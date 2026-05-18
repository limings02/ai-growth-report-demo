// lib/graph/types.ts
// 成长星图数据结构定义（兼容层）。
//
// 本文件保持旧 LifeGraphData 接口供 LifeGraphPreview 使用。
// LifeGraphNodeType 已扩展为兼容旧类型（child/year）+ 通用类型（subject/person/time/...）。

import type { MemoryGraphNodeType } from "@/lib/memory-core/types";

// 旧 family-specific 节点类型，保留兼容
export type LegacyLifeGraphNodeType = "child" | "year";

// 扩展后的节点类型：兼容旧 child/year + 通用 MemoryGraphNodeType
export type LifeGraphNodeType = LegacyLifeGraphNodeType | MemoryGraphNodeType;

export type LifeGraphNode = {
  id: string;
  type: LifeGraphNodeType;
  label: string;
  description?: string;
  source?: "raw" | "generated";
  x?: number;
  y?: number;
};

export type LifeGraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type LifeGraphData = {
  nodes: LifeGraphNode[];
  edges: LifeGraphEdge[];
};
