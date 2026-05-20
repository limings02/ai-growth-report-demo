# Family Dev Fallback Removal - Phase 12.6B

> 完成时间：Phase 12.6B（2026-05-20）  
> 前置：Phase 12.6A 已完成引用审计，决策删除 dev-only legacy ReportPreview fallback

---

## 1. 背景

- Phase 12.6A 决策：采用方案 B，删除 dev-only legacy ReportPreview fallback。
- 本阶段只删除 UI fallback 链路。
- parser fallback 和 rollback path 保留，留到 Phase 12.6C / 12.6D 处理。

---

## 2. 删除范围

| 文件 / 逻辑 | 处理 |
|---|---|
| `GrowthReportApp` `showLegacyReportPreview` state | 删除 |
| `GrowthReportApp` `ReportPreview` import | 删除 |
| `GrowthReportApp` `memoryArtifactToGrowthArtifact` import | 删除 |
| `GrowthReportApp` `isDev` 变量（仅 legacy fallback 用途） | 删除 |
| dev-only 「🧪 查看旧版 ReportPreview」浮动按钮 | 删除 |
| dev-only `if (isDev && showLegacyReportPreview)` 分支 | 删除 |
| `components/ReportPreview.tsx` | 删除 |
| `components/LifeGraphPreview.tsx` | 删除 |
| `lib/graph/buildLifeGraph.ts` | 删除 |
| `lib/graph/types.ts` | 删除 |

---

## 3. 保留范围

| 文件 / 逻辑 | 原因 |
|---|---|
| `lib/memory-core/parseMemoryArtifact.ts` 旧格式 fallback | Phase 12.6C 处理 |
| `lib/skill-runtime/parseGrowthMemoryArtifact.ts` | Phase 12.6C 处理 |
| `lib/skill-runtime/runGrowthMemorySkill.ts` | Phase 12.6D 处理 |
| `lib/domains/family/artifactAdapter.ts` | parse fallback / rollback 仍使用 |
| `lib/skill-runtime/types.ts`（`GrowthMemoryArtifact` 类型） | Phase 12.6D 处理 |
| `.skills/growth-memory` | 后续归档 |

---

## 4. grep 验证结果

### 命令及结果

```
rg "ReportPreview"       → 仅注释（3 处：runGrowthMemorySkill.ts、types.ts、artifactAdapter.ts）
rg "LifeGraphPreview"    → 仅注释（2 处：artifactAdapter.ts）
rg "buildLifeGraph"      → 0
rg "LifeGraphData"       → 0
rg "showLegacyReportPreview" → 0
```

### 分类说明

| 符号 | 代码引用 | 文档/注释历史引用 |
|------|---------|-----------------|
| `ReportPreview` | **0** | 3 处（历史注释，在保留文件中） |
| `LifeGraphPreview` | **0** | 2 处（历史注释，在保留文件中） |
| `buildLifeGraph` | **0** | 0 |
| `LifeGraphData` | **0** | 0 |
| `showLegacyReportPreview` | **0** | 0 |

注释历史引用位于 `artifactAdapter.ts` / `runGrowthMemorySkill.ts` / `lib/memory-core/types.ts`，这些文件是 Phase 12.6C/D 的清理对象，历史注释不影响当前行为，保留不删。

---

## 5. 功能验收

### 代码静态验收

| 检查项 | 结果 |
|--------|------|
| `GrowthReportApp` 不再 import `ReportPreview` | ✅ |
| `GrowthReportApp` 不再 import `memoryArtifactToGrowthArtifact` | ✅ |
| `GrowthReportApp` 不再有 `showLegacyReportPreview` state | ✅ |
| `GrowthReportApp` result 分支只渲染 `FamilyArtifactPreview` | ✅ |
| `components/ReportPreview.tsx` 已删除 | ✅ |
| `components/LifeGraphPreview.tsx` 已删除 | ✅ |
| `lib/graph/buildLifeGraph.ts` 已删除 | ✅ |
| `lib/graph/types.ts` 已删除 | ✅ |
| `parseMemoryArtifact.ts` 旧格式 fallback 未改动 | ✅ |
| `parseGrowthMemoryArtifact.ts` 仍存在 | ✅ |
| `runGrowthMemorySkill.ts` 仍存在 | ✅ |
| `artifactAdapter.ts` 仍存在 | ✅ |

### lint / build

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

### 真实浏览器验证

**未完成真实浏览器交互验证（需人工操作浏览器）**

静态代码分析确认：
- production / dev 下 result 分支只渲染 `FamilyArtifactPreview`
- 「🧪 查看旧版 ReportPreview」浮动按钮不存在于任何环境
- `FamilyArtifactPreview` 传入 `artifact`、`rawMaterial`、`photos` 不变
- `onBackToEdit` / `onCreateAnother` / `onBackToHome` 逻辑不变
- Phase 12.4A.2 已完成完整人工浏览器验证，`FamilyArtifactPreview` 逻辑未改动

---

## 6. 结论

| 检查项 | 状态 |
|--------|------|
| lint | ✅ 通过 |
| build | ✅ 通过 |
| 代码引用残留 | ✅ 0 处 |
| dev fallback UI 已完整删除 | ✅ |
| 保留文件完整（parser/rollback） | ✅ |
| 是否允许进入 Phase 12.6C | ✅ **允许** |
