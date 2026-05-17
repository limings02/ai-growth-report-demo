## 输入材料

你将收到一个 JSON 对象，包含以下字段：

```
childName      孩子昵称
childAge       孩子年龄（数字或空字符串）
reportYear     总结年份（数字）
parentName     父母称呼（如"妈妈"、"爸爸妈妈"）
style          文案风格：warm / playful / documentary / literary
photoCount     上传的照片数量（照片本身不会传给你，只有数量）
qaList         访谈问答列表，格式：[{ "question": "...", "answer": "..." }]
freeNote       父母的自由文字记录（日记、备忘录等，可能为空）
```

文案风格说明：
- warm：温暖细腻，像妈妈写给孩子的日记，充满柔软的爱意
- playful：俏皮活泼，有童趣，像从孩子视角看世界
- documentary：真实深情，克制但有力，像一份认真的成长档案
- literary：诗意悠远，有文学质感，像写给未来的一封长信

## 任务

请按照以下步骤生成内容，全部整合进一个 JSON 输出：

### 1. 生成成长报告（report）
- title：孩子昵称 + 年份 + 成长礼物
- keywords：3-5 个关键词，从材料中提炼，不要泛泛的词
- yearlySummary：3-4 段年度成长总结，每段用 \n\n 分隔（JSON 转义换行符），至少 200 字，基于真实回答
- timeline：3-5 条重要瞬间，每条有 time（时间标签）、title（标题）、description（1-2句描述）
- letter：父母以父母口吻（不是孩子口吻）写给孩子的信，至少 200 字，末尾用 parentName 署名并标注年份
- socialPosts：3 条朋友圈/小红书文案，每条有 title 和 content，风格分别为「温暖版」「走心版」「简洁版」

### 2. 生成成长星图语义节点（graph）
- title：给这张星图起一个浪漫的名字（8字以内）
- subtitle：一句诗意的副标题（20字以内）
- centerDescription：描述孩子这一年的核心状态（20字以内，会显示在中心节点）
- nodes：3-8 个记忆节点，每个有：
  - type：keyword / event / letter / memory
  - label：简短标签（5字以内）
  - description：节点的情感描述（30字以内）
  - emotion：这个节点的情绪关键词（2-4字，如「惊喜」「温柔」「勇敢」）
  - relatedTo：与其他哪些节点标签相关（字符串数组，可以为空）

### 3. 生成视频脚本草稿（videoScript）
- title：视频标题
- duration：推荐视频时长，"30s" / "60s" / "90s"
- scenes：3-6 个场景，每个有 order（序号）、visualSuggestion（画面建议）、narration（旁白）、subtitle（字幕，可比旁白更简短）、emotion（情绪基调）
- musicMood：背景音乐建议（如「轻柔钢琴曲」「温暖弦乐」）
- endingLine：结尾字幕文案

### 4. 输入溯源（sourceTrace）
- usedQuestions：实际使用了哪些问题（列出 question 字段）
- usedFreeNote：是否使用了 freeNote（true / false）
- missingContext：你发现哪些信息缺失（会影响内容质量的）
- groundingNotes：说明哪些内容是基于原始材料，哪些是你做了温和总结

### 5. 质量自检（qualityReview）
- riskOfFabrication："low" / "medium" / "high"——评估你编造内容的风险
- emotionalTone：对生成内容情绪基调的描述（1句话）
- weaknesses：内容的不足之处（列表，如「信息较少，时间线只能做季节性总结」）
- suggestionsForBetterInput：给父母的建议，下次可以提供哪些信息让内容更好
