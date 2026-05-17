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
  const timeoutId = setTimeout(() => controller.abort(), 60_000); // 60s 超时

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
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("请求超时（60秒），请稍后重试");
    }
    throw new Error(`网络请求失败：${(err as Error).message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`DeepSeek API 返回错误 ${res.status}：${body.slice(0, 200)}`);
  }

  let data: DeepSeekResponse;
  try {
    data = (await res.json()) as DeepSeekResponse;
  } catch {
    throw new Error("DeepSeek 返回的响应体不是合法 JSON");
  }
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek 返回内容为空");
  }
  return content;
}
