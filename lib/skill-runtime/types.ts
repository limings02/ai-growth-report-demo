// lib/skill-runtime/types.ts
// Growth Memory Skill Pack 的输出类型定义
// 对应 .skills/growth-memory/schemas/growth_memory_artifact.schema.json

import type { ReportData } from "@/lib/types";

// ── 成长星图语义节点（AI 直接生成，比前端派生更有情感深度）──────
export type AiGraphNodeType = "keyword" | "event" | "letter" | "memory";

export type AiGraphNode = {
  type: AiGraphNodeType;
  label: string;        // 5 字以内的简短标签
  description: string;  // 30 字以内的情感描述
  emotion: string;      // 2-4 字的情绪关键词
  relatedTo: string[];  // 与其他节点 label 的关联
};

export type AiGraphHints = {
  title: string;            // 星图名称（8 字以内）
  subtitle: string;         // 诗意副标题（20 字以内）
  centerDescription: string; // 中心节点描述（20 字以内）
  nodes: AiGraphNode[];
};

// ── 视频脚本 ──────────────────────────────────────────────────────
export type VideoScene = {
  order: number;
  visualSuggestion: string; // 画面建议（用哪张照片或哪个场景）
  narration: string;        // 旁白文案
  subtitle: string;         // 字幕（可比旁白更简短）
  emotion: string;          // 情绪基调
};

export type VideoScript = {
  title: string;
  duration: "30s" | "60s" | "90s";
  scenes: VideoScene[];
  musicMood: string;   // 背景音乐建议
  endingLine: string;  // 结尾字幕
};

// ── 输入溯源 ──────────────────────────────────────────────────────
export type SourceTrace = {
  usedQuestions: string[];    // 实际使用的问题列表
  usedFreeNote: boolean;      // 是否使用了 freeNote
  missingContext: string[];   // 缺失的信息（影响质量）
  groundingNotes: string[];   // 说明哪些内容有依据，哪些是总结
};

// ── 质量自检 ──────────────────────────────────────────────────────
export type QualityReview = {
  riskOfFabrication: "low" | "medium" | "high";
  emotionalTone: string;
  weaknesses: string[];
  suggestionsForBetterInput: string[];
};

// ── 完整 Artifact ─────────────────────────────────────────────────
export type GrowthMemoryArtifact = {
  artifactVersion: string;    // "0.1"
  report: ReportData;         // 兼容现有前端的成长报告
  graph: AiGraphHints;        // AI 生成的星图语义节点
  videoScript: VideoScript;   // 视频脚本草稿（暂不展示，但保留）
  sourceTrace: SourceTrace;   // 输入溯源（暂不展示，用于调试）
  qualityReview: QualityReview; // 质量自检（暂不展示，用于调试）
};
