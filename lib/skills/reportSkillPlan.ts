// lib/skills/reportSkillPlan.ts
// 成长礼物各 skill 的执行计划描述
// 当前 v0.2 中此文件只作设计文档用途，不参与任何运行时调用

import type { SkillName } from "./types";

// ── 执行模式 ──────────────────────────────────────────────────
// v0.2：single-call — 一次 DeepSeek 调用生成完整 ReportData
// 未来：parallel — Phase 1 并行，Phase 2 依赖 Phase 1 结果
export const EXECUTION_MODE = "single-call" as "single-call" | "parallel" | "sequential";

// ── 单个 skill 的计划描述 ─────────────────────────────────────
type SkillPlanItem = {
  name: SkillName;
  description: string;
  inputFields: string[];   // 使用 RawMaterial 的哪些字段
  outputField: string;     // 对应 ReportData 的哪个字段
  phase: 1 | 2 | 3;       // 执行阶段（同一 phase 可并行）
  futurePriority: "P1" | "P2" | "P3";
  splitTrigger: string;    // 建议拆分的时机
};

// ── 执行计划 ──────────────────────────────────────────────────
// Phase 1（可并行）：不依赖其他 skill 的输出
// Phase 2（依赖 Phase 1）：可以利用 Phase 1 结果优化输出
// Phase 3（依赖完整 report）：需要完整 ReportData 才能运行
export const REPORT_SKILL_PLAN: SkillPlanItem[] = [
  {
    name: "keywordSkill",
    description: "从用户回答中提炼 3-5 个最能代表这一年的关键词",
    inputFields: ["childName", "childAge", "reportYear", "qaList", "freeNote"],
    outputField: "keywords",
    phase: 1,
    futurePriority: "P1",
    splitTrigger: "关键词质量不稳定，或需要用户手动确认关键词后再生成其他内容",
  },
  {
    name: "summarySkill",
    description: "生成 3-4 段温暖真实的年度成长总结，基于用户真实回答",
    inputFields: ["childName", "childAge", "reportYear", "parentName", "style", "qaList", "freeNote"],
    outputField: "yearlySummary",
    phase: 1,
    futurePriority: "P1",
    splitTrigger: "总结质量需要单独调优，或需要支持「重新生成总结」功能",
  },
  {
    name: "timelineSkill",
    description: "从用户回答中结构化提取 3-5 个重要事件，自动判断时间节点",
    inputFields: ["qaList", "freeNote", "reportYear"],
    outputField: "timeline",
    phase: 1,
    futurePriority: "P1",
    splitTrigger: "时间线提取错误率高，或需要用户编辑时间线后再生成信件",
  },
  {
    name: "letterSkill",
    description: "以父母口吻写一封给孩子的信，温暖克制，至少 200 字",
    inputFields: ["childName", "childAge", "reportYear", "parentName", "style", "qaList", "freeNote"],
    outputField: "letter",
    phase: 2,
    futurePriority: "P1",
    splitTrigger: "信件是最重要的模块，用户最可能需要「重新生成信件」的功能",
  },
  {
    name: "socialPostSkill",
    description: "生成 3 个不同风格的朋友圈/小红书文案",
    inputFields: ["childName", "childAge", "reportYear", "parentName", "style", "qaList"],
    outputField: "socialPosts",
    phase: 2,
    futurePriority: "P2",
    splitTrigger: "朋友圈文案需要支持「换一批」功能时",
  },
  {
    name: "videoScriptSkill",
    description: "生成成长视频脚本（画面建议 + 旁白 + 字幕），供剪映等工具使用",
    inputFields: ["childName", "childAge", "reportYear", "parentName", "qaList"],
    outputField: "videoScript" as string,  // ReportData 未来扩展字段
    phase: 3,
    futurePriority: "P3",
    splitTrigger: "用户明确需要视频脚本功能时",
  },
  {
    name: "wikiSourceSkill",
    description: "将原始材料和生成内容整理成 Life Wiki Markdown 格式",
    inputFields: ["childName", "childAge", "reportYear", "parentName", "qaList", "freeNote"],
    outputField: "wikiSource" as string,  // ReportData 未来扩展字段
    phase: 3,
    futurePriority: "P3",
    splitTrigger: "Life Wiki 功能上线时",
  },
];
