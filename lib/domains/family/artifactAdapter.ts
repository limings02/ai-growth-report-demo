// lib/domains/family/artifactAdapter.ts
// family mode 的 artifact adapter：MemoryArtifact -> GrowthMemoryArtifact 单向转换。
//
// Phase 12.6C：growthArtifactToMemoryArtifact 已删除（parse fallback 清理）。
// 保留 memoryArtifactToGrowthArtifact，供 runGrowthMemorySkill rollback path 使用（Phase 12.6D 处理）。

import type {
  VideoScript,
  SourceTrace,
  QualityReview,
  AiGraphHints,
  AiGraphNodeType,
  GrowthMemoryArtifact,
} from "@/lib/skill-runtime/types";
import type {
  MemoryArtifact,
  MemoryGraphNodeType,
  MemorySourceTrace,
  MemoryQualityReview,
} from "@/lib/memory-core/types";

// ── 空值兜底默认值 ────────────────────────────────────────────────
// 用于 memoryArtifactToGrowthArtifact 逆向转换时，字段缺失时提供安全默认值

const EMPTY_VIDEO_SCRIPT: VideoScript = {
  title: "",
  duration: "60s",
  scenes: [],
  musicMood: "",
  endingLine: "",
};

const EMPTY_SOURCE_TRACE: SourceTrace = {
  usedQuestions: [],
  usedFreeNote: false,
  missingContext: [],
  groundingNotes: [],
};

const EMPTY_QUALITY_REVIEW: QualityReview = {
  riskOfFabrication: "medium",
  emotionalTone: "",
  weaknesses: [],
  suggestionsForBetterInput: [],
};

const EMPTY_AI_GRAPH_HINTS: AiGraphHints = {
  title: "记忆星图",
  subtitle: "每一个节点，都是被认真保存的片段。",
  centerDescription: "一段被整理的记忆",
  nodes: [],
};

// ── 节点类型转换工具 ───────────────────────────────────────────────

/**
 * 将通用 MemoryGraphNodeType 降级为旧 AiGraphNodeType。
 * 通用类型是旧类型的超集，必须做降级映射。
 */
function toGrowthGraphNodeType(type: MemoryGraphNodeType): AiGraphNodeType {
  if (
    type === "keyword" ||
    type === "event" ||
    type === "letter" ||
    type === "memory"
  ) {
    return type;
  }
  // 通用类型到旧类型的降级规则
  if (type === "message") return "memory";
  if (type === "emotion") return "keyword";
  if (type === "person") return "memory";
  if (type === "subject") return "memory";
  if (type === "time") return "event";
  if (type === "place") return "event";
  return "memory";
}

// ── 主要转换函数 ──────────────────────────────────────────────────

/**
 * 将通用 MemoryArtifact 转回旧的 GrowthMemoryArtifact。
 * 供 runGrowthMemorySkill rollback path 使用（Phase 12.6D 清理）。
 */
export function memoryArtifactToGrowthArtifact(
  artifact: MemoryArtifact
): GrowthMemoryArtifact {
  const { narrative, graph, extensions } = artifact;

  // 安全提取 extensions 中的字段，提供类型安全的 fallback
  const videoScript =
    (extensions.videoScript as VideoScript | undefined) ?? EMPTY_VIDEO_SCRIPT;

  const rawSourceTrace = extensions.sourceTrace as
    | MemorySourceTrace
    | undefined;
  const sourceTrace: SourceTrace = rawSourceTrace
    ? {
        usedQuestions: rawSourceTrace.usedQuestions,
        usedFreeNote: rawSourceTrace.usedFreeNote,
        missingContext: rawSourceTrace.missingContext,
        groundingNotes: rawSourceTrace.groundingNotes,
      }
    : EMPTY_SOURCE_TRACE;

  const rawQualityReview = extensions.qualityReview as
    | MemoryQualityReview
    | undefined;
  const qualityReview: QualityReview = rawQualityReview
    ? {
        riskOfFabrication: rawQualityReview.riskOfFabrication,
        emotionalTone: rawQualityReview.emotionalTone,
        weaknesses: rawQualityReview.weaknesses,
        suggestionsForBetterInput: rawQualityReview.suggestionsForBetterInput,
      }
    : EMPTY_QUALITY_REVIEW;

  // 图谱：通用类型节点降级回旧 AiGraphNodeType
  const aiGraphHints: AiGraphHints = graph
    ? {
        title: graph.title,
        subtitle: graph.subtitle,
        centerDescription: graph.centerDescription,
        nodes: graph.nodes.map((node) => ({
          type: toGrowthGraphNodeType(node.type),
          label: node.label,
          description: node.description,
          emotion: node.emotion ?? "",
          relatedTo: node.relatedTo,
        })),
      }
    : EMPTY_AI_GRAPH_HINTS;

  return {
    artifactVersion: artifact.artifactVersion,
    report: {
      title: narrative.title,
      keywords: narrative.keywords,
      yearlySummary: narrative.summary,
      timeline: narrative.timeline.map((item) => ({
        time: item.time,
        title: item.title,
        description: item.description,
      })),
      letter: narrative.longFormText.content,
      socialPosts: narrative.socialPosts.map((post) => ({
        title: post.title,
        content: post.content,
      })),
      // 全部设为 done，表示生成已完成
      skillStatus: {
        keywords: "done",
        yearlySummary: "done",
        timeline: "done",
        letter: "done",
        socialPosts: "done",
      },
    },
    graph: aiGraphHints,
    videoScript,
    sourceTrace,
    qualityReview,
  };
}
