// app/api/generate-report/route.ts
// 服务端 API Route，Next.js App Router
// 只允许 POST，API Key 只在服务端读取，前端不可见

import { NextRequest, NextResponse } from "next/server";
import { RawMaterial } from "@/lib/types";
import { callDeepSeek } from "@/lib/server/deepseekClient";
import { buildGrowthReportPrompt } from "@/lib/server/prompts/growthReportPrompt";
import { parseReportJson } from "@/lib/server/parseReportJson";

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
  if (!material.qaList || material.qaList.length < 2) {
    return NextResponse.json({ error: "至少需要回答 2 个问题" }, { status: 400 });
  }
  if (!material.reportYear || typeof material.reportYear !== "number") {
    return NextResponse.json({ error: "缺少报告年份" }, { status: 400 });
  }

  try {
    const prompt = buildGrowthReportPrompt(material);
    const raw = await callDeepSeek([
      { role: "system", content: "你是专业的家庭记忆整理师，输出严格 JSON，不要输出任何其他内容。" },
      { role: "user", content: prompt },
    ]);

    const report = parseReportJson(
      raw,
      material.childName,
      material.reportYear
    );

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成失败，请重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 拒绝非 POST 请求
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
