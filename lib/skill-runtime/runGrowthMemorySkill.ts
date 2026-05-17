// lib/skill-runtime/runGrowthMemorySkill.ts
// 服务端专用：skill 入口，build → call → parse
// 替换旧的 buildGrowthReportPrompt → callDeepSeek → parseReportJson 链路

import type { RawMaterial } from "@/lib/types";
import type { GrowthMemoryArtifact } from "./types";
import { callDeepSeek } from "@/lib/server/deepseekClient";
import { buildGrowthMemoryPrompt } from "./buildGrowthMemoryPrompt";
import { parseGrowthMemoryArtifact } from "./parseGrowthMemoryArtifact";

export async function runGrowthMemorySkill(
  material: RawMaterial
): Promise<GrowthMemoryArtifact> {
  const messages = buildGrowthMemoryPrompt(material);
  const raw = await callDeepSeek(messages);
  return parseGrowthMemoryArtifact(raw, material.childName, material.reportYear);
}
