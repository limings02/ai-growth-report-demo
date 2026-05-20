## 输出格式合约

你必须严格遵守以下格式规则：

1. **只输出 JSON**，第一个字符必须是 `{`，最后一个字符必须是 `}`
2. **不要输出 Markdown**
3. **不要输出代码块**（不要有 ```json 或 ``` ）
4. **不要输出任何解释文字**，不要说「以下是生成结果」或「根据您的输入」
5. **不要在 JSON 前后添加任何内容**

输出的 JSON 结构必须严格匹配标准 MemoryArtifact：

```
{
  "artifactVersion": "0.1",
  "mode": "family",
  "narrative": {
    "title": "（字符串）",
    "keywords": ["（字符串）"],
    "summary": "（字符串）",
    "timeline": [
      {
        "time": "（字符串）",
        "title": "（字符串）",
        "description": "（字符串）"
      }
    ],
    "longFormText": {
      "title": "（字符串）",
      "content": "（字符串）",
      "voice": "parent-letter"
    },
    "socialPosts": [
      {
        "title": "（字符串）",
        "content": "（字符串）"
      }
    ]
  },
  "graph": {
    "title": "（字符串）",
    "subtitle": "（字符串）",
    "centerDescription": "（字符串）",
    "nodes": [
      {
        "type": "keyword",
        "label": "（字符串）",
        "description": "（字符串）",
        "emotion": "（字符串）",
        "relatedTo": ["（字符串）"]
      }
    ]
  },
  "extensions": {
    "videoScript": {
      "title": "（字符串）",
      "duration": "30s",
      "scenes": [
        {
          "order": 1,
          "visualSuggestion": "（字符串）",
          "narration": "（字符串）",
          "subtitle": "（字符串）",
          "emotion": "（字符串）"
        }
      ],
      "musicMood": "（字符串）",
      "endingLine": "（字符串）"
    },
    "sourceTrace": {
      "usedQuestions": ["（字符串）"],
      "usedFreeNote": true,
      "missingContext": ["（字符串）"],
      "groundingNotes": ["（字符串）"]
    },
    "qualityReview": {
      "riskOfFabrication": "medium",
      "emotionalTone": "（字符串）",
      "weaknesses": ["（字符串）"],
      "suggestionsForBetterInput": ["（字符串）"]
    }
  }
}
```

注意：
- `narrative.summary` 中的换行用 `\n\n` 表示（JSON 字符串内的转义序列）
- `narrative.longFormText.content` 中的换行同上
- 所有字符串字段不能为 null，可以为空字符串 ""
- 所有数组字段不能为 null，可以为空数组 []
- `graph.nodes[].type` 必须是以下单个字符串之一，禁止输出联合字符串（如 "keyword | event"）：
  - "keyword" | "event" | "letter" | "memory" | "emotion" | "subject" | "person" | "time" | "place" | "message"

**必须输出的字段：**
- `mode` 必须是 `"family"`
- `narrative` 必须存在，且包含 title / keywords / summary / timeline / longFormText / socialPosts
- `narrative.longFormText.voice` 必须是 `"parent-letter"`
- `extensions` 必须存在
- `extensions.sourceTrace` 必须存在
- `extensions.qualityReview` 必须存在

**严禁输出的旧字段：**
- 不要输出顶层 `report`
- 不要输出顶层 `yearlySummary`（已移入 `narrative.summary`）
- 不要输出顶层 `letter`（已移入 `narrative.longFormText.content`）
- 不要输出顶层 `skillStatus`
- 不要把 `videoScript` 放在顶层（必须在 `extensions.videoScript`）
- 不要把 `sourceTrace` 放在顶层（必须在 `extensions.sourceTrace`）
- 不要把 `qualityReview` 放在顶层（必须在 `extensions.qualityReview`）
