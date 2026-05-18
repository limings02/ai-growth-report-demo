# Claude Code 会话交接文档

> 生成时间：2026-05-18  
> 当前 commit：`27cbcdf`（Phase 9.1 - 抽象通用 memory 展示小组件）  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前所处阶段：Phase 9（通用化展示层）**

Phase 9.1 刚完成：把 `CoupleArtifactPreview` 内的本地展示组件抽象到 `components/memory/` 目录，为未来 personal/memorial 复用做准备。

**下一个目标（Phase 9.2）：** 抽象完整 `MemoryArtifactPreview`，让 CoupleArtifactPreview 精简为薄包装层。

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
- `README.md`：全面更新为 multi-mode 产品说明
- `docs/architecture/memory-engine.md`：12 章完整架构说明
- `docs/architecture/next-couple-mode-plan.md`：couple MVP 规划
- `docs/architecture/current-transition-state.md`：过渡态说明

### Phase 8.1~8.7（Couple Mode MVP）
- `app/page.tsx`：全局状态路由，默认 MemoryModeHome，couple 进入 CoupleLandingPage → CoupleMemoryApp
- `components/MemoryModeHome.tsx`：全局首页，支持 available/preview/coming_soon 三种状态
- `components/couple/CoupleLandingPage.tsx`：情绪落地页（Hero/使用场景/样例预览/隐私说明）
- `components/couple/CoupleMemoryApp.tsx`：input/generating/result/error 状态机，含开发环境 mock 入口
- `components/couple/CoupleArtifactPreview.tsx`：结果展示（封面/时间线/周年信/分享文案/Galaxy/质量说明）
- `components/couple/RelationshipGalaxyPreview.tsx`：轻量 SVG 星图，effectiveSelectedId 派生
- `components/couple/CouplePrintButton.tsx`：MemoryPrintButton 兼容 wrapper
- `lib/domains/couple/mockArtifact.ts`：开发调试用 mock artifact
- `app/api/generate-couple-memory/route.ts`：couple 专用 API，接收 CoupleRawInput，返回 MemoryArtifact
- `lib/skill-runtime/runGrowthMemorySkill.ts`：改为兼容 wrapper（走 runMemorySkill 链路）
- `app/layout.tsx`：浏览器标签页标题改为「Memory Wiki｜AI 记忆整理与纪念生成器」

### Phase 9.1（通用展示小组件）
- `components/memory/MemorySectionCard.tsx`：通用 section 容器
- `components/memory/MemoryPrintButton.tsx`：通用打印按钮
- `components/memory/MemoryQualityReviewPanel.tsx`：通用质量说明面板
- `components/memory/MemorySourceTraceDetails.tsx`：通用溯源折叠区
- `components/couple/CoupleArtifactPreview.tsx`：接入以上通用组件，删除本地 SectionCard

---

## 3. 还没完成的 TODO

### 短期（Phase 9.2）
- [ ] 抽象完整 `components/memory/MemoryArtifactPreview.tsx`
  - 接收 `MemoryArtifact` + 可插槽的 `graphComponent?: React.ReactNode`
  - 把 CoupleArtifactPreview 中的 timeline / longFormText / socialPosts / fallback 提示等通用逻辑移入
  - CoupleArtifactPreview 精简为传入 `<RelationshipGalaxyPreview>` 的薄包装层

### 中期
- [ ] `family-memory` 改为直接输出 `MemoryArtifact`（移除 GrowthMemoryArtifact 输出合约）
- [ ] `ReportPreview` 泛化为 `MemoryArtifactPreview`
- [ ] `LifeGraphPreview` 改名为 `MemoryGraphPreview`

### 长期
- [ ] personal mode 接入（表单 + 真实 skill prompt + 结果展示）
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
    MemorySectionCard.tsx             # 通用 section 容器【Phase 9.1 新增】
    MemoryPrintButton.tsx             # 通用打印按钮【Phase 9.1 新增】
    MemoryQualityReviewPanel.tsx      # 质量说明面板【Phase 9.1 新增】
    MemorySourceTraceDetails.tsx      # 溯源折叠区【Phase 9.1 新增】
  couple/
    CoupleLandingPage.tsx             # couple 落地页
    CoupleMemoryApp.tsx               # couple 状态机（含 mock 入口）
    CoupleArtifactPreview.tsx         # couple 结果展示【Phase 9.1 重构】
    RelationshipGalaxyPreview.tsx     # SVG 星图
    CouplePrintButton.tsx             # MemoryPrintButton wrapper
  family/
    FamilyLandingPage.tsx             # family 专属 landing【禁止修改】
  GrowthReportApp.tsx                 # family 主状态机【禁止修改】
  ReportPreview.tsx                   # family 报告展示【禁止修改】
  LifeGraphPreview.tsx                # 成长星图【禁止修改】

lib/
  memory-core/
    modes.ts                          # Mode Registry（family=available, couple=available, personal/memorial=coming_soon）
    types.ts                          # MemoryRawMaterial + MemoryArtifact 类型
    graphTypes.ts                     # MemoryGraphData 渲染层
    skillRegistry.ts                  # mode → skillDir 映射
    loadMemorySkillPrompt.ts
    buildMemoryPrompt.ts
    parseMemoryArtifact.ts
    runMemorySkill.ts                 # 通用 runtime 入口
  domains/
    family/
      adapter.ts                      # RawMaterial → MemoryRawMaterial
      artifactAdapter.ts              # GrowthMemoryArtifact ↔ MemoryArtifact
      buildFamilyMemoryGraph.ts       # family → MemoryGraphData
    couple/
      adapter.ts                      # CoupleRawInput → MemoryRawMaterial
      defaultQuestions.ts             # 7 道默认问题
      mockArtifact.ts                 # 开发调试 mock
  skill-runtime/
    runGrowthMemorySkill.ts           # 兼容 wrapper（调 runMemorySkill）
    types.ts                          # GrowthMemoryArtifact 类型【禁止修改】

.skills/
  family-memory/                      # 当前可用 skill pack
  couple-memory/                      # couple 真实 skill pack
  growth-memory/                      # 旧 skill（fallback，禁止删除）
  personal-memory/                    # 占位
  memorial-memory/                    # 占位

docs/architecture/
  memory-engine.md                    # 完整架构说明
  next-couple-mode-plan.md            # couple MVP 进度
  current-transition-state.md        # 过渡态说明
```

---

## 5. 核心文件修改点摘要

### `app/page.tsx`
- `HomeScreen` 类型：`mode-select | family-landing | family-app | couple-landing | couple-app | coming-soon`
- couple 点击 → couple-landing → couple-app
- couple-app 渲染时传入 `onBackToHome`（返回 mode-select）

### `lib/memory-core/types.ts`
- 输入层：`MemoryRawMaterial`（mode / subject / participants / style / media / qaList / freeNote / domainPayload）
- 输出层：`MemoryArtifact`（artifactVersion / mode / narrative / graph / extensions）
- 图谱：`MemoryGraphHints`（AI 语义层）vs `MemoryGraphData`（渲染层）

### `lib/skill-runtime/runGrowthMemorySkill.ts`
- 原来：直接 buildGrowthMemoryPrompt → callDeepSeek → parseGrowthMemoryArtifact
- 现在：familyRawMaterialToMemoryRawMaterial → runMemorySkill → memoryArtifactToGrowthArtifact

### `components/couple/CoupleMemoryApp.tsx`
- Props：`{ onBackToLanding, onBackToHome? }`
- 状态：input / generating / result / error
- 开发环境 mock 入口（`isDev = process.env.NODE_ENV === "development"`）

### `components/couple/CoupleArtifactPreview.tsx`
- Props：`{ artifact, onBackToEdit, onCreateAnother, onBackToHome? }`
- 已接入所有 `components/memory/` 通用组件
- 本地 `SectionCard` 已删除，改用 `MemorySectionCard`
- 顶部操作栏：← 返回修改 | 首页 | 保存 PDF | 再做一本

### `components/couple/RelationshipGalaxyPreview.tsx`
- 布局：最多 12 个节点，内圈（emotion/message/keyword）/外圈（event/place/time/person/memory）
- 使用 `effectiveSelectedId`（useMemo 派生，避免 layout 变化时 selectedId 指向旧节点）
- 打印时展示节点文字摘要

### `app/api/generate-couple-memory/route.ts`
- 接收 CoupleRawInput，返回 MemoryArtifact
- null 安全 qaList 守卫（`isQuestionAnswerItem`）
- chatText > 12000 字返回 400

---

## 6. 当前 git diff 摘要

工作区干净（所有修改已 commit 并 push 到 origin/main）。

最近 10 次 commit：
```
27cbcdf Phase 9.1 - 抽象通用 memory 展示小组件 + couple 接入
0b53d8f Phase 8.7 - couple 结果页体验收尾 + 文档状态清理
20cd456 Phase 8.6 - selectedId 稳定性 + Mock 开发预览 + 浏览器标题更新
98fa563 Phase 8.5 - Couple 纪念册打印/保存 PDF + 文档状态清理
b6801db Phase 8.4 - Relationship Galaxy SVG 星图 + 文档状态清理
1d06e68 Phase 8.2.1 + 8.3 - API 稳定性修复 + 结果体验优化
7456c3d Phase 8.2 - Couple Mode 真实生成 MVP
304ddb0 Phase 8.1.2 - 增强 CoupleLandingPage 情绪表达
5acc017 Phase 8.1.1 - Couple Mode 信息架构修正
e4da320 Phase 8.1 - Couple Mode 输入页骨架
```

---

## 7. 已运行过的命令和测试结果

每个 Phase 完成后均运行：
```bash
npm run lint   # 结果：零错误
npm run build  # 结果：✓ Compiled successfully，TypeScript 零错误
```

当前构建路由：
```
○  /                    (Static)
○  /_not-found          (Static)
ƒ  /api/generate-couple-memory  (Dynamic)
ƒ  /api/generate-report          (Dynamic)
```

---

## 8. 当前遇到的问题/风险点

### 已解决
- ~~RelationshipGalaxyPreview selectedId 不同步~~ → 改用 `effectiveSelectedId`（useMemo 派生）
- ~~useEffect + setState 被 ESLint 禁止~~ → 全部改为 useMemo 方案
- ~~output contract graph node type 误导模型~~ → 改为单值示例 + 明确说明
- ~~qaList null 不安全~~ → 新增 `isQuestionAnswerItem` 守卫

### 现存的过渡态（有意保留）
- `family-memory` 仍输出 `GrowthMemoryArtifact`（兼容旧前端）
- `runGrowthMemorySkill` 是兼容 wrapper
- `ReportPreview` 仍消费 `GrowthMemoryArtifact`
- `buildLifeGraph` 是兼容 wrapper
- `.skills/growth-memory` 是 fallback

### 潜在风险
1. `CoupleArtifactPreview` 仍然有大量 couple-specific 展示逻辑，Phase 9.2 需要继续抽象
2. `mockArtifact.ts` 里的 mock 数据只在 `isDev` 控制下展示，生产环境不可见，但需注意不要让 mock 数据混入真实数据流
3. couple skill prompt 期待 `legacyFamilyInput`（仅 family mode），couple mode 不会注入此字段，这是正确的，但如果 family 链路报错需检查 buildMemoryPrompt

---

## 9. 下一步建议按什么顺序继续

### 优先级 1：Phase 9.2（低风险，纯展示层）
新增 `components/memory/MemoryArtifactPreview.tsx`：
- Props: `{ artifact, graphComponent?, onBackToEdit, onCreateAnother, onBackToHome?, printTitle? }`
- 把 CoupleArtifactPreview 的 timeline / longFormText / socialPosts / fallback 提示 / 封面逻辑移入
- 把 MemoryQualityReviewPanel / MemorySourceTraceDetails / 保存建议 / 底部按钮移入
- CoupleArtifactPreview 精简为：传入 `graphComponent=<RelationshipGalaxyPreview graph={graph} />`

### 优先级 2：family-memory prompt 迁移（中风险）
- 修改 `.skills/family-memory/prompts/02_output_contract.md` 要求输出 MemoryArtifact 格式
- 修改 `parseMemoryArtifact.ts` 中 family 优先路径
- 删除 `memoryArtifactToGrowthArtifact` 在 wrapper 中的调用
- 让 ReportPreview 能消费 MemoryArtifact（或新建 MemoryArtifactPreview 后替换）

### 优先级 3：personal mode 接入（新功能）
- 参考 couple mode 接入路线
- 新增 PersonalMemoryApp / PersonalLandingPage
- `.skills/personal-memory` 从占位改为真实 prompt

---

## 10. 给新 Claude Code 会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

## 当前仓库状态

- 仓库：https://github.com/limings02/ai-growth-report-demo
- 当前分支：main，最新 commit：27cbcdf（Phase 9.1 完成）
- 工作区干净，lint + build 通过

## 已完成的大阶段

- Phase 1~5：Memory Engine 基础架构（MemoryRawMaterial / MemoryArtifact / runMemorySkill / domain adapters）
- Phase 6：图谱类型泛化（MemoryGraphData / RelationshipGalaxyPreview 雏形）
- Phase 7：架构文档固化
- Phase 8.1~8.7：Couple Mode 完整 MVP（表单 / AI 生成 / 结果展示 / Galaxy 星图 / 打印 / mock 预览）
- Phase 9.1：抽象 components/memory/ 通用展示小组件（MemorySectionCard / MemoryPrintButton / MemoryQualityReviewPanel / MemorySourceTraceDetails）

## 交接文档

交接文档保存在 .claude/handoff/current-task-handoff.md，请先阅读它。

## 核心约束

1. 不要修改 family 生成链路（/api/generate-report / runGrowthMemorySkill / GrowthReportApp / ReportPreview / LifeGraphPreview）
2. 不要修改 .skills/family-memory 和 .skills/growth-memory
3. 不要新增依赖
4. 不要修改 .env.local
5. 每个 Phase 完成后必须运行 npm run lint 和 npm run build，零错误后再继续

## 下一步任务

按 .claude/handoff/current-task-handoff.md 中"第9节 下一步建议"的顺序继续。
建议从 Phase 9.2（抽象 MemoryArtifactPreview）开始。
```
