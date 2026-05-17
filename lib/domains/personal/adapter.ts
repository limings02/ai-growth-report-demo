// lib/domains/personal/adapter.ts
// personal mode 的 domain adapter（占位）。
//
// 定位：
// - 用于个人人生 Wiki、自我回忆录、人生阶段总结
// - 用户整理某一段人生时期的感悟、经历与转折
//
// 当前阶段：只做类型定义和 adapter 实现，不接入 UI / API。

import type { MemoryRawMaterial } from "@/lib/memory-core/types";

export type PersonalRawInput = {
  personName: string;
  /** 人生阶段描述，如 "大学时期"、"第一份工作"、"移居海外" */
  lifeStage: string;
  /** 时间跨度，如 "2018 - 2022" */
  timeRange: string;
  style: "documentary" | "literary" | "reflective" | "warm";
  /** 照片数量（本地预览，不上传） */
  photoCount?: number;
  qaList: { question: string; answer: string }[];
  freeNote: string;
};

/**
 * 将个人模式的原始输入转换成通用 MemoryRawMaterial。
 */
export function personalRawInputToMemoryRawMaterial(
  input: PersonalRawInput
): MemoryRawMaterial {
  return {
    mode: "personal",

    subject: {
      title: `${input.personName}的${input.lifeStage}`,
      primaryName: input.personName,
      timeRange: input.timeRange,
    },

    participants: [
      { id: "self", name: input.personName, role: "self" },
    ],

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
      personName: input.personName,
      lifeStage: input.lifeStage,
      timeRange: input.timeRange,
    },
  };
}
