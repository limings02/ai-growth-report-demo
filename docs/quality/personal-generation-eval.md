# Personal Memory 生成质量评测

> Phase 10.3 | 2026-05-19  
> 模型：deepseek-chat（见"已知配置问题"）  
> 样例数量：3 组虚构测试输入

---

## 1. 评测目标

Phase 10.2 已接入真实 AI 生成。本次评测目标：

- 验证 personal prompt 能否在不同材料丰富度下生成合理结果
- 检验事实忠实度（是否编造未给出的信息）
- 检验鸡汤化倾向（是否过度美化低谷、替用户做价值评判）
- 发现 prompt 质量问题并做小幅修正

---

## 2. 已知配置问题（重要）

**问题**：`.env.local` 中 `DEEPSEEK_MODEL=deepseek-v4-pro` 是推理模型（reasoning model），其输出在 `reasoning_content` 字段而非 `content` 字段。`callDeepSeek` 只读取 `choices[0].message.content`，因此对这个模型始终得到空响应，触发兜底错误。

**表现**：通过 `/api/generate-personal-memory` 调用时，所有请求均返回 500 错误或 fallback artifact（`voice: "fallback"`）。

**本次评测解决方法**：直接使用 `deepseek-chat` 模型调用 prompt，绕过 dev server，验证 prompt 本身的质量。

**修复建议**：在 `.env.local` 中将 `DEEPSEEK_MODEL` 改为 `deepseek-chat`（或其他非推理模型）。这是配置问题，不是代码 bug。

---

## 3. 评测维度

| 维度 | 说明 |
|------|------|
| JSON 合法性 | 输出是否能被 parseMemoryArtifact 解析 |
| 事实忠实度 | 是否编造用户未提及的地点、人物、时间、事件 |
| keywords 质量 | 是否具体，非空洞词汇 |
| summary 质量 | 是否有情绪底色，不模板化 |
| timeline 质量 | 是否具体，是否禁止编造 |
| longFormText 质量 | 是否像写给过去自己的信，是否克制不鸡汤 |
| socialPosts 质量 | 是否可用，语气是否对应 style |
| graph 质量 | node type 是否合法，relatedTo 是否合理 |
| qualityReview 质量 | riskOfFabrication 是否诚实，suggestions 是否具体 |

---

## 4. 测试样例与结果

### 样例 1：材料丰富型（大学四年）

**输入摘要**：
- personName: 阿远 | lifeStage: 大学四年 | timeRange: 2018-2022 | style: reflective
- 7 条问答（每条 20-60 字），freeNote（毕业答辩妈妈来了的画面）

**生成结果摘要**：

```
TITLE: 阿远的大学四年：从讨好到自在
KEYWORDS: ['焦虑', '学会拒绝', '独立旅行', '沙县炒饭', '图书馆', '平静']
TIMELINE: 4 条（2018年秋入学、2019年沙县时光、2021年夏独自云南、2022年6月毕业）
LONGFORM: 212字，voice: self-reflection
SOCIAL POSTS: 2 条
GRAPH NODES: 8个（subject/emotion/place/event/person×2/keyword）
RISK: low | TONE: 内省、平静、略带感激
```

**质量评估**：

| 维度 | 评估 | 备注 |
|------|------|------|
| JSON 合法性 | ✅ 通过 | 完全合法，可被 parseMemoryArtifact 解析 |
| 事实忠实度 | ✅ 优秀 | keywords 均来自原始回答；timeline 使用用户提及的事件 |
| keywords | ✅ 具体 | 「沙县炒饭」「学会拒绝」比「成长」「奋斗」具体得多 |
| summary | ✅ 有情绪底色 | 四段，有「从焦虑到平静」的过渡，没有模板腔 |
| timeline | ✅ 具体 | 六条，时间用「2018年秋」「大三某个学期」等模糊时间，不编造具体日期 |
| longFormText | ✅ 克制 | 写给「过去的阿远」，没有承诺未来，没有「你一定会」 |
| socialPosts | ✅ 可用 | 两条，语气符合 reflective style |
| graph | ✅ 类型合法 | 8 个节点，类型均在允许列表内 |
| qualityReview | ✅ 诚实 | risk: low，suggestions 指向了具体缺失（云南细节、男生的影响）|
| **鸡汤检查** | ✅ 通过 | 未发现「一定」「礼物」「充满意义」等词 |

---

### 样例 2：材料稀疏型（第一份工作）

**输入摘要**：
- personName: 小敏 | lifeStage: 第一份工作 | timeRange: 2021-2022 | style: documentary
- 2 条简短回答 + 1 句 freeNote（「做了一年多就离职了」）

**生成结果摘要**：

```
TITLE: 小敏的第一份工作
KEYWORDS: ['职场规则', '实际', '累', '离职', '一年多']
TIMELINE: 3 条（入职、职场适应期、离职）
LONGFORM: 120字
RISK: low （⚠ 应为 medium）
WEAKNESSES: ['材料较少，细节不丰富', '情感描述较单一', '缺少具体事件']
SUGGESTIONS: ['补充具体的工作内容或项目', '描述一个难忘的瞬间', '说明离职的具体原因']
```

**质量评估**：

| 维度 | 评估 | 备注 |
|------|------|------|
| JSON 合法性 | ✅ 通过 | |
| 事实忠实度 | ✅ 通过 | 没有编造行业、城市、同事信息 |
| keywords | ⚠ 过于平淡 | 「职场规则」「实际」「累」过于抽象，但材料确实太少 |
| summary | ⚠ 较单薄 | 只有两三句，因为材料少，这是合理结果 |
| timeline | ⚠ 泛化 | 「职场适应期」不是具体事件，但材料不足时合理 |
| longFormText | ✅ 克制 | 120字，没有过度填充，没有鸡汤 |
| **qualityReview 问题** | ❌ risk 评估偏低 | 只有 2 条短回答，risk 应为 medium 而非 low |
| suggestions | ⚠ 可以更具体 | 只有 3 条，未指向「具体人物」「地点」「物品」 |

**发现的问题**：
- `riskOfFabrication` 在材料极少时仍被评为 `"low"` ——说明 prompt 对"诚实评估"标准描述不够清晰
- `suggestionsForBetterInput` 缺少对人物/地点/物品等具体方向的指引

---

### 样例 3：低谷/转折型（搬去新城市那一年）

**输入摘要**：
- personName: 晓棠 | lifeStage: 搬去新城市那一年 | timeRange: 2020.03-2021.03 | style: warm
- 4 条回答（包含发高烧事件、安静的孤独、邻居分垃圾），freeNote 说明「和自己的关系变了」

**生成结果摘要**：

```
TITLE: 晓棠的搬去新城市那一年
KEYWORDS: ['一个人生活', '安静的孤独', '发高烧', '邻居', '分垃圾', '自己挂号', '出租车上的眼泪']
TIMELINE: 4 条（搬家、发高烧、邻居善意、一年之后）
LONGFORM: 446字，voice: self-reflection
RISK: low | TONE: 温暖、内省、安静
鸡汤检查: CLEAN
```

**质量评估**：

| 维度 | 评估 | 备注 |
|------|------|------|
| JSON 合法性 | ✅ 通过 | |
| 事实忠实度 | ✅ 优秀 | 没有编造城市、同事、具体地点 |
| keywords | ✅ 有质感 | 「出租车上的眼泪」「分垃圾」来自原始材料，非常具体 |
| summary | ✅ 克制 | 有底色感，「不是变好了，而是变得不同了」完整保留了原始表达 |
| timeline | ✅ 具体 | 4 条，用「2020年某个冬夜」不编造精确日期 |
| longFormText | ⚠ 一处可商榷 | 「你比自己想象的要坚韧得多」接近替用户做评价 |
| graph | ✅ 类型合法 | emotion 字段丰富（「安静的孤独」「脆弱又坚强」） |
| qualityReview | ✅ 整体诚实 | weaknesses 指出 timeline 只有 4 条 |
| **鸡汤检查** | ✅ 基本通过 | 但「坚韧」这类评价词仍出现在信件中 |

**发现的问题**：
- 信件中「你比自己想象的要坚韧得多」是轻微的替用户做价值评判
- prompt 已有规则「不说"你当时做的是对的"」，但缺乏对「坚韧/勇气/更强」等评价词的明确限制

---

## 5. Prompt 调整记录

### Phase 10.3 调整（2026-05-19）

**修改文件**：`.skills/personal-memory/prompts/03_quality_rules.md`

**调整 1：riskOfFabrication 评估标准更清晰**

之前的描述比较主观（"丰富材料"），模型容易因为"生成内容写得不错"就给 `low`。

新增了基于回答数量的量化标准：
- low：4 条以上具体回答 + freeNote 有细节
- medium：1-3 条回答，或回答普遍简短（≤20字）
- high：几乎没有实质内容
- 明确说明：**评估材料丰富度，不是生成质量**

**调整 2：suggestionsForBetterInput 要求更具体**

新增要求：至少 3 条，并明确指向地点/人物/物品/具体事件/情绪细节。

**调整 3：信件评价词限制**

新增示例，明确「坚韧」「勇气」类词是价值评判，不应出现：
- ✗「你比自己想象的要坚韧得多」
- ✓「那段时间不容易，但你撑过来了」

---

## 6. 验收结论

### 整体评价

`deepseek-chat` + personal prompt 组合的生成质量在**材料丰富时表现优秀**：

- 事实忠实度高（三组均无编造）
- keywords 具体（样例1/3 均来自原始材料）
- 鸡汤化程度低（主要问题是信件中的评价词，已修正 prompt）

**主要问题**：

| 问题 | 严重度 | 状态 |
|------|--------|------|
| `deepseek-v4-pro` 是推理模型，空响应 | 🔴 高 | 配置问题，需用户修改 .env.local |
| 稀疏材料时 riskOfFabrication 偏低 | 🟡 中 | 已修正 prompt |
| 信件中轻微评价词（「坚韧」） | 🟡 中 | 已修正 prompt |
| suggestionsForBetterInput 不够具体 | 🟡 中 | 已修正 prompt |
| timeline 稀疏（样例2 只有 3 条模糊事件） | 🟢 低 | 材料本身不足，行为正确 |

### 下一步建议

1. **立即处理**：用户需将 `.env.local` 中 `DEEPSEEK_MODEL` 改为 `deepseek-chat`
2. **Phase 10.4**：考虑升级 PersonalMemoryGraphPreview 为 SVG 星图
3. **可选**：在 `callDeepSeek` 中增加对 `reasoning_content` 的 fallback 读取，提升对推理模型的兼容性（但这属于 runtime 改动，需要单独阶段）
