// lib/memory-core/buildMemoryPrompt.ts
// 服务端专用：输入 MemoryRawMaterial，输出 ChatMessage[]。
// 不要在客户端组件中 import 本文件。
//
// 设计原则：
// - 不写死 childName / childAge / parentName 等 family-only 字段
// - media 只注入 count / localOnly / description，不注入 File 或 blob URL
// - domainPayload 原样传入，让对应 mode 的 prompt 自行读取
//
// 兼容说明（Part H）：
// 当前 family 会 fallback 到旧 .skills/growth-memory prompt，
// 而旧 prompt 期待输入顶层包含 childName / childAge 等字段。
// 为此在 materialForLLM 中增加 legacyFamilyInput 字段作为过渡兼容。
// 后续 .skills/family-memory 创建并完全理解 MemoryRawMaterial 后，可删除此字段。

import type { ChatMessage } from "@/lib/server/deepseekClient";
import type { MemoryRawMaterial } from "./types";
import { loadMemorySkillPrompts } from "./loadMemorySkillPrompt";

export function buildMemoryPrompt(material: MemoryRawMaterial): ChatMessage[] {
  const prompts = loadMemorySkillPrompts(material.mode);

  const materialForLLM = {
    mode: material.mode,
    subject: material.subject,
    participants: material.participants,
    style: material.style,
    media: material.media.map((item) => ({
      type: item.type,
      count: item.count,
      localOnly: item.localOnly,
      description: item.description,
      // 注意：不包含 url / file / blob，照片只在浏览器本地预览
    })),
    qaList: material.qaList,
    freeNote: material.freeNote,
    domainPayload: material.domainPayload ?? {},

    // legacyFamilyInput：过渡兼容字段，仅供旧 growth-memory prompt 读取。
    // 旧 prompt 期待顶层包含 childName / childAge / reportYear / parentName 等字段。
    // 这里统一放到 legacyFamilyInput 下，不污染通用 memory-core 结构。
    // 等 .skills/family-memory 创建并完全迁移后，删除此字段。
    legacyFamilyInput:
      material.mode === "family"
        ? {
            childName: material.domainPayload?.childName,
            childAge: material.domainPayload?.childAge,
            reportYear: material.domainPayload?.reportYear,
            parentName: material.domainPayload?.parentName,
            style: material.style,
            photoCount:
              material.media.find((m) => m.type === "photo")?.count ?? 0,
            qaList: material.qaList,
            freeNote: material.freeNote,
          }
        : undefined,
  };

  const userContent = [
    prompts.taskDescription,
    "",
    "---",
    "",
    prompts.outputContract,
    "",
    "---",
    "",
    prompts.qualityRules,
    "",
    "---",
    "",
    "## 输入材料",
    "",
    "```json",
    JSON.stringify(materialForLLM, null, 2),
    "```",
    "",
    "请现在生成符合输出合约的 JSON。",
  ].join("\n");

  return [
    { role: "system", content: prompts.systemRole },
    { role: "user", content: userContent },
  ];
}
