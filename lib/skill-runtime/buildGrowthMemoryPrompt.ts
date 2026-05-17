// lib/skill-runtime/buildGrowthMemoryPrompt.ts
// 服务端专用：把 RawMaterial 注入 skill prompts，生成最终 ChatMessage[]

import type { RawMaterial } from "@/lib/types";
import type { ChatMessage } from "@/lib/server/deepseekClient";
import { loadGrowthMemoryPrompts } from "./loadSkillPrompt";

export function buildGrowthMemoryPrompt(material: RawMaterial): ChatMessage[] {
  const prompts = loadGrowthMemoryPrompts();

  // 把 RawMaterial 序列化为 JSON 注入给模型
  // photoUrls（blob://）替换为 photoCount，不传 URL
  const materialForLLM = {
    childName: material.childName,
    childAge: material.childAge,
    reportYear: material.reportYear,
    parentName: material.parentName,
    style: material.style,
    photoCount: material.photoUrls.length,
    qaList: material.qaList,
    freeNote: material.freeNote,
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
    "请现在生成 GrowthMemoryArtifact JSON。",
  ].join("\n");

  return [
    { role: "system", content: prompts.systemRole },
    { role: "user", content: userContent },
  ];
}
