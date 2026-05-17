// lib/skills/types.ts
// Skill 系统基础类型预留
// 当前 v0.2 未接入运行时，供未来拆分为多次 AI 调用时使用

import type { RawMaterial, ReportData, TimelineItem, SocialPost } from "@/lib/types";

// ── Skill 名称枚举 ────────────────────────────────────────────
export type SkillName =
  | "keywordSkill"
  | "summarySkill"
  | "timelineSkill"
  | "letterSkill"
  | "socialPostSkill"
  | "videoScriptSkill"
  | "wikiSourceSkill";

// ── Skill 执行状态 ────────────────────────────────────────────
export type SkillStatus = "pending" | "running" | "done" | "error";

// ── Skill 上下文（传入每个 skill 的输入） ────────────────────
export type SkillContext = {
  rawMaterial: RawMaterial;
  // 部分 skill（如 videoScriptSkill）需要已生成的 report 作为输入
  partialReport?: Partial<ReportData>;
};

// ── 各 skill 的输出类型映射 ───────────────────────────────────
export type SkillOutputMap = {
  keywordSkill: string[];
  summarySkill: string;
  timelineSkill: TimelineItem[];
  letterSkill: string;
  socialPostSkill: SocialPost[];
  videoScriptSkill: VideoScriptOutput;
  wikiSourceSkill: WikiSourceOutput;
};

// ── 单次 skill 运行结果 ───────────────────────────────────────
export type SkillRunResult<T extends SkillName> = {
  skill: T;
  status: SkillStatus;
  output?: SkillOutputMap[T];
  error?: string;
  durationMs?: number;
};

// ── 视频脚本输出（v0.3+ 实现）───────────────────────────────
// 详见 lib/skills/videoScriptTypes.ts
export type VideoScriptOutput = {
  title: string;
  duration: "30s" | "60s" | "90s";
  scenes: {
    order: number;
    visualSuggestion: string;
    narration: string;
    subtitle: string;
    emotion: string;
  }[];
  musicMood: string;
  endingLine: string;
};

// ── Life Wiki source 输出（v0.3+ 实现）──────────────────────
export type WikiSourceOutput = {
  markdown: string;
  suggestedLinks: string[];
};
