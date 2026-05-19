// app/api/generate-memorial-memory/route.ts
// memorial mode 专用 API route。
//
// 接收纪念材料，返回 MemoryArtifact。
// 不复用其他 mode 的 API route。
//
// 安全约束：
// - 不读取本地文件，不访问本地数据库
// - 不处理图片上传
// - 不输出 env 变量
// - 只处理用户主动填写的文本内容
// - 不模拟逝者说话，不做 AI 复活
// - 总文本超过 12000 字返回 400

export const runtime = "nodejs";
export const maxDuration = 150;

import { NextRequest, NextResponse } from "next/server";
import type { MemorialRawInput } from "@/lib/domains/memorial/adapter";
import { memorialRawInputToMemoryRawMaterial } from "@/lib/domains/memorial/adapter";
import { runMemorySkill } from "@/lib/memory-core/runMemorySkill";

const VALID_STYLES = ["documentary", "warm", "solemn", "family"] as const;
type ValidStyle = (typeof VALID_STYLES)[number];

function isValidStyle(s: unknown): s is ValidStyle {
  return VALID_STYLES.includes(s as ValidStyle);
}

// null 安全的 qaList 类型守卫
function isQuestionAnswerItem(
  item: unknown
): item is { question: string; answer: string } {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;
  return (
    typeof record.question === "string" &&
    typeof record.answer === "string"
  );
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }

  // ── 必填字段校验 ──────────────────────────────────────────────
  const deceasedName =
    typeof body.deceasedName === "string" ? body.deceasedName.trim() : "";
  const relationship =
    typeof body.relationship === "string" ? body.relationship.trim() : "";
  const timeRange =
    typeof body.timeRange === "string" ? body.timeRange.trim() : "";

  if (!deceasedName) {
    return NextResponse.json({ error: "请填写被纪念者称呼" }, { status: 400 });
  }
  if (!relationship) {
    return NextResponse.json({ error: "请填写你们的关系" }, { status: 400 });
  }
  if (!timeRange) {
    return NextResponse.json({ error: "请填写时间跨度" }, { status: 400 });
  }

  // ── 可选字段 ──────────────────────────────────────────────────
  const narratorName =
    typeof body.narratorName === "string" && body.narratorName.trim()
      ? body.narratorName.trim()
      : undefined;

  // ── style 校验（非法时默认 solemn）────────────────────────────
  const rawStyle = body.style;
  const style: ValidStyle = isValidStyle(rawStyle) ? rawStyle : "solemn";

  // ── qaList 校验（null-safe）────────────────────────────────────
  const rawQaList = body.qaList;
  const qaList: { question: string; answer: string }[] = Array.isArray(rawQaList)
    ? rawQaList.filter(isQuestionAnswerItem)
    : [];

  // ── 内容充分性校验 ────────────────────────────────────────────
  const freeNote = typeof body.freeNote === "string" ? body.freeNote : "";
  const hasAnswer = qaList.some((q) => q.answer.trim() !== "");

  if (!freeNote.trim() && !hasAnswer) {
    return NextResponse.json(
      { error: "请至少回答一个问题，或写一段自由记录。" },
      { status: 400 }
    );
  }

  // ── 总文本长度兜底 ────────────────────────────────────────────
  const totalTextLength =
    freeNote.length + qaList.reduce((sum, q) => sum + q.answer.length, 0);

  if (totalTextLength > 12000) {
    return NextResponse.json(
      { error: "输入内容过长，请先保留最有代表性的片段（建议不超过 8000 字）。" },
      { status: 400 }
    );
  }

  // ── photoCount 处理 ───────────────────────────────────────────
  const photoCount =
    typeof body.photoCount === "number" ? Math.max(0, body.photoCount) : 0;

  // ── 构造输入 + 调用通用 runtime ───────────────────────────────
  const input: MemorialRawInput = {
    deceasedName,
    narratorName,
    relationship,
    timeRange,
    style,
    photoCount,
    qaList,
    freeNote,
  };

  try {
    const memoryMaterial = memorialRawInputToMemoryRawMaterial(input);
    const artifact = await runMemorySkill(memoryMaterial);
    return NextResponse.json({ artifact });
  } catch (err) {
    console.error(
      "[generate-memorial-memory] 生成失败:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "生成失败，请稍后重试。如果问题持续，请检查 DeepSeek 配置。" },
      { status: 500 }
    );
  }
}
