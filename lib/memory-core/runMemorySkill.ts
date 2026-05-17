// lib/memory-core/runMemorySkill.ts
// 服务端专用：通用 Memory Skill 入口。
// 不要在客户端组件中 import 本文件。
//
// 链路：MemoryRawMaterial → buildMemoryPrompt → callDeepSeek → parseMemoryArtifact → MemoryArtifact
//
// family-specific 兼容逻辑分别在：
// - buildMemoryPrompt：注入 legacyFamilyInput 保持旧 growth-memory prompt 兼容
// - parseMemoryArtifact：识别旧 GrowthMemoryArtifact 格式并转换

import type { MemoryRawMaterial, MemoryArtifact } from "./types";
import { callDeepSeek } from "@/lib/server/deepseekClient";
import { buildMemoryPrompt } from "./buildMemoryPrompt";
import { parseMemoryArtifact } from "./parseMemoryArtifact";

export async function runMemorySkill(
  material: MemoryRawMaterial
): Promise<MemoryArtifact> {
  const messages = buildMemoryPrompt(material);
  const raw = await callDeepSeek(messages);
  return parseMemoryArtifact(raw, material);
}
