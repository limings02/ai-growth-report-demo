// lib/server/deepseekClient.ts
// 服务端专用，不要在客户端组件中 import 本文件
// API Key 只从环境变量读取，永远不打印到日志

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekResponse = {
  choices: { message: { content: string } }[];
};

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

  const controller = new AbortController();
  // 标记是否是我们主动 abort 的（用于区分超时 vs 其他网络错误）
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
        max_tokens: 4096,
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

  // abort 后 res.text() 有时静默返回空字符串，需要在这里再次检查
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
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek 返回内容为空");
  }
  return content;
}
