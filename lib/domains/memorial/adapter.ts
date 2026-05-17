// lib/domains/memorial/adapter.ts
// memorial mode 的 domain adapter（占位）。
//
// 定位：
// - 用于纪念馆、逝者回忆、家族记忆传承
// - 帮助家人整理关于逝去之人的故事、声音与精神
//
// 当前阶段：只做类型定义和 adapter 实现，不接入 UI / API，不生成任何纪念内容。
//
// 文案和注释保持克制与尊重。

import type { MemoryRawMaterial } from "@/lib/memory-core/types";

export type MemorialRawInput = {
  /** 被纪念者的姓名 */
  deceasedName: string;
  /** 撰写者姓名，可选 */
  narratorName?: string;
  /** 撰写者与被纪念者的关系，如 "女儿"、"老友" */
  relationship?: string;
  /** 时间跨度，描述被纪念者的生命或记忆片段 */
  timeRange: string;
  style: "documentary" | "warm" | "solemn" | "literary";
  /** 照片数量（本地预览，不上传） */
  photoCount?: number;
  qaList: { question: string; answer: string }[];
  freeNote: string;
};

/**
 * 将纪念馆模式的原始输入转换成通用 MemoryRawMaterial。
 */
export function memorialRawInputToMemoryRawMaterial(
  input: MemorialRawInput
): MemoryRawMaterial {
  const participants = [
    { id: "deceased", name: input.deceasedName, role: "deceased" },
    ...(input.narratorName
      ? [{ id: "narrator", name: input.narratorName, role: "narrator" }]
      : []),
  ];

  return {
    mode: "memorial",

    subject: {
      title: `${input.deceasedName}的记忆`,
      primaryName: input.deceasedName,
      timeRange: input.timeRange,
    },

    participants,

    style: input.style,

    media: [
      ...(input.photoCount != null && input.photoCount > 0
        ? [
            {
              type: "photo" as const,
              count: input.photoCount,
              localOnly: true,
              description: "照片仅在浏览器本地预览，不上传服务器",
            },
          ]
        : []),
    ],

    qaList: input.qaList,

    freeNote: input.freeNote,

    domainPayload: {
      deceasedName: input.deceasedName,
      narratorName: input.narratorName,
      relationship: input.relationship,
      timeRange: input.timeRange,
    },
  };
}
