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
