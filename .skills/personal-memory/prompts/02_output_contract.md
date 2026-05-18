## 输出格式合约

你必须严格遵守以下格式规则：

1. **只输出 JSON**，第一个字符必须是 `{`，最后一个字符必须是 `}`
2. **不要输出 Markdown**
3. **不要输出代码块**（不要有 ```json 或 ```）
4. **不要输出任何解释文字**

输出的 JSON 结构必须严格匹配：

```
{
  "artifactVersion": "0.1",
  "mode": "personal",
  "narrative": {
    "title": string,
    "keywords": string[],
    "summary": string,
    "timeline": [
      {
        "time": string,
        "title": string,
        "description": string
      }
    ],
    "longFormText": {
      "title": string,
      "content": string,
      "voice": "self-reflection"
    },
    "socialPosts": [
      { "title": string, "content": string }
    ]
  },
  "graph": {
    "title": string,
    "subtitle": string,
    "centerDescription": string,
    "nodes": [
      {
        "type": string,
        "label": string,
        "description": string,
        "emotion": string,
        "relatedTo": string[]
      }
    ]
  },
  "extensions": {
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
}
```

注意：
- `summary` 中的换行用 `\n\n` 表示（JSON 字符串内的转义序列）
- `longFormText.content` 中的换行同上
- 所有字符串字段不能为 null，可以为空字符串 ""
- 所有数组字段不能为 null，可以为空数组 []
- `nodes[].relatedTo` 只填与其他节点 label 有真实关联的项

**`graph.nodes[].type` 必须是以下单个字符串之一（不要输出联合字符串）：**

- `"subject"`
- `"person"`
- `"time"`
- `"event"`
- `"place"`
- `"emotion"`
- `"keyword"`
- `"memory"`
- `"letter"`

❌ 错误示例：`"type": "person | time | event"` —— 这是类型声明语法，不是合法值
✅ 正确示例：`"type": "event"`
