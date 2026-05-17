// lib/aiReportGenerator.ts
// 前端 ReportGeneratorI 实现
// 只调用 /api/generate-report，不读取任何环境变量
// 照片 previewUrl 是 blob:// URL，对服务端无意义，发送前移除
import { ReportGeneratorI, RawMaterial, ReportData } from "./types";

class AiReportGenerator implements ReportGeneratorI {
  async generate(material: RawMaterial): Promise<ReportData> {
    const res = await fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 照片 previewUrl 是 blob:// URL，对服务端无意义，发送前移除
      body: JSON.stringify({ ...material, photoUrls: [] }),
    });

    const data = (await res.json()) as ReportData & { error?: string };

    if (!res.ok || data.error) {
      throw new Error(data.error ?? `服务器错误 ${res.status}`);
    }

    return data;
  }
}

export const aiGenerator = new AiReportGenerator();
