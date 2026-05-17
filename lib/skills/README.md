# Skills 目录

## 当前状态（v0.2）

一次 DeepSeek 调用生成完整 `ReportData`，所有内容在 `lib/server/prompts/growthReportPrompt.ts` 中统一构建，由 `app/api/generate-report/route.ts` 触发。

**不把生成拆成多次 API 调用的原因：**
- 降低总延迟（串行多次调用会线性叠加）
- 降低成本（每次独立调用都有固定开销）
- 减少失败点（一次调用失败只需重试一次）
- 先验证用户是否喜欢生成结果，再做精细化优化

## 未来 Skill 化方案

每个 skill 是一个独立的 AI 调用单元，有独立 prompt、独立输出类型、独立重试机制。
当用户量增长、需要精细控制各模块质量时，拆分为多个 skill。

| Skill | 输入 | 输出 | 优先级 |
|-------|------|------|--------|
| `keywordSkill` | RawMaterial | `string[]` | P1 |
| `summarySkill` | RawMaterial | `string` | P1 |
| `timelineSkill` | RawMaterial | `TimelineItem[]` | P1 |
| `letterSkill` | RawMaterial | `string` | P1 |
| `socialPostSkill` | RawMaterial | `SocialPost[]` | P2 |
| `videoScriptSkill` | RawMaterial + ReportData | `VideoScript` | P3 |
| `wikiSourceSkill` | RawMaterial + ReportData | `WikiSource` | P3 |

## 拆分时机建议

满足以下任意一个条件时，考虑拆分：
1. 某个模块的质量明显不稳定，需要单独调优 prompt
2. 用户希望单独重新生成某个模块（如"重新生成这封信"）
3. 并发量足以让多次调用的成本可以接受
4. 需要对不同模块使用不同模型（如用推理模型生成信件）

## 目录结构

```
lib/skills/
  README.md           # 本文件，设计文档
  types.ts            # Skill 系统基础类型（预留，不接入运行时）
  reportSkillPlan.ts  # 各 skill 的执行计划描述（预留，不接入运行时）
```
