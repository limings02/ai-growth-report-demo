# Claude Code 会话交接文档

> 生成时间：2026-05-20  
> 当前阶段：Phase 12.6D 已完成（family MemoryArtifact 迁移全部完成）  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前状态：**
- family：available，真实 AI 生成（MemoryArtifact 链路；Phase 12.6B/C/D 全部完成，GrowthMemoryArtifact 兼容层已彻底清理）
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
- 清理多个文件过渡注释（types.ts / runMemorySkill / adapter / types / aiReportGenerator）
- `.skills/growth-memory/README.md` 更新为 ARCHIVED 归档说明
- grep 全量：所有 rollback 符号代码引用 0
- lint/build ✅，API 验证 ✅
- 新增 `docs/quality/family-rollback-path-removal.md`
- **Phase 12.6 完成：family MemoryArtifact 迁移全部完成**

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
- [x] **Phase 12.6D**：归档 rollback path（runGrowthMemorySkill / artifactAdapter / skill-runtime/types 等）（已完成，family MemoryArtifact 迁移全部完成）

### 中期（优先级 2）
- [ ] `family-memory` 改为直接输出 `MemoryArtifact`
- [ ] `ReportPreview` 泛化为消费 `MemoryArtifact`
- [ ] `LifeGraphPreview` 改名为 `MemoryGraphPreview`

### 长期
- [ ] 删除 GrowthMemoryArtifact 兼容层（条件：ReportPreview 泛化后）

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
    FamilyArtifactPreview.tsx                # 迁移准备组件（Phase 12.2 新增，可按 phase 修改）
    FamilyMemoryGraphPreview.tsx             # 迁移准备组件（Phase 12.2 新增，可按 phase 修改）
  GrowthReportApp.tsx                        # family 主状态机（Phase 12.6B 已清理 dev fallback）

lib/
  memory-core/
    modes.ts                                 # personal = available（Phase 10.2）
    types.ts / runMemorySkill.ts / ...
  domains/
    personal/
      adapter.ts / defaultQuestions.ts / mockArtifact.ts
  skill-runtime/
    runGrowthMemorySkill.ts                  # 【禁止修改】

.skills/
  family-memory/                             # 【禁止修改】
  couple-memory/                             # 【禁止修改】
  growth-memory/                             # 【禁止修改，fallback】
  personal-memory/                           # 真实 skill pack【Phase 10.2 升级】
  memorial-memory/                           # 真实 skill pack【Phase 11.2 升级】
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
components/family/FamilyLandingPage.tsx
# 注意：GrowthReportApp.tsx Phase 12.3 已加 dev-only shadow preview，生产主链路逻辑不可替换
# 注意：components/family/FamilyArtifactPreview.tsx 和 FamilyMemoryGraphPreview.tsx 是迁移准备组件，可按 phase 修改
.skills/family-memory/**
.skills/growth-memory/**
.skills/couple-memory/**
package.json
.env.local
```

---

## 6. 当前过渡态

| 过渡态 | 说明 |
|--------|------|
| `family-memory` 已输出 `MemoryArtifact` | Phase 12.5 完成；旧格式 fallback 路径保留 |
| `.skills/growth-memory` 已归档 | 历史参考保留，有 ARCHIVED README，不被任何运行时调用 |

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

### 优先级 1：Phase 12.7 - family 最终回归与体验优化（Phase 12.6 全部完成，下一步）
- family MemoryArtifact 迁移已全部完成，可进行体验打磨
- 可选方向：FamilyArtifactPreview 视觉细节打磨、照片区/原始记录打印支持、成长星图节点交互优化
- 无硬性代码债务，按需规划

### 优先级 2：Phase 11.4 - MemorialLandingPage / result 文案与视觉微调（可选）
- MemorialLandingPage 情绪表达与文案优化
- memorial 结果页 usage tips 等文案优化

### 优先级 2：Phase 10.5 - personal 文案与视觉微调（可选）
- PersonalLandingPage 情绪表达打磨
- personal 结果页 usage tips 等文案优化

### 优先级 2：family 清理与体验优化
- 兼容层清理：Phase 12.6B（UI fallback）→ Phase 12.6C（parse fallback）→ Phase 12.6D（rollback path）
- 照片打印与原始记录打印优化（当前 print:hidden，待后续评估）
- `FamilyArtifactPreview` 视觉细节打磨



---

## 8. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 12.6D 已完成，工作区干净，lint + build 零错误。

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
- Phase 12.6D：rollback path 全部清理（runGrowthMemorySkill / artifactAdapter / skill-runtime/types 等），lint/build ✅，API ✅
- family MemoryArtifact 迁移全部完成（Phase 12.1 → 12.6D）
- 下一步：Phase 12.7 - family 体验优化（按需规划）
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
- GrowthReportApp / components/family/**（ReportPreview / LifeGraphPreview 已删除，不再适用）
- package.json / .env.local

建议从 .claude/handoff/current-task-handoff.md 第 7 节开始执行。
```
