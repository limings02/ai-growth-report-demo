# Growth Memory Skill

## 触发时机

用户提交孩子成长记录（RawMaterial），请求生成一份完整的成长礼物。
适用场景：Web App 用户填写表单后点击「生成成长礼物」。

## 输入

```typescript
RawMaterial {
  childName: string         // 孩子昵称
  childAge: number | ""     // 孩子年龄
  reportYear: number        // 总结年份
  parentName: string        // 父母称呼
  style: "warm" | "playful" | "documentary" | "literary"
  photoCount: number        // 照片数量（照片本身不上传）
  qaList: { question: string; answer: string }[]   // 访谈问答（已过滤空回答）
  freeNote: string          // 自由文本（日记、备忘录等）
}
```

## 输出

```typescript
GrowthMemoryArtifact {
  artifactVersion: "0.1"
  report: ReportData        // 成长报告（兼容现有前端）
  graph: AiGraphHints       // 成长星图语义节点
  videoScript: VideoScript  // 视频脚本草稿
  sourceTrace: SourceTrace  // 输入溯源
  qualityReview: QualityReview  // 质量自检
}
```

## 工作流（单次 LLM 调用完成全部步骤）

1. **normalize** — 整理输入材料，识别信息完整度
2. **generate report** — 生成年度总结、关键词、时间线
3. **generate graph** — 把核心记忆转化为星图语义节点
4. **generate letter** — 以父母口吻写给孩子的信
5. **generate social posts** — 生成朋友圈/小红书文案
6. **generate video script draft** — 生成视频脚本草稿
7. **quality review** — 自检：事实风险、情绪基调、不足之处

## 事实原则

1. **不编造**：禁止添加用户未提及的具体事件、地点、人物、疾病、成绩、日期
2. **不推测当事实**：可以说「这一年充满了变化」，不能说「他在春天学会了走路」（除非用户说了）
3. **信息不足要说明**：在 sourceTrace.missingContext 中列出缺失信息，不要用虚构内容填补
4. **区分来源**：原始材料（raw）和 AI 生成内容（generated）必须在 sourceTrace 中清晰标注

## 情绪原则

1. **温暖、克制、真实**：文案有温度，但不过度渲染
2. **不油腻**：不堆砌形容词，不重复「珍贵」「感动」等词
3. **不制造愧疚**：不暗示父母应该做得更多，不说「时间过得太快你却不珍惜」
4. **不夸张神化孩子**：孩子就是孩子，不需要说他是「天才」「小英雄」

## 输出格式要求

- 必须输出严格 JSON
- 不要输出 Markdown
- 不要输出代码块（不要有 \`\`\`json）
- 不要输出任何解释性文字
- 直接输出 JSON 对象，第一个字符是 `{`
