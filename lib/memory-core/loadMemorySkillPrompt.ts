// lib/memory-core/loadMemorySkillPrompt.ts
// 服务端专用：根据 MemoryMode 从 .skills/ 目录加载 prompt 片段。
// 不要在客户端组件中 import 本文件（依赖 Node.js fs 模块）。
//
// 目录约定：.skills/{skillDir}/prompts/
// - 00_system_role.md
// - 01_task.md
// - 02_output_contract.md
// - 03_quality_rules.md

import fs from "fs";
import path from "path";
import type { MemoryMode } from "./modes";
import { getMemorySkillConfig } from "./skillRegistry";

export type MemorySkillPromptSections = {
  systemRole: string;
  taskDescription: string;
  outputContract: string;
  qualityRules: string;
};

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function readPromptFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    throw new Error(`无法读取 memory skill prompt 文件：${filePath}`);
  }
}

function resolveSkillDir(mode: MemoryMode): string {
  const config = getMemorySkillConfig(mode);
  const skillDir = path.join(process.cwd(), ".skills", config.skillDir);
  if (fileExists(skillDir)) return skillDir;
  throw new Error(
    `[memory-core] 找不到 mode=${mode} 对应的 skill 目录：${skillDir}`
  );
}

export function loadMemorySkillPrompts(
  mode: MemoryMode
): MemorySkillPromptSections {
  const skillDir = resolveSkillDir(mode);
  const promptsDir = path.join(skillDir, "prompts");

  return {
    systemRole: readPromptFile(path.join(promptsDir, "00_system_role.md")),
    taskDescription: readPromptFile(path.join(promptsDir, "01_task.md")),
    outputContract: readPromptFile(path.join(promptsDir, "02_output_contract.md")),
    qualityRules: readPromptFile(path.join(promptsDir, "03_quality_rules.md")),
  };
}
