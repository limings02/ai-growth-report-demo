## 输出格式合约

你必须严格遵守以下格式规则：

1. **只输出 JSON**，第一个字符必须是 `{`，最后一个字符必须是 `}`
2. **不要输出 Markdown**
3. **不要输出代码块**（不要有 ```json 或 ``` ）
4. **不要输出任何解释文字**，不要说「以下是生成结果」或「根据您的输入」
5. **不要在 JSON 前后添加任何内容**

输出的 JSON 结构必须严格匹配：

```
{
  "artifactVersion": "0.1",
  "report": {
    "title": string,
    "keywords": string[],
    "yearlySummary": string,
    "timeline": [{ "time": string, "title": string, "description": string }],
    "letter": string,
    "socialPosts": [{ "title": string, "content": string }],
    "skillStatus": {
      "keywords": "done",
      "yearlySummary": "done",
      "timeline": "done",
      "letter": "done",
      "socialPosts": "done"
    }
  },
  "graph": {
    "title": string,
    "subtitle": string,
    "centerDescription": string,
    "nodes": [{
      "type": "keyword" | "event" | "letter" | "memory",
      "label": string,
      "description": string,
      "emotion": string,
      "relatedTo": string[]
    }]
  },
  "videoScript": {
    "title": string,
    "duration": "30s" | "60s" | "90s",
    "scenes": [{
      "order": number,
      "visualSuggestion": string,
      "narration": string,
      "subtitle": string,
      "emotion": string
    }],
    "musicMood": string,
    "endingLine": string
  },
  "sourceTrace": {
    "usedQuestions": string[],
    "usedFreeNote": boolean,
    "missingContext": string[],
    "groundingNotes": string[]
  },
  "qualityReview": {
    "riskOfFabrication": "low" | "medium" | "high",
    "emotionalTone": string,
    "weaknesses": string[],
    "suggestionsForBetterInput": string[]
  }
}
```

注意：
- `yearlySummary` 中的换行用 `\n\n` 表示（JSON 字符串内的转义序列）
- `letter` 中的换行同上
- 所有字符串字段不能为 null，可以为空字符串 ""
- 所有数组字段不能为 null，可以为空数组 []
