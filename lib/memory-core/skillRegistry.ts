// lib/memory-core/skillRegistry.ts
// Memory Skill 目录注册表。
//
// skillDir：.skills/ 下的目录名
// fallbackSkillDir：主目录不存在时的兜底目录（供迁移过渡期使用）
//
// 当前 family 优先找 .skills/family-memory，
// 若不存在则 fallback 到已有的 .skills/growth-memory，
// 保证 Phase 4 在 family-memory 创建前仍可正常运行。

import type { MemoryMode } from "./modes";

export type MemorySkillConfig = {
  mode: MemoryMode;
  skillDir: string;
  fallbackSkillDir?: string;
};

export const MEMORY_SKILL_REGISTRY: Record<MemoryMode, MemorySkillConfig> = {
  family: {
    mode: "family",
    skillDir: "family-memory",
    fallbackSkillDir: "growth-memory",
  },
  couple: {
    mode: "couple",
    skillDir: "couple-memory",
  },
  personal: {
    mode: "personal",
    skillDir: "personal-memory",
  },
  memorial: {
    mode: "memorial",
    skillDir: "memorial-memory",
  },
};

export function getMemorySkillConfig(mode: MemoryMode): MemorySkillConfig {
  return MEMORY_SKILL_REGISTRY[mode];
}
