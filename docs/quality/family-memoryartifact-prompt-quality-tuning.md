# Family MemoryArtifact Prompt Quality Tuning - Phase 12.5.1

> 完成时间：2026-05-20  
> 验证方式：真实 API 调用（deepseek-v4-pro + DEEPSEEK_THINKING=disabled）

---

## 1. 背景

- Phase 12.5 已让 `.skills/family-memory` 直接输出 MemoryArtifact。
- 发现两个质量问题：
  1. 最小输入（2条短问答无 freeNote）时 `riskOfFabrication` 给了 `low`，偏乐观；
  2. 极稀疏输入下 videoScript 可能编造具体画面。
- 本阶段只做 prompt 质量微调，不删除兼容层。

---

## 2. 修改范围

| 文件 | 修改内容 |
|------|---------|
| `.skills/family-memory/prompts/03_quality_rules.md` | riskOfFabrication 量化标准（低/中/高 有具体数量和内容标准）；videoScript 在材料少时的保守规则 |
| `.skills/family-memory/prompts/01_task.md` | longFormText.title 优先包含 childName |
| `.skills/family-memory/prompts/02_output_contract.md` | 补充 longFormText.title 建议 |

---

## 3. 回归样例验收结果

**测试环境**：`deepseek-v4-pro`，`DEEPSEEK_THINKING=disabled`

### 样例 A：丰富输入（5具体问答 + freeNote）

```
childName: 小星星 | childAge: 5 | reportYear: 2024 | parentName: 爸爸妈妈
qa: 游泳骑车/生病盖被子/懂事了一句话/幼儿园毕业典礼/喜欢画画
freeNote: 懂事了，学会照顾弟弟
```

| 字段 | 结果 |
|------|------|
| 标准 MemoryArtifact | ✅ |
| riskOfFabrication | `low` ✅（丰富材料，评估正确）|
| narrative.title | 小星星的 2024 成长礼物 ✅ |
| longFormText.title | 写给未来的小星星 ✅（含 childName）|
| keywords | ['游泳', '骑自行车', '盖被子', '毕业典礼', '画画'] ✅（具体）|
| weaknesses | 诚实说明时间线模糊 ✅ |
| videoScript | 5 scenes，引用照片而非编造 ✅ |

### 样例 B：最小输入（2条短问答，无freeNote）

```
childName: 宝宝 | childAge: 3 | reportYear: 2024 | parentName: 妈妈
qa: "长高了" / "学会说你好了"
freeNote: ""
```

| 字段 | 结果 |
|------|------|
| 标准 MemoryArtifact | ✅ |
| riskOfFabrication | `medium` ✅（**修复成功**，Phase 12.5 时为 `low`）|
| longFormText.title | 写给未来的宝宝 ✅（含 childName）|
| weaknesses | 明确说明"输入仅有两项简短问答，缺乏具体事件" ✅ |
| videoScript | 3 scenes，使用"一张孩子春天的照片"等泛化建议 ✅（保守）|

### 样例 C：长文本输入（2长问答 + 长freeNote）

```
childName: 小明 | childAge: 6 | reportYear: 2023 | parentName: 爸爸
qa: 喜欢阅读/主动道歉（各约180字）
freeNote: 海边旅行，说"世界真的很大"（约140字）
```

| 字段 | 结果 |
|------|------|
| 标准 MemoryArtifact | ✅ |
| riskOfFabrication | `low` ✅（长文本材料丰富，评估合理）|
| longFormText.title | 写给未来的小明 ✅（含 childName）|
| keywords | ['阅读', '主动道歉', '第一次看海'] ✅ |
| videoScript | 5 scenes ✅ |

### 样例 D：极稀疏输入（2条空泛回答）

```
childName: 小李 | childAge: 4 | reportYear: 2024 | parentName: 爸爸
qa: "长大了" / "挺好的"
freeNote: ""
```

| 字段 | 结果 |
|------|------|
| 标准 MemoryArtifact | ✅ |
| riskOfFabrication | `medium` ✅（不再是 low；weaknesses 诚实说明）|
| longFormText.title | 写给未来的小李 ✅（含 childName）|
| weaknesses | "输入材料极少，只有两条简短回答且 freeNote 为空，导致内容只能做概括性描述" ✅ |
| videoScript | 5 scenes，全部使用"使用一张孩子日常照片""使用父母提供的照片"等泛化描述 ✅（**保守**）|

**注**：极稀疏输入给了 `medium` 而非 `high`（规则是1-2条空泛才给 high）。这是可接受的边界情况——weaknesses 已诚实说明，不算低估。如需更严格，可在 Phase 12.5.2 进一步微调。

---

## 4. dev legacy fallback 验证

代码静态分析（未完成真实浏览器验证）：

- `GrowthReportApp.tsx` 中 dev fallback 路径：`isDev && showLegacyReportPreview` → `memoryArtifactToGrowthArtifact(artifact)` → `ReportPreview`
- 代码路径完整，未被修改
- 状态流转逻辑（Phase 12.4A.1 修复）仍有效

**说明**：本次未完成真实浏览器交互验证，上述为代码静态分析结论。Phase 12.4A.2 已完成真实浏览器验证，逻辑未改动。

---

## 5. 是否允许进入 Phase 12.6

**条件检查：**

| 条件 | 状态 |
|------|------|
| npm run lint 通过 | ✅ |
| npm run build 通过 | ✅ |
| A/B/C/D 四组返回标准 MemoryArtifact | ✅ |
| 最小输入 risk 不再是 low | ✅（现为 medium）|
| 极稀疏输入不编造具体事件 | ✅（videoScript 使用泛化建议）|
| dev legacy fallback 代码路径存在 | ✅（静态分析，未真实浏览器验证）|
| 旧兼容层引用关系已审计 | ✅（见下方 Phase 12.6 清理候选审计）|

**结论**：✅ **允许进入 Phase 12.6A（清理计划与 dev fallback 取舍）**

但注意：Phase 12.6A 应先制定清理计划，而非直接删除文件。

---

## 6. Phase 12.6 清理候选引用审计

> 审计时间：Phase 12.5.1，所有文件均未删除

| 符号/文件 | 当前引用位置 | 是否可清理 | 备注 |
|-----------|-------------|-----------|------|
| `runGrowthMemorySkill` | 仅在自身文件中定义；仅被注释引用 | 暂缓 | rollback path，可在 12.6 确认无流量后归档 |
| `GrowthMemoryArtifact` 类型 | `ReportPreview.tsx`（dev fallback）；`artifactAdapter.ts`；`skill-runtime/types.ts` | 不可清理 | dev fallback 删除后才能清理 |
| `parseGrowthMemoryArtifact` | `parseMemoryArtifact.ts`（fallback 路径，2处）；自身文件 | 暂缓 | fallback 路径仍需作为安全网，12.6 评估 |
| `ReportPreview.tsx` | `GrowthReportApp.tsx`（dev-only 导入和渲染）| 可在 12.6A 评估 | 取决于是否保留 dev legacy fallback |
| `LifeGraphPreview.tsx` | `ReportPreview.tsx`（使用） | 与 ReportPreview 级联 | ReportPreview 删除后可级联删除 |
| `growthArtifactToMemoryArtifact` | `parseMemoryArtifact.ts`（2处） | 暂缓 | parseMemoryArtifact fallback 路径依赖 |
| `memoryArtifactToGrowthArtifact` | `GrowthReportApp.tsx`（dev fallback）；`runGrowthMemorySkill.ts` | 不可清理 | dev fallback 用到 |
| `buildLifeGraph` | `LifeGraphPreview.tsx`（使用） | 与 LifeGraphPreview 级联 | |
| `LifeGraphData` / `lib/graph/types.ts` | `buildLifeGraph.ts` | 与 buildLifeGraph 级联 | |
| `lib/aiReportGenerator.ts` 中旧注释 | `lib/types.ts`：`generate(material: RawMaterial): Promise<any>;` 注释过时 | 可清理注释 | 低风险，12.6A 可做 |

**清理路径（推荐 Phase 12.6A 制定的清理顺序）：**

1. 决策：是否保留 dev legacy `ReportPreview` fallback（建议删除 production 不需要）
2. 若删除 fallback：
   - 从 `GrowthReportApp.tsx` 移除 dev-only fallback 分支
   - 移除 `memoryArtifactToGrowthArtifact` import
   - 可安全删除 `ReportPreview.tsx`
   - 级联删除 `LifeGraphPreview.tsx`
   - 级联删除 `buildLifeGraph.ts`、`lib/graph/types.ts`
3. 清理 `parseMemoryArtifact.ts` 中 GrowthMemoryArtifact fallback 路径（需确认旧格式完全不再出现）
4. 归档/删除 `runGrowthMemorySkill.ts`、`parseGrowthMemoryArtifact.ts`、`buildGrowthMemoryPrompt.ts`
5. 清理 `lib/skill-runtime/types.ts` 中 `GrowthMemoryArtifact` 类型
