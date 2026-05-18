// lib/memory-core/graphTypes.ts
// Memory Graph 的渲染层数据结构。
//
// 注意区分两个层级：
// - MemoryGraphHints（在 types.ts）：AI 输出的语义提示，用于指导前端构图
// - MemoryGraphData（本文件）：前端图谱渲染需要的节点/边数据，是渲染层

import type { MemoryGraphNodeType } from "./types";

/**
 * 通用图谱节点（渲染层）。
 *
 * 与旧 LifeGraphNode 的区别：
 * - type 使用通用 MemoryGraphNodeType（超集）
 * - 覆盖 family / couple / personal / memorial 所有场景
 */
export type MemoryGraphNode = {
  id: string;
  type: MemoryGraphNodeType;
  label: string;
  description?: string;
  source?: "raw" | "generated";
  x?: number;
  y?: number;
};

export type MemoryGraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

/**
 * 通用图谱数据（渲染层）。
 *
 * 后续 Relationship Galaxy / Life Graph / Memorial Graph 都可以复用。
 */
export type MemoryGraphData = {
  nodes: MemoryGraphNode[];
  edges: MemoryGraphEdge[];
};
