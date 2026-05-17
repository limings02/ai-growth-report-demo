// lib/domains/family/adapter.ts
// family mode 的 domain adapter。
//
// 职责：
// 将当前孩子成长功能使用的 RawMaterial（family-only 字段）
// 转换成跨 mode 的通用 MemoryRawMaterial。
//
// 当前阶段：只新增 adapter，不替换旧链路。
// 旧链路（GrowthReportApp → extractRawMaterial → runGrowthMemorySkill）保持不变。
// 未来阶段：skill runtime 可选择接受 MemoryRawMaterial 替代 RawMaterial。

import type { RawMaterial } from "@/lib/types";
import type { MemoryRawMaterial } from "@/lib/memory-core/types";

/**
 * 将孩子成长功能的 RawMaterial 转换成跨 mode 的 MemoryRawMaterial。
 *
 * 映射规则：
 * - mode = "family"
 * - subject：从 childName + reportYear 派生
 * - participants：child + parent 各一条
 * - style：直接复用
 * - media：只记录照片数量，不传递 blob URL
 *   （raw.photoUrls 是 URL.createObjectURL 生成的本地地址，不能传给 AI）
 * - qaList：直接复用
 * - freeNote：直接复用
 * - domainPayload：保留 family-specific 字段，供未来 skill runtime 按需读取
 */
export function familyRawMaterialToMemoryRawMaterial(
  raw: RawMaterial
): MemoryRawMaterial {
  return {
    mode: "family",

    subject: {
      title: `${raw.childName}的 ${raw.reportYear} 成长记录`,
      primaryName: raw.childName,
      timeRange: `${raw.reportYear}`,
    },

    participants: [
      { id: "child", name: raw.childName, role: "child" },
      { id: "parent", name: raw.parentName, role: "parent" },
    ],

    style: raw.style,

    media: [
      {
        type: "photo",
        // 只统计数量，不传递实际 URL
        // raw.photoUrls 是浏览器本地 blob URL，不能上传服务器，不能传给 AI
        count: raw.photoUrls.length,
        localOnly: true,
        description:
          "用户上传的照片仅在浏览器本地预览，不上传服务器，不传给 AI",
      },
    ],

    qaList: raw.qaList,

    freeNote: raw.freeNote,

    // 保留 family-specific 字段，方便未来 skill runtime 按 mode 读取
    domainPayload: {
      childName: raw.childName,
      childAge: raw.childAge,
      reportYear: raw.reportYear,
      parentName: raw.parentName,
    },
  };
}
