# Claude Code 会话交接文档

> 生成时间：2026-05-22  
> 当前阶段：Phase 16.0.1 已完成（Input Friction Hotfix + Generation Quality Regression）  
> 下一阶段：Phase 16.1 Photo Caption Local Preview（生成质量回归通过，可推进下一功能）  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前状态：**
- family：available，真实 AI 生成（MemoryArtifact 链路；Phase 12.7C 体验优化全部完成；**人工 E2E 验收通过（Phase 12.7C.2）；可进入 Phase 13**）
- couple：available，真实 AI 生成，直接输出 MemoryArtifact
- personal：available，真实 AI 生成，直接输出 MemoryArtifact（Phase 10.2）
- memorial：available，真实 AI 生成（Phase 11.2），不模拟逝者说话

---

## 2. 已完成的改动

### Phase 1~9.3（架构基础 + 通用展示体系）
- Memory Engine 核心类型（MemoryRawMaterial / MemoryArtifact）
- Domain adapters：family / couple / personal / memorial
- Skill registry + runMemorySkill 通用 runtime
- Couple Mode 完整 MVP（Phase 8.x）
- components/memory/ 完整通用展示体系，含 MemoryArtifactPreview 容器（Phase 9.x）
- CoupleArtifactPreview 精简为薄 wrapper

### Phase 10.1（personal preview 骨架）
- personal mode 状态 coming_soon → preview
- PersonalLandingPage / PersonalMemoryApp / PersonalMemoryGraphPreview
- PERSONAL_DEFAULT_QUESTIONS / MOCK_PERSONAL_ARTIFACT

### Phase 10.2（personal 真实 AI 生成）
- `lib/memory-core/modes.ts`：personal 状态 preview → available
- `app/api/generate-personal-memory/route.ts`：新增，参考 couple 结构
- `.skills/personal-memory/`：所有 4 个 prompt 从占位升级为真实 skill pack
- `components/personal/PersonalMemoryApp.tsx`：升级为 input/generating/result/error 状态机，接入真实 API，保留 dev mock 按钮

### Phase 10.2.1（文档与输出合约收尾）
- `README.md`：修正 personal 残留的 preview/mock-only 描述，组件注释更新
- `docs/architecture/memory-engine.md`：personal adapter 不再写"占位"，后续迁移方向区分 personal/memorial
- `.skills/personal-memory/prompts/01_task.md`：graph node type 补齐 `letter`
- `.skills/personal-memory/prompts/02_output_contract.md`：允许 type 列表补齐 `"letter"`

### Phase 10.3（personal 真实生成质量评测与 prompt 打磨）
- 真实调用 `deepseek-chat` 完成 3 组虚构样例评测（丰富/稀疏/低谷转折）
- 发现 `deepseek-v4-pro` thinking mode 导致 content 为空（Phase 10.3.1 已修复）
- `.skills/personal-memory/prompts/03_quality_rules.md`：三项小幅修正
- 新增 `docs/quality/personal-generation-eval.md`：完整评测报告

### Phase 10.3.1（DeepSeek V4 Pro 兼容修复）
- `lib/server/deepseekClient.ts`：扩展响应类型，支持 `reasoning_content`；新增 `DEEPSEEK_THINKING` 环境变量；v4-pro/v4-flash 默认 thinking disabled；max_tokens 改为 DEEPSEEK_MAX_TOKENS 可配置；content 为空时给出更准确的错误诊断
- `.env.local.example`：推荐 `deepseek-v4-pro` + `DEEPSEEK_THINKING=disabled` 配置
- `README.md`：更新 DeepSeek 配置说明，推荐 v4-pro
- `docs/quality/personal-generation-eval.md`：修正对 v4-pro 的定性（不再建议改模型）
- `docs/quality/deepseek-v4-pro-compat.md`：新增兼容说明文档
- **已验证**：`deepseek-v4-pro` + `thinking: disabled` 通过 `/api/generate-personal-memory` 真实调用成功生成完整 MemoryArtifact

### Phase 10.3.2（handoff 文档一致性修复）
- `.claude/handoff/current-task-handoff.md`：删除第 7 节中错误建议（「将 DEEPSEEK_MODEL 改为 deepseek-chat」），改为推荐 v4-pro + DEEPSEEK_THINKING=disabled 配置

### Phase 10.4（PersonalMemoryGraphPreview SVG 视觉增强）
- `components/personal/PersonalMemoryGraphPreview.tsx`：从节点卡片列表升级为 SVG 个人记忆星图
  - 中心节点：graph.centerDescription，固定在 SVG 中心
  - 周围节点：最多 12 个，椭圆轨道均匀排列
  - 节点类型视觉配置：subject/person/time/event/place/emotion/keyword/memory/letter/message
  - 点击节点切换选中，下方展示详情面板（label/description/emotion/relatedTo）
  - relatedTo 虚线边（最多 8 条）
  - 打印时展示节点文字摘要
  - 不新增依赖

### Phase 10.4.1（PersonalMemoryGraphPreview 稳健性收尾）
- `components/personal/PersonalMemoryGraphPreview.tsx`：新增 `normalizeNode` 防御（空 label / 非法 type / null relatedTo）；relatedTo 边去重（sorted pair edgeKey）；超过 12 个节点时显示轻提示

### Phase 11.1（memorial mode preview 骨架）
- `lib/memory-core/modes.ts`：memorial 状态 coming_soon → preview，更新文案（人生故事整理/家族记忆传承，克制不拟人化）
- `lib/domains/memorial/defaultQuestions.ts`：8 道访谈问题（材料采集，非心理咨询）
- `lib/domains/memorial/mockArtifact.ts`：虚构 mock artifact（外婆陈玉兰，克制温柔）
- `components/memorial/MemorialLandingPage.tsx`：庄重克制落地页，无拟人化表达
- `components/memorial/MemorialMemoryGraphPreview.tsx`：SVG 星图（暖金/米白/灰棕色调）
- `components/memorial/MemorialMemoryApp.tsx`：input/result 状态机，复用 MemoryArtifactPreview，不调用 AI
- `app/page.tsx`：新增 memorial-landing / memorial-app 路由，不再走 coming-soon

### Phase 11.2（memorial 真实 AI 生成 MVP）
- `lib/memory-core/modes.ts`：memorial preview → available
- `lib/domains/memorial/adapter.ts`：style 类型统一（family 替换 literary），注释更新
- `app/api/generate-memorial-memory/route.ts`：新增 memorial 专用 API（字段校验/null-safe/长度兜底）
- `.skills/memorial-memory/`：全部 4 个 prompt 从占位升级为真实 skill pack（严格安全边界：不模拟逝者/不编造事实/不做哀伤治疗）
- `components/memorial/MemorialMemoryApp.tsx`：升级为 input/generating/result/error 四态，接入真实 API，保留 dev mock 按钮，usageSecondaryTip 移除 preview 说明
- **已验证**：`deepseek-v4-pro` + `thinking: disabled` 通过 `/api/generate-memorial-memory` 真实调用成功，安全边界 PASS

### Phase 11.3（memorial 真实生成质量评测与 prompt 打磨）
- 真实调用 4 组虚构样例（丰富材料/稀疏材料/敏感边界/禁止诱导）
- 全部 4 组安全边界 PASS，无逝者口吻，无强行和解，无事实编造
- 发现 `00_system_role.md` 未显式说明诱导处理方式 → 已修正
- `03_quality_rules.md` 禁止表达补充「ta 用另一种方式爱你」「ta 内心深处」→ 已修正
- 新增 `docs/quality/memorial-generation-eval.md`：完整评测报告

### Phase 12.1（family MemoryArtifact 泛化迁移前置审计）
- 新增 `docs/architecture/family-memoryartifact-migration-plan.md`：完整迁移计划
- 审计了 family 旧链路（`GrowthMemoryArtifact → runGrowthMemorySkill → ReportPreview`）
- 列出所有兼容层（10 项）和 GrowthMemoryArtifact 依赖文件（12 个）
- 设计了 6 阶段低风险迁移路线（Phase 12.2~12.6）
- 明确了高风险点：ReportPreview 含 rawMaterial 原始记录 + 照片预览，不能直接替换

### Phase 12.2（FamilyArtifactPreview wrapper，未接主链路）
- 新增 `components/family/FamilyArtifactPreview.tsx`：`MemoryArtifact` 输入，复用 `MemoryArtifactPreview`，family-specific 文案
- 新增 `components/family/FamilyMemoryGraphPreview.tsx`：轻量 SVG 成长星图（绿色配色）
- GrowthReportApp / ReportPreview / /api/generate-report 均未修改
- Phase 12.2 时 family 主链路仍走旧 `GrowthMemoryArtifact` 链路（已被 Phase 12.4A 替换）

### Phase 12.3（dev-only shadow preview）
- `GrowthReportApp` 新增 `showMemoryArtifactPreview` state + `isDev` 判断
- 开发环境结果页右下角出现「🔬 开发预览：查看 MemoryArtifact 版成长册」浮动按钮
- 点击后用 `growthArtifactToMemoryArtifact` 本地转换，渲染 `FamilyArtifactPreview`
- 生产环境 `isDev = false`，浮动按钮和 shadow preview 分支均不渲染
- `/api/generate-report`、`ReportPreview` 默认路径均未修改

### Phase 12.3.1（shadow preview 补齐与文档收口）
- `MemoryArtifactPreview.tsx`：新增 `backLabel` prop（默认"← 返回修改"），顶部/底部按钮均使用
- `FamilyArtifactPreview.tsx`：新增 `rawMaterial?`/`photos?`/`backLabel?` 可选 props；渲染照片区（最多 6 张，print:hidden）和原始记录区（可折叠 `<details>`）
- `GrowthReportApp.tsx`：shadow preview 传入 `rawMaterial`/`photos`/`backLabel="← 返回旧版预览"`；浮动按钮说明补充"用于迁移验收"文字
- `family-memoryartifact-migration-plan.md`：修正顶部状态、Phase 12.3 验收标准、Phase 12.4 拆分为 12.4A/12.4B、禁止事项补充

### Phase 12.4A（family 前端 UI 默认切换，不改 API）
- `MemoryArtifactPreview.tsx`：新增 `extraSections` 插槽（在 sourceTrace 之后、底部按钮之前）
- `FamilyArtifactPreview.tsx`：重构为单层 wrapper，照片区+原始记录区通过 `extraSections` 注入（均 print:hidden）
- `GrowthReportApp.tsx`：result 分支默认渲染 FamilyArtifactPreview（本地转换 GrowthMemoryArtifact）；dev-only「🧪 查看旧版 ReportPreview」按钮；`onBackToEdit` 真正返回输入表单；生产不显示任何 legacy fallback
- API / aiReportGenerator / .skills/family-memory 均未修改

### Phase 12.4A.1（状态流转修复 + 文档收口 + 验收模板）
- `GrowthReportApp`：`handleGenerate()` 开头加 `setShowLegacyReportPreview(false)`；legacy onBack 也重置该状态，防止再次生成后卡在旧版
- README / handoff 中"family 仍默认走旧 ReportPreview"等过时描述已清理
- 新增 `docs/quality/family-ui-migration-regression.md`：family 新旧 UI 回归验收模板 + Phase 12.4B 准入标准

### Phase 12.4A.2（family 真实生成回归验收）
- 真实调用 deepseek-v4-pro 完成 A/B/C 三组样例验收
- 样例 A（丰富 2问答+freeNote）/ B（最小 2问答无照片）/ C（长文本 2问答+长freeNote）均通过
- growthArtifactToMemoryArtifact 转换字段映射全部正确
- 状态流转（Phase 12.4A.1 修复后）全部正确
- production 构建 dev-only 按钮不渲染，默认 FamilyArtifactPreview ✅
- 已知低优先级差异：照片/原始记录打印 print:hidden、信件标题固定、旧版原始记录 Tab 更详细
- **整体结论：有条件通过，允许进入 Phase 12.4B**

### Phase 12.4B（family API 返回 MemoryArtifact）
- 新增 `lib/domains/family/runFamilyMemorySkill.ts`：`RawMaterial → runMemorySkill → MemoryArtifact`
- `/api/generate-report` 改为调用 `runFamilyMemorySkill`，直接返回 `MemoryArtifact`
- `lib/aiReportGenerator.ts` 返回类型改为 `Promise<MemoryArtifact>`
- `GrowthReportApp` state 改为 `MemoryArtifact | null`，主路径去掉 `growthArtifactToMemoryArtifact` 本地转换
- dev-only legacy fallback 改用 `memoryArtifactToGrowthArtifact` 转换给旧 `ReportPreview`
- API 验证：两组样例均返回标准 MemoryArtifact（mode: "family"，有 narrative，无 report）✅
- `runGrowthMemorySkill` / `GrowthMemoryArtifact` / `ReportPreview` 等旧兼容层均保留

### Phase 12.4B.1（API 迁移后回归验收与小清理）
- `components/GrowthReportApp.tsx`：旧注释修正（Phase 12.4A → 12.4B）
- `lib/aiReportGenerator.ts`：新增 `isMemoryArtifactLike` 结构防御（无新依赖）
- API 错误响应验证：缺 childName → 400 ✅；qaList < 2 → 400 ✅
- API 正常响应验证：mode=family，有 narrative，无 report ✅
- `docs/quality/family-api-memoryartifact-migration.md` 追加 12.4B.1 回归章节
- lint/build 通过

### Phase 12.5（family-memory prompt 输出合约迁移到 MemoryArtifact）
- `.skills/family-memory/prompts/01_task.md`：任务改为"输出 MemoryArtifact"；report/yearlySummary/letter → narrative/summary/longFormText；extensions 结构明确
- `.skills/family-memory/prompts/02_output_contract.md`：标准 MemoryArtifact 合约；禁止旧字段；必须输出新字段
- `.skills/family-memory/prompts/03_quality_rules.md`：字段名对齐
- 真实生成验收：三组样例（丰富/最小/长文本）均直接输出 MemoryArtifact，LLM 未走旧格式路径 ✅
- 小问题记录：最小输入 risk 偏乐观（Phase 12.5.1 改进）
- 新增 `docs/quality/family-memoryartifact-prompt-migration.md`

### Phase 12.5.1（prompt 质量微调 + 兼容层清理前置验收）
- `03_quality_rules.md`：riskOfFabrication 量化标准（low/medium/high 有具体数量条件）；videoScript 保守规则
- `01_task.md`：longFormText.title 优先包含 childName
- `02_output_contract.md`：补充 longFormText.title 建议
- 四组验收（丰富/最小/长文本/极稀疏）全部通过；最小输入 risk 从 low 修正为 medium ✅
- Phase 12.6 清理候选引用审计完成
- 新增 `docs/quality/family-memoryartifact-prompt-quality-tuning.md`
- **允许进入 Phase 12.6A**（清理计划与 dev fallback 取舍）

### Phase 12.6A（兼容层清理计划与 dev fallback 取舍）
- 真实引用审计：10 个符号，均无生产主路径引用
- 新增 `docs/architecture/family-legacy-cleanup-plan.md`：清理计划、引用审计表、清理顺序
- API 验证：`/api/generate-report` 返回标准 MemoryArtifact ✅
- 决策：推荐方案 B（删除 dev fallback），分三步（12.6B→12.6C→12.6D）
- 清理过时文档 TODO（handoff 优先级 2、migration plan Phase 12.6 细化）
- **允许进入 Phase 12.6B**（删除 dev legacy UI fallback）

### Phase 12.6B（删除 dev legacy UI fallback）
- `components/GrowthReportApp.tsx`：移除 `showLegacyReportPreview` state、`ReportPreview` import、`memoryArtifactToGrowthArtifact` import、`isDev` 变量、dev-only 浮动按钮
- 删除 `components/ReportPreview.tsx`、`LifeGraphPreview.tsx`、`lib/graph/buildLifeGraph.ts`、`lib/graph/types.ts`
- lint/build 通过；grep 5 个符号代码引用全部为 0
- **允许进入 Phase 12.6C**

### Phase 12.6C（删除旧格式 parse fallback）
- `parseMemoryArtifact.ts`：删除旧 GrowthMemoryArtifact parse 路径；`artifactAdapter.ts`：删除 `growthArtifactToMemoryArtifact`
- 删除 `lib/skill-runtime/parseGrowthMemoryArtifact.ts`
- lint/build ✅，API 验证 ✅

### Phase 12.6D（归档 rollback path）
- 删除 `lib/skill-runtime/runGrowthMemorySkill.ts`、`buildGrowthMemoryPrompt.ts`、`loadSkillPrompt.ts`、`types.ts`
- 删除 `lib/domains/family/artifactAdapter.ts`（`memoryArtifactToGrowthArtifact`）
- 删除 `components/SkillReviewPanel.tsx`（孤立 dev panel）
- 清理 `buildMemoryPrompt.ts` `legacyFamilyInput`、`skillRegistry.ts` `fallbackSkillDir`、`loadMemorySkillPrompt.ts` fallback 逻辑
- `.skills/growth-memory/README.md` 更新为 ARCHIVED 归档说明
- lint/build ✅，API 验证 ✅
- **Phase 12.6 完成：family MemoryArtifact 迁移全部完成**

### Phase 12.7A.1（family 最终回归 + P1 体验小修）
- 3 组 API 样例验收（最小/丰富/长文本）：全部返回标准 MemoryArtifact ✅
- 产品体验代码审计：P1/P2/P3 问题分类，见 `docs/quality/family-final-regression.md`
- P1 小修：quality/sourceTrace print:hidden；"幻觉风险"→"参考可信度"；style 中文化；"首页"→"← 返回首页"
- lint/build ✅

### Phase 12.7B（family 照片前移 + 图谱优化 + 按钮统一）
- `MemoryArtifactPreview.tsx`：新增 `afterCoverSections` 可选 prop（cover 后、timeline 前）；底部"再做一本 ✨"→"再做一本"
- `FamilyArtifactPreview.tsx`：照片区 → `afterCoverSections`（封面后）；原始记录 → `extraSections`（底部不变）
- `FamilyMemoryGraphPreview.tsx`：去掉 `graph.title` 展示（保留 subtitle）；节点截断 5 → 8 字
- couple / personal / memorial 不传 `afterCoverSections`，不受影响
- lint/build ✅

### Phase 15.1B（落地页情绪叙事扩写 + 动效增强）
- `PersonalLandingPage.tsx`：完整重写（约 165→280 行）；新增情绪场景卡片（6 张）/ Before-After / 它会整理什么（扩写）/ 示例预览（时间线+关键词+信片段）/ 未来打开场景（4 条）/ gentle-glow CTA 动效
- `MemorialLandingPage.tsx`：完整重写（约 153→300 行）；新增为什么要整理（4 条）/ 记忆细节卡片（5 张）/ 它会整理什么（扩写）/ 示例预览（纪念文+时间线+细节片段）/ 边界说明温柔版（非警告框，内容完整）
- `CoupleLandingPage.tsx`：新增"从聊天到纪念册"Before-After；新增 Relationship Galaxy 宇宙示意（深色背景 + constellation-pulse 星点 + flex-wrap 节点）
- `FamilyLandingPage.tsx`：新增"从照片到成长册"Before-After（LandingHero 前）；新增"在这些时刻打开成长册"仪式感（HowItWorks 后）；4 条场景（18岁生日/毕业/离家/很久以后）
- `MemoryModeHome.tsx`：四个 mode 卡片底部 CTA 改为双行（场景 + 关键词副标题），情绪差异更明显
- `app/globals.css`：新增 5 个动效（slow-fade-in / memory-card-float / gentle-glow / soft-slide-up / constellation-pulse），已加入 prefers-reduced-motion + print 禁用列表
- `docs/quality/landing-emotional-storytelling-check.md`：新增，四页完整验收记录
- memorial 边界检查：用户可见区域无禁用词，边界声明保持完整 ✅
- `npm run lint` ✅ / `npm run build` ✅（零错误）
- **待人工确认（Phase 15.1C）**：真实浏览器 375px/390px/430px 各页面视觉验收；personal 情绪场景卡片可读性；couple Galaxy 在小屏布局；memorial 边界说明温柔度

### Phase 15.1B.1（文案边界克制化 + 移动端可读性 + glow 动效拆分）
- `MemoryModeHome.tsx`：memorial 卡片底部 "整理记忆 · 不做对话模拟" → "整理故事 · 保留家族记忆"
- `MemorialLandingPage.tsx`：边界声明重写，移除"模拟离世者 / 数字形象 / 对话模拟"概念，改为"只整理你主动提供的... / 不创造新的个人表达 / 不包装成交互式人格 / 帮助这些记忆被家人慢慢读起"；记忆细节卡片 `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- `PersonalLandingPage.tsx`：情绪场景卡片 `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`；CTA `gentle-glow` → `gentle-glow-blue`
- `app/globals.css`：删除通用 `gentleGlow` keyframe，新增 `gentleGlowWarm / gentleGlowBlue / gentleGlowMemorial` 三种 tone；三个新类加入 prefers-reduced-motion + print 禁用列表
- `docs/quality/landing-emotional-storytelling-check.md`：新增 Phase 15.1B.1 修复记录，memorial 边界检查表更新，lint/build ✅ 已统一
- `npm run lint` ✅ / `npm run build` ✅（零错误）
- **待人工确认（Phase 15.1C）**：真实浏览器验收仍未完成；Phase 14.x 云端同步继续暂缓；不进入部署

### Phase 15.1C（全量静态移动端验收 + 文档修正）
- 验收方式：全量静态代码分析（无浏览器工具；dev server HTTP 200 ✅）
- `npm run lint` ✅ / `npm run build` ✅（零错误）
- **静态检查全部通过**：memorial 禁用词 / AuthPanel 同步按钮 / print:hidden / z-index / grid 布局 / 所有 mode available / mock 按钮 dev-only
- `docs/quality/landing-emotional-storytelling-check.md`：修正旧 memorial 边界声明残留（移除"不模拟离世者发言 / 不包装成数字人格"旧表述）；更新动效类名（gentle-glow → gentle-glow-blue）；更新移动端风险表
- `docs/quality/mobile-beta-qa-check.md`：新增 Phase 15.1C 完整验收节（静态汇总表 / 375/390/430px 状态表 / 7 项人工待确认清单 / 整体结论）
- **无代码修复**：静态分析未发现代码层阻塞问题
- **7 项待人工确认**（高优先 4 项）：
  1. ⚠️ couple Galaxy 375px 节点排列可读性
  2. ⚠️ MemoryArtifactPreview 结果页 375px 无横向滚动（whitespace-pre-line 边缘情况）
  3. ⚠️ 打印预览实际内容完整性
  4. ⚠️ 所有 CTA 触摸区域可点击
  5. 中：family Before/After 与 LandingHero 视觉节奏不重复
  6. 中：动效在真实设备上轻柔不廉价
  7. 低：couple Galaxy 在深色系统模式下可读
- **建议进入 Phase 15.2 Beta Deployment Prep**：代码层面无阻塞；高优先待确认项属视觉/交互验收，不属于代码 bug

### Phase 15.2A（Beta Deployment Prep with Manual QA Gate）
- **新增** `docs/deployment/beta-release-gate.md`：10 项 Hard Gate 人工验收条件 + Go/No-Go 判断标准 + 可接受 Beta 限制 + 禁止承诺项；当前 Hard Gate #8 / #9 静态已通过，#1-#7 / #10 待人工
- **更新** `docs/deployment/beta-deployment-checklist.md`：新增 10 步 Smoke Test 清单；补充 Phase 15.2A 更新备注；明确部署前需完成 beta-release-gate.md Hard Gate
- **修正** `docs/quality/mobile-beta-qa-check.md`：Personal Landing 旧"grid-cols-2 文字较小"→ 当前单列状态；"已知限制"表格更新；Phase 15.1B 整体结论同步
- **修正** `docs/quality/landing-emotional-storytelling-check.md`：移除文档中对旧高风险表达的直接引用，改为抽象描述；同步 Phase 15.1B.1 修复记录措辞
- `npm run lint` ✅ / `npm run build` ✅
- **当前状态**：
  - 无公开发布（仅准备文档和配置说明）
  - 真实浏览器验收仍未完成（7 项人工待确认）
  - Phase 14.x 云端同步继续暂缓
  - AuthPanel 仍不展示"同步到云端"按钮
- **下一阶段 Phase 15.2B**：部署到 Vercel Preview URL → 执行 Smoke Test → 执行 Hard Gate 10 项真实浏览器验收 → 通过后才可对外公开 Beta

### Phase 15.2B（Preview/Staging Deploy + Manual Browser QA）
- **修正** `docs/deployment/beta-release-gate.md`：memorial"不允许承诺"中高风险场景改为抽象工程边界描述"交互式人格化体验"；新增 Section 7 手动部署步骤（Vercel Dashboard + CLI 两种方式）；更新阶段边界表
- **更新** `docs/deployment/beta-deployment-checklist.md`：Smoke Test 改为表格形式，标注每项状态（#8 静态通过，其余待人工）
- **更新** `docs/quality/mobile-beta-qa-check.md`：新增 Phase 15.2B 验收记录节（部署状态 / Smoke Test 表 / Hard Gate 表 / 整体结论）
- `npm run lint` ✅ / `npm run build` ✅
- **部署状态**：⛔ CI 环境无 Vercel CLI / 无 `.vercel` 配置，无法在当前环境执行部署
- **Preview URL**：⬜ 待手动获取（人工完成 Vercel Dashboard 部署后填入）
- **Smoke Test**：⬜ 9 项待人工，#8（memorial 文案）静态已通过
- **Hard Gate**：⬜ 8 项待人工，#8（AuthPanel）#9（memorial 文案）静态已通过
- **外部公开 Beta**：⛔ **不允许**，等待 Smoke Test + Hard Gate 全部通过
- **待人工操作（按优先级）**：
  1. 在 Vercel Dashboard 创建 Project，配置 DeepSeek env vars，部署 main 分支
  2. 获得 preview URL 后执行 10 步 Smoke Test
  3. 执行 Hard Gate #1-#7 真实浏览器验收（375/390/430px；DevTools 或真实设备）
  4. 执行 Hard Gate #10：四个 mode 各生成一次，确认无白屏
  5. 全部通过后进入公开 Beta 发布决策

### Phase 15.2B.1（Vercel CLI Setup + Preview Deploy Guide）
- 确认 `npx vercel` 可用（v54.3.0）✅
- 确认 `.gitignore` 已忽略 `.env.local` + `.vercel` ✅
- 确认 `npm run lint` ✅ / `npm run build` ✅
- 确认 `.env.local` 不在 Git 中 ✅
- `beta-release-gate.md` Section 7 更新为完整 5 步 CLI 部署指南
- ⛔ **阻塞**：`npx vercel whoami` 检测到未登录，启动了 device flow 授权
- 已终止等待进程，等待用户手动登录
- **下一步（用户操作）**：
  ```bash
  npx vercel login          # 浏览器完成 OAuth
  npx vercel link           # 关联项目（见 Section 7 交互选项）
  # Vercel Dashboard 配置 DeepSeek env vars
  npx vercel                # 创建 Preview deployment（不是 --prod）
  ```
- 登录 + 部署完成后，把 preview URL 告知 Claude Code，继续 Smoke Test + Hard Gate

### Phase 16.0（Input Comfort + Human-like Skill Quality）
- `components/memory/InputComfortNote.tsx`（**新增**）：四种 mode 四种文案，three variants（hero/mid-form/before-submit），mode-specific 色系
- `GrowthReportApp.tsx`：import InputComfortNote，插入 hero variant；门槛提示语气软化
- `CoupleMemoryApp.tsx`：import InputComfortNote，插入 hero variant；问题下方显示 hint；门槛提示软化
- `PersonalMemoryApp.tsx`：import InputComfortNote，插入 hero variant；问题下方显示 hint（通过 index 访问 PERSONAL_DEFAULT_QUESTIONS[idx].hint）；门槛提示软化
- `MemorialMemoryApp.tsx`：import InputComfortNote，插入 hero variant；问题下方显示 hint；门槛提示软化
- `lib/domains/couple/defaultQuestions.ts`：CoupleQuestion 类型增加 `hint?: string`，7 道题全部补充 hint
- `lib/domains/personal/defaultQuestions.ts`：7 道题全部补充 hint，使用「」替代内嵌双引号
- `lib/domains/memorial/defaultQuestions.ts`：8 道题全部补充 hint，同上
- `.skills/*/prompts/03_quality_rules.md`（4 个 mode 全部更新）：追加「记忆编辑师」写作人格、反模板规则、输入不足诚实处理
- `docs/architecture/multimodal-memory-roadmap.md`（**新增**）：5 阶段路线图（图片说明→media ref→vision spike→图文结果→视频脚本），当前不实装
- `docs/quality/input-comfort-and-skill-quality-check.md`（**新增**）：完整验收记录
- `npm run lint` ✅ / `npm run build` ✅
- **部署线暂停**；外部 Beta 未发布；多模态未实装；视频生成未实装；云端同步继续暂缓
- **下一阶段建议**：
  - Phase 16.0.1：用四个 mode 真实样例输入对比生成质量（验证 skill prompt 改动效果）
  - 或 Phase 16.1：Photo Caption Local Preview（用户为图片写说明，进入 AI 上下文）

### Phase 16.0.1（Input Friction Hotfix + Generation Quality Regression）
- **GrowthReportApp.tsx**：`isFormValid()` 改为 `answeredCount >= 1 || hasFreeNote`；mid-form 安抚插在 InterviewForm 前；before-submit 在内容少时显示于按钮上方；门槛提示文案软化
- **app/api/generate-report/route.ts**：API 校验从"qaList.length >= 2"改为"qaList.length >= 1 OR freeNote 非空"（最小侵入，仅改输入校验）
- **InterviewForm.tsx**：新增 `hints[]` 数组，8 道默认题全部有常驻 hint（显示在问题标题下方）
- **CoupleMemoryApp.tsx**：mid-form 在 chatText 和 questions 之间；before-submit 替换原文本提示
- **PersonalMemoryApp.tsx**：mid-form 在问答区前；before-submit 在 canGenerate 时显示
- **MemorialMemoryApp.tsx**：mid-form 在问答区前；before-submit 在 canGenerate 时显示
- `docs/quality/generation-regression/phase-16-0-1-fixtures.md`（**新增**）：四个 mode 固定输入样例
- `docs/quality/generation-regression/phase-16-0-1-rubric.md`（**新增**）：7 维评分 rubric
- `docs/quality/generation-regression/phase-16-0-1-results.md`（**新增**）：真实生成结果，综合分 3.9/4.6/4.7/4.9
- `npm run lint` ✅ / `npm run build` ✅
- **生成质量回归结论**：Phase 16.0 prompt 改动效果显著，personal/memorial/couple 表现优秀；family 有轻微「比喻升华」问题，可在 Phase 16.1 中顺带修
- **部署线仍暂停**；Preview URL 仍待人工部署；多模态/视频生成未实装；云端同步继续暂缓

### Phase 15.1A.1（Family z-index 补全 + Memorial 注释清理）
- `FamilyLandingPage.tsx`：main 改为纯 `relative`，EmotionalBackdrop 移到 sticky nav 之前；LandingHero / FutureScene / ValueCards / HowItWorks 全部包入 `<div className="relative z-10">`，确保所有正文内容在 backdrop 上方
- `MemorialLandingPage.tsx`：顶部注释改为抽象工程约束（不再直接列出高风险词），用户可见文案不变
- lint/build ✅（零错误零 warning）

### Phase 15.1A（Visual Layer Fix + Mobile Beta QA）
- `EmotionalBackdrop.tsx`：glow 改为外层定位 div + 内层动效 div，解决 translate 和 scale transform 冲突
- `CoupleLandingPage.tsx` / `PersonalLandingPage.tsx` / `MemorialLandingPage.tsx` / `FamilyLandingPage.tsx`：主内容容器加 `relative z-10`，确保不被 fixed z-0 backdrop 遮挡
- `MemorialLandingPage.tsx`：边界声明删除敏感词，改为"不制造仿佛重逢的体验""不包装成数字人格"；memorial chips 移除"最后一次通话"
- `CoupleLandingPage.tsx`：hero 区新增静态聊天气泡视觉（左右错位，4 条示例）
- `AuthPanel.tsx`：Beta 前隐藏"同步到云端"按钮和 sync 状态；替换为"云端同步仍在内测中"说明；sync 能力代码保留注释
- 新增 `docs/quality/mobile-beta-qa-check.md`：移动端 Beta 验收清单（9 个维度）
- lint/build ✅（零错误零 warning）
- **Phase 14.x 云端同步继续暂缓**

### Phase 15.0（Emotional Motion Polish / 浪漫动态体验打磨）
- `app/globals.css`：5 个 CSS 动效（memoryFloat/Drift/softPulse/revealUp/shimmerLine）+ prefers-reduced-motion + print 禁用
- `components/visual/EmotionalBackdrop.tsx`（新增）：mode-specific 情绪背景（5 种 tone / radial glow / floating chips / print:hidden）
- `MemoryModeHome.tsx`：EmotionalBackdrop / 文案升级 / 状态修正（四种主题均可体验）/ 卡片 CTA 升级 / 底部隐私文案 / 账户文案修正
- `FamilyLandingPage.tsx`：EmotionalBackdrop + 情绪引导语 + 未来打开场景标签（不删子组件）
- `CoupleLandingPage.tsx`：删除 Preview badge / orange warning box / 旧阶段文案；hero 升级；EmotionalBackdrop
- `PersonalLandingPage.tsx`：删除 preview/mock 旧文案；hero 升级；隐私说明规范化；EmotionalBackdrop
- `MemorialLandingPage.tsx`：删除 preview/mock 旧文案；hero 升级；新增明确边界声明（绝不复活/对话）；EmotionalBackdrop
- `MemoryArtifactPreview.tsx`：新增 reveal hint（print:hidden）
- `MemoryCoverSection.tsx`：reveal-up 动效 + 增强封面阴影 + keywords 视觉升级
- lint/build ✅；新增 `docs/quality/emotional-motion-polish-check.md`
- **不新增任何依赖；暂停云端同步开发**

### Phase 14.3（手动上传本地 archive 到云端）
- `lib/archive/cloudArchiveSync.ts`（新增）：
  - `uploadLocalArchiveItemsToCloud()`：INSERT ONLY，不 upsert，不覆盖
  - 流程：blocked fields 过滤 → SELECT 云端已有 id → filter 新 id → INSERT
  - 不做 cloud → local；不做自动同步；不做删除同步
  - 纯参数化函数，不引用 localStorage
- `AuthPanel.tsx`（更新）：
  - `useMemo(() => getSupabaseBrowserClient(), [])` 避免重复创建 client
  - `handleManualUploadArchive`：登录后可用，读取本地 archive → 上传
  - 已登录 UI：新增"手动同步本地记忆档案"区域 + "同步到云端"按钮 + syncMessage 反馈
  - 安全文案：明确只有点击才上传，不自动上传
- lint/build ✅；新增 `docs/quality/manual-cloud-upload-check.md`
- **本阶段：不读取 cloud archive / 不做 cloud→local / 不做删除同步**

### Phase 14.2（Auth shell / 登录登出 UI）
- `npm install @supabase/ssr`（已安装 `^0.10.3`）
- `lib/supabase/env.ts`（新增）：统一 env 读取，`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `lib/supabase/browserClient.ts`（新增）：`getSupabaseBrowserClient()`，env 未配置返回 null
- `lib/supabase/serverClient.ts`（新增）：`getSupabaseServerClient()`，备用，本阶段不接主流程
- `lib/supabase/client.ts`（更新）：兼容 re-export，向下兼容 `getSupabaseClient()`
- `components/auth/AuthPanel.tsx`（新增）：
  - env 未配置 → "🔌 云端同步未配置"卡片
  - email/password 登录 / 注册 / 登出
  - 已登录展示用户 email + 明确提示不自动同步
  - status 反馈（成功绿/失败红）
- `app/page.tsx`：新增 `auth` screen
- `components/MemoryModeHome.tsx`：新增 `onOpenAuth?` + "👤 账户 / 登录"按钮
- lint/build ✅；新增 `docs/quality/auth-shell-check.md`
- **本阶段：不同步 archive / 不上传 localStorage / 不读取 cloud archive_items**

### Phase 14.1（Supabase schema spike / 最小云端数据层）
- `npm install @supabase/supabase-js`（已安装，package.json 中 `^2.106.1`）
- `lib/supabase/client.ts`（新增）：
  - `getSupabaseClient()`：env 未配置时返回 null，不 throw
  - `isSupabaseConfigured()`：检查 env 是否就绪
  - 使用 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`（不使用旧命名 ANON_KEY）
  - 不使用 service role / secret key
- `lib/archive/cloudArchiveMapper.ts`（新增）：
  - `CloudArchiveItemInsert` 类型：对应 Supabase archive_items insert row
  - `mapArchiveItemToCloudInsert()`：纯函数映射，不发网络请求
  - `containsBlockedCloudArchiveFields()`：防止 blob/previewUrl 上传
- `supabase/migrations/0001_life_archive_schema.sql`（新增）：
  - profiles 表 + RLS
  - archive_items 表（id 沿用本地，artifact/source 为 jsonb，soft delete 预留）
  - 4 个独立 RLS policy（SELECT/INSERT/UPDATE/DELETE），均 `user_id = auth.uid()`
- README 新增 Supabase env 节，明确离线降级
- lint/build ✅；新增 `docs/quality/supabase-schema-spike-check.md`
- **本阶段无登录 UI、无真实同步、无自动上传；未配置 env 时 app 完全离线运行**

### Phase 14.0（云端同步 / 账户系统架构设计）
- 新增 `docs/architecture/cloud-sync-plan.md`：
  - 推荐技术路线：Supabase + Next.js；本阶段不接入
  - 云端数据模型草案：profiles + archive_items（id 沿用本地，artifact 为 jsonb）
  - RLS 权限边界：`user_id = auth.uid()` 隔离
  - 本地→云端非破坏性迁移策略（不清空 localStorage，不强覆盖云端）
  - 删除同步语义（soft delete 预留，Phase 14.5 启用）
  - 导出/导入保留（JSON 导入 = 本地恢复，不直接等同云端恢复）
  - 隐私与安全边界（10 条风险清单）
  - 分阶段计划（Phase 14.1～14.6）
  - Phase 14.1 最小验收标准
- 新增 `docs/quality/cloud-sync-architecture-check.md`
- lint/build ✅（纯文档，代码未改动）

### Phase 13.9（统一 archive 筛选 / 搜索 / 单条删除）
- `AllArchivePage.tsx`：
  - `items` state 改为可更新 + `refreshItems()`
  - `isSupportedArchiveMode` 兜底：过滤未知 mode，防页面崩溃
  - mode 筛选：ModeFilter 状态 + 5 个按钮（全部/家庭/情侣/个人/纪念）
  - 搜索：`searchQuery` + `archiveItemMatchesQuery`（标题/摘要/关键词/source 摘要）
  - `filteredItems` 计算值：筛选 + 搜索双重过滤
  - 单条删除：`pendingDeleteId` 二次确认 → `deleteArchiveItem` → `refreshItems`
  - 卡片重构为 `<article>` + 内嵌 `<button>`（无 button 嵌套）
  - 操作反馈：`operationMessage` + `operationStatus`（success 绿 / error 红）
  - 两种空状态：完全无 archive / 筛选搜索无结果
- lint/build ✅；新增 `docs/quality/all-archive-management-check.md`

### Phase 13.8（跨 mode archive 统一列表 / 我的记忆档案）
- `MemoryModeHome.tsx`：新增 `onOpenArchive?` prop + "📚 我的记忆档案"按钮（四卡片下方）
- `app/page.tsx`：新增 `all-archive` screen + `handleCreateNewByMode` helper；默认首页传 `onOpenArchive`
- `components/archive/AllArchivePage.tsx`（新增）：
  - `useState` 懒初始化，读取所有 mode 的 ArchiveItem，按 updatedAt 倒序
  - 响应式双列卡片（sm:grid-cols-2），卡片带 mode badge（颜色区分）
  - 空状态 CTA
  - 详情回看：family→FamilyArtifactPreview / couple→CoupleArtifactPreview / personal/memorial→MemoryArtifactPreview + 对应 graphSlot
  - 所有详情页 `showArchiveSaveButton={false}` 或不传 `topActionsSlot`
  - `FamilyArchivePage` 专属管理页不影响
- lint/build ✅；新增 `docs/quality/all-archive-page-check.md`

### Phase 13.7（couple / personal / memorial archive 保存入口）
- `components/archive/ArchiveSaveButton.tsx`（新增）：通用保存按钮，供 couple/personal/memorial 复用；内部逻辑与 family 独立，不影响 family 已验收链路
- `CoupleArtifactPreview.tsx`：新增 `source?` / `showArchiveSaveButton?` prop + `topActionsSlot` 接入 ArchiveSaveButton
- `CoupleMemoryApp.tsx`：结果页构造 `coupleArchiveSource`（不含 chatText/freeNote 原文）
- `PersonalMemoryApp.tsx`：结果页构造 `personalArchiveSource` + `topActionsSlot`（不含 freeNote/qaList 原文）
- `MemorialMemoryApp.tsx`：结果页构造 `memorialArchiveSource` + `topActionsSlot`（不含 freeNote/qaList 原文；按钮文案"保存到本地"，不涉及逝者模拟）
- lint/build ✅；新增 `docs/quality/other-modes-save-to-archive-check.md`

### Phase 13.6（family archive JSON 导入 / 恢复）
- `lib/archive/importArchive.ts`（新增）：
  - `validateArchiveExportBundle`：校验 exportVersion / mode / items
  - `parseArchiveImportText`：JSON.parse + validateArchiveExportBundle
  - `isValidArchiveItemForMode`：结构最小验证
  - `containsBlockedPhotoFields`：拒绝含 previewUrl/blob:/File 的 item
  - `importArchiveItemsFromBundle`：非破坏性合并；相同 id 跳过；不误删 mode !== family；遵守 MAX_ARCHIVE_ITEMS
- `lib/archive/index.ts`：新增 `export * from "./importArchive"`
- `FamilyArchivePage.tsx`：
  - import `useRef` + 导入工具函数
  - `importInputRef` + `handleImportButtonClick` + `handleImportFileChange`（async，FileReader/file.text()）
  - 顶部「导入 JSON」按钮（始终可见，空列表也显示）
  - 隐藏 `<input type="file">` 触发选择
  - 数据说明区补充：导入 JSON 时会跳过同 id 记录，不覆盖已有成长册
- lint/build ✅；新增 `docs/quality/family-archive-import-check.md`

### Phase 13.5（family archive JSON 导出）
- `lib/archive/exportArchive.ts`（新增）：`createArchiveExportBundle` / `createArchiveExportFileName` / `downloadJsonFile`（Blob + URL.createObjectURL，SSR 安全）
- `lib/archive/index.ts`：新增 `export * from "./exportArchive"`
- `FamilyArchivePage.tsx`：
  - import 导出函数
  - `operationStatus: "success" | "error"` 状态区分（反馈颜色：绿/红）
  - `showOperationMessage()` helper 统一操作反馈
  - `handleExportFamilyArchive()`：只导出 family item
  - 顶部栏「导出 JSON」按钮（`items.length > 0` 时显示）
  - 危险操作区上方添加隐私说明（不包含原始照片文件）
- lint/build ✅；新增 `docs/quality/family-archive-export-check.md`

### Phase 13.4（family archive 删除 / 清空管理）
- `lib/archive/localArchiveStore.ts`：新增 `deleteArchiveItemsByMode(mode)` — 只删指定 mode，不影响其他 mode
- `components/archive/FamilyArchivePage.tsx`：
  - `items` state 改为可更新 + `refreshItems()` 函数
  - 卡片重构为 `<article>` + 内嵌 `<button>`（主体）+ 独立删除区，无 button 嵌套
  - 单条删除：`pendingDeleteId` 二次确认 → `deleteArchiveItem(id)` → `refreshItems()`
  - 清空 family：`confirmClear` 二次确认 → `deleteArchiveItemsByMode("family")` → `refreshItems()`（**不调用 clearArchiveCollection()**）
  - `operationMessage` 操作反馈（成功/失败）
  - 文案明确说明"只清空家庭成长册，不影响未来其他类型记忆"
- lint/build ✅；新增 `docs/quality/family-archive-management-check.md`

### Phase 13.3（family 历史记录列表 + 详情回看）
- `app/page.tsx`：新增 `family-archive` screen；FamilyLandingPage 传 `onOpenArchive`
- `FamilyLandingPage.tsx`：新增 `onOpenArchive?` prop + "📚 我的成长册"按钮（顶部右侧）
- `FamilyArtifactPreview.tsx`：新增 `showArchiveSaveButton?` prop（默认 true；archive 详情传 false）
- `components/archive/FamilyArchivePage.tsx`（新增）：
  - `useState` 懒初始化读取 localStorage（SSR 安全，修复 react-hooks/set-state-in-effect）
  - 只展示 `mode === "family"` 的 ArchiveItem
  - 卡片展示：标题/摘要/日期/关键词/photoCount/questionCount/仅本设备
  - 空状态：CTA 跳转生成页
  - 点击卡片 → `selectedItem` → FamilyArtifactPreview 详情回看（showArchiveSaveButton=false）
- lint/build ✅；新增 `docs/quality/family-archive-list-check.md`

### Phase 13.2（family 结果页保存按钮）
- `MemoryArtifactPreview.tsx`：新增 `topActionsSlot?: React.ReactNode`（顶部右侧按钮组，already print:hidden）
- `FamilyArtifactPreview.tsx`：
  - import `createArchiveItemFromArtifact` / `upsertArchiveItem` / `readArchiveCollection`
  - `saveStatus: "idle" | "saved" | "error"` 状态；`savedArchiveId` 防重复保存
  - `buildFamilyArchiveSourceSnapshot()`：从 rawMaterial/photos 提取 metadata（只保存 photoCount，不保存 blob）
  - `handleSaveToArchive()`：首次生成新 item，后续复用同 id 更新
  - 保存按钮通过 `topActionsSlot` 传入
  - 按钮文案：idle="保存到本地" / saved="已保存 ✓" / error="保存失败，再试"
- couple / personal / memorial 不受影响（topActionsSlot 为可选 prop，默认 undefined）
- lint/build ✅；新增 `docs/quality/family-save-to-archive-check.md`

### Phase 13.1（Life Archive 本地数据模型）
- 新增 `lib/archive/types.ts`：`ArchiveMode`（复用 MemoryMode）/ `ArchiveSourceSnapshot` / `ArchiveItem` / `ArchiveCollection`
- 新增 `lib/archive/createArchiveItem.ts`：`createArchiveItemFromArtifact()` 工厂函数（mode fallback title / 时间戳 id / 不保存照片 blob）
- 新增 `lib/archive/localArchiveStore.ts`：`localStorage` 读写工具（SSR 安全 / try-catch / 最多 50 条 / 按 updatedAt 倒序）
- 新增 `lib/archive/index.ts`：barrel export
- 新增 `docs/architecture/life-archive-data-model.md`：架构设计文档
- 新增 `docs/quality/life-archive-data-model-check.md`：静态验收报告
- lint/build ✅，无新依赖，未接 UI

### Phase 12.7C（打印照片 + 移动端优化）
- `FamilyArtifactPreview.tsx`：
  - 新增 `hidden print:block` 照片区（blob URL 同会话有效，照片纳入礼物 PDF）
  - 浏览器照片网格改为 `grid-cols-2 sm:grid-cols-3`（小屏 2 列，大屏 3 列）
  - 更新文件头注释说明双版本照片策略
- lint/build ✅
- 静态分析：打印隐藏项（顶部栏/quality/sourceTrace/原始记录/底部按钮）全部 print:hidden ✅；照片/时间线/信件/社交文案/星图可打印 ✅

---

## 3. 还没完成的 TODO

### 紧急（用户配置）- 已通过 Phase 10.3.1 修复
- [x] ~~将 DEEPSEEK_MODEL 改为 deepseek-chat~~（不需要了，代码已适配）
- [ ] 在 `.env.local` 中加 `DEEPSEEK_THINKING=disabled`（如果尚未添加）
- [ ] 在 `.env.local` 中加 `DEEPSEEK_MAX_TOKENS=8192`（可选，提升长 JSON 输出稳定性）

### 短期（优先级 1）
- [x] ~~Phase 10.3：personal 真实生成质量评测与 prompt 打磨~~（已完成）
- [x] **Phase 10.4**：PersonalMemoryGraphPreview 视觉增强（已完成）
- [x] **Phase 11.1**：memorial mode preview 骨架（已完成）
- [x] **Phase 11.2**：memorial 真实 AI 生成 MVP（已完成）
- [x] **Phase 11.3**：memorial 真实生成质量评测与 prompt 打磨（已完成）
- [x] **Phase 12.1**：family MemoryArtifact 泛化迁移前置审计（已完成，仅文档）
- [x] **Phase 12.2**：新增 FamilyArtifactPreview wrapper（已完成，未接主链路）
- [x] **Phase 12.3**：dev-only shadow preview（已完成，生产不显示）
- [x] **Phase 12.3.1**：shadow preview 补齐 rawMaterial/photos/backLabel + 迁移计划 12.4A/12.4B 拆分（已完成）
- [x] **Phase 12.4A**：family 生产默认 UI 切换到 FamilyArtifactPreview（已完成，API 未修改）
- [x] **Phase 12.4A.1**：状态流转 bug 修复 + 文档收口 + 验收模板（已完成）
- [x] **Phase 12.4A.2**：family 真实生成回归验收（已完成，有条件通过，允许进入 12.4B）
- [x] **Phase 12.4B**：family API 返回 MemoryArtifact，GrowthReportApp state 切换（已完成）
- [x] **Phase 12.4B.1**：API 迁移回归验收 + aiReportGenerator 结构防御 + 旧注释清理（已完成）
- [x] **Phase 12.5**：family-memory prompt 直接输出 MemoryArtifact，三组验收通过（已完成）
- [x] **Phase 12.5.1**：prompt 质量微调，四组验收，引用审计完成（已完成，允许进入 12.6A）
- [x] **Phase 12.6A**：清理计划文档 + 引用审计 + dev fallback 取舍决策（已完成，允许进入 12.6B）
- [x] **Phase 12.6B**：删除 dev legacy UI fallback（ReportPreview/LifeGraphPreview/buildLifeGraph）（已完成，允许进入 12.6C）
- [x] **Phase 12.6C**：删除旧格式 parse fallback（parseGrowthMemoryArtifact / growthArtifactToMemoryArtifact）（已完成）
- [x] **Phase 12.6D**：归档 rollback path（runGrowthMemorySkill / artifactAdapter / skill-runtime/types 等）（已完成）
- [x] **Phase 12.7A.1**：family 最终回归 + P1 体验小修（已完成）
- [x] **Phase 12.7B**：family 照片区前移 + 图谱双标题修复 + 节点截断放宽 + 按钮文案统一（已完成）
- [x] **Phase 12.7C**：照片纳入礼物 PDF（print-only 照片区）+ 移动端小屏 grid-cols-2 优化（已完成）
- [x] **Phase 12.7C.1**：文档收口 + 过时 TODO 清理 + 人工 E2E checklist 新增（已完成）
- [x] **Phase 12.7C.2**：family 人工 E2E 验收通过落档，允许进入 Phase 13（已完成）
- [x] **Phase 13.1**：Life Archive 本地数据模型 + localStorage 工具函数（已完成）
- [x] **Phase 13.2**：family 结果页「保存到本地」按钮接入（已完成）
- [x] **Phase 13.3**：family 历史记录列表 + 本地详情回看（已完成）
- [x] **Phase 13.4**：family archive 删除单条 + 清空 family（已完成）
- [x] **Phase 13.5**：family archive JSON 导出（已完成）
- [x] **Phase 13.6**：family archive JSON 导入 / 恢复（已完成）
- [x] **Phase 13.7**：couple / personal / memorial archive 保存入口（已完成）
- [x] **Phase 13.8**：跨 mode archive 统一列表 / 我的记忆档案（已完成）
- [x] **Phase 13.9**：统一 archive 筛选 / 搜索 / 单条删除（已完成）
- [x] **Phase 14.0**：云端同步 / 账户系统架构设计（已完成，纯文档）
- [x] **Phase 14.1**：Supabase schema spike / 最小云端数据层（已完成）
- [x] **Phase 14.2**：Auth shell / 登录登出 UI（已完成）
- [x] **Phase 14.3**：手动上传本地 archive 到云端（已完成）
- [x] **Phase 15.0**：Emotional Motion Polish / 浪漫动态体验打磨（已完成）
- [x] **Phase 15.1A**：Visual Layer Fix + Mobile Beta QA（已完成）
- [x] **Phase 15.1A.1**：Family z-index 补全 + Memorial 注释清理（已完成）
- [x] **Phase 15.1B**：静态移动端验收 + Beta 部署准备（已完成，真实浏览器验收待人工）

### 中期（优先级 2）
- [x] **family 真实浏览器 E2E 验收**（已完成，Phase 12.7C.2）
- [x] **family 真实打印预览验收**（已完成，Phase 12.7C.2）
- [x] **family 移动端人工验收**（已完成，Phase 12.7C.2）
- [ ] couple / personal / memorial 结果页体验对齐 family 12.7 系列（print:hidden / 文案软化 / 图谱优化）

### 长期
- [ ] Phase 13：跨 mode 数据保存 / 人生 Wiki 数据层设计（人工 E2E 通过后再开始）

---

## 4. 核心文件路径

```
app/
  page.tsx                                   # 全局状态路由
  api/
    generate-report/route.ts                 # family API【禁止修改】
    generate-couple-memory/route.ts          # couple API【禁止修改】
    generate-personal-memory/route.ts        # personal API【Phase 10.2 新增】

components/
  memory/
    MemoryArtifactPreview.tsx                # 通用展示容器
    （10 个通用子组件）
  couple/
    CoupleArtifactPreview.tsx                # MemoryArtifactPreview 薄 wrapper
    RelationshipGalaxyPreview.tsx
  personal/
    PersonalLandingPage.tsx
    PersonalMemoryApp.tsx                    # 真实 API 状态机【Phase 10.2 升级】
    PersonalMemoryGraphPreview.tsx
  family/
    FamilyLandingPage.tsx                    # 【禁止修改】
    FamilyArtifactPreview.tsx                # family 结果页（唯一，照片前移/打印/原始记录）
    FamilyMemoryGraphPreview.tsx             # family 成长星图（subtitle 氛围文案，节点截断 8 字）
  GrowthReportApp.tsx                        # family 主状态机

lib/
  memory-core/
    modes.ts / types.ts / runMemorySkill.ts / parseMemoryArtifact.ts / buildMemoryPrompt.ts
  domains/
    family/
      adapter.ts                             # RawMaterial → MemoryRawMaterial
      runFamilyMemorySkill.ts                # family server 入口
    personal/
      adapter.ts / defaultQuestions.ts / mockArtifact.ts

.skills/
  family-memory/                             # 【禁止修改】当前 family skill pack
  couple-memory/                             # 【禁止修改】
  growth-memory/                             # ARCHIVED（有 README 说明，不被运行时调用）
  personal-memory/                           # 真实 skill pack
  memorial-memory/                           # 真实 skill pack
```

---

## 5. 核心约束（禁止修改边界）

```
app/api/generate-report/route.ts
app/api/generate-couple-memory/route.ts
lib/memory-core/runMemorySkill.ts
lib/memory-core/buildMemoryPrompt.ts
lib/memory-core/parseMemoryArtifact.ts
components/family/FamilyLandingPage.tsx
.skills/family-memory/**
.skills/couple-memory/**
package.json
.env.local
```

---

## 6. 当前过渡态

| 过渡态 | 说明 |
|--------|------|
| `family-memory` 已输出 `MemoryArtifact` | Phase 12.5 完成；旧格式 fallback 已在 Phase 12.6C 删除 |
| `.skills/growth-memory` 已归档 | 历史参考保留，有 ARCHIVED README，不被任何运行时调用 |
| 真实浏览器交互验证 | ✅ **已完成**（Phase 12.7C.2 人工验收通过；浏览器主流程 + 打印预览 + 移动端；无 P0/P1）|

---

## 7. 下一步建议

### 立即处理（用户配置）
如果本地 `.env.local` 尚未更新，请保持以下配置（**不要改成 deepseek-chat**）：

```
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_THINKING=disabled
DEEPSEEK_JSON_MODE=true
DEEPSEEK_MAX_TOKENS=8192
```

Phase 10.3.1 已在 `lib/server/deepseekClient.ts` 中适配 v4-pro：对 v4-pro/v4-flash 默认注入 thinking disabled，让最终 JSON 回到 `message.content`，不再出现空响应问题。

### 优先级 1：Phase 15.2 - Beta Deploy（准备就绪）

代码层面已通过静态验收，无阻塞问题。下一步：
- 人工完成 `docs/quality/mobile-beta-qa-check.md` 中"待人工确认"项（真实浏览器 DevTools / 实机）
- 按 `docs/deployment/beta-deployment-checklist.md` 完成 Vercel 部署配置
- 首次部署后手动验收四个 mode 生成流程
- 如验收无阻塞 → 进入 Phase 15.2 正式 Beta

### 优先级 2：Phase 14.4（暂缓，可选）

云端 archive 读取 / 本地合并预览；待用户测试反馈后决策。

### 优先级 3：其他模式管理增强（可选）
- couple/personal/memorial landing 各自加"我的纪念册/回忆录"专属入口
- couple/personal/memorial archive 导出/导入能力对齐 family

### 优先级 3：其他 mode 体验对齐（可选）
- couple / personal / memorial 结果页体验对齐 family 12.7 系列
- Phase 11.4：memorial 结果页文案微调
- Phase 10.5：personal 结果页文案微调



---

## 8. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 15.1B 已完成，工作区干净，lint + build 零错误。

已完成：
- family / couple / personal / memorial 四个 mode 均可真实 AI 生成
- memorial mode 严格安全边界：不模拟逝者/不编造事实/不做哀伤治疗
- Phase 12.1~12.3.1：family 审计 + dev shadow preview 完整建立
- Phase 12.4A：family 生产默认 UI 已切换为 FamilyArtifactPreview
- Phase 12.4A.1~12.4A.2：状态流转修复 + 回归验收通过
- Phase 12.4B：/api/generate-report 直接返回 MemoryArtifact；GrowthReportApp state 切换
- Phase 12.4B.1：API 迁移回归验收通过；aiReportGenerator 结构防御；旧注释清理
- Phase 12.5：family-memory prompt 直接输出 MemoryArtifact，三组验收通过
- Phase 12.5.1：prompt 质量微调，四组验收通过，兼容层引用审计完成
- Phase 12.6A：清理计划文档 + 引用审计 + dev fallback 取舍决策（推荐删除，方案 B）
- Phase 12.6B：删除 dev legacy UI fallback（ReportPreview/LifeGraphPreview/buildLifeGraph/graph types），lint/build ✅
- Phase 12.6C：删除旧格式 parse fallback（parseGrowthMemoryArtifact / growthArtifactToMemoryArtifact），lint/build ✅
- Phase 12.6D：rollback path 全部清理，lint/build ✅，API ✅
- Phase 12.7A.1：3 组 API 验证 ✅，P1 小修（print:hidden / 文案软化 / 风格中文化 / 首页按钮）
- Phase 12.7B：照片区前移（afterCoverSections）/ 图谱双标题修复 / 节点截断 8 / 按钮统一 ✅
- Phase 12.7C：照片纳入礼物 PDF（print-only）/ 小屏 grid-cols-2 / 打印隐藏项全部 print:hidden ✅
- Phase 12.7C.2：family 人工 E2E 验收通过（浏览器主流程 + 打印预览 + 移动端，无 P0/P1）✅
- Phase 13.1：lib/archive/ 数据层就绪（ArchiveItem / localStorage / createArchiveItemFromArtifact）✅
- Phase 13.2：family 结果页「保存到本地」按钮（topActionsSlot / upsertArchiveItem）✅
- Phase 13.3：family 历史列表（FamilyArchivePage / useState 懒初始化 / showArchiveSaveButton）✅
- Phase 13.4：archive 删除单条 + 清空 family（deleteArchiveItemsByMode / 二次确认 / refreshItems）✅
- Phase 13.5：family archive JSON 导出（exportArchive / Blob+URL.createObjectURL / operationStatus）✅
- Phase 13.6：family archive JSON 导入（importArchive / 非破坏性合并 / 重复 id 跳过 / blob 拒绝）✅
- Phase 13.7：couple / personal / memorial 保存入口（ArchiveSaveButton / 低敏 source snapshot）✅
- Phase 13.8：跨 mode 统一档案页（MemoryModeHome 入口 / AllArchivePage / 各 mode 详情回看）✅
- Phase 13.9：统一 archive 筛选 / 搜索 / 单条删除（mode filter / contains search / pendingDeleteId）✅
- Phase 14.0：云端同步架构设计文档（Supabase schema / RLS / 迁移策略 / 风险清单，纯文档）✅
- Phase 14.1：Supabase schema spike（@supabase/supabase-js / client helper / SQL migration + RLS / cloudArchiveMapper）✅
- Phase 14.2：Auth shell（@supabase/ssr / env.ts / browserClient / AuthPanel / 登录登出 / session）✅
- Phase 14.3：手动上传本地 archive（cloudArchiveSync / INSERT ONLY / blocked fields 防护 / AuthPanel 同步按钮）✅
- Phase 15.0：Emotional Motion Polish（EmotionalBackdrop / CSS动效 / 文案升级 / preview/mock清理）✅
- Phase 15.1A：Visual Layer Fix（transform 修复 / z-10 / memorial 敏感词 / couple 气泡 / AuthPanel sync 隐藏）✅
- Phase 15.1A.1：Family z-index 补全 + Memorial 注释清理 ✅
- Phase 15.1B：静态验收通过（无阻塞），Beta 部署 checklist 新增 ✅；真实浏览器验收待人工
- 下一步：Phase 15.2 Beta Deploy（人工验收通过后）；云端同步继续暂缓
- components/memory/ 完整通用展示体系（MemoryArtifactPreview 容器 + 10 个子组件）
- personal-memory skill pack 已升级为真实 prompt + Phase 10.3 质量打磨
- Phase 10.3.1：deepseekClient 适配 deepseek-v4-pro（DEEPSEEK_THINKING=disabled）
- docs/quality/：personal 评测报告 + v4-pro 兼容说明

推荐 .env.local 配置：
  DEEPSEEK_MODEL=deepseek-v4-pro
  DEEPSEEK_THINKING=disabled
  DEEPSEEK_JSON_MODE=true
  DEEPSEEK_MAX_TOKENS=8192

核心约束（不可修改）：
- family API / runtime / .skills/family-memory / .skills/couple-memory
- components/family/FamilyLandingPage.tsx / package.json / .env.local

待办：
- 人工完成 mobile-beta-qa-check.md 真实浏览器验收项 → 进入 Phase 15.2 Beta Deploy

建议从 .claude/handoff/current-task-handoff.md 第 7 节开始执行。
```
