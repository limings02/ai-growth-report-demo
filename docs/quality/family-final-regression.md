# Family Final Regression - Phase 12.7

## 1. 背景

- Phase 12.6D 已完成 family MemoryArtifact 迁移全部清理。
- 本阶段验证 family 主链路的 API 质量 + 产品体验代码审计。
- 重点从"架构正确"转向"产品是否像一份成长礼物"。

---

## 2. 验收环境

| 项目 | 结果 |
|------|------|
| 日期 | 2026-05-20 |
| 模型 | deepseek-v4-pro + DEEPSEEK_THINKING=disabled |
| npm run lint | ✅ 零错误 |
| npm run build | ✅ TypeScript 零错误，6 个 route 正常编译 |
| npm run dev | ✅ 正常启动 |
| 真实 DeepSeek API 调用 | ✅（3 组样例全部真实调用）|
| 真实浏览器交互验证 | **未完成**（需人工操作浏览器）|

---

## 3. 样例 A：最小输入

**输入**：childName=小星星 / age=5 / year=2024 / 2 道短问答 / 无照片 / 无 freeNote

| 检查项 | 结果 | 备注 |
|---|---|---|
| API 正常返回 MemoryArtifact | ✅ | mode=family，has_report=False |
| title | ✅ | "小星星的 2024 成长礼物" |
| keywords | ✅ | ['自己穿鞋', '平衡车', '长高']（3 个，贴近输入）|
| summary | ✅ | 145 字，简短合理 |
| timeline_count | ✅ | 3 条 |
| letter_voice | ✅ | parent-letter |
| letter_title | ✅ | "写给未来的小星星"（含 childName）|
| socialPosts_count | ✅ | 3 条 |
| graph.nodes_count | ⚠️ | 3 个（较稀疏，但与输入相符）|
| qualityReview.risk | ✅ | medium（2 条短问答，评估正确）|
| sourceTrace.missingContext | ✅ | 诚实说明缺少具体细节 |
| 输入页可用 | **未浏览器验证** | 代码分析确认 |
| 无旧 ReportPreview 入口 | ✅ | 代码已删除 |

**结论**：API 层面全部正确。最小输入下内容相对简短，属于预期行为。

---

## 4. 样例 B：丰富输入 + 照片

**输入**：childName=豆豆 / age=6 / year=2024 / 5 道具体问答 / freeNote 170 字 / 4 张本地照片

| 检查项 | 结果 | 备注 |
|---|---|---|
| API 正常返回 MemoryArtifact | ✅ | |
| title | ✅ | "豆豆的2024成长礼物" |
| keywords | ✅ | ['一年级', '大海', '骑自行车', '恐龙画', '孝顺']（5 个，多样具体）|
| summary 情绪感 | ✅ | "第一天上学他自己背上书包，一滴眼泪都没掉，还反过来安慰爸爸妈妈"——贴近原文 |
| timeline_count | ✅ | 5 条（具体月份，如"9月"）|
| letter 开头 | ✅ | "亲爱的豆豆：这是2024年，你六岁的一年。爸爸妈妈想用这封信，为你存下这一年的光。" |
| letter_voice | ✅ | parent-letter |
| socialPosts_count | ✅ | 3 条 |
| graph.nodes_count | ✅ | 6 个 |
| graph.centerDescription | ✅ | "豆豆的2024年" |
| qualityReview.risk | ✅ | low（丰富输入）|
| videoScript | ✅ | 有标题，extensions 中存在 |
| 照片区展示 | **未浏览器验证** | 代码确认：3x2 grid，print:hidden |
| 原始记录折叠区 | **未浏览器验证** | 代码确认：默认折叠，可展开 |

**结论**：丰富输入下 AI 内容质量明显更好，letter 开头很有礼物感，timeline 具体到月份。

---

## 5. 样例 C：长文本输入（literary 风格）

**输入**：childName=小明 / age=7 / year=2024 / 3 道长问答 / freeNote 270 字 / 无照片

| 检查项 | 结果 | 备注 |
|---|---|---|
| API 正常返回 MemoryArtifact | ✅ | |
| title | ✅ | "小明的 2024 成长礼物" |
| keywords | ✅ | ['桥梁书', '游泳', '宇宙', '日记', '友谊']（5 个，层次丰富）|
| summary_len | ✅ | 400 字（长文输入后输出更丰富）|
| summary 情绪 | ✅ | "从图画书到桥梁书，他开始独自在睡前灯下探索恐龙和宇宙" |
| timeline_count | ✅ | 4 条 |
| letter_title | ✅ | "写给未来的小明" |
| letter_len | ✅ | 463 字（较长，体现 literary 风格要求）|
| graph_nodes | ✅ | 6 个 |
| qualityReview.risk | ✅ | low（内容扎实）|
| weaknesses | ✅ | "timeline 时间节点不够精确，只能写上半年/夏天"——诚实说明 |
| 打印预览 | **未浏览器验证** | 代码确认：quality/sourceTrace 会打印（见 P1 问题）|

**结论**：literary 风格正常工作，AI 能感知风格差异。长文本不会造成字段截断（API层）。

---

## 6. 产品体验评分（代码审计 + API 输出质量）

| 维度 | 分数 | 备注 |
|---|---:|---|
| 情绪感染力 | 4/5 | letter 开头、cover 渐变和词云有礼物感；summary 有时过于 AI 腔 |
| 事实可信度 | 4/5 | 丰富输入时高度贴近原文；最小输入时有概括填充 |
| 视觉完整度 | 3/5 | 暖色调 cover 好；质量说明/溯源 section 太技术感，破坏整体氛围 |
| 图谱价值 | 3/5 | 概念成立，节点有惊喜感；但最小输入时节点稀少，中心文字截断 |
| 照片融合度 | 3/5 | 照片区样式简洁，位置靠后（在 sourceTrace 之后）；未参与打印 |
| 原始记录价值 | 4/5 | 折叠区归档感好，不影响主流程 |
| 打印 / 保存 PDF | 2/5 | **技术 section（幻觉风险、内容溯源）会打印**，不适合作为礼物 PDF |
| 分享文案价值 | 4/5 | 三条文案风格各异，可直接复制 |

---

## 7. 发现的问题

### P1：明显影响体验

**P1-1：技术 section 会打印进 PDF（最影响礼物感）**

- `MemoryQualityReviewPanel`（"📊 生成质量说明"）和 `MemorySourceTraceDetails`（"🔍 查看内容溯源"）未设 `print:hidden`，会出现在礼物 PDF 里
- 父母把这份礼物打印给孩子，PDF 里会看到"幻觉风险：中"这种工程化标签，完全破坏礼物感

**修复方案**：在 `MemoryArtifactPreview.tsx` 中将这两个 section 包裹在 `<div className="print:hidden">` 里  
**风险**：极低，只加 CSS class，不改逻辑

**P1-2："幻觉风险" 标签对普通父母太技术**

- 父母看到"幻觉风险"会困惑或担心
- 即便隐藏了打印，这个词在页面上也出现时会影响信任感

**修复方案**：`MemoryQualityReviewPanel` 中将"幻觉风险"改为"参考可信度"，"📊 生成质量说明"改为"💡 内容参考说明"  
**风险**：极低，纯文案改动

### P2：可后续优化

**P2-1：raw material 区显示 `style: warm` 而非中文**

- "风格：warm"对父母来说是技术字段
- `FamilyArtifactPreview.tsx` 应将 warm/literary/simple 等值转换为中文展示

**P2-2：照片区位置靠后**

- 照片区（`extraSections`）位于 sourceTrace 之后、底部按钮之前，用户需要滑动到很底部才能看到
- 可以考虑提到 cover section 之后（但这需要改插槽位置，属于中等风险改动）

**P2-3：graph title/subtitle 与 section card title 重复**

- `MemorySectionCard title="🌿 成长星图"` 之后又显示 `graph.title`（例如"被爱点亮的这一年"），有双标题感

**P2-4："首页" 按钮文案略短**

- 顶部栏的 `首页` 按钮缺少"← 返回"前缀，和左边的"← 返回修改"不一致

### P3：记录但不急

**P3-1：节点标签截断到 5 个字**

- `truncate(node.label, 5)` 在中文里很保守，5 字会截断"成人礼"这样的词
- 可以考虑 8 个字

**P3-2："再做一本"在顶部和底部文案微不一致**

- 顶部："再做一本"（无 emoji）
- 底部："再做一本 ✨"（有 emoji）
- 统一即可

**P3-3：video script 无 UI 展示**

- AI 生成了 videoScript（见 Sample B），但前端没有展示入口
- 这是功能缺失，不是 bug；是未来功能

---

## 8. Phase 12.7A.1 小修实施（本阶段内）

本阶段直接修复 P1 问题：

| 修复项 | 文件 | 改动 |
|---|---|---|
| quality + sourceTrace 加 print:hidden | `MemoryArtifactPreview.tsx` | 包裹在 `<div className="print:hidden">` |
| "幻觉风险" → "参考可信度" | `MemoryQualityReviewPanel.tsx` | 文案改动 |
| "📊 生成质量说明" → "💡 内容参考说明" | `MemoryQualityReviewPanel.tsx` | 文案改动 |
| raw material style 转中文 | `FamilyArtifactPreview.tsx` | 加简单 lookup map |

---

## 9. Phase 12.7B 建议

**建议进入 Phase 12.7B：family 礼物感体验优化**

优先优化项（产品价值 > 技术代价）：

1. 照片区位置前移（移到 cover 之后）——用户应该在第一屏或第二屏就看到照片
2. 图谱双标题问题（去掉 graph.title 在 section card 内的重复显示）
3. graph 节点截断调整（5 → 8 字）

不建议做的项：

- 重写 MemoryArtifactPreview 布局（影响所有 4 个 mode）
- 改变打印 layout（需专门设计，不是小修）
- 新增 video script 展示（功能规划，不是体验打磨）

**更大方向**：family 产品稳定后，可考虑 Phase 13 人生 Wiki 数据层 / 多次生成历史保存。
