# DeepSeek V4 Pro 兼容说明

> Phase 10.3.1 | 2026-05-19

---

## 1. 问题背景

Phase 10.3 评测时发现：当 `.env.local` 中设置 `DEEPSEEK_MODEL=deepseek-v4-pro` 时，通过项目 API 发起的所有生成请求均返回 500 错误，表现为 `callDeepSeek` 抛出"DeepSeek 返回内容为空"。

根本原因：`deepseek-v4-pro` 是 **thinking 模型**，默认开启推理过程（thinking mode）。在 thinking 模式下，最终生成内容被放在 `choices[0].message.reasoning_content` 字段，`content` 字段为空字符串。原来的 `callDeepSeek` 只读取 `content`，因此始终得不到内容。

---

## 2. 为什么不改回 deepseek-chat

用户明确选择使用 `deepseek-v4-pro`。项目代码应当适配模型，而不是要求用户降级。

---

## 3. DeepSeek V4 Pro 的 thinking/content 响应差异

| 场景 | content 字段 | reasoning_content 字段 |
|------|-------------|----------------------|
| thinking 默认开启 | 空字符串 `""` | 包含推理过程 |
| thinking 显式关闭（`"type": "disabled"`） | 包含最终输出 | 空或 null |

DeepSeek API 文档支持在请求 body 中传入：

```json
{
  "thinking": {
    "type": "enabled" | "disabled"
  }
}
```

对于结构化 JSON 生成任务（本项目所有 family/couple/personal 生成），不需要推理过程，只需要最终 JSON。因此默认关闭 thinking 即可。

---

## 4. 本项目的策略

### 推荐 .env.local 配置

```
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_THINKING=disabled
DEEPSEEK_JSON_MODE=true
DEEPSEEK_MAX_TOKENS=8192
```

### 代码层面（lib/server/deepseekClient.ts）

1. **模型识别**：`deepseek-v4-pro` / `deepseek-v4-flash` 视为 thinking 模型
2. **thinking 注入**：对 v4 模型在请求 body 中注入 `"thinking": { "type": "disabled" }`，默认关闭；可通过 `DEEPSEEK_THINKING=enabled` 显式开启
3. **只解析 content**：`message.content` 有值则返回；不读取、不解析、不透传 `reasoning_content`
4. **诊断错误**：若 `content` 为空但 `reasoning_content` 存在，抛出可诊断的错误提示（不含 reasoning 原文）
5. **max_tokens 可配置**：通过 `DEEPSEEK_MAX_TOKENS` 环境变量控制，默认 8192

### 不做的事

- **不把 reasoning_content 当最终 JSON 解析**：reasoning 是推理过程，格式不稳定，不能直接用
- **不输出 reasoning_content 原文**：日志、前端响应均不包含推理内容
- **不把 reasoning_content 透传给用户**

---

## 5. 验证方法

配置好 `.env.local` 后，任意访问以下 API 可验证生成链路是否正常：

```bash
# family mode
curl -X POST http://localhost:3000/api/generate-report ...

# couple mode
curl -X POST http://localhost:3000/api/generate-couple-memory ...

# personal mode
curl -X POST http://localhost:3000/api/generate-personal-memory \
  -H "Content-Type: application/json" \
  -d '{"personName":"测试","lifeStage":"测试阶段","timeRange":"2020-2021","style":"reflective","qaList":[{"question":"变化是什么","answer":"有些改变"}],"freeNote":""}'
```

成功时返回 `{ artifact: { mode: "personal", narrative: {...}, ... } }`。

如果失败且错误为 `"DeepSeek 返回了 reasoning_content 但 content 为空"`，说明 thinking 未被关闭，检查：
1. `.env.local` 中是否有 `DEEPSEEK_THINKING=disabled`
2. DeepSeek API 是否支持 thinking 配置参数

---

## 6. 后续可选方向

如果未来需要利用 thinking 能力（例如多步推理、复杂逻辑），建议设计**二阶段流程**：

```
阶段 1：使用 thinking 模型推理，得到 reasoning_content
阶段 2：将 reasoning_content 作为中间结果，再调用模型生成最终 JSON
```

不建议直接把 `reasoning_content` 解析为 JSON——它是自然语言推理过程，格式不受 JSON mode 约束。
