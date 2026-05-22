// app/api/generate-report/route.ts
// 服务端 API Route，Next.js App Router
// Phase 12.4B：返回标准 MemoryArtifact（不再返回 GrowthMemoryArtifact）

// 必须使用 nodejs runtime：skill runtime 依赖 fs 读取 .skills/prompts/*.md
export const runtime = "nodejs";
// maxDuration 在 Vercel 等部署平台生效；本地依赖 ReadableStream 保持连接
export const maxDuration = 150;

import { NextRequest, NextResponse } from "next/server";
import { RawMaterial } from "@/lib/types";
import { runFamilyMemorySkill } from "@/lib/domains/family/runFamilyMemorySkill";

// 旧链路已迁移到 skill runtime，保留注释方便回溯：
// import { callDeepSeek } from "@/lib/server/deepseekClient";
// import { buildGrowthReportPrompt } from "@/lib/server/prompts/growthReportPrompt";
// import { parseReportJson } from "@/lib/server/parseReportJson";

export async function POST(req: NextRequest) {
  let material: RawMaterial;
  try {
    material = (await req.json()) as RawMaterial;
  } catch {
    return NextResponse.json({ error: "请求体解析失败" }, { status: 400 });
  }

  // 校验必填字段
  if (!material.childName?.trim()) {
    return NextResponse.json({ error: "缺少孩子昵称" }, { status: 400 });
  }
  if (material.childAge === "" || material.childAge == null) {
    return NextResponse.json({ error: "缺少孩子年龄" }, { status: 400 });
  }
  if (!material.parentName?.trim()) {
    return NextResponse.json({ error: "缺少父母称呼" }, { status: 400 });
  }
  // Phase 16.0.1: 允许 1 个回答 OR 非空 freeNote，让用户先生成初版
  const hasContent = (material.qaList && material.qaList.length >= 1) || material.freeNote?.trim();
  if (!hasContent) {
    return NextResponse.json({ error: "先写一点也可以——回答 1 个问题，或写一段自由记录，就能生成初版。" }, { status: 400 });
  }
  if (!material.reportYear || typeof material.reportYear !== "number") {
    return NextResponse.json({ error: "缺少报告年份" }, { status: 400 });
  }

  // 用 ReadableStream 保持连接活跃，避免本地 dev server 在生成期间断开
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const artifact = await runFamilyMemorySkill(material);
        controller.enqueue(encoder.encode(JSON.stringify(artifact)));
      } catch (err) {
        const message = err instanceof Error ? err.message : "生成失败，请重试";
        controller.enqueue(encoder.encode(JSON.stringify({ error: message })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// 拒绝非 POST 请求
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
