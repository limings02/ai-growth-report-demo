// lib/aiReportGenerator.ts
// 前端调用层，Phase 12.4B：返回 MemoryArtifact
// 只调用 /api/generate-report，不读取任何环境变量
import type { RawMaterial } from "./types";
import type { MemoryArtifact } from "./memory-core/types";

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
    let data: MemoryArtifact & { error?: string };
    try {
      data = (await res.json()) as MemoryArtifact & { error?: string };
    } catch {
      throw new Error(`服务器返回非 JSON 响应 (HTTP ${res.status})，请稍后重试`);
    }

    if (!res.ok || data.error) {
      throw new Error(data.error ?? `服务器错误 ${res.status}`);
    }

    return data;
  }
}

export const aiGenerator = new AiReportGenerator();
