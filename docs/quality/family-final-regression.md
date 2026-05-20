# Family Final Regression - Phase 12.7

## 1. 背景

- Phase 12.6D 已完成 family MemoryArtifact 迁移全部清理。
- Phase 12.7A.1：3 组 API 样例验收 + 代码审计 + P1 小修。
- Phase 12.7B：照片区前移、图谱双标题修复、节点截断放宽、按钮文案统一。
- 重点从"架构正确"转向"产品是否像一份成长礼物"。

---

## 2. 验收环境

| 项目 | 结果 |
|------|------|
| 日期 | 2026-05-20 |
| 模型 | deepseek-v4-pro + DEEPSEEK_THINKING=disabled |
| npm run lint（Phase 12.7B 后）| ✅ 零错误 |
| npm run build（Phase 12.7B 后）| ✅ TypeScript 零错误，6 个 route 正常编译 |
| npm run dev | ✅ 正常启动 |
| 真实 DeepSeek API 调用 | ✅（3 组样例全部真实调用，Phase 12.7A.1）|
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
| 照片区展示 | **未浏览器验证** | Phase 12.7B 代码：位置已前移至封面后 |
| 原始记录折叠区 | **未浏览器验证** | Phase 12.7B 代码：仍在页面底部 |

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
| 打印预览 | **未浏览器验证** | Phase 12.7A.1 已修：quality/sourceTrace print:hidden |

**结论**：literary 风格正常工作，AI 能感知风格差异。

---

## 6. 产品体验评分

| 维度 | Phase 12.7A.1 前 | Phase 12.7B 后 | 备注 |
|---|---:|---:|---|
| 情绪感染力 | 4/5 | 4/5 | letter 开头礼物感好 |
| 事实可信度 | 4/5 | 4/5 | 丰富输入时高度贴近原文 |
| 视觉完整度 | 3/5 | 3/5 | 暖色调 cover 好；质量说明文案已软化 |
| 图谱价值 | 3/5 | 3.5/5 | 双标题已去除；节点截断从 5 改为 8 |
| 照片融合度 | 3/5 | 4/5 | 照片区已前移至封面后（代码确认）|
| 原始记录价值 | 4/5 | 4/5 | 折叠区归档感好，位置不变 |
| 打印 / 保存 PDF | 2/5 | 4/5 | quality/sourceTrace/photos/原始记录均 print:hidden |
| 分享文案价值 | 4/5 | 4/5 | 三条文案可直接复制 |

---

## 7. 问题状态总览

### 已修复（P1 + P2）

| 问题 | 修复阶段 | 说明 |
|---|---|---|
| quality/sourceTrace 出现在 PDF | Phase 12.7A.1 | 加 `print:hidden` |
| "幻觉风险" 技术标签 | Phase 12.7A.1 | 改为"参考可信度" |
| raw material style 显示英文值 | Phase 12.7A.1 | 加中文 lookup map |
| "首页"按钮文案不一致 | Phase 12.7A.1 | 改为"← 返回首页" |
| 照片区位置靠后 | Phase 12.7B | 前移至封面后（`afterCoverSections`）|
| 图谱双标题 | Phase 12.7B | 去掉 `graph.title` 展示 |
| 节点标签截断 5 字 | Phase 12.7B | 改为 8 字 |
| "再做一本"文案不一致 | Phase 12.7B | 顶部/底部统一为"再做一本" |

### 仍开放（P2）

| 问题 | 优先级 | 建议处理 |
|---|---|---|
| 照片未纳入 PDF 打印 | P2 | Phase 12.7C 专门设计打印 layout |

### 记录（P3）

| 问题 | 说明 |
|---|---|
| video script 无 UI 展示 | 功能缺失，不是 bug；Phase 13+ 规划 |

---

## 8. Phase 12.7B 实施记录

### 代码改动

| 文件 | 改动 |
|---|---|
| `MemoryArtifactPreview.tsx` | 新增 `afterCoverSections` 可选 prop；插入到 cover 之后、timeline 之前；底部"再做一本 ✨"→"再做一本" |
| `FamilyArtifactPreview.tsx` | 照片区 → `afterCoverSections`；原始记录 → `extraSections`（不变）；更新注释 |
| `FamilyMemoryGraphPreview.tsx` | 去掉 `graph.title` 展示；节点截断 5 → 8 |

### lint / build

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误 |

### 真实浏览器验证

**未完成**（需人工操作浏览器）

代码静态分析确认：
- `afterCoverSections` prop 正确传递，在 cover 和 timeline 之间渲染
- `extraSections` 位置不变（usage tips 之后）
- couple / personal / memorial 不传 `afterCoverSections`，不受影响
- 图谱：`graph.subtitle` 仍显示，`graph.title` 不再显示
- 节点 label：`truncate(node.label, 8)`
- 顶部和底部"再做一本"文案一致

---

## 9. 结论

| 检查项 | 状态 |
|--------|------|
| lint | ✅ |
| build | ✅ |
| P1 问题全部修复 | ✅ |
| P2 主要问题（照片位置、图谱标题）修复 | ✅ |
| 未修改 API / runtime / prompt 合约 | ✅ |
| 未恢复任何旧兼容层 | ✅ |
| couple / personal / memorial 不受影响 | ✅（afterCoverSections 为可选 prop）|
| 是否建议进入下一阶段 | ✅ **建议进入 Phase 12.7C 或 Phase 13** |

Phase 12.7B 完成后，family 结果页主要体验问题已全部处理。剩余唯一开放 P2 项是照片打印，需要专门的 print layout 设计。
