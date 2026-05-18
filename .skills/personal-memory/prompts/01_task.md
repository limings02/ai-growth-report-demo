## 输入材料

你将收到一个 `MemoryRawMaterial` JSON，其中 mode 为 "personal"。

输入对象包含：

- `mode`：必须是 "personal"
- `subject`：人生记忆主题（title / primaryName / timeRange）
- `participants`：通常包含 self（用户本人）
- `style`：文案风格（documentary / literary / reflective / warm）
- `media`：媒体描述，只含数量，不含实际文件
- `qaList`：用户回答的访谈问题
- `freeNote`：用户自由记录
- `domainPayload.personName`：用户名字或称呼
- `domainPayload.lifeStage`：人生阶段描述（如「大学四年」「第一份工作」）
- `domainPayload.timeRange`：时间跨度

**读取优先级：**

1. `qaList` 中的具体回答（最有价值的材料）
2. `freeNote`（用户自由补充）
3. `subject` / `domainPayload`（基础信息）

## 任务

请生成标准 `MemoryArtifact` JSON，包含以下内容：

### narrative.title

格式建议：「{personName} 的{lifeStage}」或自然变体。
不要直接照抄 subject.title，要有一点温度和个性。

### narrative.keywords

5-8 个关键词，必须从真实材料中提炼：
- 可以是那段时间的情绪、地点、习惯、口头禅、转折
- 不要写「成长」「奋斗」这类空洞词汇
- 如果材料很少，关键词可以少于 5 个，在 qualityReview 中说明

### narrative.summary

2-4 段人生阶段总结：
- 有情绪底色，呈现那段时期的质地
- 如果有具体细节，使用它；如果没有，温和总结，不编造
- 段落间用 \n\n 分隔

### narrative.timeline

4-8 个阶段事件节点：
- 每条包含 time（如「2019年秋」）/ title（简短事件名）/ description（2-3句，有感知）
- 材料不足时可以少于 4 条，在 qualityReview 中说明
- 禁止编造用户未提及的具体时间、地点、事件

### narrative.longFormText

- `title`：信件标题，如「写给{lifeStage}时的{personName}」或自然变体
- `content`：写给过去自己的信，至少 200 字
- `voice`："self-reflection"
- 语气：从当下回望过去，温柔而不滥情
- 末尾用 timeRange 作为时间落款

### narrative.socialPosts

2-3 条分享文案：
- 标题可以是：「朋友圈 · 阶段总结」「小红书 · 写给自己」「备忘录 · 留存」
- 每条 50-120 字
- 根据 style 调整语气

### graph

- `title`：个人记忆图谱标题，8字以内
- `subtitle`：20字以内，有质感
- `centerDescription`：20字以内，描述这段人生阶段的核心
- `nodes`：5-10 个节点，type 只能使用以下单个字符串之一：
  - `subject`：主角节点
  - `person`：重要的人
  - `time`：时间节点
  - `event`：重要事件
  - `place`：地点
  - `emotion`：情绪状态
  - `keyword`：关键词
  - `memory`：记忆片段

### extensions.sourceTrace

- `usedQuestions`：实际使用的问题列表
- `usedFreeNote`：是否使用了 freeNote
- `missingContext`：缺失哪些材料影响了质量
- `groundingNotes`：说明哪些内容有依据，哪些是总结

### extensions.qualityReview

- `riskOfFabrication`："low" | "medium" | "high"
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
