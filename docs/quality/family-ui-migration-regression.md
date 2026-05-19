# Family UI Migration Regression - Phase 12.4A.2

> 创建时间：2026-05-19  
> 验收完成：2026-05-19（Phase 12.4A.2）  
> 验收方式：真实 API 调用（deepseek-v4-pro + DEEPSEEK_THINKING=disabled）+ 代码静态分析

---

## 1. 背景

- Phase 12.4A 已将 family 默认结果页从 `ReportPreview` 切换为 `FamilyArtifactPreview`。
- `/api/generate-report` 仍返回 `GrowthMemoryArtifact`，前端本地调用 `growthArtifactToMemoryArtifact` 转为 `MemoryArtifact`。
- `ReportPreview` 仍保留作为 dev-only legacy fallback，可通过「🧪 查看旧版 ReportPreview」切换对比。
- 本验收记录真实生成测试结果，为进入 Phase 12.4B 提供判断依据。

---

## 2. 验收范围

用代码静态分析对比新旧版能力：

| 能力 | 旧 ReportPreview | 新 FamilyArtifactPreview | 是否通过 | 备注 |
|------|-----------------|--------------------------|---------|------|
| 封面标题 | ✅ report.title | ✅ narrative.title | ✅ | 字段映射正确 |
| 关键词 | ✅ report.keywords | ✅ narrative.keywords | ✅ | 字段映射正确 |
| 年度总结 / summary | ✅ report.yearlySummary | ✅ narrative.summary | ✅ | 字段映射正确 |
| 时间线 | ✅ report.timeline | ✅ narrative.timeline | ✅ | 字段映射正确 |
| 给孩子的信 | ✅ report.letter | ✅ narrative.longFormText.content | ✅ | title 硬编码为"给未来的信"，可优化 |
| 分享文案 | ✅ report.socialPosts | ✅ narrative.socialPosts | ✅ | 字段映射正确 |
| 分享文案复制按钮 | ✅ 有 | ✅ MemorySocialPostsSection 有 | ✅ | |
| 成长星图 | ✅ LifeGraphPreview（child/year 类型）| ✅ FamilyMemoryGraphPreview（新 SVG）| ✅ | 新版增项，视觉更好 |
| 质量说明 | ✅ qualityReview | ✅ MemoryQualityReviewPanel | ✅ | 字段映射正确 |
| source trace / 溯源折叠 | ✅ sourceTrace | ✅ MemorySourceTraceDetails | ✅ | 字段映射正确 |
| 照片预览 | ✅ 有照片展示 | ✅ extraSections 照片区（print:hidden）| ⚠️ | 打印时隐藏，待后续优化 |
| 原始记录 | ✅ 独立 Tab 页（更完整）| ✅ extraSections 折叠区 | ⚠️ | 旧版 Tab 更详细；新版折叠区基本可用 |
| 返回修改（回到输入表单） | ✅ onBack → setAppState("input") | ✅ onBackToEdit → setAppState("input") | ✅ | Phase 12.4A.1 修复后正确 |
| 再做一本（清空重置） | ❌ 无此功能 | ✅ onCreateAnother 清空并返回 | ✅ | 新版增项 |
| 保存 PDF / 打印 | ✅ 有 PrintButton | ✅ MemoryPrintButton | ✅ | 照片/原始记录暂 print:hidden |
| 首页（onBackToHome） | ❌ 无 | ✅ onBackToHome=onBackToLanding | ✅ | 新版增项 |
| dev-only legacy 按钮 | N/A | ✅「🧪 查看旧版 ReportPreview」| ✅ | isDev 控制，production 不显示 |
| production 不显示 dev 按钮 | N/A | ✅ isDev=false | ✅ | process.env.NODE_ENV="production" |

---

## 3. 真实生成测试样例

**测试环境**：
- 模型：deepseek-v4-pro（DEEPSEEK_THINKING=disabled）
- 调用方式：curl → `http://localhost:3000/api/generate-report`

### 样例 A：丰富输入（2 问答 + freeNote）

```
childName: 小熊宝 | childAge: 5 | reportYear: 2024 | parentName: 爸爸妈妈
style: warm | photoUrls: ["blob:1","blob:2","blob:3"]
qa1: 今年最大变化 → "学会自己穿衣服，变得更独立了"
qa2: 最印象深刻的事 → "生病时他来给我盖被子"
freeNote: "感觉孩子突然懂事了很多，开始会保护弟弟分享玩具"
```

**生成结果**：HTTP 200，8297 bytes
- title：小熊宝的2024成长礼物 ✅
- keywords：['自己穿衣服', '独立', '盖被子', '感动', '五岁'] ✅（具体，来自材料）
- timeline：3 条（春天/自己穿衣服、秋天/病中的小暖男、冬天/我是小帮手）✅
- letter：418 字，以第二人称写给孩子，温暖有温度 ✅
- socialPosts：3 条（温暖版/走心版/简洁版）✅
- graph.nodes：5 个 ✅
- risk：medium（材料 2 条，评估合理）✅
- 无信件承诺滥用 ✅
- **growthArtifactToMemoryArtifact 所有字段映射通过** ✅

### 样例 B：最小可用输入（2 问答，无照片，freeNote 为空）

```
childName: 宝宝 | childAge: 3 | reportYear: 2024 | parentName: 妈妈
style: warm | photoUrls: [] | freeNote: ""
qa1: 今年最大变化 → "长高了"
qa2: 最印象深刻的事 → "会说你好了"
```

**生成结果**：HTTP 200，4926 bytes
- title：宝宝的三岁成长礼物 ✅
- keywords：['长高了', '会说你好了', '三岁'] ✅（来自材料）
- timeline：3 条（春天/又长高了一点点、夏天/第一声"你好"、秋天/爱说话的小人儿）✅
- letter：温柔，末尾"你永远都是妈妈最珍贵的宝贝"（家庭信件正常表达）✅
- socialPosts：✅；graph.nodes：3 个 ✅
- risk：medium（材料少，评估正确）✅
- weaknesses 诚实说明材料不足 ✅
- **growthArtifactToMemoryArtifact 所有字段映射通过** ✅

### 样例 C：长文本输入（2 个超长问答 + 长 freeNote）

```
childName: 小明 | childAge: 6 | reportYear: 2023 | parentName: 爸爸
style: literary | photoUrls: []
qa1（180字）：孩子开始喜欢阅读，主动翻书，问字的意思
qa2（190字）：跟小朋友闹矛盾后主动道歉，令人惊喜
freeNote（140字）：海边旅行，第一次看到海，说"世界有这么大"
```

**生成结果**：HTTP 200，7423 bytes
- title：写给六岁的小明 ✅（文学风格，有个性）
- keywords：['阅读', '道歉', '海', '好奇', '安静'] ✅（具体，来自材料）
- timeline：3 条（春天/爱上阅读、某一天/勇敢道歉、夏天/第一次看海）✅
- letter：以父亲视角写，引用"世界有这么大"原话，有文学感 ✅
- risk：low（材料丰富，评估正确）✅
- 无字段溢出，长文本处理正常 ✅
- **growthArtifactToMemoryArtifact 所有字段映射通过** ✅

---

## 4. 状态流转验证（代码静态分析）

| 流转 | 代码验证 | 结论 |
|------|---------|------|
| 生成完成 → 默认进入 FamilyArtifactPreview | `appState="result"` 时默认渲染 FamilyArtifactPreview（Phase 12.4A）| ✅ |
| 点「🧪 查看旧版 ReportPreview」→ 进入旧版 | `setShowLegacyReportPreview(true)` | ✅ |
| 旧版点「🌱 返回新版」→ 回新版 | `setShowLegacyReportPreview(false)` | ✅ |
| 旧版点「返回修改」→ 回输入 + 重置状态 | `setShowLegacyReportPreview(false); setAppState("input")` | ✅（Phase 12.4A.1 修复）|
| 新版点「返回修改」→ 回输入表单 | `onBackToEdit={() => setAppState("input")}` | ✅ |
| 新版点「再做一本」→ 清空并回输入 | `setArtifact(null); setRawMaterial(null); setFormData(defaultFormData); setShowLegacyReportPreview(false); setAppState("input")` | ✅ |
| 修改后重新生成 → 默认新版 | `handleGenerate()` 开头 `setShowLegacyReportPreview(false)` | ✅（Phase 12.4A.1 修复）|

---

## 5. Production 行为验证

- `npm run build`：**通过**（零错误）
- `isDev = process.env.NODE_ENV === "development"` → production 中值为 `false`
- production 分析：
  - `{isDev && ...}` 浮动按钮：**不渲染** ✅
  - `if (isDev && showLegacyReportPreview)` 分支：**不执行** ✅
  - 默认渲染 `FamilyArtifactPreview`：✅
  - 不渲染旧 `ReportPreview`：✅

---

## 6. 已知差异 / 待解决项

| 差异 | 描述 | 优先级 | 计划解决阶段 |
|------|------|--------|-------------|
| 照片打印 | 照片区 print:hidden，打印时不显示 | 低 | Phase 12.4B 后单独优化 |
| 原始记录打印 | 折叠区 print:hidden，打印时不显示 | 低 | Phase 12.4B 后单独优化 |
| 旧版原始记录 Tab vs 新版折叠区 | 旧版是独立 Tab 且展示更全（包含未过滤答案），新版是折叠区，交互不同但内容基本对等 | 低 | 可接受当前差异，Phase 12.4B 后评估 |
| 信件标题 | 新版固定为"给未来的信"；旧版可能更具体（如"给未来的小熊宝"）| 低 | 可在 growthArtifactToMemoryArtifact 中优化 |

---

## 7. 验收结论

- **验收日期**：2026-05-19
- **验收方式**：真实 API 调用（deepseek-v4-pro）+ 代码静态分析
- **npm run lint**：✅ 通过
- **npm run build**：✅ 通过
- **样例 A（丰富输入）**：✅ 通过，所有字段完整，转换映射正确
- **样例 B（最小输入）**：✅ 通过，不崩溃，空状态合理，qualityReview 诚实
- **样例 C（长文本输入）**：✅ 通过，长文本处理正常，文学风格保留
- **状态流转**：✅ 通过（Phase 12.4A.1 修复后全部正确）
- **production 行为**：✅ dev-only 按钮不渲染，默认 FamilyArtifactPreview
- **整体结论**：**有条件通过**（4 项低优先级已知差异，均可接受）
- **发现的问题**：（1）信件标题固定"给未来的信"可优化；（2）照片/原始记录打印待后续处理；（3）旧版原始记录 Tab 比新版更详细，但功能对等
- **是否允许进入 Phase 12.4B**：✅ **允许**（已知差异均为低优先级，不影响 API 迁移判断）
