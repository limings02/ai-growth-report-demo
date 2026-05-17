// lib/memory-core/parseMemoryArtifact.ts
// 服务端专用：把 LLM 返回的 raw string 解析成 MemoryArtifact。
// 不要在客户端组件中 import 本文件。
//
// 解析策略（优先级由高到低）：
// 1. 解析为 JSON → 已是 MemoryArtifact 格式 → 规范化后返回
// 2. 解析为 JSON → 是旧 GrowthMemoryArtifact 格式（family mode）→ 转换后返回
// 3. JSON 解析失败 + family mode → 尝试旧 parseGrowthMemoryArtifact → 转换后返回
// 4. 全部失败 → 返回最小可渲染 MemoryArtifact，不让 API 崩溃

import type {
  MemoryArtifact,
  MemoryRawMaterial,
  MemoryGraphNodeType,
  MemoryNarrative,
  MemoryGraphHints,
  MemorySourceTrace,
  MemoryQualityReview,
  MemoryTimelineItem,
  MemorySocialPost,
} from "./types";
import { growthArtifactToMemoryArtifact } from "@/lib/domains/family/artifactAdapter";
import { parseGrowthMemoryArtifact } from "@/lib/skill-runtime/parseGrowthMemoryArtifact";

// ── 工具函数 ─────────────────────────────────────────────────────

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1];
  return trimmed;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

function strArr(v: unknown): string[] {
  if (Array.isArray(v))
    return v.filter((i): i is string => typeof i === "string");
  return [];
}

const VALID_GRAPH_NODE_TYPES: MemoryGraphNodeType[] = [
  "subject", "person", "time", "keyword", "event",
  "place", "message", "letter", "memory", "emotion",
];

function isMemoryGraphNodeType(v: string): v is MemoryGraphNodeType {
  return VALID_GRAPH_NODE_TYPES.includes(v as MemoryGraphNodeType);
}

// ── 最小兜底 artifact ────────────────────────────────────────────

function makeMinimalMemoryArtifact(
  material: MemoryRawMaterial,
  reason: string
): MemoryArtifact {
  return {
    artifactVersion: "0.1",
    mode: material.mode,
    narrative: {
      title: material.subject.title || "记忆整理",
      keywords: ["记忆", "记录", "整理"],
      summary: "这是一份基于当前输入生成的最小记忆整理结果。",
      timeline: [
        {
          time: material.subject.timeRange || "这段时间",
          title: "被记录的记忆",
          description: "由于生成内容解析失败，系统返回了最小可展示版本。",
        },
      ],
      longFormText: {
        title: "写给未来的话",
        content:
          "这段记忆已经被保存下来。你可以补充更多细节后重新生成。",
        voice: "fallback",
      },
      socialPosts: [],
    },
    graph: {
      title: "记忆星图",
      subtitle: "每一个节点，都是被认真保存的片段。",
      centerDescription: material.subject.primaryName || "记忆",
      nodes: [],
    },
    extensions: {
      sourceTrace: {
        usedQuestions: material.qaList.map((qa) => qa.question),
        usedFreeNote: Boolean(material.freeNote?.trim()),
        missingContext: [reason],
        groundingNotes: ["这是解析失败后的最小兜底结果。"],
      },
      qualityReview: {
        riskOfFabrication: "medium",
        emotionalTone: "fallback",
        weaknesses: [reason],
        suggestionsForBetterInput: [
          "可以补充更多具体事件、时间、地点和原始记录后重新生成。",
        ],
      },
    },
  };
}

// ── normalizeMemoryArtifact：对 parsed JSON 做轻量安全取值 ────────

function normalizeTimeline(v: unknown): MemoryTimelineItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    const i = (item ?? {}) as Record<string, unknown>;
    return {
      time: str(i.time, ""),
      title: str(i.title, ""),
      description: str(i.description, ""),
    };
  });
}

function normalizeSocialPosts(v: unknown): MemorySocialPost[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    const i = (item ?? {}) as Record<string, unknown>;
    return {
      title: str(i.title, ""),
      content: str(i.content, ""),
    };
  });
}

function normalizeNarrative(
  v: unknown,
  subject: MemoryRawMaterial["subject"]
): MemoryNarrative {
  const n = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const lt = (n.longFormText && typeof n.longFormText === "object"
    ? n.longFormText
    : {}) as Record<string, unknown>;
  return {
    title: str(n.title, subject.title || "记忆整理"),
    keywords: strArr(n.keywords),
    summary: str(n.summary, ""),
    timeline: normalizeTimeline(n.timeline),
    longFormText: {
      title: str(lt.title, ""),
      content: str(lt.content, ""),
      voice: str(lt.voice, ""),
    },
    socialPosts: normalizeSocialPosts(n.socialPosts),
  };
}

function normalizeGraph(v: unknown): MemoryGraphHints {
  const g = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const nodes = Array.isArray(g.nodes)
    ? g.nodes.map((node) => {
        const n = (node ?? {}) as Record<string, unknown>;
        const rawType = str(n.type, "memory");
        return {
          type: isMemoryGraphNodeType(rawType) ? rawType : ("memory" as MemoryGraphNodeType),
          label: str(n.label, "记忆"),
          description: str(n.description, ""),
          emotion: str(n.emotion) || undefined,
          relatedTo: strArr(n.relatedTo),
        };
      })
    : [];
  return {
    title: str(g.title, "记忆星图"),
    subtitle: str(g.subtitle, "每一个节点，都是被认真保存的片段。"),
    centerDescription: str(g.centerDescription, "记忆"),
    nodes,
  };
}

function normalizeSourceTrace(v: unknown): MemorySourceTrace | undefined {
  if (!v || typeof v !== "object") return undefined;
  const s = v as Record<string, unknown>;
  return {
    usedQuestions: strArr(s.usedQuestions),
    usedFreeNote: s.usedFreeNote === true,
    missingContext: strArr(s.missingContext),
    groundingNotes: strArr(s.groundingNotes),
  };
}

function normalizeQualityReview(v: unknown): MemoryQualityReview | undefined {
  if (!v || typeof v !== "object") return undefined;
  const q = v as Record<string, unknown>;
  const risk = ["low", "medium", "high"].includes(str(q.riskOfFabrication))
    ? (str(q.riskOfFabrication) as "low" | "medium" | "high")
    : "medium";
  return {
    riskOfFabrication: risk,
    emotionalTone: str(q.emotionalTone),
    weaknesses: strArr(q.weaknesses),
    suggestionsForBetterInput: strArr(q.suggestionsForBetterInput),
  };
}

function normalizeMemoryArtifact(
  parsed: Record<string, unknown>,
  material: MemoryRawMaterial
): MemoryArtifact {
  return {
    artifactVersion: str(parsed.artifactVersion, "0.1"),
    mode: (str(parsed.mode) || material.mode) as MemoryRawMaterial["mode"],
    narrative: normalizeNarrative(parsed.narrative, material.subject),
    graph: normalizeGraph(parsed.graph),
    extensions: {
      videoScript: parsed.extensions
        ? (parsed.extensions as Record<string, unknown>).videoScript
        : undefined,
      sourceTrace: normalizeSourceTrace(
        parsed.extensions
          ? (parsed.extensions as Record<string, unknown>).sourceTrace
          : undefined
      ),
      qualityReview: normalizeQualityReview(
        parsed.extensions
          ? (parsed.extensions as Record<string, unknown>).qualityReview
          : undefined
      ),
    },
  };
}

// ── 主函数 ───────────────────────────────────────────────────────

export function parseMemoryArtifact(
  raw: string,
  material: MemoryRawMaterial
): MemoryArtifact {
  // 从 domainPayload 提取 family-specific 字段（用于 fallback parser）
  const childName =
    typeof material.domainPayload?.childName === "string"
      ? material.domainPayload.childName
      : material.subject.primaryName;
  const reportYear =
    typeof material.domainPayload?.reportYear === "number"
      ? material.domainPayload.reportYear
      : Number(material.subject.timeRange) || new Date().getFullYear();

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;
  } catch {
    // JSON 解析失败：family mode 尝试旧 parser，其他 mode 直接返回最小 artifact
    if (material.mode === "family") {
      try {
        const growthArtifact = parseGrowthMemoryArtifact(raw, childName, reportYear);
        return growthArtifactToMemoryArtifact(growthArtifact);
      } catch {
        return makeMinimalMemoryArtifact(material, "LLM 输出无法解析为 JSON");
      }
    }
    return makeMinimalMemoryArtifact(material, "LLM 输出无法解析为 JSON");
  }

  // 已是 MemoryArtifact 格式（有 narrative + graph）
  if (parsed.narrative && parsed.graph) {
    return normalizeMemoryArtifact(parsed, material);
  }

  // 旧 GrowthMemoryArtifact 格式（有 report，family mode）
  if (material.mode === "family" && parsed.report) {
    try {
      const growthArtifact = parseGrowthMemoryArtifact(
        JSON.stringify(parsed),
        childName,
        reportYear
      );
      return growthArtifactToMemoryArtifact(growthArtifact);
    } catch {
      return makeMinimalMemoryArtifact(material, "旧 GrowthMemoryArtifact 解析失败");
    }
  }

  return makeMinimalMemoryArtifact(material, "无法识别的 MemoryArtifact 格式");
}
