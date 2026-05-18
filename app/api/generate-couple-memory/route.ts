// app/api/generate-couple-memory/route.ts
// couple mode 专用 API route。
//
// 接收 CoupleRawInput，返回 MemoryArtifact。
// 不复用 /api/generate-report，不修改 family 链路。
//
// 安全约束：
// - 不读取文件，不访问本地数据库
// - 不处理图片上传
// - 不输出 env 变量
// - chatText 超过 12000 字返回 400，提示用户精简

export const runtime = "nodejs";
export const maxDuration = 150;

import { NextRequest, NextResponse } from "next/server";
import type { CoupleRawInput } from "@/lib/domains/couple/adapter";
import { coupleRawInputToMemoryRawMaterial } from "@/lib/domains/couple/adapter";
import { runMemorySkill } from "@/lib/memory-core/runMemorySkill";

const VALID_STYLES = ["romantic", "documentary", "playful", "literary"] as const;
type ValidStyle = (typeof VALID_STYLES)[number];

function isValidStyle(s: unknown): s is ValidStyle {
  return VALID_STYLES.includes(s as ValidStyle);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }

  // ── 必填字段校验 ──────────────────────────────────────────────
  const partnerAName = typeof body.partnerAName === "string" ? body.partnerAName.trim() : "";
  const partnerBName = typeof body.partnerBName === "string" ? body.partnerBName.trim() : "";
  const relationshipTimeRange =
    typeof body.relationshipTimeRange === "string" ? body.relationshipTimeRange.trim() : "";

  if (!partnerAName) {
    return NextResponse.json({ error: "请填写你的昵称" }, { status: 400 });
  }
  if (!partnerBName) {
    return NextResponse.json({ error: "请填写 TA 的昵称" }, { status: 400 });
  }
  if (!relationshipTimeRange) {
    return NextResponse.json({ error: "请填写在一起的时间跨度" }, { status: 400 });
  }

  // ── style 校验 ────────────────────────────────────────────────
  const rawStyle = body.style;
  const style: ValidStyle = isValidStyle(rawStyle) ? rawStyle : "romantic";

  // ── qaList 校验 ───────────────────────────────────────────────
  const rawQaList = body.qaList;
  const qaList: { question: string; answer: string }[] = Array.isArray(rawQaList)
    ? (rawQaList as unknown[])
        .filter(
          (item): item is { question: string; answer: string } =>
            typeof (item as Record<string, unknown>).question === "string" &&
            typeof (item as Record<string, unknown>).answer === "string"
        )
    : [];

  // ── 内容充分性校验 ────────────────────────────────────────────
  const chatText = typeof body.chatText === "string" ? body.chatText : "";
  const freeNote = typeof body.freeNote === "string" ? body.freeNote : "";
  const hasAnswer = qaList.some((q) => q.answer.trim() !== "");

  if (!chatText.trim() && !freeNote.trim() && !hasAnswer) {
    return NextResponse.json(
      { error: "请至少提供一段聊天文本、一个问题回答，或一段自由记录。" },
      { status: 400 }
    );
  }

  // ── chatText 长度兜底（前端有 5000 字提示，后端 12000 字兜底）─
  if (chatText.length > 12000) {
    return NextResponse.json(
      { error: "聊天文本过长，请先粘贴最有代表性的片段（建议不超过 5000 字）。" },
      { status: 400 }
    );
  }

  // ── 构造输入 + 调用通用 runtime ───────────────────────────────
  const input: CoupleRawInput = {
    partnerAName,
    partnerBName,
    relationshipTimeRange,
    anniversaryDate:
      typeof body.anniversaryDate === "string" && body.anniversaryDate.trim()
        ? body.anniversaryDate.trim()
        : undefined,
    style,
    photoCount: typeof body.photoCount === "number" ? Math.max(0, body.photoCount) : 0,
    chatText: chatText || undefined,
    qaList,
    freeNote,
  };

  try {
    const memoryMaterial = coupleRawInputToMemoryRawMaterial(input);
    const artifact = await runMemorySkill(memoryMaterial);
    return NextResponse.json({ artifact });
  } catch (err) {
    console.error("[generate-couple-memory] 生成失败:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "生成失败，请稍后重试。如果问题持续，请检查 DeepSeek 配置。" },
      { status: 500 }
    );
  }
}
