// lib/skill-runtime/parseGrowthMemoryArtifact.ts
// 从 LLM 返回文本中解析 GrowthMemoryArtifact
// 失败时 fallback 到旧的 parseReportJson，保证不崩溃

import type { GrowthMemoryArtifact, AiGraphHints, VideoScript, SourceTrace, QualityReview } from "./types";
import { parseReportJson } from "@/lib/server/parseReportJson";

// 从模型返回文本中提取 JSON（兼容偶尔包裹 ```json 的情况）
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1];
  return trimmed;
}

// 安全取字符串
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

// 安全取字符串数组
function strArr(v: unknown): string[] {
  if (Array.isArray(v)) return (v as unknown[]).filter((i) => typeof i === "string") as string[];
  return [];
}

function parseGraph(raw: unknown, childName: string, reportYear: number): AiGraphHints {
  if (!raw || typeof raw !== "object") {
    return { title: "被爱点亮的这一年", subtitle: "每一颗星，都是你认真记住过的瞬间。", centerDescription: `${reportYear} 年，${childName} 的成长记录`, nodes: [] };
  }
  const g = raw as Record<string, unknown>;
  const nodes = Array.isArray(g.nodes)
    ? (g.nodes as unknown[]).map((n) => {
        const node = n as Record<string, unknown>;
        return {
          type: (["keyword", "event", "letter", "memory"].includes(str(node.type)) ? str(node.type) : "keyword") as "keyword" | "event" | "letter" | "memory",
          label: str(node.label, "记忆"),
          description: str(node.description, ""),
          emotion: str(node.emotion, ""),
          relatedTo: strArr(node.relatedTo),
        };
      })
    : [];
  return {
    title: str(g.title, "被爱点亮的这一年"),
    subtitle: str(g.subtitle, "每一颗星，都是你认真记住过的瞬间。"),
    centerDescription: str(g.centerDescription, `${reportYear} 年，${childName} 的成长`),
    nodes,
  };
}

function parseVideoScript(raw: unknown): VideoScript {
  const empty: VideoScript = { title: "", duration: "60s", scenes: [], musicMood: "", endingLine: "" };
  if (!raw || typeof raw !== "object") return empty;
  const v = raw as Record<string, unknown>;
  const duration = ["30s", "60s", "90s"].includes(str(v.duration)) ? str(v.duration) as "30s" | "60s" | "90s" : "60s";
  const scenes = Array.isArray(v.scenes)
    ? (v.scenes as unknown[]).map((s) => {
        const scene = s as Record<string, unknown>;
        return {
          order: typeof scene.order === "number" ? scene.order : 0,
          visualSuggestion: str(scene.visualSuggestion),
          narration: str(scene.narration),
          subtitle: str(scene.subtitle),
          emotion: str(scene.emotion),
        };
      })
    : [];
  return { title: str(v.title), duration, scenes, musicMood: str(v.musicMood), endingLine: str(v.endingLine) };
}

function parseSourceTrace(raw: unknown): SourceTrace {
  const empty: SourceTrace = { usedQuestions: [], usedFreeNote: false, missingContext: [], groundingNotes: [] };
  if (!raw || typeof raw !== "object") return empty;
  const s = raw as Record<string, unknown>;
  return {
    usedQuestions: strArr(s.usedQuestions),
    usedFreeNote: s.usedFreeNote === true,
    missingContext: strArr(s.missingContext),
    groundingNotes: strArr(s.groundingNotes),
  };
}

function parseQualityReview(raw: unknown): QualityReview {
  const empty: QualityReview = { riskOfFabrication: "medium", emotionalTone: "", weaknesses: [], suggestionsForBetterInput: [] };
  if (!raw || typeof raw !== "object") return empty;
  const q = raw as Record<string, unknown>;
  const risk = ["low", "medium", "high"].includes(str(q.riskOfFabrication)) ? str(q.riskOfFabrication) as "low" | "medium" | "high" : "medium";
  return {
    riskOfFabrication: risk,
    emotionalTone: str(q.emotionalTone),
    weaknesses: strArr(q.weaknesses),
    suggestionsForBetterInput: strArr(q.suggestionsForBetterInput),
  };
}

// 三层兜底的最小 artifact：任何解析失败都能返回可渲染的结构
function makeMinimalArtifact(childName: string, reportYear: number): GrowthMemoryArtifact {
  return {
    artifactVersion: "0.1",
    report: {
      title: `${childName}的 ${reportYear} 成长礼物`,
      keywords: ["成长", "被爱", "记录"],
      yearlySummary: `${reportYear} 年，${childName} 认真地又长大了一岁。`,
      timeline: [
        { time: "这一年", title: "被认真记住了", description: "每一个平凡的日子都是礼物。" },
      ],
      letter: `亲爱的 ${childName}，\n\n这一年，你被认真地爱着。\n\n爱你的父母\n${reportYear} 年`,
      socialPosts: [
        { title: "温暖版", content: `${childName} ${reportYear} 年的成长礼物 🌸` },
        { title: "走心版", content: `有一天，你会看见自己是如何被爱着长大的。` },
        { title: "简洁版", content: `记录这一年，留给未来的你。🎁` },
      ],
      skillStatus: { keywords: "done", yearlySummary: "done", timeline: "done", letter: "done", socialPosts: "done" },
    },
    graph: {
      title: "被爱点亮的这一年",
      subtitle: "每一颗星，都是你认真记住过的瞬间。",
      centerDescription: `${reportYear} 年，${childName} 的成长记录`,
      nodes: [],
    },
    videoScript: { title: "", duration: "60s", scenes: [], musicMood: "", endingLine: "" },
    sourceTrace: { usedQuestions: [], usedFreeNote: false, missingContext: ["内容解析失败，已降级为最小版本"], groundingNotes: [] },
    qualityReview: { riskOfFabrication: "medium", emotionalTone: "", weaknesses: ["内容解析失败"], suggestionsForBetterInput: [] },
  };
}

export function parseGrowthMemoryArtifact(
  raw: string,
  childName: string,
  reportYear: number
): GrowthMemoryArtifact {
  let parsed: Record<string, unknown>;

  // 第一层：尝试解析完整 GrowthMemoryArtifact JSON
  try {
    parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;
  } catch {
    // 第二层：JSON 解析失败，尝试用旧 parseReportJson 兼容旧格式
    console.warn("[parseGrowthMemoryArtifact] JSON parse failed, trying parseReportJson fallback");
    try {
      const report = parseReportJson(raw, childName, reportYear);
      return {
        artifactVersion: "0.1",
        report,
        graph: { title: "被爱点亮的这一年", subtitle: "每一颗星，都是你认真记住过的瞬间。", centerDescription: `${reportYear} 年，${childName} 的成长记录`, nodes: [] },
        videoScript: { title: "", duration: "60s", scenes: [], musicMood: "", endingLine: "" },
        sourceTrace: { usedQuestions: [], usedFreeNote: false, missingContext: [], groundingNotes: ["内容来自旧格式兼容解析"] },
        qualityReview: { riskOfFabrication: "medium", emotionalTone: "", weaknesses: [], suggestionsForBetterInput: [] },
      };
    } catch {
      // 第三层：全部失败，返回最小可渲染 artifact
      console.warn("[parseGrowthMemoryArtifact] All parsing failed, returning minimal artifact");
      return makeMinimalArtifact(childName, reportYear);
    }
  }

  // 解析 report 字段
  let report;
  try {
    if (parsed.report && typeof parsed.report === "object") {
      report = parseReportJson(JSON.stringify(parsed.report), childName, reportYear);
    } else {
      // 模型返回了旧格式 ReportData（无 artifactVersion）
      report = parseReportJson(raw, childName, reportYear);
    }
  } catch {
    // report 解析失败也不崩，用最小 report
    report = makeMinimalArtifact(childName, reportYear).report;
  }

  return {
    artifactVersion: str(parsed.artifactVersion, "0.1"),
    report,
    graph: parseGraph(parsed.graph, childName, reportYear),
    videoScript: parseVideoScript(parsed.videoScript),
    sourceTrace: parseSourceTrace(parsed.sourceTrace),
    qualityReview: parseQualityReview(parsed.qualityReview),
  };
}
