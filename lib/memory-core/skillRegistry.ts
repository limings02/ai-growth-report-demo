// lib/memory-core/skillRegistry.ts
// Memory Skill 目录注册表。
//
// skillDir：.skills/ 下的目录名

import type { MemoryMode } from "./modes";

export type MemorySkillConfig = {
  mode: MemoryMode;
  skillDir: string;
};

export const MEMORY_SKILL_REGISTRY: Record<MemoryMode, MemorySkillConfig> = {
  family: {
    mode: "family",
    skillDir: "family-memory",
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
