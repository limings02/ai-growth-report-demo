// lib/domains/family/runFamilyMemorySkill.ts
// 服务端专用：family mode 标准 MemoryArtifact 生成入口。
// Phase 12.4B 新增。
//
// 链路：
//   RawMaterial
//     → familyRawMaterialToMemoryRawMaterial
//     → runMemorySkill（通用 memory-core 链路）
//     → MemoryArtifact
//
// 注意：
// - 不修改 .skills/family-memory

import type { RawMaterial } from "@/lib/types";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import { familyRawMaterialToMemoryRawMaterial } from "@/lib/domains/family/adapter";
import { runMemorySkill } from "@/lib/memory-core/runMemorySkill";

export async function runFamilyMemorySkill(
  material: RawMaterial
): Promise<MemoryArtifact> {
  const memoryMaterial = familyRawMaterialToMemoryRawMaterial(material);
  return runMemorySkill(memoryMaterial);
}
