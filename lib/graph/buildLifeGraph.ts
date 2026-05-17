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

  // ── 中心节点：孩子 ───────────────────────────────────────────
  nodes.push({
    id: "child",
    type: "child",
    label: rawMaterial.childName || "宝贝",
    description: `${rawMaterial.childAge !== "" ? rawMaterial.childAge + " 岁" : ""}${rawMaterial.childAge !== "" ? " · " : ""}${rawMaterial.reportYear} 年`,
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
  edges.push({ id: `edge-child-year`, source: "child", target: yearId });

  // ── 关键词节点（最多 5 个）───────────────────────────────────
  report.keywords.slice(0, 5).forEach((kw, i) => {
    const nodeId = `keyword-${i}`;
    nodes.push({
      id: nodeId,
      type: "keyword",
      label: kw,
      description: "年度关键词",
      source: "generated",
    });
    edges.push({ id: `edge-child-${nodeId}`, source: "child", target: nodeId });
  });

  // ── 时间线事件节点（最多 5 个）──────────────────────────────
  report.timeline.slice(0, 5).forEach((item, i) => {
    const nodeId = `event-${i}`;
    nodes.push({
      id: nodeId,
      type: "event",
      label: item.title,
      description: `${item.time}｜${item.description}`,
      source: "generated",
    });
    edges.push({ id: `edge-child-${nodeId}`, source: "child", target: nodeId });
    edges.push({ id: `edge-year-${nodeId}`, source: yearId, target: nodeId });
  });

  // ── 信件节点 ─────────────────────────────────────────────────
  nodes.push({
    id: "letter",
    type: "letter",
    label: "写给未来的你",
    description: report.letter.slice(0, 80) + (report.letter.length > 80 ? "……" : ""),
    source: "generated",
  });
  edges.push({ id: "edge-child-letter", source: "child", target: "letter" });

  // ── 自由记录节点（有内容才生成）─────────────────────────────
  if (rawMaterial.freeNote.trim()) {
    nodes.push({
      id: "memory",
      type: "memory",
      label: "父母的补充记录",
      description: rawMaterial.freeNote.slice(0, 80) + (rawMaterial.freeNote.length > 80 ? "……" : ""),
      source: "raw",
    });
    edges.push({ id: "edge-child-memory", source: "child", target: "memory" });
  }

  return { nodes, edges };
}
