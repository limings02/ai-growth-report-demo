// lib/graph/buildLifeGraph.ts
// 从 rawMaterial + report 派生成长星图数据
// 纯函数：不调用 AI，不访问网络，不读写存储

import type { RawMaterial, ReportData } from "@/lib/types";
import type { LifeGraphData, LifeGraphNode, LifeGraphEdge } from "./types";

export function buildLifeGraph(input: {
  rawMaterial: RawMaterial;
  report: ReportData;
}): LifeGraphData {
  const { rawMaterial, report } = input;
  const nodes: LifeGraphNode[] = [];
  const edges: LifeGraphEdge[] = [];
  // 用于去重：已存在的边 id 集合
  const edgeIds = new Set<string>();

  function addEdge(edge: LifeGraphEdge) {
    if (!edgeIds.has(edge.id)) {
      edgeIds.add(edge.id);
      edges.push(edge);
    }
  }

  // ── 中心节点：孩子 ───────────────────────────────────────────
  const agePrefix = rawMaterial.childAge !== "" ? `${rawMaterial.childAge} 岁 · ` : "";
  nodes.push({
    id: "child",
    type: "child",
    label: rawMaterial.childName || "宝贝",
    description: `${agePrefix}${rawMaterial.reportYear} 年｜这一年，被认真记住了`,
    source: "raw",
  });

  // ── 年份节点 ─────────────────────────────────────────────────
  const yearId = `year-${rawMaterial.reportYear}`;
  nodes.push({
    id: yearId,
    type: "year",
    label: `${rawMaterial.reportYear}`,
    description: "这一年的成长记录",
    source: "raw",
  });
  addEdge({ id: "edge-child-year", source: "child", target: yearId });

  // ── 关键词节点（最多 5 个）───────────────────────────────────
  const keywordNodes: LifeGraphNode[] = [];
  report.keywords.slice(0, 5).forEach((kw, i) => {
    const nodeId = `keyword-${i}`;
    const node: LifeGraphNode = {
      id: nodeId,
      type: "keyword",
      label: kw,
      description: "年度关键词",
      source: "generated",
    };
    nodes.push(node);
    keywordNodes.push(node);
    addEdge({ id: `edge-child-${nodeId}`, source: "child", target: nodeId });
  });

  // ── 时间线事件节点（最多 5 个）──────────────────────────────
  const eventNodes: LifeGraphNode[] = [];
  report.timeline.slice(0, 5).forEach((item, i) => {
    const nodeId = `event-${i}`;
    const node: LifeGraphNode = {
      id: nodeId,
      type: "event",
      label: item.title,
      description: `${item.time}｜${item.description}`,
      source: "generated",
    };
    nodes.push(node);
    eventNodes.push(node);
    addEdge({ id: `edge-child-${nodeId}`, source: "child", target: nodeId });
    addEdge({ id: `edge-year-${nodeId}`, source: yearId, target: nodeId });
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

  // ── 信件节点 ─────────────────────────────────────────────────
  nodes.push({
    id: "letter",
    type: "letter",
    label: "写给未来的你",
    description: report.letter.slice(0, 80) + (report.letter.length > 80 ? "……" : ""),
    source: "generated",
  });
  addEdge({ id: "edge-child-letter", source: "child", target: "letter" });

  // ── 自由记录节点（有内容才生成）─────────────────────────────
  if (rawMaterial.freeNote.trim()) {
    nodes.push({
      id: "memory",
      type: "memory",
      label: "父母的补充记录",
      description: rawMaterial.freeNote.slice(0, 80) + (rawMaterial.freeNote.length > 80 ? "……" : ""),
      source: "raw",
    });
    addEdge({ id: "edge-child-memory", source: "child", target: "memory" });
  }

  return { nodes, edges };
}
