# Claude Code 会话交接文档

> 生成时间：2026-05-18  
> 当前阶段：Phase 9.3 已完成  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前所处阶段：Phase 9（通用化展示层）已全部完成**

Phase 9.1~9.3 均已完成：
- 9.1：抽象 4 个小型通用展示组件
- 9.2：抽象 6 个叙事展示组件
- 9.3：抽象完整 `MemoryArtifactPreview` 容器，`CoupleArtifactPreview` 精简为薄 wrapper

**下一个目标（Phase 9.4 或 10.x）**：personal mode MVP，或 family-memory prompt 迁移到直接输出 MemoryArtifact。

---

## 2. 已完成的改动

### Phase 1~5（架构基础）
- `lib/memory-core/modes.ts`：四个 mode 注册表（family/couple/personal/memorial）
- `lib/memory-core/types.ts`：MemoryRawMaterial（输入层）+ MemoryArtifact（输出层）
- `lib/memory-core/graphTypes.ts`：MemoryGraphData 渲染层
- `lib/memory-core/skillRegistry.ts`：mode → skillDir 映射
- `lib/memory-core/loadMemorySkillPrompt.ts`：按 mode 加载 prompt
- `lib/memory-core/buildMemoryPrompt.ts`：MemoryRawMaterial → ChatMessage[]
- `lib/memory-core/parseMemoryArtifact.ts`：三层兜底解析
- `lib/memory-core/runMemorySkill.ts`：通用 runtime 入口
- `lib/domains/family/adapter.ts`：RawMaterial → MemoryRawMaterial
- `lib/domains/family/artifactAdapter.ts`：GrowthMemoryArtifact ↔ MemoryArtifact
- `lib/domains/family/buildFamilyMemoryGraph.ts`：family → MemoryGraphData
- `lib/domains/couple/adapter.ts`：CoupleRawInput → MemoryRawMaterial（含 chatText）
- `lib/domains/couple/defaultQuestions.ts`：7 道默认访谈问题
- `lib/domains/personal/adapter.ts`、`lib/domains/memorial/adapter.ts`：占位
- `.skills/family-memory/`：真实 skill pack，输入 MemoryRawMaterial，输出 GrowthMemoryArtifact（兼容旧前端）
- `.skills/couple-memory/`：真实 skill pack，输出标准 MemoryArtifact
- `.skills/growth-memory/`：旧 skill pack，保留为 fallback
- `.skills/personal-memory/`、`.skills/memorial-memory/`：占位

### Phase 6（图谱泛化）
- `lib/graph/types.ts`：LifeGraphNodeType 扩展（兼容 child/year + 通用类型）
- `lib/graph/buildLifeGraph.ts`：兼容 wrapper → buildFamilyMemoryGraph
- `components/LifeGraphPreview.tsx`：支持通用节点类型

### Phase 7（文档固化）
- `README.md`、`docs/architecture/memory-engine.md`、`docs/architecture/next-couple-mode-plan.md`

### Phase 8.1~8.7（Couple Mode MVP）
- `app/page.tsx`：全局状态路由，默认 MemoryModeHome，couple 进入 CoupleLandingPage → CoupleMemoryApp
- `components/MemoryModeHome.tsx`：全局首页，支持 available/preview/coming_soon 三种状态
- `components/couple/CoupleLandingPage.tsx`：情绪落地页
- `components/couple/CoupleMemoryApp.tsx`：input/generating/result/error 状态机，含开发环境 mock 入口
- `components/couple/RelationshipGalaxyPreview.tsx`：轻量 SVG 星图，effectiveSelectedId 派生
- `components/couple/CouplePrintButton.tsx`：MemoryPrintButton 兼容 wrapper
- `lib/domains/couple/mockArtifact.ts`：开发调试用 mock artifact
- `app/api/generate-couple-memory/route.ts`：couple 专用 API
- `lib/skill-runtime/runGrowthMemorySkill.ts`：改为兼容 wrapper（走 runMemorySkill 链路）
- `app/layout.tsx`：标题改为「Memory Wiki｜AI 记忆整理与纪念生成器」

### Phase 9.1（通用展示小组件）
- `components/memory/MemorySectionCard.tsx`
- `components/memory/MemoryPrintButton.tsx`
- `components/memory/MemoryQualityReviewPanel.tsx`
- `components/memory/MemorySourceTraceDetails.tsx`

### Phase 9.2（通用叙事展示组件）
- `components/memory/MemoryFallbackNotice.tsx`
- `components/memory/MemoryCoverSection.tsx`
- `components/memory/MemoryTimelineSection.tsx`
- `components/memory/MemoryLongFormSection.tsx`
- `components/memory/MemorySocialPostsSection.tsx`
- `components/memory/MemoryUsageTipsSection.tsx`
- `components/couple/CoupleArtifactPreview.tsx`：接入所有通用组件，本地重复逻辑已删除

### Phase 9.3（通用 MemoryArtifactPreview 容器）
- `components/memory/MemoryArtifactPreview.tsx`：完整页面 shell 容器，含 `graphSlot` 插槽
- `components/couple/CoupleArtifactPreview.tsx`：精简为薄 wrapper（~40 行），只传 couple-specific 文案和 RelationshipGalaxyPreview

---

## 3. 还没完成的 TODO

### 短期（优先级 1）
- [ ] **personal mode MVP**：PersonalLandingPage + PersonalMemoryApp + `.skills/personal-memory` 真实 prompt
  - 结果页可直接复用 `MemoryArtifactPreview`，传入 personal-specific 文案和 graph

### 中期（优先级 2）
- [ ] `family-memory` 改为直接输出 `MemoryArtifact`（移除 GrowthMemoryArtifact 输出合约）
- [ ] `ReportPreview` 泛化为消费 `MemoryArtifact`（使用 MemoryArtifactPreview）
- [ ] `LifeGraphPreview` 改名为 `MemoryGraphPreview`

### 长期
- [ ] memorial mode 接入（克制文案，隐私保护）
- [ ] 删除 GrowthMemoryArtifact 兼容层（条件：ReportPreview 泛化完成后）
- [ ] 删除 .skills/growth-memory fallback（条件：family-memory 稳定输出 MemoryArtifact 后）

---

## 4. 涉及到的核心文件路径

```
app/
  layout.tsx                          # 浏览器标题
  page.tsx                            # 全局状态路由
  api/
    generate-report/route.ts          # family API【禁止修改】
    generate-couple-memory/route.ts   # couple API

components/
  MemoryModeHome.tsx                  # 全局首页
  memory/
    MemoryArtifactPreview.tsx         # 通用展示容器【Phase 9.3 新增】
    MemorySectionCard.tsx
    MemoryPrintButton.tsx
    MemoryQualityReviewPanel.tsx
    MemorySourceTraceDetails.tsx
    MemoryFallbackNotice.tsx
    MemoryCoverSection.tsx
    MemoryTimelineSection.tsx
    MemoryLongFormSection.tsx
    MemorySocialPostsSection.tsx
    MemoryUsageTipsSection.tsx
  couple/
    CoupleLandingPage.tsx
    CoupleMemoryApp.tsx               # couple 状态机（含 mock 入口）
    CoupleArtifactPreview.tsx         # MemoryArtifactPreview 的薄 wrapper【Phase 9.3 重构】
    RelationshipGalaxyPreview.tsx     # SVG 星图
    CouplePrintButton.tsx             # MemoryPrintButton wrapper
  family/
    FamilyLandingPage.tsx             # 【禁止修改】
  GrowthReportApp.tsx                 # family 主状态机【禁止修改】
  ReportPreview.tsx                   # family 报告展示【禁止修改】
  LifeGraphPreview.tsx                # 成长星图【禁止修改】

lib/
  memory-core/
    modes.ts
    types.ts                          # MemoryRawMaterial + MemoryArtifact 类型
    skillRegistry.ts
    runMemorySkill.ts                 # 通用 runtime 入口
  domains/
    family/
      adapter.ts
      artifactAdapter.ts
      buildFamilyMemoryGraph.ts
    couple/
      adapter.ts
      defaultQuestions.ts
      mockArtifact.ts                 # 开发调试 mock
  skill-runtime/
    runGrowthMemorySkill.ts           # 兼容 wrapper【禁止修改】
    types.ts                          # GrowthMemoryArtifact 类型【禁止修改】

.skills/
  family-memory/                      # 【禁止修改】
  couple-memory/                      # couple 真实 skill pack【禁止修改】
  growth-memory/                      # 旧 skill（fallback）【禁止修改】
  personal-memory/                    # 占位
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

详见 `docs/architecture/current-transition-state.md`。

---

## 7. MemoryArtifactPreview 使用方式（Phase 9.3 新增）

```tsx
// personal mode 未来接入示例（伪代码）
<MemoryArtifactPreview
  artifact={artifact}
  onBackToEdit={...}
  onCreateAnother={...}
  modeLabel="个人回忆录"
  badge="📖 个人回忆录"
  fallbackTitle="个人回忆录"
  timelineTitle="⏱ 人生时间线"
  longFormFallbackTitle="写给未来自己的信"
  usagePrimaryTip="..."
  graphSlot={<PersonalMemoryGraphPreview graph={artifact.graph} />}
/>
```

Props 详见 `components/memory/MemoryArtifactPreview.tsx`。

---

## 8. 下一步建议

### 优先级 1：personal mode MVP（低风险，纯新增）
1. 修改 `lib/memory-core/modes.ts`：personal 从 `coming_soon` 改为 `available` 或 `preview`
2. 新增 `components/personal/PersonalLandingPage.tsx`
3. 新增 `components/personal/PersonalMemoryApp.tsx`（参考 CoupleMemoryApp 结构）
4. 新增 `app/api/generate-personal-memory/route.ts`
5. 完善 `.skills/personal-memory/`（真实 prompt）
6. 结果页使用 `MemoryArtifactPreview` + 简单 graph slot

### 优先级 2：family-memory prompt 迁移（中风险）
- 修改 `.skills/family-memory/02_output_contract.md` 要求直接输出 MemoryArtifact
- `ReportPreview` 迁移为消费 MemoryArtifact

---

## 9. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 9.3 已完成，工作区干净，lint + build 零错误。

核心约束：
1. 不修改 family 生成链路（/api/generate-report / runGrowthMemorySkill / GrowthReportApp / ReportPreview / LifeGraphPreview）
2. 不修改 .skills/family-memory 和 .skills/growth-memory 和 .skills/couple-memory
3. 不新增依赖
4. 不修改 .env.local
5. 每个 Phase 完成后必须运行 npm run lint 和 npm run build，零错误后再继续

已完成架构：
- Phase 1~5：Memory Engine 基础架构
- Phase 6：图谱类型泛化
- Phase 7：架构文档
- Phase 8.1~8.7：Couple Mode 完整 MVP
- Phase 9.1~9.3：components/memory/ 完整通用展示体系（MemoryArtifactPreview 容器 + 10 个子组件）

下一步建议按 .claude/handoff/current-task-handoff.md 第 8 节执行。
```
