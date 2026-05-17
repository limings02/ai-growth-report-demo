// lib/domains/family/artifactAdapter.ts
// family mode 的 artifact adapter：GrowthMemoryArtifact <-> MemoryArtifact 双向转换。
//
// 当前阶段：只新增 adapter，不替换旧链路。
// - GrowthReportApp、ReportPreview、LifeGraphPreview 继续消费 GrowthMemoryArtifact
// - 本文件为后续 memory-core 统一输出层预留接口

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
  title: "",
  subtitle: "",
  centerDescription: "",
  nodes: [],
};

// ── 节点类型转换工具 ───────────────────────────────────────────────

/**
 * 将旧 AiGraphNodeType 转换成通用 MemoryGraphNodeType。
 * AiGraphNodeType 是 MemoryGraphNodeType 的子集，直接透传即可。
 */
function toMemoryGraphNodeType(type: string): MemoryGraphNodeType {
  if (
    type === "keyword" ||
    type === "event" ||
    type === "letter" ||
    type === "memory"
  ) {
    return type;
  }
  // 旧 type 值不在通用类型范围内时，降级为 memory
  return "memory";
}

/**
 * 将通用 MemoryGraphNodeType 降级为旧 AiGraphNodeType。
 * 通用类型是旧类型的超集，必须做降级映射，避免旧 UI 崩。
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
 * 将旧的 GrowthMemoryArtifact 转换成通用 MemoryArtifact。
 *
 * 作用：
 * - 让 family mode 的旧生成结果进入新的 memory-core 输出抽象
 * - 后续 generic runtime 统一返回 MemoryArtifact 后，此函数可复用验证逻辑
 *
 * 映射规则：
 *   artifactVersion           → artifactVersion
 *   mode                      → "family"
 *   report.title              → narrative.title
 *   report.keywords           → narrative.keywords
 *   report.yearlySummary      → narrative.summary
 *   report.timeline           → narrative.timeline
 *   report.letter             → narrative.longFormText.content
 *   report.socialPosts        → narrative.socialPosts
 *   graph                     → graph（节点类型做兼容转换）
 *   videoScript               → extensions.videoScript
 *   sourceTrace               → extensions.sourceTrace
 *   qualityReview             → extensions.qualityReview
 */
export function growthArtifactToMemoryArtifact(
  artifact: GrowthMemoryArtifact
): MemoryArtifact {
  const { report, graph, videoScript, sourceTrace, qualityReview } = artifact;

  return {
    artifactVersion: artifact.artifactVersion,
    mode: "family",

    narrative: {
      title: report.title,
      keywords: report.keywords,
      summary: report.yearlySummary,
      timeline: report.timeline.map((item) => ({
        time: item.time,
        title: item.title,
        description: item.description,
      })),
      longFormText: {
        title: "给未来的信",
        content: report.letter,
        voice: "parent-letter",
      },
      socialPosts: report.socialPosts.map((post) => ({
        title: post.title,
        content: post.content,
      })),
    },

    graph: {
      title: graph.title,
      subtitle: graph.subtitle,
      centerDescription: graph.centerDescription,
      nodes: graph.nodes.map((node) => ({
        type: toMemoryGraphNodeType(node.type),
        label: node.label,
        description: node.description,
        emotion: node.emotion,
        relatedTo: node.relatedTo,
      })),
    },

    extensions: {
      videoScript,
      sourceTrace: sourceTrace
        ? {
            usedQuestions: sourceTrace.usedQuestions,
            usedFreeNote: sourceTrace.usedFreeNote,
            missingContext: sourceTrace.missingContext,
            groundingNotes: sourceTrace.groundingNotes,
          }
        : undefined,
      qualityReview: qualityReview
        ? {
            riskOfFabrication: qualityReview.riskOfFabrication,
            emotionalTone: qualityReview.emotionalTone,
            weaknesses: qualityReview.weaknesses,
            suggestionsForBetterInput: qualityReview.suggestionsForBetterInput,
          }
        : undefined,
    },
  };
}

/**
 * 将通用 MemoryArtifact 转回旧的 GrowthMemoryArtifact。
 *
 * 作用：
 * - 保持当前 ReportPreview / GrowthReportApp / LifeGraphPreview 不用立刻重写
 * - 让旧 UI 继续消费 GrowthMemoryArtifact，不感知 MemoryArtifact 的存在
 *
 * 注意：
 * - extensions.videoScript 是 unknown，通过 as 加 fallback 安全转换
 * - extensions.sourceTrace / qualityReview 同理
 * - 图谱节点类型从通用类型降级回旧类型
 * - report.skillStatus 全部设为 "done"，表示生成完成
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
