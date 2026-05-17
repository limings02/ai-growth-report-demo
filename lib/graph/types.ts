// lib/graph/types.ts
// 成长星图数据结构定义

export type LifeGraphNodeType =
  | "child"    // 中心节点：孩子
  | "year"     // 年份节点
  | "keyword"  // 年度关键词
  | "event"    // 时间线事件
  | "letter"   // 给孩子的信
  | "memory";  // 父母的补充记录

export type LifeGraphNode = {
  id: string;
  type: LifeGraphNodeType;
  label: string;
  description?: string;
  source?: "raw" | "generated"; // 来源：原始材料 or AI 生成
  x?: number; // 布局坐标（0-1 归一化）
  y?: number;
};

export type LifeGraphEdge = {
  id: string;
  source: string; // node id
  target: string; // node id
  label?: string;
};

export type LifeGraphData = {
  nodes: LifeGraphNode[];
  edges: LifeGraphEdge[];
};
