## 输入材料

你将收到一个 JSON 对象，这是 family mode 的 MemoryRawMaterial。

当前 family mode 的第一个可运行场景是：孩子成长记录 / 亲子成长礼物。

输入对象可能包含：

- mode: 必须是 "family"
- subject: 记忆主题（title / primaryName / timeRange）
- participants: 参与者列表，通常包含 child 和 parent
- style: 文案风格（warm / playful / documentary / literary）
- media: 媒体描述，只包含数量和说明，不包含真实文件或 URL
- qaList: 访谈问答
- freeNote: 自由文本
- domainPayload: family 专属字段（childName / childAge / reportYear / parentName）
- legacyFamilyInput: 过渡兼容字段，包含旧 RawMaterial 的关键字段

请**优先使用 legacyFamilyInput** 中的字段：

- legacyFamilyInput.childName → 孩子昵称
- legacyFamilyInput.childAge → 孩子年龄
- legacyFamilyInput.reportYear → 报告年份
- legacyFamilyInput.parentName → 父母称呼（用于信件署名）
- legacyFamilyInput.photoCount → 照片数量（只作参考，不能看到照片内容）
- legacyFamilyInput.qaList → 访谈问答
- legacyFamilyInput.freeNote → 自由文本

如果 legacyFamilyInput 缺失或字段为空，再从以下位置推断：

- childName：domainPayload.childName 或 subject.primaryName
- childAge：domainPayload.childAge
- reportYear：domainPayload.reportYear 或 subject.timeRange（转为数字）
- parentName：domainPayload.parentName 或 participants 中 role=parent 的 name
- photoCount：media 中 type=photo 的 count
- qaList：顶层 qaList
- freeNote：顶层 freeNote

## 任务

请生成一份孩子成长礼物，输出完整 GrowthMemoryArtifact JSON。

内容要求如下：

### 1. report

- **title**：格式为「{childName}的 {reportYear} 成长礼物」，或自然的变体（如「写给三岁的{childName}」）
- **keywords**：3-5 个关键词，必须从用户真实回答中提炼，不要写「成长」「爱」这种空洞词汇
- **yearlySummary**：3-4 段年度总结，每段 2-4 句，合计至少 200 字，必须基于 qaList 和 freeNote 的真实回答；段落之间用 \n\n 分隔
- **timeline**：3-5 条重要瞬间，每条包含：
  - time：月份或季节，如 "3月"、"暑假"
  - title：简短事件标题（10 字以内）
  - description：2-3 句描述，有温度
- **letter**：以 parentName 的身份写给孩子的信，至少 200 字，视角始终是父母；末尾用 parentName 署名并标注 reportYear 年；段落间用 \n\n 分隔
- **socialPosts**：3 条分享文案，标题分别为「温暖版」「走心版」「简洁版」，内容 50-150 字
- **skillStatus**：所有字段设为 "done"

### 2. graph

- **title**：8 字以内，有情感温度
- **subtitle**：20 字以内，诗意
- **centerDescription**：20 字以内，描述中心节点
- **nodes**：3-8 个节点，每个节点包含：
  - type：只能是 "keyword" | "event" | "letter" | "memory"
  - label：5 字以内
  - description：20-30 字，有情感，不是简单事实
  - emotion：2-4 字的情绪词，如「温柔」「骄傲」「惊喜」
  - relatedTo：与其他节点 label 的关联（只填有真实关联的）

### 3. videoScript

- **title**：视频标题
- **duration**："30s" | "60s" | "90s"
- **scenes**：3-6 个场景，每个场景包含 order / visualSuggestion / narration / subtitle / emotion
- **musicMood**：背景音乐建议
- **endingLine**：结尾字幕

### 4. sourceTrace

- **usedQuestions**：实际使用的问题列表
- **usedFreeNote**：是否使用了 freeNote（布尔值）
- **missingContext**：缺失哪些信息影响了质量
- **groundingNotes**：哪些内容有直接依据，哪些是温和总结

### 5. qualityReview

- **riskOfFabrication**："low" | "medium" | "high"
- **emotionalTone**：情绪基调描述
- **weaknesses**：诚实列出内容不足
- **suggestionsForBetterInput**：告诉父母下次可以提供哪些信息

## 事实原则

- 禁止添加用户未提及的具体事件、地点、人物、疾病、成绩、日期
- 禁止把推测写成确定事实
- 信息不足时，timeline 可以只有 3 条且用季节性总结，不要凑数
- 不要为了温情而编造情节
- 不要暗示父母做得不够或时光流逝的遗憾
- 不要夸张神化孩子的成就

## 输出要求

只输出严格 JSON。
不要输出 Markdown。
不要输出代码块（不要有 ```json 或 ```）。
不要输出任何解释文字。
第一个字符必须是 `{`。
最后一个字符必须是 `}`。
