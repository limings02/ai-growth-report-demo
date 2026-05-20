# Family Rollback Path Removal - Phase 12.6D

> 完成时间：Phase 12.6D（2026-05-20）  
> 前置：Phase 12.6B（UI fallback）+ Phase 12.6C（parse fallback）均已完成

---

## 1. 背景

- Phase 12.6B 已删除 dev legacy UI fallback（ReportPreview / LifeGraphPreview）。
- Phase 12.6C 已删除旧格式 parse fallback（parseGrowthMemoryArtifact / growthArtifactToMemoryArtifact）。
- 本阶段删除最后的 rollback path，并清理所有过渡期遗留注释和死代码。

---

## 2. 删除 / 归档范围

| 文件 / 逻辑 | 处理 | 说明 |
|---|---|---|
| `lib/skill-runtime/runGrowthMemorySkill.ts` | **删除** | rollback wrapper，无生产调用 |
| `lib/domains/family/artifactAdapter.ts` | **删除** | 只服务 runGrowthMemorySkill（`memoryArtifactToGrowthArtifact`）|
| `lib/skill-runtime/buildGrowthMemoryPrompt.ts` | **删除** | 无外部调用 |
| `lib/skill-runtime/loadSkillPrompt.ts` | **删除** | 只被 buildGrowthMemoryPrompt 导入 |
| `lib/skill-runtime/types.ts` | **删除** | 只被 artifactAdapter + SkillReviewPanel 导入（均已删除）|
| `components/SkillReviewPanel.tsx` | **删除** | 孤立 dev panel，从未被任何组件 import |
| `lib/memory-core/skillRegistry.ts` `fallbackSkillDir` | **删除** | family-memory 已稳定，growth-memory fallback 不再需要 |
| `lib/memory-core/loadMemorySkillPrompt.ts` fallback 逻辑 | **删除** | `resolveSkillDir` 简化为直接 throw；`01_growth_memory_task.md` fallback 删除 |
| `lib/memory-core/buildMemoryPrompt.ts` `legacyFamilyInput` | **删除** | family-memory prompt 不再使用此字段 |
| `.skills/growth-memory/README.md` | **更新** | 归档说明，保留目录不删除 |

### 注释清理

| 文件 | 清理内容 |
|------|---------|
| `lib/memory-core/types.ts` | 删除"不替换 GrowthMemoryArtifact"过渡说明；MemoryArtifact JSDoc 更新 |
| `lib/memory-core/runMemorySkill.ts` | 删除 legacyFamilyInput / GrowthMemoryArtifact 注释 |
| `lib/domains/family/runFamilyMemorySkill.ts` | 删除 rollback path 过时注释 |
| `lib/domains/family/adapter.ts` | 删除旧链路提及 |
| `lib/types.ts` | 删除 GrowthMemoryArtifact 引用注释，更新生成器接口注释 |
| `lib/aiReportGenerator.ts` | 更新结构防御注释 |

---

## 3. 保留范围

| 文件 / 逻辑 | 原因 |
|---|---|
| `.skills/growth-memory/` | 历史参考保留，不急删；已标记 ARCHIVED |
| `.skills/family-memory/` | 当前 family skill pack |
| `lib/domains/family/runFamilyMemorySkill.ts` | 当前 family server 入口 |
| `lib/memory-core/runMemorySkill.ts` | 当前通用 runtime |
| `lib/memory-core/parseMemoryArtifact.ts` | 当前标准解析，含 malformed JSON 兜底 |
| `components/family/FamilyArtifactPreview.tsx` | 当前展示 |
| `components/GrowthReportApp.tsx` | 当前状态机 |

---

## 4. grep 验证结果

| 符号 | 代码引用 | 历史注释引用 |
|------|---------|------------|
| `runGrowthMemorySkill` | **0** | 0 |
| `memoryArtifactToGrowthArtifact` | **0** | 0 |
| `GrowthMemoryArtifact` | **0** | 2 处（parseMemoryArtifact.ts + route.ts 说明文字）|
| `buildGrowthMemoryPrompt` | **0** | 0 |
| `artifactAdapter` | **0** | 0 |
| `skill-runtime/types` | **0** | 0 |
| `legacyFamilyInput` | **0** | 0 |
| `fallbackSkillDir` | **0** | 0 |

---

## 5. 功能验收

### lint / build

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

### API 验证（真实调用）

```
mode: family                             ✅
has_narrative: True                      ✅
has_report (should be False): False      ✅
narrative.title: 测试的 2024 成长礼物     ✅
longFormText.voice: parent-letter        ✅
risk: medium                             ✅（2条短问答，评估正确）
has_qualityReview: True                  ✅
```

### malformed JSON 兜底

未做直接 parser 单元测试。代码静态分析确认 `parseMemoryArtifact.ts` 的 try/catch 路径完整，malformed JSON → `makeMinimalMemoryArtifact` 不抛异常。

### 真实浏览器验证

**未完成真实浏览器交互验证**。API 验证通过，静态分析确认 `GrowthReportApp` → `FamilyArtifactPreview` 链路未改动。

---

## 6. 结论

| 检查项 | 状态 |
|--------|------|
| lint | ✅ 通过 |
| build | ✅ 通过 |
| 全部 rollback path 代码引用 | ✅ 0 |
| API 生成验证 | ✅ 标准 MemoryArtifact |
| `.skills/growth-memory` 已归档 | ✅ |
| family 主链路无影响 | ✅ |
| 是否允许进入 Phase 12.7 | ✅ **允许** |
