# Family 链路泛化迁移计划

> 文档创建：Phase 12.1（2026-05-19）  
> 当前状态：Phase 12.6D 已完成。dev UI fallback、parse fallback、rollback path 均已清理。family MemoryArtifact 迁移全部完成。

---

## 1. 背景

当前 family mode 是最早上线的场景，其生成链路独立于 couple / personal / memorial 的通用链路。

其他三个 mode 已经：
- 直接输出标准 `MemoryArtifact`
- 复用 `MemoryArtifactPreview` 通用展示容器
- 共用 `runMemorySkill` 通用 runtime

而 family 仍维护一套兼容层：`GrowthMemoryArtifact` → `ReportPreview` → `LifeGraphPreview`。

本计划的目标是设计一条低风险迁移路线，让 family 最终也走通用链路，同时保证用户体验不回归。

---

## 2. 当前 family 旧链路

```
family 表单填写（GrowthReportApp）
  ↓ extractRawMaterial
RawMaterial（family-only 字段）
  ↓ fetch /api/generate-report
  ↓ runGrowthMemorySkill（wrapper）
    ↓ familyRawMaterialToMemoryRawMaterial
    ↓ runMemorySkill（通用 runtime）
      ↓ buildMemoryPrompt
      ↓ callDeepSeek → .skills/family-memory
      ↓ parseMemoryArtifact
        ├── 识别 GrowthMemoryArtifact 格式 → growthArtifactToMemoryArtifact
        └── 识别 MemoryArtifact 格式 → normalizeMemoryArtifact
    ↓ memoryArtifactToGrowthArtifact
GrowthMemoryArtifact（旧格式）
  ↓ GrowthReportApp.setState
  ↓ <ReportPreview artifact={...} rawMaterial={...} photos={...} />
    ↓ artifact.report（ReportData）展示成长报告
    ↓ <LifeGraphPreview rawMaterial={...} report={...} graphHints={...} />
      ↓ buildLifeGraph（wrapper → buildFamilyMemoryGraph → memoryGraphToLifeGraph）
      ↓ LifeGraphData 节点渲染
```

注意：`runGrowthMemorySkill` 内部已经走了通用 `runMemorySkill`，只是最后一步把结果转回 `GrowthMemoryArtifact` 给旧 UI 用。这是一个已经完成的中间状态。

---

## 3. 新 mode 标准链路（couple / personal / memorial）

```
表单填写（CoupleMemoryApp / PersonalMemoryApp / MemorialMemoryApp）
  ↓ fetch /api/generate-{mode}-memory
  ↓ {mode}RawInputToMemoryRawMaterial
  ↓ runMemorySkill
      ↓ buildMemoryPrompt → callDeepSeek → .skills/{mode}-memory
      ↓ parseMemoryArtifact → MemoryArtifact
MemoryArtifact（标准格式）
  ↓ <MemoryArtifactPreview artifact={...} graphSlot={<...GraphPreview />} />
```

---

## 4. 当前兼容层清单

| 兼容层 | 文件 | 职责 | 可删除条件 |
|--------|------|------|-----------|
| `runGrowthMemorySkill` | `lib/skill-runtime/runGrowthMemorySkill.ts` | `RawMaterial → GrowthMemoryArtifact` wrapper | ReportPreview 迁移后 |
| `GrowthMemoryArtifact` 类型 | `lib/skill-runtime/types.ts` | 旧前端消费的 artifact 类型 | ReportPreview/GrowthReportApp 迁移后 |
| `memoryArtifactToGrowthArtifact` | `lib/domains/family/artifactAdapter.ts` | MemoryArtifact → GrowthMemoryArtifact 降级 | `runGrowthMemorySkill` 删除后 |
| `growthArtifactToMemoryArtifact` | `lib/domains/family/artifactAdapter.ts` | GrowthMemoryArtifact → MemoryArtifact 升级 | `parseMemoryArtifact` family fallback 路径删除后 |
| `parseGrowthMemoryArtifact` | `lib/skill-runtime/parseGrowthMemoryArtifact.ts` | 旧格式解析兜底 | family-memory prompt 改为 MemoryArtifact 输出后 |
| `buildLifeGraph` wrapper | `lib/graph/buildLifeGraph.ts` | `buildFamilyMemoryGraph → LifeGraphData` 降级 | LifeGraphPreview 改名/替换后 |
| `LifeGraphData` 类型 | `lib/graph/types.ts` | 旧 LifeGraphPreview 渲染的数据结构 | LifeGraphPreview 替换为 MemoryGraphPreview 后 |
| `aiReportGenerator` | `lib/aiReportGenerator.ts` | 前端调用层，返回 `GrowthMemoryArtifact` | GrowthReportApp 迁移后 |
| `fallbackSkillDir: "growth-memory"` | `lib/memory-core/skillRegistry.ts` | family-memory 不存在时 fallback | family-memory 稳定后 |

---

## 5. 依赖 GrowthMemoryArtifact 的文件清单

| 文件 | 依赖方式 | 说明 |
|------|---------|------|
| `app/api/generate-report/route.ts` | 调用 `runGrowthMemorySkill`，返回值即为 `GrowthMemoryArtifact` | 迁移最后一步 |
| `components/GrowthReportApp.tsx` | `useState<GrowthMemoryArtifact>` | 消费 API 返回值 |
| `components/ReportPreview.tsx` | `props: { artifact: GrowthMemoryArtifact }` | 最核心的展示层 |
| `components/LifeGraphPreview.tsx` | 消费 `rawMaterial + report + graphHints`（均来自 GrowthMemoryArtifact.report） | 依赖旧字段结构 |
| `lib/aiReportGenerator.ts` | 返回类型 `GrowthMemoryArtifact`，被 GrowthReportApp import | 前端调用层 |
| `lib/skill-runtime/runGrowthMemorySkill.ts` | 生产 `GrowthMemoryArtifact`（wrapper，内部已走 runMemorySkill） | 迁移删除点 |
| `lib/skill-runtime/parseGrowthMemoryArtifact.ts` | 解析旧格式 JSON | `parseMemoryArtifact` 中 family fallback 路径调用 |
| `lib/skill-runtime/types.ts` | 定义 `GrowthMemoryArtifact` 类型 | 全项目引用点 |
| `lib/domains/family/artifactAdapter.ts` | 双向转换 adapter | 兼容层核心 |
| `lib/memory-core/parseMemoryArtifact.ts` | 识别旧格式并调用 `growthArtifactToMemoryArtifact` | 过渡兼容路径 |
| `.skills/family-memory/` | prompt 要求输出 `GrowthMemoryArtifact` 格式 | 迁移的起始点之一 |

---

## 6. family-memory / growth-memory skill 现状

### family-memory（当前可用）

文件：`.skills/family-memory/prompts/02_output_contract.md`

**当前要求输出：**
```json
{
  "artifactVersion": "0.1",
  "report": { ... },      ← GrowthMemoryArtifact 的旧 report 字段
  "graph": { ... },
  "videoScript": { ... },
  "sourceTrace": { ... },
  "qualityReview": { ... }
}
```

注意：`parseMemoryArtifact` 能识别这个旧格式并转换为 `MemoryArtifact`，再由 `runGrowthMemorySkill` 的 wrapper 转回 `GrowthMemoryArtifact`。所以 AI 实际输出是 `GrowthMemoryArtifact`，整个链路转了两次格式。

### growth-memory（保留为 fallback）

文件：`.skills/growth-memory/`

当前作为 `family` mode 的 `fallbackSkillDir`，当 `.skills/family-memory/` 主目录某个文件缺失时自动启用。这个 fallback 已经很旧，保留只是为了应急。

---

## 7. 迁移风险

| 风险 | 说明 | 风险等级 |
|------|------|---------|
| family 是最早上线模式 | 用户体验已被依赖，任何回归都是严重问题 | 🔴 高 |
| ReportPreview 内容复杂 | 除了生成内容外，还包含"原始记录"标签页（rawMaterial）、照片预览（photos）、朋友圈复制、打印逻辑，不是单纯的 MemoryArtifact 展示 | 🔴 高 |
| LifeGraphPreview 数据结构差异 | 依赖 `LifeGraphData`（含 `child`/`year` 等旧节点类型和 id 格式），而 `MemoryGraphHints` 用不同字段和类型。两套结构不等价 | 🟡 中 |
| GrowthMemoryArtifact ≠ MemoryArtifact | `GrowthMemoryArtifact.report` 包含 `ReportData`（keywords/yearlySummary/timeline/letter/socialPosts/skillStatus）；`MemoryArtifact.narrative` 字段名不同。转换时有信息损失 | 🟡 中 |
| family-memory prompt 改动 | 如果直接改 prompt 要求输出 MemoryArtifact，会影响 `parseMemoryArtifact` 的识别路径，需同步修改 | 🟡 中 |
| 照片本地预览逻辑 | `photos: PhotoItem[]` 是纯客户端照片预览，`ReportPreview` 用来展示但不上传。迁移时不能误认为需要传给 AI | 🟢 低（已有保障）|
| `/api/generate-report` 直接替换 | 这条路影响最广，应该最后做，且需要充分测试 | 🔴 高 |

---

## 8. 推荐迁移路线

迁移原则：
- **每个阶段独立可回滚**
- **旧 UI 在下一阶段验证稳定前保持可用**
- **不一步到位**

### Phase 12.2：创建 FamilyArtifactPreview，不替换主链路（已完成）

**目标**：新增一个能消费 `MemoryArtifact` 的 family 结果页，复用 `MemoryArtifactPreview`，但不接入主链路。

**已完成（Phase 12.2）**：
- 新增 `components/family/FamilyArtifactPreview.tsx`：`MemoryArtifact` 输入，复用 `MemoryArtifactPreview`，传入 family-specific 文案
- 新增 `components/family/FamilyMemoryGraphPreview.tsx`：轻量 SVG 成长星图（绿色配色，支持 12 节点 / 空状态 / 详情面板 / 打印摘要）
- **GrowthReportApp 和 /api/generate-report 未修改**

**验收**：lint/build 通过，不影响现有 family 功能。

---

### Phase 12.3：dev-only shadow preview（已完成）

**目标**：开发环境下，GrowthReportApp 结果页增加 dev-only 切换按钮，本地转换并用 `FamilyArtifactPreview` 预览；生产环境不显示。

**已完成（Phase 12.3）**：
- `GrowthReportApp` 新增 `showMemoryArtifactPreview` state 和 `isDev` 判断
- 当 `isDev && showMemoryArtifactPreview` 时，用 `growthArtifactToMemoryArtifact` 本地转换当前结果并渲染 `FamilyArtifactPreview`
- 旧 `ReportPreview` 右下角（`fixed bottom-4 right-4`）出现 dev-only 浮动按钮：「🔬 开发预览：查看 MemoryArtifact 版成长册」
- 生产 build 中 `isDev = false`，浮动按钮和 shadow preview 分支均不渲染
- `/api/generate-report` 未修改，默认 `ReportPreview` 渲染逻辑未修改

**验收**：lint/build 通过，dev 下可见 dev-only 按钮，生产 build 不渲染。

---

### Phase 12.4A：family 前端 UI 默认切换，不改 API（已完成）

**目标**：
- `/api/generate-report` 仍返回 `GrowthMemoryArtifact`
- `GrowthReportApp` 仍接收 `GrowthMemoryArtifact`
- 在 result 阶段默认将 `GrowthMemoryArtifact` 本地转换成 `MemoryArtifact`，渲染 `FamilyArtifactPreview`
- 保留 dev-only legacy fallback（可一键切回旧 ReportPreview 查看）
- 不修改 skill prompt，不修改 server API 返回格式

**已完成**：
- `GrowthReportApp` 默认渲染 `FamilyArtifactPreview`（本地 `growthArtifactToMemoryArtifact` 转换）
- `MemoryArtifactPreview` 新增 `extraSections` 插槽
- `FamilyArtifactPreview` 使用 `extraSections` 注入照片区（print:hidden）+ 原始记录折叠区（print:hidden）
- dev-only 浮动按钮「🧪 查看旧版 ReportPreview」可切回对比
- 旧版 ReportPreview 可切回「🌱 返回新版 FamilyArtifactPreview」
- production 不渲染 dev-only 按钮，不渲染旧 ReportPreview

**禁止（12.4A 阶段）**：
- **不修改 `/api/generate-report` 返回结构**
- **不修改 `.skills/family-memory` 输出合约**
- 不在未承接 rawMaterial/photos 前删除 ReportPreview

**验收**：family 默认显示 FamilyArtifactPreview；照片/原始记录/图谱/质量说明均可见；可一键切回旧 ReportPreview；`onBackToEdit` 真正返回输入表单；体验不回归。

---

### Phase 12.4B：family API 返回 MemoryArtifact（已完成）

**已完成**：
- 新增 `lib/domains/family/runFamilyMemorySkill.ts`：`RawMaterial → runMemorySkill → MemoryArtifact`
- `/api/generate-report` 改为调用 `runFamilyMemorySkill`，返回标准 `MemoryArtifact`
- `aiReportGenerator.generate()` 返回类型改为 `Promise<MemoryArtifact>`
- `GrowthReportApp` state 切换为 `MemoryArtifact | null`，主路径不再调用 `growthArtifactToMemoryArtifact`
- dev-only legacy fallback 通过 `memoryArtifactToGrowthArtifact` 转回旧格式给 `ReportPreview`
- `runGrowthMemorySkill` 保留作为 rollback path，不删除
- API 验证：两组真实样例均返回标准 MemoryArtifact，顶层无 `report`，有 `mode: "family"` 和 `narrative`

---

### Phase 12.4B.1：API 迁移后回归验收与小清理（已完成）

**目标**：
- 验证 API 返回 MemoryArtifact 后，family 前端主路径、dev fallback、错误响应、production 行为无回归
- 清理 Phase 12.4A/12.4B 遗留旧注释
- 在进入 Phase 12.5 之前建立明确准入标准

**已完成**：
- `components/GrowthReportApp.tsx` 旧注释修正（Phase 12.4A → 12.4B）
- `lib/aiReportGenerator.ts` 新增 `isMemoryArtifactLike` 结构防御（不引入新依赖）
- API 错误响应验证：缺少 childName → 400 + `{"error":"缺少孩子昵称"}` ✅；qaList < 2 → 400 ✅
- API 正常响应验证：mode=family，有 narrative，无 report，`isMemoryArtifactLike` 通过 ✅
- `docs/quality/family-api-memoryartifact-migration.md` 追加 12.4B.1 回归验收章节
- lint/build 通过

---

### Phase 12.5：family-memory prompt 改为直接输出 MemoryArtifact（已完成）

**已完成**：
- `01_task.md`：任务改为"输出 MemoryArtifact"；字段名全面更新；extensions 结构明确
- `02_output_contract.md`：输出合约改为标准 MemoryArtifact；禁止旧字段；必须输出新字段
- `03_quality_rules.md`：字段名对齐（sourceTrace/qualityReview → extensions.*）
- 三组真实生成样例均直接输出 MemoryArtifact（LLM 未走旧格式路径）
- 发现小问题：最小输入时 risk 评估偏乐观，记录为 Phase 12.5.1 改进项

**验收**：生成结果字段完整，质量不低于迁移前。

---

### Phase 12.5.1：prompt 迁移后质量微调（已完成）

**已完成**：
- `03_quality_rules.md`：riskOfFabrication 量化标准；videoScript 保守规则
- `01_task.md`：longFormText.title 优先包含 childName
- `02_output_contract.md`：补充 longFormText.title 建议
- 四组样例（丰富/最小/长文本/极稀疏）验收通过
- 最小输入 risk 从 low 修正为 medium ✅
- 极稀疏输入 videoScript 使用泛化画面建议 ✅
- Phase 12.6 清理候选引用审计完成（见 docs/quality/family-memoryartifact-prompt-quality-tuning.md）

---

### Phase 12.6A：清理计划与 dev fallback 取舍（已完成）

**已完成**：
- 新增 `docs/architecture/family-legacy-cleanup-plan.md`
- 完整引用审计（10 个符号，均无生产主路径引用）
- 决策：推荐方案 B（删除 dev fallback），分三步执行

---

### Phase 12.6B：删除 dev legacy UI fallback（已完成）

**已完成**：
- `GrowthReportApp.tsx`：移除 `showLegacyReportPreview` 状态、`ReportPreview` import、`memoryArtifactToGrowthArtifact` import、`isDev` 变量、dev-only 浮动按钮
- 删除 `components/ReportPreview.tsx`
- 删除 `components/LifeGraphPreview.tsx`
- 删除 `lib/graph/buildLifeGraph.ts`
- 删除 `lib/graph/types.ts`
- `grep` 验证：`ReportPreview` / `LifeGraphPreview` 代码引用 0；`buildLifeGraph` / `LifeGraphData` / `showLegacyReportPreview` 全部为 0
- lint/build 通过（TypeScript 零错误）
- **保留**：`artifactAdapter.ts`、`parseGrowthMemoryArtifact.ts`、`runGrowthMemorySkill.ts`（分步处理）

---

### Phase 12.6C：删除旧格式 parse fallback（已完成）

**已完成**：
- `parseMemoryArtifact.ts`：移除 `parseGrowthMemoryArtifact` import、`growthArtifactToMemoryArtifact` import、`childName`/`reportYear` 提取、JSON 失败 family fallback、`parsed.report` 分支；更新顶部注释
- 删除 `lib/skill-runtime/parseGrowthMemoryArtifact.ts`
- `artifactAdapter.ts`：删除 `growthArtifactToMemoryArtifact` 函数和 `toMemoryGraphNodeType` helper
- grep 验证：`parseGrowthMemoryArtifact` 代码引用 0；`growthArtifactToMemoryArtifact` 代码引用 0；`parsed.report` 代码引用 0
- API 验证：最小输入返回标准 MemoryArtifact（mode=family，has_narrative=True，has_report=False，longFormText.voice=parent-letter）✅
- lint/build 通过（TypeScript 零错误）

---

### Phase 12.6D：归档 rollback path（已完成）

**已完成**：
- 删除 `lib/skill-runtime/runGrowthMemorySkill.ts`、`buildGrowthMemoryPrompt.ts`、`loadSkillPrompt.ts`、`types.ts`
- 删除 `lib/domains/family/artifactAdapter.ts`（含 `memoryArtifactToGrowthArtifact`）
- 删除 `components/SkillReviewPanel.tsx`（孤立 dev panel）
- 清理 `skillRegistry.ts` `fallbackSkillDir`、`loadMemorySkillPrompt.ts` fallback 逻辑、`buildMemoryPrompt.ts` `legacyFamilyInput`
- 清理多个文件的过渡期注释
- `.skills/growth-memory/README.md` 更新为归档说明
- grep 全量验证：rollback 符号代码引用全部为 0
- lint/build 通过；API 验证 ✅

---

## 9. 每阶段验收标准

| 阶段 | 验收标准 |
|------|---------|
| Phase 12.2 | FamilyArtifactPreview / FamilyMemoryGraphPreview 组件存在，lint/build 通过，family 现有功能不变 |
| Phase 12.3 | development 环境可通过 shadow preview 查看 MemoryArtifact 版 family 结果页；production 不显示入口；默认 ReportPreview 主链路不变 |
| Phase 12.3.1 | shadow preview 承接 rawMaterial/photos；backLabel 透传；照片区 / 原始记录区可见；迁移验收说明文字在开发环境显示 |
| Phase 12.4A | ✅ 已完成：family 默认显示 FamilyArtifactPreview；照片/原始记录/图谱可见；dev-only 可切回旧 ReportPreview；/api/generate-report 未修改 |
| Phase 12.4B | ✅ 已完成：/api/generate-report 直接返回 MemoryArtifact；GrowthReportApp state 切换；API 格式验证通过 |
| Phase 12.4B.1 | ✅ 已完成：旧注释清理；aiReportGenerator 结构防御；API 错误响应验证；12.4B.1 回归通过 |
| Phase 12.5 | ✅ 已完成：family-memory 直接输出 MemoryArtifact，三组样例验收通过 |
| Phase 12.5.1 | ✅ 已完成：riskOfFabrication 量化修正，videoScript 保守规则，四组验收通过，引用审计完成 |
| Phase 12.6A | ✅ 已完成：清理计划制定，引用审计，dev fallback 取舍（推荐方案 B）|
| Phase 12.6B | ✅ 已完成：删除 dev legacy UI fallback（ReportPreview/LifeGraphPreview/buildLifeGraph/graph types）|
| Phase 12.6C | ✅ 已完成：删除旧格式 parse fallback（parseGrowthMemoryArtifact / growthArtifactToMemoryArtifact）|
| Phase 12.6D | ✅ 已完成：rollback path 全部清理，.skills/growth-memory 已归档 |

---

## 10. 禁止事项

- 不要一次性替换整个 family 链路
- 不要在 Phase 12.4A 中修改 `/api/generate-report` 返回结构
- 不要在 Phase 12.4A 中修改 `.skills/family-memory` 输出合约
- 不要在 Phase 12.4B 完成前修改 `.skills/family-memory/`
- 不要删除 `.skills/growth-memory/` 作为 fallback，直到 Phase 12.5 验证稳定后
- 不要在未承接 rawMaterial/photos 前删除 ReportPreview
- 不要忘记 `ReportPreview` 的"原始记录"标签页和照片预览——这些是 family mode 特有的功能，不能在迁移中丢失
- 不要在没有回滚路径的情况下修改 `/api/generate-report`
- 不要把 photos 传给 AI

---

## 附录：关键文件路径速查

```
app/api/generate-report/route.ts              # family API（禁止在 Phase 12.4B 之前修改）
lib/skill-runtime/runGrowthMemorySkill.ts      # wrapper（Phase 12.4B 之后可移除）
lib/skill-runtime/types.ts                    # GrowthMemoryArtifact 类型定义
lib/skill-runtime/parseGrowthMemoryArtifact.ts # 旧格式解析
lib/domains/family/adapter.ts                 # RawMaterial → MemoryRawMaterial
lib/domains/family/artifactAdapter.ts         # GrowthMemoryArtifact ↔ MemoryArtifact
lib/domains/family/buildFamilyMemoryGraph.ts  # 图谱构建（已基于 MemoryGraphData）
lib/graph/buildLifeGraph.ts                   # LifeGraphData wrapper（Phase 12.6 删除）
lib/graph/types.ts                            # LifeGraphData 旧类型
lib/aiReportGenerator.ts                      # 前端调用层（Phase 12.4 替换）
components/GrowthReportApp.tsx                # family 主状态机（Phase 12.4 修改）
components/ReportPreview.tsx                  # 当前 family 展示层（Phase 12.4 替换）
components/LifeGraphPreview.tsx               # 旧星图组件（Phase 12.6 替换）
.skills/family-memory/                        # 当前 prompt（Phase 12.5 修改输出合约）
.skills/growth-memory/                        # fallback（Phase 12.6 归档）
lib/memory-core/skillRegistry.ts              # fallbackSkillDir 配置（Phase 12.6 清理）
```
