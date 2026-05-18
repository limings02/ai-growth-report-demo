## 输入材料

你将收到一个 `MemoryRawMaterial` JSON，其中 mode 为 "couple"。

输入对象包含：

- `mode`：必须是 "couple"
- `subject`：恋爱记忆主题（title / primaryName / timeRange）
- `participants`：通常包含 partnerA 和 partnerB
- `style`：文案风格（romantic / documentary / playful / literary）
- `media`：媒体描述，只含数量，不含实际文件
- `qaList`：用户回答的恋爱访谈问题
- `freeNote`：用户自由记录
- `domainPayload.chatText`：用户手动粘贴的聊天文本（可能为空）
- `domainPayload.partnerAName`：你的昵称
- `domainPayload.partnerBName`：TA 的昵称
- `domainPayload.relationshipTimeRange`：在一起的时间跨度
- `domainPayload.anniversaryDate`：纪念日（可选）

**读取优先级：**

1. `qaList` 中的具体回答（最有价值的材料）
2. `domainPayload.chatText` 中的聊天片段（注意：可能不完整，不要假设完整性）
3. `freeNote`
4. `subject` / `participants` / `relationshipTimeRange` / `anniversaryDate`

## 任务

请生成标准 `MemoryArtifact` JSON，包含以下内容：

### narrative.title

格式建议：「{partnerAName} 和 {partnerBName} 的{关系关键词}」或自然变体。
不要直接照抄 subject.title。

### narrative.keywords

5-8 个关系关键词，必须从真实材料中提炼：
- 可以是他们的称呼、暗号、习惯、地点
- 不要写「爱情」「幸福」这类空洞词汇
- 如果材料很少，关键词数量可以减少，在 qualityReview 中说明

### narrative.summary

3-5 段恋爱故事总结：
- 有情绪线，呈现关系的成长轨迹
- 如果有具体细节，使用它；如果没有，温和总结，不编造
- 段落间用 \n\n 分隔

### narrative.timeline

5-8 个恋爱节点：
- 每条包含 time（如"2021年夏天"）/ title（简短事件名）/ description（2-3句，有温度）
- 材料不足时可以少于5条，在 qualityReview 中说明
- 禁止编造用户未提及的具体时间、地点、事件

### narrative.longFormText

- `title`：信件标题，如「写给{relationshipTimeRange}的我们」
- `content`：周年信/写给未来你们的信，至少 200 字，以「写给未来的你们」开头
- `voice`："anniversary-letter"
- 末尾用 relationshipTimeRange 作为时间落款

### narrative.socialPosts

3 条分享文案：
- 标题分别是：温柔版、纪念日版、简洁版
- 每条 50-120 字
- 根据 style 调整语气

### graph

- `title`：关系星图标题，8字以内
- `subtitle`：20字以内，诗意
- `centerDescription`：20字以内，描述这段关系的核心
- `nodes`：5-10 个节点，type 可使用：
  - `person`：人物（双方昵称、共同朋友等）
  - `time`：时间节点
  - `event`：关系中的事件
  - `emotion`：情绪关键词
  - `message`：聊天里的话
  - `keyword`：关系关键词
  - `place`：地点
  - `memory`：记忆片段

### extensions.sourceTrace

- `usedQuestions`：实际使用的问题列表
- `usedFreeNote`：是否使用了 freeNote
- `missingContext`：缺失哪些材料影响了质量
- `groundingNotes`：说明哪些内容有依据，哪些是总结

### extensions.qualityReview

- `riskOfFabrication`："low" | "medium" | "high"
  - low：材料丰富，内容有充分依据
  - medium：材料一般，部分内容做了合理总结
  - high：材料很少，大量内容基于模板总结
- `emotionalTone`：情绪基调描述
- `weaknesses`：诚实列出内容不足
- `suggestionsForBetterInput`：告诉用户下次可以补充什么

## 输出要求

只输出严格 JSON。
不要输出 Markdown。
不要输出代码块（不要有 ```json 或 ```）。
不要输出任何解释文字。
第一个字符必须是 `{`。
最后一个字符必须是 `}`。
