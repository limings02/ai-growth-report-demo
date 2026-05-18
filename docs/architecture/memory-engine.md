# Memory Engine Architecture

> 这份文档为后续开发（Claude Code / Codex / 人工）提供架构上下文，不依赖长聊天记录。

---

## 1. 为什么要从 Growth Report 重构成 Memory Engine

原项目是一个孩子成长报告 demo，运行时代码到处都有 `childName`、`parentName`、`reportYear` 等 family-only 字段。

问题：
- 未来要支持 couple / personal / memorial 等完全不同的记忆场景
- 如果不泛化，所有场景都会被 family 的字段污染
- skill prompt 也会越写越乱，无法复用

解决思路：
- 统一输入层（`MemoryRawMaterial`），不同 mode 通过 domain adapter 接入
- 统一输出层（`MemoryArtifact`），不同 mode 的生成结果用同一种语言描述
- skill pack 按 mode 拆分，每个 mode 的 prompt 独立维护
- 旧前端通过 adapter 兼容，不需要立刻重写

---

## 2. 核心设计原则

| 原则 | 说明 |
|------|------|
| 小步重构 | 每次只做一层抽象，不推倒重来 |
| 不破坏旧 family 功能 | 每个阶段完成后 family 生成链路必须可用 |
| 新抽象先并存 | 新文件与旧文件并存，不立即替换 |
| 输入先统一，输出再统一 | MemoryRawMaterial 先于 MemoryArtifact 落地 |
| Skill pack 按 mode 拆分 | 每个 mode 独立维护 prompt 和输出合约 |
| 旧前端通过 adapter 兼容 | ReportPreview 暂时仍消费 GrowthMemoryArtifact |
| 照片不上传服务器 | 照片只在浏览器本地预览，永远不传给 AI |

---

## 3. 当前架构图

```
Family form（填写孩子信息 + 问答）
  │
  ▼
RawMaterial（旧 family-only 输入结构）
  │ familyRawMaterialToMemoryRawMaterial
  ▼
MemoryRawMaterial（通用输入层）
  │ buildMemoryPrompt
  ▼
ChatMessage[]（system + user）
  │ loadMemorySkillPrompts（按 mode 加载 skill pack）
  │   → .skills/family-memory/prompts/
  │   → .skills/growth-memory/（fallback）
  │ callDeepSeek
  ▼
LLM raw string
  │ parseMemoryArtifact
  │   → 识别 GrowthMemoryArtifact 格式 → growthArtifactToMemoryArtifact
  │   → 识别 MemoryArtifact 格式 → normalizeMemoryArtifact
  │   → 解析失败 → makeMinimalMemoryArtifact（兜底）
  ▼
MemoryArtifact（通用输出层）
  │ memoryArtifactToGrowthArtifact
  ▼
GrowthMemoryArtifact（兼容旧前端）
  │
  ├──▶ ReportPreview（成长报告）
  └──▶ LifeGraphPreview（成长星图）
```

---

## 4. Mode Registry

文件：`lib/memory-core/modes.ts`

注册四个 mode，每个 mode 包含：
- `id`：唯一标识
- `title` / `subtitle` / `description`：展示文案
- `emoji`：卡片图标
- `status`：`available` / `preview` / `coming_soon`
  - `available`：真实生成链路可用
  - `preview`：可体验前端流程或 mock 结果，但不代表真实 AI 生成
  - `coming_soon`：只展示占位说明
- `primaryUseCase`：核心使用场景说明

| mode | status | 说明 |
|------|--------|------|
| `family` | available | 完整可用，已接入真实生成 |
| `couple` | available | MVP 可生成，直接输出 MemoryArtifact，不经 GrowthMemoryArtifact 兼容层 |
| `personal` | available | Phase 10.2 MVP：真实 AI 生成，直接输出 MemoryArtifact，不经 GrowthMemoryArtifact 兼容层 |
| `memorial` | coming_soon | 占位，仅展示说明 |

`getMemoryModeConfig(mode)` 按 id 查找配置。

---

## 5. MemoryRawMaterial

文件：`lib/memory-core/types.ts`

```typescript
type MemoryRawMaterial = {
  mode: MemoryMode;           // 当前 mode
  subject: MemorySubject;     // 记忆主题（title / primaryName / timeRange）
  participants: MemoryParticipant[]; // 参与者列表（id / name / role）
  style: string;              // 生成风格
  media: MemoryMediaRef[];    // 媒体描述（只含数量，不含文件）
  qaList: MemoryQA[];         // 问答列表
  freeNote: string;           // 自由文本
  domainPayload?: Record<string, unknown>; // mode-specific 专属字段
}
```

**重要约束：**
- `media` 只记录 count / localOnly / description，永远不包含文件路径或 blob URL
- `domainPayload` 是 mode-specific 扩展区，长期可以保留少量 domain 专属字段，但不能滥用成「什么都往里塞」的垃圾桶。family 的 `childName` 等字段放在这里是合理的。
- `legacyFamilyInput` 是过渡兼容字段，未来 family-memory prompt 完全理解 MemoryRawMaterial 后可以删除；但 `domainPayload` 本身不会因此消失

**Family 特有的过渡字段 `legacyFamilyInput`**：
- 由 `buildMemoryPrompt` 在 `materialForLLM` 中注入
- 供旧 growth-memory prompt 识别 childName 等字段
- 后续 family-memory prompt 完全理解 MemoryRawMaterial 后，可删除

---

## 6. MemoryArtifact

文件：`lib/memory-core/types.ts`

```typescript
type MemoryArtifact = {
  artifactVersion: string;
  mode: MemoryMode;
  narrative: MemoryNarrative;    // 叙事层（title / keywords / summary / timeline / longFormText / socialPosts）
  graph: MemoryGraphHints;       // AI 图谱语义提示
  extensions: {
    videoScript?: unknown;
    sourceTrace?: MemorySourceTrace;
    qualityReview?: MemoryQualityReview;
    [key: string]: unknown;
  };
}
```

**当前 family 仍输出 GrowthMemoryArtifact 的原因：**

- `ReportPreview` 和 `LifeGraphPreview` 还在消费 `GrowthMemoryArtifact`
- Phase 4 的 `parseMemoryArtifact` 能识别旧格式并转换
- `runGrowthMemorySkill`（wrapper）最终再转回 `GrowthMemoryArtifact`，旧前端零改动

**注意区分两个图谱类型：**

| 类型 | 位置 | 说明 |
|------|------|------|
| `MemoryGraphHints` | `lib/memory-core/types.ts` | AI 输出的语义提示（情感语义）|
| `MemoryGraphData` | `lib/memory-core/graphTypes.ts` | 前端图谱渲染的节点/边数据 |

---

## 7. Domain Adapters

### 输入 adapter

| 文件 | 职责 |
|------|------|
| `lib/domains/family/adapter.ts` | `RawMaterial → MemoryRawMaterial` |
| `lib/domains/couple/adapter.ts` | `CoupleRawInput → MemoryRawMaterial`（当前用于 couple 真实生成链路）|
| `lib/domains/personal/adapter.ts` | `PersonalRawInput → MemoryRawMaterial`（占位）|
| `lib/domains/memorial/adapter.ts` | `MemorialRawInput → MemoryRawMaterial`（占位）|

### Artifact adapter（family）

| 文件 | 函数 | 方向 |
|------|------|------|
| `lib/domains/family/artifactAdapter.ts` | `growthArtifactToMemoryArtifact` | 旧 → 通用 |
| | `memoryArtifactToGrowthArtifact` | 通用 → 旧（供 wrapper 使用）|

节点类型转换：
- 正向：`AiGraphNodeType`（子集）→ `MemoryGraphNodeType`（超集），直接透传
- 逆向：`subject→child`, `time→year`, `person/message→memory`, `place→event`, `emotion→keyword`

### Graph adapter（family）

| 文件 | 函数 | 说明 |
|------|------|------|
| `lib/domains/family/buildFamilyMemoryGraph.ts` | `buildFamilyMemoryGraph` | `RawMaterial + ReportData → MemoryGraphData` |

节点类型映射：`child → subject`，`year → time`，其余类型不变。

---

## 8. Skill Runtime

### 通用入口

```
lib/memory-core/
  runMemorySkill.ts         → 入口：MemoryRawMaterial → MemoryArtifact
  buildMemoryPrompt.ts      → MemoryRawMaterial → ChatMessage[]
  parseMemoryArtifact.ts    → LLM string → MemoryArtifact（三层兜底）
  loadMemorySkillPrompt.ts  → 按 mode 加载 prompt 文件
  skillRegistry.ts          → mode → skillDir 映射
```

### Family fallback 规则

```
skillRegistry.ts:
  family.skillDir = "family-memory"
  family.fallbackSkillDir = "growth-memory"

loadMemorySkillPrompt:
  1. 查找 .skills/family-memory/
  2. 不存在则 fallback .skills/growth-memory/

task prompt 查找顺序：
  1. 01_task.md
  2. 01_growth_memory_task.md
```

### 旧兼容 wrapper

```typescript
// lib/skill-runtime/runGrowthMemorySkill.ts
export async function runGrowthMemorySkill(material: RawMaterial): Promise<GrowthMemoryArtifact> {
  const memoryMaterial = familyRawMaterialToMemoryRawMaterial(material);
  const memoryArtifact = await runMemorySkill(memoryMaterial);
  return memoryArtifactToGrowthArtifact(memoryArtifact);
}
```

---

## 9. Skill Packs

| 目录 | 状态 | 说明 |
|------|------|------|
| `.skills/family-memory/` | 当前可用 | 原生理解 MemoryRawMaterial，输出 GrowthMemoryArtifact |
| `.skills/growth-memory/` | 保留 fallback | 旧 RawMaterial 输入，不删除 |
| `.skills/couple-memory/` | 当前可用 | couple mode 真实 skill pack，输入 MemoryRawMaterial，直接输出 MemoryArtifact |
| `.skills/personal-memory/` | 当前可用 | personal mode 真实 skill pack（Phase 10.2），输入 MemoryRawMaterial，直接输出 MemoryArtifact |
| `.skills/memorial-memory/` | 占位 | 同上，文案克制尊重 |

每个 skill pack 包含：
- `SKILL.md`：输入/输出定义
- `prompts/00_system_role.md`
- `prompts/01_task.md`（或旧名 `01_growth_memory_task.md`）
- `prompts/02_output_contract.md`
- `prompts/03_quality_rules.md`

---

## 10. Graph Layer

```
MemoryGraphHints（AI 输出的图谱语义提示）
  └── 存在于 MemoryArtifact.graph
  └── 类型在 lib/memory-core/types.ts

MemoryGraphData（前端图谱渲染数据）
  └── 类型在 lib/memory-core/graphTypes.ts
  └── 由 buildFamilyMemoryGraph 生成

buildFamilyMemoryGraph（lib/domains/family/）
  └── RawMaterial + ReportData → MemoryGraphData

buildLifeGraph（lib/graph/buildLifeGraph.ts）
  └── 兼容 wrapper：调用 buildFamilyMemoryGraph → 降级回 LifeGraphData

LifeGraphPreview（components/LifeGraphPreview.tsx）
  └── 仍保留旧名字（有意兼容）
  └── NODE_CONFIG 已支持新节点类型：subject / person / time / place / message / emotion
  └── computeLayout 已兼容 subject/child、time/year
```

---

## 11. 当前仍然是过渡态的地方

详细说明见 [`current-transition-state.md`](current-transition-state.md)。

简要列表：

| 过渡态 | 说明 |
|--------|------|
| `family-memory` 仍输出 `GrowthMemoryArtifact` | 旧前端未泛化 |
| `runGrowthMemorySkill` 仍保留 | `/api/generate-report` 调用它，未改 |
| `ReportPreview` 仍消费 `GrowthMemoryArtifact` | 未泛化为 MemoryArtifactPreview |
| `LifeGraphPreview` 保留旧名字 | 未改名为 MemoryGraphPreview |
| `buildLifeGraph` 是 wrapper | 未删除，供 LifeGraphPreview 调用 |
| `.skills/growth-memory` 保留 | 作为 fallback，未删除 |

---

## 12. 后续迁移方向

1. **已完成（Phase 9.1~9.3）**：`components/memory/` 通用展示组件体系已建立
   - Phase 9.1：MemorySectionCard / MemoryPrintButton / MemoryQualityReviewPanel / MemorySourceTraceDetails
   - Phase 9.2：MemoryFallbackNotice / MemoryCoverSection / MemoryTimelineSection / MemoryLongFormSection / MemorySocialPostsSection / MemoryUsageTipsSection
   - Phase 9.3：`MemoryArtifactPreview`（完整页面 shell 容器，含 graphSlot 插槽）；`CoupleArtifactPreview` 已精简为薄 wrapper
2. **下一步**：personal / memorial mode 结果页可直接复用 `MemoryArtifactPreview`，只需传入 mode-specific 文案和 graphSlot
3. Relationship Galaxy 继续增强为更完整的可交互图谱
4. `family-memory` 改为直接输出 `MemoryArtifact`（移除 GrowthMemoryArtifact 输出合约）
5. `ReportPreview` 泛化为 `MemoryArtifactPreview`，消费 `MemoryArtifact`
6. `LifeGraphPreview` 改名为 `MemoryGraphPreview`，接收 `MemoryGraphHints` / `MemoryGraphData`
7. personal / memorial mode 按安全边界逐步开放
8. 稳定后再考虑删除 `GrowthMemoryArtifact` 兼容层、`buildLifeGraph` wrapper 和 `.skills/growth-memory` fallback
