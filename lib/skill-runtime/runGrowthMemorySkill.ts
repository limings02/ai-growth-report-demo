// lib/skill-runtime/runGrowthMemorySkill.ts
// 服务端专用：family mode 生成入口，现在是 memory-core 通用链路的兼容 wrapper。
//
// 链路：
//   RawMaterial
//     → familyRawMaterialToMemoryRawMaterial（Phase 2 adapter）
//     → runMemorySkill（通用 memory-core 链路）
//     → memoryArtifactToGrowthArtifact（Phase 3 adapter）
//     → GrowthMemoryArtifact
//
// 对外接口保持不变：
// - 函数名：runGrowthMemorySkill
// - 参数：RawMaterial
// - 返回：GrowthMemoryArtifact
//
// /api/generate-report、GrowthReportApp、ReportPreview 均无需修改。

import type { RawMaterial } from "@/lib/types";
import type { GrowthMemoryArtifact } from "./types";
import { familyRawMaterialToMemoryRawMaterial } from "@/lib/domains/family/adapter";
import { memoryArtifactToGrowthArtifact } from "@/lib/domains/family/artifactAdapter";
import { runMemorySkill } from "@/lib/memory-core/runMemorySkill";

export async function runGrowthMemorySkill(
  material: RawMaterial
): Promise<GrowthMemoryArtifact> {
  // 1. 转换为通用输入格式
  const memoryMaterial = familyRawMaterialToMemoryRawMaterial(material);

  // 2. 通用 memory skill 链路（build → call → parse）
  const memoryArtifact = await runMemorySkill(memoryMaterial);

  // 3. 转换回旧输出格式，保持现有 UI 不受影响
  return memoryArtifactToGrowthArtifact(memoryArtifact);
}
