// lib/domains/couple/adapter.ts
// couple mode 的 domain adapter。
//
// MVP 阶段约束：
// - 支持用户手动粘贴聊天文本（不做自动导入，不读取系统数据库）
// - 支持照片数量记录（本地预览，不上传）
// - 不处理任何绕过系统权限的能力
// - 不读取微信数据库

import type { MemoryRawMaterial } from "@/lib/memory-core/types";

export type CoupleRawInput = {
  partnerAName: string;
  partnerBName: string;
  /** 恋爱时间跨度，如 "2021.06 - 至今" */
  relationshipTimeRange: string;
  /** 纪念日，可选 */
  anniversaryDate?: string;
  style: "romantic" | "documentary" | "playful" | "literary";
  /** 照片数量（本地预览，不上传） */
  photoCount: number;
  /** 用户手动粘贴的聊天消息条数（估算值），可选 */
  chatMessageCount?: number;
  /**
   * 用户手动粘贴的聊天文本。
   *
   * MVP 阶段只允许用户主动粘贴：
   * - 不读取微信数据库
   * - 不自动导入微信聊天记录
   * - 不绕过系统权限
   */
  chatText?: string;
  qaList: { question: string; answer: string }[];
  freeNote: string;
};

/**
 * 简单估算聊天消息条数：按非空行数计算。
 * 这是 MVP 占位，不做微信格式解析。
 */
function estimateChatMessageCount(chatText?: string): number {
  if (!chatText?.trim()) return 0;
  return chatText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;
}

/**
 * 将情侣模式的原始输入转换成通用 MemoryRawMaterial。
 *
 * 媒体说明：
 * - photo：本地预览，不上传服务器，不传给 AI，只记录数量
 * - chat：用户手动粘贴的聊天文本，记录条数估算值
 *
 * chatText 保存在 domainPayload 中，供后续 skill prompt 读取。
 */
export function coupleRawInputToMemoryRawMaterial(
  input: CoupleRawInput
): MemoryRawMaterial {
  const chatCount =
    input.chatMessageCount ?? estimateChatMessageCount(input.chatText);

  return {
    mode: "couple",

    subject: {
      title: `${input.partnerAName} 和 ${input.partnerBName} 的恋爱记忆`,
      primaryName: "我们的恋爱故事",
      timeRange: input.relationshipTimeRange,
    },

    participants: [
      { id: "partnerA", name: input.partnerAName, role: "partnerA" },
      { id: "partnerB", name: input.partnerBName, role: "partnerB" },
    ],

    style: input.style,

    media: [
      {
        type: "photo",
        count: input.photoCount,
        localOnly: true,
        description: "照片仅在浏览器本地预览，不上传服务器，不传给 AI",
      },
      {
        type: "chat",
        count: chatCount,
        description: "用户手动粘贴的聊天文本（估算行数）",
      },
    ],

    qaList: input.qaList,

    freeNote: input.freeNote,

    domainPayload: {
      partnerAName: input.partnerAName,
      partnerBName: input.partnerBName,
      relationshipTimeRange: input.relationshipTimeRange,
      anniversaryDate: input.anniversaryDate,
      // chatText 保存在 domainPayload，供 couple-memory skill prompt 读取
      chatText: input.chatText,
    },
  };
}
