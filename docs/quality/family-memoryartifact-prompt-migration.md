# Family MemoryArtifact Prompt Migration - Phase 12.5

> 完成时间：2026-05-20  
> 验证方式：真实 API 调用（deepseek-v4-pro + DEEPSEEK_THINKING=disabled）

---

## 1. 背景

- Phase 12.4B 已让 `/api/generate-report` 返回 `MemoryArtifact`（通过 `parseMemoryArtifact` 兼容路径转换旧格式）。
- Phase 12.5 将 `.skills/family-memory` 输出合约改为直接输出 `MemoryArtifact`，使 LLM 不再需要输出旧 `GrowthMemoryArtifact` 格式。
- 旧 `GrowthMemoryArtifact` 解析路径（`parseGrowthMemoryArtifact`）仍保留作为 rollback path，不删除。

---

## 2. 修改范围

| 文件 | 修改内容 |
|------|---------|
| `.skills/family-memory/prompts/01_task.md` | 任务从"输出 GrowthMemoryArtifact"改为"输出 MemoryArtifact"；字段名从 report/yearlySummary/letter 改为 narrative/summary/longFormText；videoScript/sourceTrace/qualityReview 移入 extensions |
| `.skills/family-memory/prompts/02_output_contract.md` | 输出合约从旧 `report + 顶层辅助字段` 改为标准 MemoryArtifact；明确禁止输出旧字段；明确必须输出的字段 |
| `.skills/family-memory/prompts/03_quality_rules.md` | 字段名对齐（sourceTrace → extensions.sourceTrace，qualityReview → extensions.qualityReview，letter → narrative.longFormText）|

---

## 3. API 验收标准

调用 `/api/generate-report` 后返回结构验证：

| 字段 | 期望 |
|------|------|
| 顶层 `mode` | `"family"` |
| 顶层 `narrative` | 存在 |
| 顶层 `report` | 不存在 |
| 顶层 `sourceTrace` | 不存在（已移入 extensions） |
| 顶层 `qualityReview` | 不存在（已移入 extensions） |
| 顶层 `videoScript` | 不存在（已移入 extensions） |
| `narrative.longFormText.voice` | `"parent-letter"` |
| `extensions.sourceTrace` | 存在 |
| `extensions.qualityReview` | 存在 |
| `extensions.videoScript` | 存在 |

---

## 4. 样例验收结果

**测试环境**：`deepseek-v4-pro`，`DEEPSEEK_THINKING=disabled`

### 样例 A：丰富输入（5问答 + freeNote）

```
childName: 小熊宝 | childAge: 5 | reportYear: 2024 | parentName: 爸爸妈妈
qa: 穿衣服/生病盖被子/游泳骑车/要爸爸休息/幼儿园毕业典礼
freeNote: 懂事了，学会体谅，会保护弟弟
```

**结果**：HTTP 200，8094 bytes
- 直接输出 MemoryArtifact：✅（LLM 未走旧格式路径）
- `mode: "family"` ✅，有 `narrative` ✅，无顶层 `report` ✅
- `narrative.title`："小熊宝的2024成长礼物" ✅
- `narrative.keywords`：['独立', '体谅', '坚持', '毕业典礼', '保护弟弟'] ✅（具体，来自材料）
- `narrative.summary` 251字 ✅
- `narrative.timeline` 4条 ✅
- `narrative.longFormText.voice`："parent-letter" ✅，content 386字 ✅
- `socialPosts` 3条 ✅
- `extensions.sourceTrace.usedQuestions` 5题，对应真实输入 ✅
- `risk: medium`（材料中等，评估合理）✅

### 样例 B：最小输入（2问答，无freeNote）

```
childName: 宝宝 | childAge: 3 | reportYear: 2024 | parentName: 妈妈
qa: 长高了 / 学会说你好了
freeNote: ""
```

**结果**：HTTP 200，5320 bytes
- 直接输出 MemoryArtifact：✅
- `narrative.keywords`：['长高', '学会说你好', '打招呼'] ✅（来自材料）
- `narrative.longFormText.voice`："parent-letter" ✅
- `risk: low` ⚠️（只有2条短回答，评估偏低；weaknesses 已诚实说明材料不足）
- `weaknesses`：正确指出材料有限，内容不丰富 ✅

**注**：`risk: low` 与材料量不匹配是一个小问题，已记录为 Phase 12.5.1 改进项。

### 样例 C：长文本输入（2长问答 + 长freeNote）

```
childName: 小明 | childAge: 6 | reportYear: 2023 | parentName: 爸爸
qa: 喜欢阅读问字（约180字）/ 主动道歉（约190字）
freeNote: 海边旅行，第一次看到海，说"世界真的很大"（约140字）
```

**结果**：HTTP 200，6397 bytes
- 直接输出 MemoryArtifact：✅
- `narrative.keywords`：['阅读', '主动道歉', '第一次看海'] ✅（具体，来自材料）
- `narrative.longFormText.voice`："parent-letter" ✅，content 359字 ✅
- `risk: medium` ✅（材料中等，评估合理）
- 无顶层旧字段 ✅

---

## 5. dev legacy fallback 验证

Phase 12.5 后，development 环境旧 `ReportPreview` fallback 通过以下路径仍可用：

```
MemoryArtifact
  → memoryArtifactToGrowthArtifact（Phase 12.4B 引入）
  → GrowthMemoryArtifact
  → ReportPreview（dev-only）
```

代码静态分析：`GrowthReportApp.tsx` 中 `isDev && showLegacyReportPreview` 分支调用 `memoryArtifactToGrowthArtifact(artifact)` ✅

---

## 6. 发现的小问题（Phase 12.5.1 改进项）

| 问题 | 严重度 | 说明 |
|------|--------|------|
| 样例 B（最小输入）`risk: low` 偏乐观 | 低 | 只有2条极短回答，risk 应为 medium；weaknesses 虽诚实但 risk 本身评估不一致 |
| `extensions.videoScript` 在最小输入时可能生成空内容 | 低 | 视频脚本参考价值有限，但结构存在 ✅ |

---

## 7. 结论

- **npm run lint**：✅ 通过
- **npm run build**：✅ 通过
- **样例 A（丰富）**：✅ 通过，LLM 直接输出标准 MemoryArtifact
- **样例 B（最小）**：✅ 通过，结构正确；risk 评估略偏低（记录为改进项）
- **样例 C（长文本）**：✅ 通过，长文本处理正常
- **旧格式 fallback**：✅ 不再被触发（LLM 直接输出新格式）
- **dev legacy ReportPreview**：✅ 代码路径确认可用
- **整体结论**：✅ Phase 12.5 通过
- **是否允许进入 Phase 12.5.1**：✅ 允许（建议先做小幅 prompt 质量调整）
