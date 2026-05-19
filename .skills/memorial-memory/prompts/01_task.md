## 输入材料

你将收到一个 `MemoryRawMaterial` JSON，其中 mode 为 "memorial"。

输入对象包含：

- `mode`：必须是 "memorial"
- `subject`：纪念主题（title / primaryName / timeRange）
- `participants`：通常包含 deceased（被纪念者）和 narrator（撰写者）
- `style`：文稿风格（documentary / warm / solemn / family）
- `media`：媒体描述，只含数量，不含实际文件
- `qaList`：家人回答的纪念问题
- `freeNote`：用户自由记录
- `domainPayload.deceasedName`：被纪念者称呼
- `domainPayload.narratorName`：撰写者称呼（可选）
- `domainPayload.relationship`：你们的关系
- `domainPayload.timeRange`：时间跨度

**读取优先级：**

1. `qaList` 中的具体回答（最有价值的材料）
2. `freeNote`（用户自由补充）
3. `subject` / `domainPayload`（基础信息）

## 任务

请生成标准 `MemoryArtifact` JSON，包含以下内容：

### narrative.title

格式建议：「{deceasedName}的纪念册」或自然变体。
可以根据 relationship 和 style 调整，但不要模仿逝者说话。

### narrative.keywords

5-8 个关键词，必须从真实材料中提炼：
- 可以是 ta 的习惯、物品、地点、称呼、关系、情感底色
- 不要写「思念」「爱」这类空洞词汇
- 如果材料很少，关键词可以少于 5 个，在 qualityReview 中说明

### narrative.summary

2-4 段人生故事整理：
- 用家人的视角叙述，不用逝者第一人称
- 有情感底色，但克制
- 如果有具体细节，使用它；如果没有，温和总结，不编造
- 段落间用 \n\n 分隔

### narrative.timeline

3-8 个人生片段或共同记忆节点：
- 每条包含 time（如「1960年代」「多年以后」）/ title（简短描述）/ description（2-3句，有感知）
- **材料没给具体年份，用模糊时间**，如"那时""很多年前""青年时期"
- 禁止编造用户未提及的具体时间、地点、事件
- 材料不足时可以少于 3 条，在 qualityReview 中说明

### narrative.longFormText

- `title`：纪念文标题，如「写给家人的纪念文」或自然变体
- `content`：纪念文，至少 200 字
- `voice`："memorial-tribute"
- 以撰写者（narrator）视角写，不以逝者视角写
- 描述的是"从家人眼中看到的 ta"，不是"ta 对你们说的话"
- 末尾用 timeRange 或纪念撰写时间作为落款

### narrative.socialPosts

1-3 条纪念页文案：
- 标题可以是：「家庭纪念」「清明 · 留念」「给后辈的记录」
- 每条 30-100 字
- 克制，不营销，不煽情
- 不要出现"永远"的过度承诺

### graph

- `title`：纪念图谱标题，8字以内
- `subtitle`：20字以内，克制有质感
- `centerDescription`：20字以内，描述这份记忆的核心
- `nodes`：5-10 个节点，type 只能使用以下单个字符串之一：
  - `subject`：主角节点（被纪念者）
  - `person`：其他重要的人
  - `time`：时间节点
  - `event`：重要事件
  - `place`：地点
  - `emotion`：情绪底色
  - `keyword`：关键词
  - `memory`：记忆片段
  - `letter`：纪念文节点（可选）
  - `message`：话语（如 ta 常说的话）

### extensions.sourceTrace

- `usedQuestions`：实际使用的问题列表
- `usedFreeNote`：是否使用了 freeNote
- `missingContext`：缺失哪些材料影响了质量
- `groundingNotes`：说明哪些内容有依据，哪些是温和总结

### extensions.qualityReview

- `riskOfFabrication`："low" | "medium" | "high"
  - low：用户提供了 4 条以上具体回答，且 freeNote 有细节
  - medium：用户只有 1-3 条回答，或回答普遍简短
  - high：材料很少，大量内容基于模板总结
  - 评估的是材料丰富度，不是生成质量
- `emotionalTone`：情绪基调描述
- `weaknesses`：诚实列出内容不足
- `suggestionsForBetterInput`：至少 3 条，指向地点/人物/物品/具体场景/话语细节

## 输出要求

只输出严格 JSON。
不要输出 Markdown。
不要输出代码块（不要有 ```json 或 ```）。
不要输出任何解释文字。
第一个字符必须是 `{`。
最后一个字符必须是 `}`。
