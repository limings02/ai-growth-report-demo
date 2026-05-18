// lib/graph/buildLifeGraph.ts
// 兼容 wrapper：保持旧调用接口 buildLifeGraph({ rawMaterial, report })。
//
// 内部已改为：
//   buildFamilyMemoryGraph（通用 MemoryGraphData）
//     → memoryGraphToLifeGraph（降级回 LifeGraphData）
//
// 这样现有的 LifeGraphPreview 调用不需要修改，
// 但内部逻辑已从 family 通用图谱开始构建。

import type { RawMaterial, ReportData } from "@/lib/types";
import type { LifeGraphData, LifeGraphNode, LifeGraphEdge, LifeGraphNodeType } from "./types";
import type { MemoryGraphData, MemoryGraphNode } from "@/lib/memory-core/graphTypes";
import type { MemoryGraphNodeType } from "@/lib/memory-core/types";
import { buildFamilyMemoryGraph } from "@/lib/domains/family/buildFamilyMemoryGraph";

export function buildLifeGraph(input: {
  rawMaterial: RawMaterial;
  report: ReportData;
}): LifeGraphData {
  const memoryGraph = buildFamilyMemoryGraph(input);
  return memoryGraphToLifeGraph(memoryGraph);
}

// ── 通用类型 → 旧 LifeGraphNodeType 降级映射 ────────────────────
// 旧 LifeGraphPreview 还没完全改名，旧 UI 仍以 LifeGraphData 渲染。
// 保留此函数作为过渡，后续 LifeGraphPreview 完全支持 MemoryGraphNodeType 后可删除。
function toLifeGraphNodeType(type: MemoryGraphNodeType): LifeGraphNodeType {
  switch (type) {
    case "subject":  return "child";
    case "time":     return "year";
    case "keyword":  return "keyword";
    case "event":    return "event";
    case "letter":   return "letter";
    case "memory":   return "memory";
    // 新增通用类型的降级
    case "person":   return "memory";
    case "place":    return "event";
    case "message":  return "memory";
    case "emotion":  return "keyword";
    default:         return "memory";
  }
}

// ── 通用 MemoryGraphNode id 映射规则 ────────────────────────────
// subject → child（旧 LifeGraphPreview 默认选中 id="child"）
// time-XXXX → year-XXXX
// 其他节点 id 保持不变
function toLifeNodeId(node: MemoryGraphNode): string {
  if (node.type === "subject") return "child";
  if (node.type === "time") return node.id.replace(/^time-/, "year-");
  return node.id;
}

function memoryGraphToLifeGraph(graph: MemoryGraphData): LifeGraphData {
  // 构建 id 映射表（新 id → 旧 id），用于边的转换
  const idMap = new Map<string, string>(
    graph.nodes.map((n) => [n.id, toLifeNodeId(n)])
  );

  const nodes: LifeGraphNode[] = graph.nodes.map((n) => ({
    id: toLifeNodeId(n),
    type: toLifeGraphNodeType(n.type),
    label: n.label,
    description: n.description,
    source: n.source,
    x: n.x,
    y: n.y,
  }));

  const edges: LifeGraphEdge[] = graph.edges.map((e) => ({
    id: e.id,
    source: idMap.get(e.source) ?? e.source,
    target: idMap.get(e.target) ?? e.target,
    label: e.label,
  }));

  return { nodes, edges };
}
