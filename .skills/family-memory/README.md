# Growth Memory Skill Pack

这是「给未来的你｜孩子的成长礼物」项目的核心 skill pack。

## 结构

```
growth-memory/
  SKILL.md              # Skill 定义：输入、输出、原则、工作流
  README.md             # 本文件
  prompts/
    00_system_role.md   # 模型角色定义
    01_growth_memory_task.md  # 输入格式 + 任务说明
    02_output_contract.md     # 输出格式合约（严格 JSON）
    03_quality_rules.md       # 质量规则
  schemas/
    raw_material.schema.json          # 输入 schema
    growth_memory_artifact.schema.json # 输出 schema
  examples/
    input.example.json   # 输入示例
    output.example.json  # 输出示例
  tests/
    minimal_input.json   # 最小输入（只有必填字段）
    rich_input.json      # 丰富输入（所有字段都有内容）
    sparse_input.json    # 稀疏输入（大部分问题未回答）
```

## 运行时

Skill 通过 `lib/skill-runtime/` 调用：

```
RawMaterial
  → buildGrowthMemoryPrompt()   # 读取 prompts/ + 注入材料
  → callDeepSeek()              # 调用 LLM
  → parseGrowthMemoryArtifact() # 解析 + 验证 + fallback
  → GrowthMemoryArtifact
```

## 当前版本（v0.4）

- **一次 LLM 调用**生成完整 artifact
- prompt 从 `.skills/growth-memory/prompts/` 运行时读取（fs.readFileSync）
- 修改 prompt 不需要重新 build

## 后续演进

可以把 7 个步骤拆成独立 agent skill：

| Phase | Skills（可并行） |
|-------|----------------|
| 1 | keywordSkill, summarySkill, timelineSkill |
| 2 | letterSkill, socialPostSkill |
| 3 | videoScriptSkill, wikiSourceSkill |

拆分时机：当某个模块质量需要单独调优，或用户需要「重新生成某一部分」功能时。
