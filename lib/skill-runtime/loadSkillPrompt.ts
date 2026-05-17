// lib/skill-runtime/loadSkillPrompt.ts
// 服务端专用：运行时从 .skills/growth-memory/prompts/ 读取 prompt 文件
// 改 prompt 不需要重新 build

import fs from "fs";
import path from "path";

const PROMPTS_DIR = path.join(process.cwd(), ".skills", "growth-memory", "prompts");

function readPromptFile(filename: string): string {
  const filePath = path.join(PROMPTS_DIR, filename);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    throw new Error(`无法读取 skill prompt 文件：${filePath}`);
  }
}

export type SkillPromptSections = {
  systemRole: string;
  taskDescription: string;
  outputContract: string;
  qualityRules: string;
};

// 读取全部 4 个 prompt section，运行时调用
export function loadGrowthMemoryPrompts(): SkillPromptSections {
  return {
    systemRole: readPromptFile("00_system_role.md"),
    taskDescription: readPromptFile("01_growth_memory_task.md"),
    outputContract: readPromptFile("02_output_contract.md"),
    qualityRules: readPromptFile("03_quality_rules.md"),
  };
}
