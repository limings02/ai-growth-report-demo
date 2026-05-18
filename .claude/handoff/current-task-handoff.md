# Claude Code 会话交接文档

> 生成时间：2026-05-18  
> 当前阶段：Phase 10.1 已完成  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前所处阶段：Phase 10（personal mode 接入）**

Phase 10.1 已完成：personal mode preview 骨架（不调用 AI，展示 mock 结果）

**下一个目标（Phase 10.2）**：接入真实 AI 生成，新增 `/api/generate-personal-memory` + `.skills/personal-memory` 真实 prompt。

---

## 2. 已完成的改动

### Phase 1~5（架构基础）
- `lib/memory-core/modes.ts`：四个 mode 注册表
- `lib/memory-core/types.ts`：MemoryRawMaterial + MemoryArtifact
- `lib/memory-core/skillRegistry.ts`、`runMemorySkill.ts` 等通用 runtime
- `lib/domains/family/`、`lib/domains/couple/` adapter + artifactAdapter
- `.skills/family-memory/`、`.skills/couple-memory/`：真实 skill pack

### Phase 6~7（图谱泛化 + 文档）
- `lib/graph/`、`components/LifeGraphPreview.tsx`：兼容新节点类型
- `docs/architecture/` 文档体系建立

### Phase 8.1~8.7（Couple Mode MVP）
- `app/page.tsx`：全局状态路由
- `components/MemoryModeHome.tsx`：全局首页
- `components/couple/CoupleLandingPage.tsx`、`CoupleMemoryApp.tsx`：完整 couple 流程
- `components/couple/RelationshipGalaxyPreview.tsx`：SVG 星图
- `app/api/generate-couple-memory/route.ts`：couple API
- `lib/skill-runtime/runGrowthMemorySkill.ts`：兼容 wrapper

### Phase 9.1~9.3（通用展示体系）
- `components/memory/MemoryArtifactPreview.tsx`：完整页面 shell 容器（含 graphSlot 插槽）
- `components/memory/` 其余 10 个通用组件
- `components/couple/CoupleArtifactPreview.tsx`：精简为 ~40 行薄 wrapper

### Phase 10.1（personal mode preview 骨架）
- `lib/memory-core/modes.ts`：personal 状态从 `coming_soon` 改为 `preview`，更新文案
- `lib/domains/personal/defaultQuestions.ts`：7 道默认访谈问题
- `lib/domains/personal/mockArtifact.ts`：完整 mock MemoryArtifact（林夏的大学四年）
- `components/personal/PersonalLandingPage.tsx`：情绪落地页（4 价值卡片 + 适合场景 + 样例预览）
- `components/personal/PersonalMemoryApp.tsx`：输入页 + mock 结果状态机，复用 MemoryArtifactPreview
- `components/personal/PersonalMemoryGraphPreview.tsx`：轻量图谱（节点卡片列表，非 SVG）
- `app/page.tsx`：新增 `personal-landing` / `personal-app` 状态，personal 不再走 coming-soon

---

## 3. 还没完成的 TODO

### 短期（优先级 1）
- [ ] **Phase 10.2：personal mode 真实 AI 生成**
  - 新增 `app/api/generate-personal-memory/route.ts`
  - 完善 `.skills/personal-memory/`（真实 prompt）
  - `PersonalMemoryApp` 接入真实 API 调用
  - PersonalMemoryApp 增加 generating / error 状态

### 中期（优先级 2）
- [ ] `family-memory` 改为直接输出 `MemoryArtifact`
- [ ] `ReportPreview` 泛化为消费 `MemoryArtifact`
- [ ] `LifeGraphPreview` 改名为 `MemoryGraphPreview`

### 长期
- [ ] memorial mode 接入（克制文案，隐私保护）
- [ ] 删除 GrowthMemoryArtifact 兼容层（条件：ReportPreview 泛化后）

---

## 4. 核心文件路径

```
app/
  page.tsx                            # 全局状态路由（含 personal-landing/personal-app）
  api/
    generate-report/route.ts          # family API【禁止修改】
    generate-couple-memory/route.ts   # couple API【禁止修改】

components/
  MemoryModeHome.tsx                  # 全局首页
  memory/
    MemoryArtifactPreview.tsx         # 通用展示容器（含 graphSlot）
    MemorySectionCard.tsx / MemoryPrintButton.tsx / ...（10 个通用子组件）
  couple/
    CoupleArtifactPreview.tsx         # MemoryArtifactPreview 的薄 wrapper
    RelationshipGalaxyPreview.tsx
  personal/
    PersonalLandingPage.tsx           # personal 落地页【Phase 10.1 新增】
    PersonalMemoryApp.tsx             # personal 状态机（preview）【Phase 10.1 新增】
    PersonalMemoryGraphPreview.tsx    # personal 轻量图谱【Phase 10.1 新增】
  family/
    FamilyLandingPage.tsx             # 【禁止修改】
  GrowthReportApp.tsx                 # 【禁止修改】
  ReportPreview.tsx                   # 【禁止修改】
  LifeGraphPreview.tsx                # 【禁止修改】

lib/
  memory-core/
    modes.ts                          # personal = preview（Phase 10.1）
    types.ts
    runMemorySkill.ts                 # 【禁止修改】
  domains/
    personal/
      adapter.ts
      defaultQuestions.ts             # 【Phase 10.1 新增】
      mockArtifact.ts                 # 【Phase 10.1 新增】
    couple/
      adapter.ts / defaultQuestions.ts / mockArtifact.ts
  skill-runtime/
    runGrowthMemorySkill.ts           # 【禁止修改】

.skills/
  family-memory/                      # 【禁止修改】
  couple-memory/                      # 【禁止修改】
  growth-memory/                      # 【禁止修改，fallback】
  personal-memory/                    # 当前占位，Phase 10.2 完善
  memorial-memory/                    # 占位
```

---

## 5. 核心约束（禁止修改边界）

```
app/api/generate-report/route.ts
app/api/generate-couple-memory/route.ts
lib/memory-core/runMemorySkill.ts
lib/memory-core/buildMemoryPrompt.ts
lib/memory-core/parseMemoryArtifact.ts
lib/skill-runtime/runGrowthMemorySkill.ts
components/GrowthReportApp.tsx
components/ReportPreview.tsx
components/LifeGraphPreview.tsx
components/family/**
.skills/family-memory/**
.skills/growth-memory/**
.skills/couple-memory/**
package.json
.env.local
```

---

## 6. 当前过渡态（有意保留）

| 过渡态 | 说明 |
|--------|------|
| `family-memory` 仍输出 `GrowthMemoryArtifact` | 旧前端未泛化 |
| `runGrowthMemorySkill` 仍保留 | `/api/generate-report` 调用它 |
| `ReportPreview` 仍消费 `GrowthMemoryArtifact` | 未泛化 |
| `LifeGraphPreview` 保留旧名字 | 未改名 |
| `.skills/growth-memory` 保留 | 作为 fallback |
| personal mode 不调用 AI | Phase 10.1 只做 preview 骨架 |

---

## 7. MemoryArtifactPreview 使用方式

```tsx
// personal 结果页（PersonalMemoryApp 内已实现）
<MemoryArtifactPreview
  artifact={artifact}
  onBackToEdit={...}
  onCreateAnother={...}
  onBackToHome={...}
  modeLabel="个人回忆录"
  badge="📖 个人回忆录"
  timelineTitle="⏱ 人生阶段时间线"
  longFormFallbackTitle="写给未来自己的信"
  usagePrimaryTip="..."
  graphSlot={<PersonalMemoryGraphPreview graph={artifact.graph} />}
/>
```

---

## 8. 下一步建议

### 优先级 1：Phase 10.2 - personal mode 真实 AI 生成
1. 完善 `.skills/personal-memory/prompts/`（01_task / 02_output_contract / 03_quality_rules）
2. 新增 `app/api/generate-personal-memory/route.ts`（参考 generate-couple-memory）
3. `PersonalMemoryApp` 增加 `generating` / `error` 状态，接入真实 API
4. lint + build 验证

### 优先级 2：family 链路泛化
- `family-memory` 改为直接输出 MemoryArtifact
- `ReportPreview` 迁移为消费 MemoryArtifact + MemoryArtifactPreview

---

## 9. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 10.1 已完成，工作区干净，lint + build 零错误。

核心约束：
1. 不修改 family 生成链路（/api/generate-report / runGrowthMemorySkill / GrowthReportApp / ReportPreview / LifeGraphPreview）
2. 不修改 .skills/family-memory、.skills/growth-memory、.skills/couple-memory
3. 不新增依赖
4. 不修改 .env.local
5. 每个 Phase 完成后必须运行 npm run lint 和 npm run build，零错误后再继续

已完成架构：
- Phase 1~5：Memory Engine 基础架构
- Phase 6~7：图谱泛化 + 文档
- Phase 8.1~8.7：Couple Mode 完整 MVP（真实 AI 生成）
- Phase 9.1~9.3：components/memory/ 完整通用展示体系
- Phase 10.1：personal mode preview 骨架（不调用 AI，mock 结果）

下一步建议按 .claude/handoff/current-task-handoff.md 第 8 节执行（Phase 10.2：personal 真实 AI 生成）。
```
