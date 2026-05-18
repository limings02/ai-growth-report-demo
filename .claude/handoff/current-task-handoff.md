# Claude Code 会话交接文档

> 生成时间：2026-05-18  
> 当前阶段：Phase 10.2.1 已完成  
> 仓库：`limings02/ai-growth-report-demo`，分支 `main`

---

## 1. 当前任务目标

这是一个多阶段架构重构项目，目标是把单一孩子成长报告 demo 演化为 **multi-mode Memory Product**，支持 family / couple / personal / memorial 四种记忆主题。

**当前状态：**
- family：available，真实 AI 生成（GrowthMemoryArtifact 兼容链路）
- couple：available，真实 AI 生成，直接输出 MemoryArtifact
- personal：available，真实 AI 生成，直接输出 MemoryArtifact（Phase 10.2）
- memorial：coming_soon

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

---

## 3. 还没完成的 TODO

### 短期（优先级 1）
- [ ] **Phase 10.3**：打磨 personal 生成质量
  - 测试真实生成结果，调整 prompt
  - 增强 PersonalMemoryGraphPreview（可选，添加 SVG 图谱）
  - 打磨 PersonalLandingPage 情绪表达

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
  memorial-memory/                           # 占位
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

### 优先级 1：Phase 10.3 - personal 生成质量打磨
- 测试真实生成效果，观察 timeline/keywords/longFormText 质量
- 如质量不足，调整 .skills/personal-memory/prompts/
- 可选：升级 PersonalMemoryGraphPreview 为 SVG 图谱（参考 RelationshipGalaxyPreview）

### 优先级 2：family 链路泛化
- family-memory prompt 改为直接输出 MemoryArtifact
- ReportPreview 迁移为消费 MemoryArtifact + MemoryArtifactPreview

### 优先级 3：memorial mode preview 骨架（参考 Phase 10.1 路线）

---

## 8. 给新会话的启动提示词

```
你是这个项目的高级架构助手，正在接力一个 multi-mode Memory Product 的重构工作。

仓库：https://github.com/limings02/ai-growth-report-demo
当前分支：main，Phase 10.2 已完成，工作区干净，lint + build 零错误。

已完成：
- family / couple / personal 三个 mode 均可真实 AI 生成
- components/memory/ 完整通用展示体系（MemoryArtifactPreview 容器 + 10 个子组件）
- personal-memory skill pack 已从占位升级为真实 prompt

核心约束（不可修改）：
- family API / runtime / .skills/family-memory / .skills/couple-memory
- GrowthReportApp / ReportPreview / LifeGraphPreview / components/family/**
- package.json / .env.local

建议从 .claude/handoff/current-task-handoff.md 第 7 节开始执行。
```
