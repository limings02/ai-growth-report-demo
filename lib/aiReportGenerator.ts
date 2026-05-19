// lib/aiReportGenerator.ts
// 前端调用层，Phase 12.4B：返回 MemoryArtifact
// 只调用 /api/generate-report，不读取任何环境变量
import type { RawMaterial } from "./types";
import type { MemoryArtifact } from "./memory-core/types";

// 轻量结构防御：防止旧 API 格式或异常 JSON 进入 UI 后崩溃
// 不引入 zod/yup，只检查关键字段存在性
function isMemoryArtifactLike(data: unknown): data is MemoryArtifact {
  if (!data || typeof data !== "object") return false;
  const value = data as Partial<MemoryArtifact> & Record<string, unknown>;

  if (value.mode !== "family") return false;
  if (!value.narrative || typeof value.narrative !== "object") return false;
  if (!value.graph || typeof value.graph !== "object") return false;
  if (!value.extensions || typeof value.extensions !== "object") return false;

  const narrative = value.narrative as Record<string, unknown>;
  return (
    typeof narrative.title === "string" &&
    typeof narrative.summary === "string" &&
    Array.isArray(narrative.keywords) &&
    Array.isArray(narrative.timeline) &&
    Array.isArray(narrative.socialPosts)
  );
}

class AiReportGenerator {
  async generate(material: RawMaterial): Promise<MemoryArtifact> {
    // 网络错误处理：DNS 失败、连接超时等
    let res: Response;
    try {
      res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 照片 previewUrl 是 blob:// URL，对服务端无意义，发送前移除
        body: JSON.stringify({ ...material, photoUrls: [] }),
      });
    } catch (err) {
      throw new Error("网络请求失败，请检查网络连接后重试", { cause: err });
    }

    // JSON 解析失败处理：如 502 的 HTML 响应、空响应等
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new Error(`服务器返回非 JSON 响应 (HTTP ${res.status})，请稍后重试`);
    }

    // error 字段优先（来自 API 400/500 响应）
    const maybeError = data as { error?: string };
    if (!res.ok || maybeError?.error) {
      throw new Error(maybeError?.error ?? `服务器错误 ${res.status}`);
    }

    // 结构防御：若 API 返回旧格式（如旧 GrowthMemoryArtifact）或异常结构，给出明确错误
    if (!isMemoryArtifactLike(data)) {
      throw new Error(
        "服务器返回的 family 结果不是 MemoryArtifact 格式，请检查 API 版本是否一致"
      );
    }

    return data;
  }
}

export const aiGenerator = new AiReportGenerator();
