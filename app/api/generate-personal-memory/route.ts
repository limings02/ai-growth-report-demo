// app/api/generate-personal-memory/route.ts
// personal mode 专用 API route。
//
// 接收 PersonalRawInput，返回 MemoryArtifact。
// 不复用 /api/generate-report，不修改 family / couple 链路。
//
// 安全约束：
// - 不读取本地文件，不访问本地数据库
// - 不处理图片上传
// - 不输出 env 变量
// - 只处理用户主动填写的文本内容
// - 总文本超过 12000 字返回 400，提示用户精简

export const runtime = "nodejs";
export const maxDuration = 150;

import { NextRequest, NextResponse } from "next/server";
import type { PersonalRawInput } from "@/lib/domains/personal/adapter";
import { personalRawInputToMemoryRawMaterial } from "@/lib/domains/personal/adapter";
import { runMemorySkill } from "@/lib/memory-core/runMemorySkill";

const VALID_STYLES = ["documentary", "literary", "reflective", "warm"] as const;
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
  const personName = typeof body.personName === "string" ? body.personName.trim() : "";
  const lifeStage = typeof body.lifeStage === "string" ? body.lifeStage.trim() : "";
  const timeRange = typeof body.timeRange === "string" ? body.timeRange.trim() : "";

  if (!personName) {
    return NextResponse.json({ error: "请填写你的名字或称呼" }, { status: 400 });
  }
  if (!lifeStage) {
    return NextResponse.json({ error: "请填写人生阶段" }, { status: 400 });
  }
  if (!timeRange) {
    return NextResponse.json({ error: "请填写时间跨度" }, { status: 400 });
  }

  // ── style 校验（非法时默认 reflective）────────────────────────
  const rawStyle = body.style;
  const style: ValidStyle = isValidStyle(rawStyle) ? rawStyle : "reflective";

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
  const input: PersonalRawInput = {
    personName,
    lifeStage,
    timeRange,
    style,
    photoCount,
    qaList,
    freeNote,
  };

  try {
    const memoryMaterial = personalRawInputToMemoryRawMaterial(input);
    const artifact = await runMemorySkill(memoryMaterial);
    return NextResponse.json({ artifact });
  } catch (err) {
    console.error("[generate-personal-memory] 生成失败:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "生成失败，请稍后重试。如果问题持续，请检查 DeepSeek 配置。" },
      { status: 500 }
    );
  }
}
