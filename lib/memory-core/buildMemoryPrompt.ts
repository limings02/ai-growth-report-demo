// lib/memory-core/buildMemoryPrompt.ts
// 服务端专用：输入 MemoryRawMaterial，输出 ChatMessage[]。
// 不要在客户端组件中 import 本文件。
//
// 设计原则：
// - 不写死 childName / childAge / parentName 等 family-only 字段
// - media 只注入 count / localOnly / description，不注入 File 或 blob URL
// - domainPayload 原样传入，让对应 mode 的 prompt 自行读取

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
