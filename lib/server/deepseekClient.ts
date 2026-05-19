// lib/server/deepseekClient.ts
// 服务端专用，不要在客户端组件中 import 本文件
// API Key 只从环境变量读取，永远不打印到日志
//
// DeepSeek V4 Pro 兼容说明（Phase 10.3.1）：
// - deepseek-v4-pro / deepseek-v4-flash 是 thinking 模型
// - thinking enabled 时，最终 JSON 在 reasoning_content 而非 content
// - 本项目结构化 JSON 任务默认关闭 thinking（DEEPSEEK_THINKING=disabled）
// - 不读取、不打印、不透传 reasoning_content

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// 扩展响应类型以支持 reasoning_content（仅用于错误诊断，不透传内容）
type DeepSeekMessage = {
  content?: string | null;
  reasoning_content?: string | null;
};

type DeepSeekChoice = {
  message?: DeepSeekMessage;
  finish_reason?: string;
};

type DeepSeekResponse = {
  choices?: DeepSeekChoice[];
};

// ── V4 Pro 判断 ──────────────────────────────────────────────────

function isDeepSeekV4Model(model: string): boolean {
  return model === "deepseek-v4-pro" || model === "deepseek-v4-flash";
}

// ── thinking 配置 ────────────────────────────────────────────────
// 只对 v4 模型注入 thinking 配置。
// 默认 disabled，确保最终 JSON 回到 message.content 字段。
// 如需开启（不推荐用于结构化 JSON 任务），设置 DEEPSEEK_THINKING=enabled。

function getThinkingConfig(model: string): { type: "enabled" | "disabled" } | undefined {
  if (!isDeepSeekV4Model(model)) return undefined;
  const raw = process.env.DEEPSEEK_THINKING;
  const type = raw === "enabled" ? "enabled" : "disabled";
  return { type };
}

export async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 DEEPSEEK_API_KEY，请在 .env.local 中配置");
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL;
  if (!model) {
    throw new Error("缺少 DEEPSEEK_MODEL，请在 .env.local 中配置");
  }

  // max_tokens：支持环境变量，默认 8192（v4 pro 长 JSON 输出需要更大预算）
  const rawMaxTokens = Number(process.env.DEEPSEEK_MAX_TOKENS ?? 8192);
  const safeMaxTokens = Number.isFinite(rawMaxTokens) && rawMaxTokens > 0 ? rawMaxTokens : 8192;

  const thinking = getThinkingConfig(model);

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 120_000); // 120s 超时

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: safeMaxTokens,
        // v4-pro/v4-flash：注入 thinking 配置（默认 disabled 保证 JSON 回到 content）
        ...(thinking && { thinking }),
        // DEEPSEEK_JSON_MODE=false 时不传此字段，用于不支持 json_object 的模型
        ...(process.env.DEEPSEEK_JSON_MODE !== "false" && {
          response_format: { type: "json_object" },
        }),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError" || timedOut) {
      throw new Error("请求超时（120秒），DeepSeek 生成时间过长，请稍后重试");
    }
    throw new Error(`网络请求失败：${(err as Error).message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  // 读取响应体文本
  const rawText = await res.text().catch(() => "");

  if (timedOut || rawText === "") {
    if (timedOut || controller.signal.aborted) {
      throw new Error("请求超时（120秒），DeepSeek 生成时间过长，请稍后重试");
    }
    throw new Error("DeepSeek 返回了空响应，请稍后重试");
  }

  if (!res.ok) {
    throw new Error(`DeepSeek API 返回错误 ${res.status}：${rawText.slice(0, 200)}`);
  }

  let data: DeepSeekResponse;
  try {
    data = JSON.parse(rawText) as DeepSeekResponse;
  } catch {
    throw new Error(`DeepSeek 返回的响应体不是合法 JSON。原始内容：${rawText.slice(0, 300)}`);
  }

  const choice = data.choices?.[0];
  const message = choice?.message;
  const content = message?.content?.trim();
  const finishReason = choice?.finish_reason;

  if (content) return content;

  // content 为空时给出可诊断的错误提示，但不泄露 reasoning_content 原文
  if (message?.reasoning_content) {
    throw new Error(
      `DeepSeek 返回了 reasoning_content 但 content 为空。` +
      `当前模型可能处于 thinking mode，请确认 DEEPSEEK_THINKING=disabled。` +
      `finish_reason=${finishReason ?? "unknown"}`
    );
  }

  throw new Error(
    `DeepSeek 返回内容为空。finish_reason=${finishReason ?? "unknown"}`
  );
}
