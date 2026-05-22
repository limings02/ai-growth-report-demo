# Input Comfort + Skill Quality Check — Phase 16.0

> 创建时间：Phase 16.0（2026-05-22）  
> 用途：填写安抚 + 生成质量人味化改动记录与验收

---

## 1. 四个输入页安抚机制

### components/memory/InputComfortNote.tsx（新增）

**Props**：`mode: "family" | "couple" | "personal" | "memorial"`, `variant?: "hero" | "mid-form" | "before-submit"`

| variant | 用途 | 外观 |
|---------|------|------|
| `hero` | 页面顶部，完整情绪安抚卡片 | 圆角卡片，含标题 + 两段正文 |
| `mid-form` | 表单中段，轻量安抚 | 单行小卡，只显示第一段正文 |
| `before-submit` | 生成按钮前，最小提示 | 纯文本一行，无卡片 |

各 mode 对应文案：

| mode | 标题 | 核心信息 |
|------|------|---------|
| family | 不用一次写完 | 礼物的价值来自你的真实记录；想象孩子未来打开时的表情 |
| couple | 不用整理全部聊天 | 只留一小段就够了；重要的是你愿意认真为这段关系准备 |
| personal | 先写几个还记得的片段 | 不用讲清楚人生；当时说不清，后来才看得懂 |
| memorial | 慢慢来，不用一次写完 | AI 只整理材料；你愿意留下的每一个片段都很珍贵 |

### 接入位置

| 输入页 | 接入位置 | variant |
|--------|---------|---------|
| GrowthReportApp（family）| 标题描述下方 | `hero` |
| CoupleMemoryApp | 标题描述段落下方 | `hero` |
| PersonalMemoryApp | 标题下方 | `hero` |
| MemorialMemoryApp | 标题下方 | `hero` |

---

## 2. 最小填写门槛可感知表达

### 门槛调整

| 输入页 | 原提示文案 | 更新后文案 |
|--------|----------|-----------|
| GrowthReportApp（family）| `还需要至少回答 2 个问题（已回答 N 个）` | `先写一点也可以——再回答 N 个问题就能生成初版` |
| CoupleMemoryApp | `请至少粘贴一段聊天文本、回答 1 个问题，或填写自由记录` | `先写一点也可以——粘贴一段聊天、回答 1 个问题，或写一段自由记录，就能生成初版` |
| PersonalMemoryApp | `请至少回答一个问题，或在自由记录里写一些内容` | `先写一点也可以——回答 1 个问题或写一段自由记录，就能生成初版` |
| MemorialMemoryApp | `请至少回答一个问题，或在自由记录里写一些内容` | `慢慢来——回答 1 个问题或写一段自由记录，就能生成初版` |

**注意**：最小门槛数值未改变（family 仍需 2 个问答，其余 1 个）。只改了语气，降低心理压力。

---

## 3. 问题级 hint 覆盖情况

### 字段设计

各 mode defaultQuestions 新增 `hint?: string` 字段：
- 只在 UI 显示（问题下方灰色小字 `✦ hint text`）
- 不传给 AI（adapter 仍只使用 `label`/`question` + `answer`）
- couple 的 `CoupleQuestion` 类型已新增 `hint?: string`
- personal 和 memorial 使用 TypeScript inference，不需要显式类型改动

### 覆盖范围

| mode | 问题数 | 全部有 hint |
|------|--------|-----------|
| family | N/A（使用 InterviewForm 的 placeholder，已有示例文案）| ✅ |
| couple | 7 | ✅ 全部 7 道 |
| personal | 7 | ✅ 全部 7 道 |
| memorial | 8 | ✅ 全部 8 道 |

### hint 显示组件实现

- CoupleMemoryApp：`{q.hint && <p>✦ {q.hint}</p>}` 在 label 和 textarea 之间
- PersonalMemoryApp：`{PERSONAL_DEFAULT_QUESTIONS[idx]?.hint && ...}` 访问原始问题的 hint
- MemorialMemoryApp：`{MEMORIAL_DEFAULT_QUESTIONS[idx]?.hint && ...}` 同上

---

## 4. skill prompt 质量规则修改摘要

### 修改范围

每个 mode 的 `.skills/*/prompts/03_quality_rules.md` 均追加了新章节：

**章节名**：`### 写作人格：记忆编辑师（Phase 16.0）`

### 通用写作原则（每个 mode 均有）

1. 具体胜过宏大：优先使用用户提供的动作、场景、语气、物件
2. 克制胜过煽情：不堆叠"爱、成长、珍贵、温暖"等空泛词
3. 像人写的：句子有长短变化，允许停顿，避免整齐模板句
4. 每段有一个具体细节支撑
5. 不编造：用"也许 / 像是 / 这让人感觉"处理无依据内容
6. 不教育用户 / 不道德绑架 / 不制造愧疚或英雄主义

### mode 特定写作原则

| mode | 特殊要求 |
|------|---------|
| family | 不制造父母愧疚；不暗示陪伴不够 |
| couple | 不对关系做判断；不给承诺 |
| personal | 低谷不是「礼物」；不替用户做价值判断 |
| memorial | 不替 ta 说话；不包装失去 |

### 反模板规则（通用）

新增"反模板规则"，列出具体禁止的模板句式及对应"更好的写法"示例。

### 输入不足诚实处理（强化）

每个 mode 新增了当 `riskOfFabrication` 为 medium/high 时：
- `weaknesses` 必须明确说明"材料较少，当前更像初版"
- `suggestionsForBetterInput` 包含 5 个具体补充方向（场景/原话/地点/人/时间）

---

## 5. memorial 边界检查

### 用户可见文案

| 检查项 | 状态 |
|--------|------|
| InputComfortNote memorial 文案不含高风险词 | ✅ |
| hint 文案不含高风险词 | ✅ |
| 新增 skill 反模板规则不含高风险词 | ✅ |

### skill prompt 安全性

- `03_quality_rules.md` 新增的"写作人格"章节中，反模板示例使用 `ta 虽然离开了`（虽然带引号的反例）——确认这是"禁止使用"的例子，不是正面建议
- 正向写法使用"从家人的记述里""这份记录没有试图重构 ta 的全部"等克制表达

---

## 6. 多模态 roadmap 状态

| 项目 | 状态 |
|------|------|
| 路线图文档 `docs/architecture/multimodal-memory-roadmap.md` | ✅ 已新增 |
| 图片上传到服务器 | ❌ 未实装 |
| 图片传给 AI | ❌ 未实装 |
| 用户手写图片说明 | ⬜ Phase 16.1 目标 |
| 视频生成文件 | ❌ 不做 |
| 视频脚本 Storyboard 增强 | ⬜ 未来 |

---

## Phase 16.0.1 补充（2026-05-22）

### mid-form / before-submit 接入完成情况

| 输入页 | hero | mid-form | before-submit |
|--------|------|---------|---------------|
| GrowthReportApp（family）| ✅ | ✅（InterviewForm 之前）| ✅（canGenerate 且内容少时）|
| CoupleMemoryApp | ✅ | ✅（chatText 和 questions 之间）| ✅（基本信息有效但无内容时）|
| PersonalMemoryApp | ✅ | ✅（问答区之前）| ✅（canGenerate 时）|
| MemorialMemoryApp | ✅ | ✅（问答区之前）| ✅（canGenerate 时）|

### family 最小门槛修改

| 项目 | Phase 16.0 | Phase 16.0.1 |
|------|------------|--------------|
| 前端 isFormValid | answeredCount >= 2 | answeredCount >= 1 **OR** freeNote.trim().length > 0 |
| API 校验（generate-report）| qaList.length < 2 → 报错 | qaList.length >= 1 **OR** freeNote 非空 → 允许 |
| 门槛提示文案 | 「还需要至少回答 2 个问题」| 「先写一点也可以——回答 1 个问题，或写一段自由记录，就能生成初版。」|

### family 常驻 hint 覆盖

InterviewForm.tsx 新增 `hints[]` 数组（并行于 `placeholders[]`），8 道默认题全部有 hint，显示在问题标题下方（`✦ 提示文字` 格式）。

### 生成质量回归执行情况

✅ **四个 mode 均执行了真实生成回归**。详见 `docs/quality/generation-regression/phase-16-0-1-results.md`。

综合评分：family 3.9 / couple 4.6 / personal 4.7 / memorial 4.9。Phase 16.0 prompt 改动效果显著。

---

## 7. lint/build 结果

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误（Phase 16.0 + Phase 16.0.1）|
| `npm run build` | ✅ 零 TypeScript 错误（Phase 16.0 + Phase 16.0.1）|

---

## 8. 已知限制

| 限制 | 说明 |
|------|------|
| family 问题 hint | family 使用 InterviewForm + placeholders，而非独立 hint 字段；placeholder 已有示例效果 |
| PersonalMemoryApp hint 访问方式 | 通过 `PERSONAL_DEFAULT_QUESTIONS[idx]?.hint` 访问，而非 qaList 自身字段（qaList 只存 question+answer）|
| MemorialMemoryApp 同上 | 同 personal 处理方式 |
| skill prompt 效果验证 | 需要真实调用四个 mode 生成对比测试（Phase 16.0.1）|
| InputComfortNote 动效 | 无动效，静态卡片；如需 reveal-up 可在后续阶段叠加 |
