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
// - 不再调用 memoryArtifactToGrowthArtifact，直接返回 MemoryArtifact
// - 不修改 .skills/family-memory
// - family-memory 仍可能输出旧 GrowthMemoryArtifact 格式
//   parseMemoryArtifact 会识别并兼容转换为标准 MemoryArtifact
// - runGrowthMemorySkill 保留作为 legacy wrapper / rollback path，不删除

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
