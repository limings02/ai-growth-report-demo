// lib/domains/family/buildFamilyMemoryGraph.ts
// family domain → 通用 MemoryGraphData 的 adapter。
//
// 作用：
// - 把 family 的 RawMaterial + ReportData 转成通用 MemoryGraphData
// - 使用通用节点类型（subject / time / keyword / event / letter / memory）
// - 纯函数：不调用 AI，不访问网络，不读写存储

import type { RawMaterial, ReportData } from "@/lib/types";
import type {
  MemoryGraphData,
  MemoryGraphNode,
  MemoryGraphEdge,
} from "@/lib/memory-core/graphTypes";

export function buildFamilyMemoryGraph(input: {
  rawMaterial: RawMaterial;
  report: ReportData;
}): MemoryGraphData {
  const { rawMaterial, report } = input;
  const nodes: MemoryGraphNode[] = [];
  const edges: MemoryGraphEdge[] = [];
  const edgeIds = new Set<string>();

  function addEdge(edge: MemoryGraphEdge) {
    if (!edgeIds.has(edge.id)) {
      edgeIds.add(edge.id);
      edges.push(edge);
    }
  }

  // ── 中心节点：subject（通用）代替旧 child ────────────────────
  const agePrefix =
    rawMaterial.childAge !== "" ? `${rawMaterial.childAge} 岁 · ` : "";
  const subjectId = "subject";
  nodes.push({
    id: subjectId,
    type: "subject",
    label: rawMaterial.childName || "宝贝",
    description: `${agePrefix}${rawMaterial.reportYear} 年｜这一年，被认真记住了`,
    source: "raw",
  });

  // ── 时间节点：time（通用）代替旧 year ────────────────────────
  const timeId = `time-${rawMaterial.reportYear}`;
  nodes.push({
    id: timeId,
    type: "time",
    label: `${rawMaterial.reportYear}`,
    description: "这一年的成长记录",
    source: "raw",
  });
  addEdge({ id: "edge-subject-time", source: subjectId, target: timeId });

  // ── 关键词节点（最多 5 个）───────────────────────────────────
  const keywordNodes: MemoryGraphNode[] = [];
  report.keywords.slice(0, 5).forEach((kw, i) => {
    const nodeId = `keyword-${i}`;
    const node: MemoryGraphNode = {
      id: nodeId,
      type: "keyword",
      label: kw,
      description: "年度关键词",
      source: "generated",
    };
    nodes.push(node);
    keywordNodes.push(node);
    addEdge({ id: `edge-subject-${nodeId}`, source: subjectId, target: nodeId });
  });

  // ── 事件节点（最多 5 个）────────────────────────────────────
  const eventNodes: MemoryGraphNode[] = [];
  report.timeline.slice(0, 5).forEach((item, i) => {
    const nodeId = `event-${i}`;
    const node: MemoryGraphNode = {
      id: nodeId,
      type: "event",
      label: item.title,
      description: `${item.time}｜${item.description}`,
      source: "generated",
    };
    nodes.push(node);
    eventNodes.push(node);
    addEdge({ id: `edge-subject-${nodeId}`, source: subjectId, target: nodeId });
    addEdge({ id: `edge-time-${nodeId}`, source: timeId, target: nodeId });
  });

  // ── keyword → event 弱关联（简单字符串 includes 匹配）───────
  keywordNodes.forEach((kwNode) => {
    eventNodes.forEach((evNode) => {
      const kw = kwNode.label;
      const evText = evNode.label + (evNode.description ?? "");
      if (evText.includes(kw)) {
        addEdge({
          id: `edge-kw-ev-${kwNode.id}-${evNode.id}`,
          source: kwNode.id,
          target: evNode.id,
          label: "相关",
        });
      }
    });
  });

  // ── 信件节点（letter）────────────────────────────────────────
  nodes.push({
    id: "letter",
    type: "letter",
    label: "写给未来的你",
    description:
      report.letter.slice(0, 80) + (report.letter.length > 80 ? "……" : ""),
    source: "generated",
  });
  addEdge({ id: "edge-subject-letter", source: subjectId, target: "letter" });

  // ── 自由记录节点（有内容才生成）─────────────────────────────
  if (rawMaterial.freeNote.trim()) {
    nodes.push({
      id: "memory",
      type: "memory",
      label: "父母的补充记录",
      description:
        rawMaterial.freeNote.slice(0, 80) +
        (rawMaterial.freeNote.length > 80 ? "……" : ""),
      source: "raw",
    });
    addEdge({ id: "edge-subject-memory", source: subjectId, target: "memory" });
  }

  return { nodes, edges };
}
