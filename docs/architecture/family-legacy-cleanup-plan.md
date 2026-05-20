# Family Legacy Cleanup Plan - Phase 12.6A

> 文档创建：Phase 12.6A（2026-05-20）  
> 更新：Phase 12.6B（2026-05-20）  
> 状态：Phase 12.6B 已执行完成，dev legacy UI fallback 已删除。允许进入 Phase 12.6C。

---

## 1. 背景

- family API 已返回标准 `MemoryArtifact`（Phase 12.4B）
- family prompt 已直接输出 `MemoryArtifact`（Phase 12.5）
- family 生产 UI 已使用 `FamilyArtifactPreview`（Phase 12.4A）
- 旧 `GrowthMemoryArtifact` 兼容层目前只用于：
  - dev-only legacy `ReportPreview` fallback
  - `parseMemoryArtifact` 旧格式兼容路径
  - rollback path（`runGrowthMemorySkill`）

---

## 2. 真实引用审计（Phase 12.6A）

> 基于 `rg` 对当前代码库的完整扫描（排除 node_modules/.next/.skills/docs）

| 符号 | 实际引用文件 | 引用类型 | 备注 |
|------|-------------|---------|------|
| `runGrowthMemorySkill` | `lib/skill-runtime/runGrowthMemorySkill.ts`（自身）；`lib/domains/family/adapter.ts`（注释）；`lib/domains/family/runFamilyMemorySkill.ts`（注释） | rollback path + 注释 | 不被任何生产代码调用 |
| `GrowthMemoryArtifact` | `components/ReportPreview.tsx`（类型引用）；`components/GrowthReportApp.tsx`（注释）；`lib/types.ts`（过时注释）；`lib/domains/family/artifactAdapter.ts`（类型定义）；`lib/skill-runtime/runGrowthMemorySkill.ts`；`lib/skill-runtime/parseGrowthMemoryArtifact.ts`；`lib/memory-core/parseMemoryArtifact.ts`（注释）| dev fallback + parse fallback + 注释 | 无生产主路径引用 |
| `parseGrowthMemoryArtifact` | `lib/skill-runtime/parseGrowthMemoryArtifact.ts`（自身）；`lib/memory-core/parseMemoryArtifact.ts`（import + 2处调用）| parse fallback | 被 `parseMemoryArtifact` 旧格式 fallback 路径调用，生产不触发但逻辑存在 |
| `ReportPreview` | `components/ReportPreview.tsx`（自身）；`components/GrowthReportApp.tsx`（import + `isDev && showLegacyReportPreview` 分支）| dev-only fallback | production 不渲染（`isDev=false`）|
| `LifeGraphPreview` | `components/LifeGraphPreview.tsx`（自身）；`components/ReportPreview.tsx`（import + 调用）| dev fallback 级联 | 随 `ReportPreview` 一起 |
| `growthArtifactToMemoryArtifact` | `lib/domains/family/artifactAdapter.ts`（定义）；`lib/memory-core/parseMemoryArtifact.ts`（2处调用）| parse fallback | 被 `parseMemoryArtifact` 旧格式转换路径使用 |
| `memoryArtifactToGrowthArtifact` | `components/GrowthReportApp.tsx`（dev fallback 内）；`lib/skill-runtime/runGrowthMemorySkill.ts`；`lib/domains/family/artifactAdapter.ts`（定义）| dev fallback + rollback | |
| `buildLifeGraph` | `lib/graph/buildLifeGraph.ts`（自身）；`components/LifeGraphPreview.tsx`（调用）| dev fallback 级联 | 随 `LifeGraphPreview` |
| `LifeGraphData` | `lib/graph/buildLifeGraph.ts`（使用）；`lib/graph/types.ts`（定义）| dev fallback 级联 | 随 `buildLifeGraph` |
| `showLegacyReportPreview` | `components/GrowthReportApp.tsx`（3处：定义/条件判断/重置）| dev-only fallback 入口 | `isDev` 控制，production 不渲染 |

**结论**：所有被审计的符号均**不在生产主路径**中。分三类：
1. **dev-only fallback**：`showLegacyReportPreview` → `ReportPreview` + `LifeGraphPreview` + `buildLifeGraph` + `LifeGraphData` + `memoryArtifactToGrowthArtifact`
2. **parse fallback**：`parseGrowthMemoryArtifact` + `growthArtifactToMemoryArtifact`（在 `parseMemoryArtifact.ts` 旧格式路径）
3. **rollback path**：`runGrowthMemorySkill`

---

## 3. dev fallback 取舍

### 方案 A：保留 dev fallback

**优点**：
- 回归时可快速对比旧展示
- 迁移初期安全保障
- 对旧功能有信心后再删

**缺点**：
- 旧 `GrowthMemoryArtifact` 兼容层无法清理干净
- 代码中持续有旧类型 / 逻辑残留
- 后续协作者可能误以为旧链路还在用

### 方案 B：删除 dev fallback（推荐）

**优点**：
- 可级联清理 `ReportPreview` / `LifeGraphPreview` / `buildLifeGraph` / `LifeGraphData` / `memoryArtifactToGrowthArtifact`
- family 链路代码更干净
- 减少后续维护负担

**缺点**：
- 失去旧版 UI 对比入口
- 若新版 UI 有回归，需通过 git revert 临时恢复

**推荐理由**：新版 `FamilyArtifactPreview` 已经过 Phase 12.4A.2 完整回归验收（A/B/C 三组），Phase 12.5.1 四组验收均通过。当前 dev fallback 的对比价值已大幅降低，持续维护成本不合算。

---

## 4. 推荐决策

**采用方案 B，分三步执行：**

### Phase 12.6B：删除 dev legacy UI fallback（已完成，2026-05-20）

已删除：
- `GrowthReportApp.tsx`：移除 `showLegacyReportPreview` 状态、`memoryArtifactToGrowthArtifact` import、`ReportPreview` import、`isDev` 变量、dev-only 浮动按钮
- `components/ReportPreview.tsx`（已删除）
- `components/LifeGraphPreview.tsx`（已删除）
- `lib/graph/buildLifeGraph.ts`（已删除）
- `lib/graph/types.ts`（已删除）

grep 结果：`ReportPreview` / `LifeGraphPreview` 代码引用 0；`buildLifeGraph` / `LifeGraphData` / `showLegacyReportPreview` 全部 0；
残留为注释历史引用（artifactAdapter.ts / runGrowthMemorySkill.ts / types.ts），不影响行为。

lint ✅ | build ✅ | TypeScript 零错误

**保留**：`memoryArtifactToGrowthArtifact`（函数定义，`runGrowthMemorySkill` 仍用到）；`parseGrowthMemoryArtifact`；`growthArtifactToMemoryArtifact`

### Phase 12.6C：删除旧格式 parse fallback

删除内容：
- `lib/memory-core/parseMemoryArtifact.ts`：移除 `parseGrowthMemoryArtifact` import 和两处调用，移除 `growthArtifactToMemoryArtifact` import
- 删除 `lib/skill-runtime/parseGrowthMemoryArtifact.ts`
- 确认 `lib/domains/family/artifactAdapter.ts` 中 `growthArtifactToMemoryArtifact` 是否还有其他引用，若无则可删除函数

**前置条件**：确认 family prompt 不再输出旧格式（已完成，Phase 12.5.1 验收通过）

### Phase 12.6D：归档 rollback path

处理内容：
- `lib/skill-runtime/runGrowthMemorySkill.ts`：确认无生产调用后，注释/归档或删除
- `lib/skill-runtime/buildGrowthMemoryPrompt.ts`（如有）
- `lib/skill-runtime/types.ts`：清理 `GrowthMemoryArtifact` 类型（需确认无引用）
- `.skills/growth-memory/`：归档，不急删
- `lib/domains/family/artifactAdapter.ts`：清理 `memoryArtifactToGrowthArtifact` 函数（已无引用后）

---

## 5. 清理依赖关系

```
showLegacyReportPreview（GrowthReportApp.tsx）
  └── ReportPreview.tsx
        └── LifeGraphPreview.tsx
              └── buildLifeGraph.ts
                    └── lib/graph/types.ts（LifeGraphData）

parseMemoryArtifact.ts（parse fallback 路径）
  └── parseGrowthMemoryArtifact
  └── growthArtifactToMemoryArtifact
        └── artifactAdapter.ts（growthArtifactToMemoryArtifact 函数）

runGrowthMemorySkill.ts
  └── memoryArtifactToGrowthArtifact（artifactAdapter.ts）
  └── lib/skill-runtime/types.ts（GrowthMemoryArtifact 类型）
```

Phase 12.6B 可清理链顶端（dev fallback），其他链路独立。

---

## 6. 每阶段验收标准

每个清理阶段都必须：

| 检查项 | 说明 |
|--------|------|
| `npm run lint` 通过 | 零错误 |
| `npm run build` 通过 | 零 TypeScript 错误 |
| family 真实生成通过 | API 返回标准 MemoryArtifact |
| family UI 正常渲染 | `FamilyArtifactPreview` 完整显示 |
| `grep` 无被删符号残留 | 确认无孤立引用 |
| README / handoff / migration plan 同步 | 文档与代码一致 |

---

## 7. 浏览器验证（Phase 12.6A）

**API 验证**（已完成）：

调用 `/api/generate-report`，返回：
- `mode: "family"` ✅
- `has_narrative: True` ✅
- `has_report: False` ✅
- `longFormText.title: "写给未来的测试"` ✅（包含 childName）
- `risk: "medium"` ✅（2条短问答，评估正确）

**真实浏览器交互验证**：**未完成**（需人工操作浏览器）

静态代码分析确认：
- production 下 `isDev=false`，`showLegacyReportPreview` 分支不执行
- dev 下 `isDev=true`，「🧪 查看旧版 ReportPreview」按钮可见
- `memoryArtifactToGrowthArtifact(artifact)` 在 dev fallback 分支中正确调用
- Phase 12.4A.2 已完成完整的人工浏览器验证，逻辑未改动

---

## 8. 本阶段结论

- **是否建议保留 dev fallback**：否，建议 Phase 12.6B 删除
- **是否建议进入 Phase 12.6B**：✅ 是
- **Phase 12.6B 的具体边界**：
  - 只处理 `GrowthReportApp.tsx` dev fallback 分支 + 被删除的 `ReportPreview` / `LifeGraphPreview` / `buildLifeGraph` / `lib/graph/types.ts`
  - **不处理** `parseMemoryArtifact.ts` parse fallback（Phase 12.6C）
  - **不处理** `runGrowthMemorySkill.ts`（Phase 12.6D）
  - **不处理** `artifactAdapter.ts` 中的函数（分步清理）
