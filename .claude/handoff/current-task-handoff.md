# Claude Code 会话交接文档

> 生成时间：2026-05-19  
> 当前阶段：Phase 12.1 已完成  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前状态：**
- family：available，真实 AI 生成（GrowthMemoryArtifact 兼容链路）
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
  family/                                    # 【禁止修改】
  GrowthReportApp.tsx                        # 【禁止修改】
  ReportPreview.tsx                          # 【禁止修改】
  LifeGraphPreview.tsx                       # 【禁止修改】

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

## 6. 当前过渡态

| 过渡态 | 说明 |
|--------|------|
| `family-memory` 仍输出 `GrowthMemoryArtifact` | 旧前端未泛化 |
| `runGrowthMemorySkill` 仍保留 | `/api/generate-report` 调用它 |
| `ReportPreview` 仍消费 `GrowthMemoryArtifact` | 未泛化 |
| `LifeGraphPreview` 保留旧名字 | 未改名 |
| `.skills/growth-memory` 保留 | 作为 family 的 fallback |

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

### 优先级 1：Phase 12.2 - 新增 FamilyArtifactPreview wrapper（不替换主链路）
- 新增 `components/family/FamilyArtifactPreview.tsx`
- 输入 `MemoryArtifact`，复用 `MemoryArtifactPreview`
- GrowthReportApp / ReportPreview / API 均不变
- 详见 `docs/architecture/family-memoryartifact-migration-plan.md` Phase 12.2 节

### 优先级 2：Phase 11.4 - MemorialLandingPage / result 文案与视觉微调（可选）
- MemorialLandingPage 情绪表达与文案优化
- memorial 结果页 usage tips 等文案优化

### 优先级 2：Phase 10.5 - personal 文案与视觉微调（可选）
- PersonalLandingPage 情绪表达打磨
- personal 结果页 usage tips 等文案优化

### 优先级 2：family 链路泛化
- family-memory prompt 改为直接输出 MemoryArtifact
- ReportPreview 迁移为消费 MemoryArtifact + MemoryArtifactPreview



---

## 8. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 12.1 已完成，工作区干净，lint + build 零错误。

已完成：
- family / couple / personal / memorial 四个 mode 均可真实 AI 生成
- memorial mode 严格安全边界：不模拟逝者/不编造事实/不做哀伤治疗
- Phase 12.1：family 链路泛化前置审计完成，迁移计划已建立
- 下一步：Phase 12.2 新增 FamilyArtifactPreview（不替换主链路）
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
- GrowthReportApp / ReportPreview / LifeGraphPreview / components/family/**
- package.json / .env.local

建议从 .claude/handoff/current-task-handoff.md 第 7 节开始执行。
```
