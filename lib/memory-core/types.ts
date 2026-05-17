// lib/memory-core/types.ts
// 跨 mode 的通用输入类型定义。
//
// 设计目的：
// 1. 避免底层 runtime 继续依赖 childName / parentName / reportYear 等 family-only 字段。
// 2. 让 couple / personal / memorial 未来可以走同一套 skill runtime。
// 3. 当前阶段只做类型定义和 domain adapter，不替换现有 RawMaterial 和旧链路。

import type { MemoryMode } from "./modes";

/**
 * 参与者：用于统一表达不同 mode 里的角色。
 *
 * family mode:
 * - child
 * - parent
 *
 * couple mode:
 * - partnerA
 * - partnerB
 *
 * personal mode:
 * - self
 *
 * memorial mode:
 * - deceased
 * - narrator
 * - familyMember
 */
export type MemoryParticipant = {
  id: string;
  name: string;
  role: string;
};

/**
 * 媒体引用：只描述媒体类型和数量，不保存真实文件或 URL。
 *
 * 重要约束：
 * - 当前项目照片只做本地预览（URL.createObjectURL）
 * - 不能上传服务器
 * - 不能把 blob URL 传给 AI
 * - 本类型只记录 count 和 description，用于生成时向 AI 说明媒体情况
 */
export type MemoryMediaRef = {
  type: "photo" | "chat" | "note" | "audio" | "video";
  count?: number;
  localOnly?: boolean;
  description?: string;
};

/**
 * 通用问答材料。
 *
 * 不同 mode 都可以复用：
 * - family：父母回答孩子成长问题
 * - couple：情侣回答恋爱问题
 * - personal：用户回答人生阶段问题
 * - memorial：家人回答逝者回忆问题
 */
export type MemoryQA = {
  question: string;
  answer: string;
};

/**
 * 记忆主题元信息。
 *
 * 跨 mode 的通用描述，不依赖任何 mode-specific 字段。
 */
export type MemorySubject = {
  title: string;
  primaryName: string;
  timeRange: string;
};

/**
 * 跨 mode 的统一原始材料输入（Memory Engine 的标准输入层）。
 *
 * 设计思路：
 * - mode：标识当前是哪个记忆主题
 * - subject：记忆主题的核心描述
 * - participants：参与者列表（支持多角色）
 * - style：生成风格（由各 mode 自定义合法值）
 * - media：媒体引用描述（只记录数量和类型，不含实际文件）
 * - qaList：问答列表（核心内容来源）
 * - freeNote：自由文本补充
 * - domainPayload：各 mode 的专属字段，保留向后兼容性
 *
 * 当前阶段：只做类型定义和 adapter，不替换现有 RawMaterial。
 * 未来阶段：skill runtime 可逐步迁移到接受 MemoryRawMaterial。
 */
export type MemoryRawMaterial = {
  mode: MemoryMode;
  subject: MemorySubject;
  participants: MemoryParticipant[];
  style: string;
  media: MemoryMediaRef[];
  qaList: MemoryQA[];
  freeNote: string;
  /**
   * 各 mode 的专属字段容器。
   * 例如 family mode 会在这里保留 childAge、reportYear 等。
   * 未来 skill runtime 可以按 mode 读取对应字段。
   */
  domainPayload?: Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────────
// 通用输出类型（Memory Engine 标准输出层）
// 当前阶段只做类型定义，不替换 GrowthMemoryArtifact 或 ReportPreview
// ─────────────────────────────────────────────────────────────────

/**
 * 通用时间线条目。
 *
 * family mode:  孩子的成长瞬间
 * couple mode:  恋爱关系中的重要节点
 * personal mode: 个人阶段中的关键事件
 * memorial mode: 被纪念者的人生片段或共同回忆
 */
export type MemoryTimelineItem = {
  time: string;
  title: string;
  description: string;
};

/**
 * 通用社交分享文案。
 *
 * 不同 mode 可以生成朋友圈、小红书、纪念页分享语等。
 */
export type MemorySocialPost = {
  title: string;
  content: string;
};

/**
 * 通用长文内容。
 *
 * family mode:   给孩子的信
 * couple mode:   周年信 / 写给对方的信
 * personal mode: 写给未来自己的信 / 人生阶段回顾
 * memorial mode: 纪念文 / 家族记忆文
 */
export type MemoryLongFormText = {
  title: string;
  content: string;
  /** 文字视角标识，如 "parent-letter"、"self-reflection"、"memorial-tribute" */
  voice: string;
};

/**
 * 通用叙事层。
 *
 * 所有 mode 都应该能输出的核心 narrative：
 * - title：标题
 * - keywords：关键词
 * - summary：整体总结
 * - timeline：时间线
 * - longFormText：长文（信、纪念文等）
 * - socialPosts：分享文案
 */
export type MemoryNarrative = {
  title: string;
  keywords: string[];
  summary: string;
  timeline: MemoryTimelineItem[];
  longFormText: MemoryLongFormText;
  socialPosts: MemorySocialPost[];
};

/**
 * 通用记忆图谱节点类型。
 *
 * 设计为超集，能覆盖 family / couple / personal / memorial：
 * - subject：主角节点
 * - person：参与者节点
 * - time：时间节点
 * - keyword：关键词节点（兼容旧 family mode）
 * - event：事件节点（兼容旧 family mode）
 * - place：地点节点
 * - message：聊天/书信节点（couple mode）
 * - letter：信件节点（兼容旧 family mode）
 * - memory：记忆/回忆节点（兼容旧 family mode）
 * - emotion：情绪节点
 */
export type MemoryGraphNodeType =
  | "subject"
  | "person"
  | "time"
  | "keyword"
  | "event"
  | "place"
  | "message"
  | "letter"
  | "memory"
  | "emotion";

/**
 * 通用图谱语义节点。
 *
 * 注意：这是给 UI 渲染图谱用的语义 hint，不是最终 SVG 布局数据。
 */
export type MemoryGraphNodeHint = {
  type: MemoryGraphNodeType;
  label: string;
  description: string;
  emotion?: string;
  relatedTo: string[];
};

/**
 * 通用图谱提示。
 *
 * 后续 Relationship Galaxy / Life Graph / Memorial Graph 都可以复用。
 */
export type MemoryGraphHints = {
  title: string;
  subtitle: string;
  centerDescription: string;
  nodes: MemoryGraphNodeHint[];
};

/**
 * 通用输入溯源。
 *
 * 用于解释生成内容基于哪些问题、是否使用自由文本、缺失哪些上下文。
 */
export type MemorySourceTrace = {
  usedQuestions: string[];
  usedFreeNote: boolean;
  missingContext: string[];
  groundingNotes: string[];
};

/**
 * 通用质量自检。
 *
 * 用于评估幻觉风险、情绪基调、当前内容弱点和改进输入建议。
 */
export type MemoryQualityReview = {
  riskOfFabrication: "low" | "medium" | "high";
  emotionalTone: string;
  weaknesses: string[];
  suggestionsForBetterInput: string[];
};

/**
 * 跨 mode 的统一生成结果（Memory Engine 标准输出层）。
 *
 * 当前阶段：
 * - 只新增类型，不替换旧 GrowthMemoryArtifact
 * - 不替换 ReportPreview 的 props
 *
 * 后续阶段：
 * - 通用 runMemorySkill 可以返回 MemoryArtifact
 * - family mode 通过 artifactAdapter 转回 GrowthMemoryArtifact，兼容旧 UI
 */
export type MemoryArtifact = {
  artifactVersion: string;
  mode: MemoryMode;
  narrative: MemoryNarrative;
  graph: MemoryGraphHints;
  extensions: {
    /**
     * 视频脚本（family mode 当前已支持，其他 mode 预留）。
     * 使用 unknown 避免强耦合旧 VideoScript 类型。
     */
    videoScript?: unknown;
    sourceTrace?: MemorySourceTrace;
    qualityReview?: MemoryQualityReview;
    /** 扩展槽：各 mode 可放入专属字段 */
    [key: string]: unknown;
  };
};
