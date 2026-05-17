// lib/domains/couple/adapter.ts
// couple mode 的 domain adapter（占位）。
//
// 当前阶段：只做类型定义和 adapter 实现，不接入 UI / API。
//
// 未来 MVP 规划：
// - 支持用户手动粘贴聊天文本（不做自动导入，不读取系统数据库）
// - 支持上传照片本地预览
// - 生成恋爱时间线、Relationship Galaxy
// - 不处理任何绕过系统权限的能力

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
  qaList: { question: string; answer: string }[];
  freeNote: string;
};

/**
 * 将情侣模式的原始输入转换成通用 MemoryRawMaterial。
 *
 * 媒体说明：
 * - photo：本地预览，不上传服务器，不传给 AI，只记录数量
 * - chat：用户手动粘贴的聊天文本，记录条数估算值
 */
export function coupleRawInputToMemoryRawMaterial(
  input: CoupleRawInput
): MemoryRawMaterial {
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
        count: input.chatMessageCount ?? 0,
        description: "用户手动粘贴或导入的聊天文本条数（估算值）",
      },
    ],

    qaList: input.qaList,

    freeNote: input.freeNote,

    domainPayload: {
      partnerAName: input.partnerAName,
      partnerBName: input.partnerBName,
      relationshipTimeRange: input.relationshipTimeRange,
      anniversaryDate: input.anniversaryDate,
    },
  };
}
