"use client";

import { useState } from "react";
import { ReportData, RawMaterial, PhotoItem } from "@/lib/types";

type Props = {
  report: ReportData;
  rawMaterial: RawMaterial;
  photos: PhotoItem[];
  onBack: () => void;
};

type Tab = "generated" | "raw";

export default function ReportPreview({ report, rawMaterial, photos, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("generated");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── 顶部操作栏 ─────────────────────────────────────── */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(255,250,247,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)" }}>
        <button onClick={onBack} className="text-sm cursor-pointer hover:underline flex items-center gap-1"
          style={{ color: "var(--text-muted)" }}>
          ← 返回修改
        </button>

        <div className="flex items-center gap-2">
          {/* 标签切换 */}
          {(["generated", "raw"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
              style={tab === t
                ? { background: "var(--primary)", color: "white" }
                : { background: "var(--accent)", color: "var(--text-muted)", border: "1px solid var(--border)" }
              }>
              {t === "generated" ? "✨ 年报" : "📋 原始记录"}
            </button>
          ))}
          {/* TODO[print]: 阶段5实现打印 */}
          <button
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-not-allowed opacity-40"
            style={{ background: "var(--accent)", color: "var(--primary)", border: "1px solid var(--border)" }}
            disabled>
            🖨️ 打印
          </button>
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">

          {/* ── 年报正文 ─────────────────────────────────────── */}
          {tab === "generated" && <GeneratedContent report={report} photos={photos} />}

          {/* ── 原始材料 ─────────────────────────────────────── */}
          {tab === "raw" && <RawContent rawMaterial={rawMaterial} photos={photos} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 生成内容：完整年报排版
// ─────────────────────────────────────────────────────────────
function GeneratedContent({ report, photos }: { report: ReportData; photos: PhotoItem[] }) {
  return (
    <div>
      {/* 封面区 */}
      <CoverSection report={report} photos={photos} />

      {/* 关键词 + 成长总结（两列网格） */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="sm:col-span-2">
          <KeywordsCard keywords={report.keywords} />
        </div>
        <div className="sm:col-span-3">
          <SummaryCard summary={report.yearlySummary} />
        </div>
      </div>

      {/* 时间线 */}
      <TimelineCard timeline={report.timeline} />

      {/* 给孩子的信 + 朋友圈（两列网格） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <LetterCard letter={report.letter} />
        <SocialCard posts={report.socialPosts} />
      </div>

      {/* 未来 skill 占位 */}
      <ComingSoonCard />
    </div>
  );
}

// ── 封面区 ──────────────────────────────────────────────────
function CoverSection({ report, photos }: { report: ReportData; photos: PhotoItem[] }) {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-4 mt-6"
      style={{
        background: "linear-gradient(135deg, #fde8dc 0%, #fcd5c0 50%, #f4b8a0 100%)",
        minHeight: "200px",
      }}>
      {/* 背景装饰 */}
      <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #e8836a, transparent)" }} />
      <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #fff, transparent)" }} />

      <div className="relative z-10 p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* 照片拼贴（最多3张） */}
        {photos.length > 0 && (
          <div className="flex-shrink-0 flex gap-2">
            {photos.slice(0, 3).map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.previewUrl} alt="照片"
                className="object-cover rounded-2xl shadow-md"
                style={{
                  width: i === 0 ? 80 : 60,
                  height: i === 0 ? 80 : 60,
                  marginTop: i === 1 ? 8 : i === 2 ? -8 : 0,
                  border: "2px solid white",
                }} />
            ))}
          </div>
        )}

        <div>
          <p className="text-xs font-medium mb-2 opacity-70" style={{ color: "#8b4a38" }}>
            🌸 成长礼物
          </p>
          <h2 className="text-2xl font-bold leading-snug" style={{ color: "#2d1f1a" }}>
            {report.title}
          </h2>
          <p className="text-sm mt-1 opacity-70" style={{ color: "#5a3d35" }}>
            一份用心整理的成长记录
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 关键词卡片 ───────────────────────────────────────────────
function KeywordsCard({ keywords }: { keywords: string[] }) {
  return (
    <SectionCard title="✨ 年度关键词" className="h-full">
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <span key={kw} className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #fde8dc, #fcd5c0)", color: "#c0674a" }}>
            {kw}
          </span>
        ))}
      </div>
      {/* TODO[skill:keywords] */}
    </SectionCard>
  );
}

// ── 成长总结卡片 ─────────────────────────────────────────────
function SummaryCard({ summary }: { summary: string }) {
  return (
    <SectionCard title="💛 年度成长总结" className="h-full">
      <p className="text-sm leading-loose whitespace-pre-line" style={{ color: "var(--foreground)" }}>
        {summary}
      </p>
      {/* TODO[skill:summary] */}
    </SectionCard>
  );
}

// ── 时间线卡片（竖线设计）───────────────────────────────────
function TimelineCard({ timeline }: { timeline: { time: string; title: string; description: string }[] }) {
  return (
    <SectionCard title="⏱ 重要瞬间" className="mb-4">
      <div className="relative pl-4">
        {/* 竖线 */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "linear-gradient(to bottom, #f4b8a0, #fde8dc)" }} />

        <div className="space-y-6">
          {timeline.map((item, i) => (
            <div key={i} className="relative flex gap-4">
              {/* 圆点 */}
              <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm mt-0.5"
                style={{ background: "#e8836a", marginLeft: "-2px" }} />
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#fde8dc", color: "#c0674a" }}>
                    {item.time}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TODO[skill:timeline] */}
    </SectionCard>
  );
}

// ── 给孩子的信（手账质感）───────────────────────────────────
function LetterCard({ letter }: { letter: string }) {
  return (
    <div className="rounded-2xl p-5 mb-0 flex flex-col"
      style={{
        background: "#fffdf9",
        border: "1px solid #f0ddd5",
        backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #f5e8e0 27px, #f5e8e0 28px)",
        backgroundSize: "100% 28px",
        backgroundPositionY: "40px",
      }}>
      <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "var(--text-muted)" }}>
        ✉️ 给孩子的信
      </p>
      <p className="text-sm leading-loose whitespace-pre-line relative z-10 flex-1"
        style={{ color: "#3d2c2c", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}>
        {letter}
      </p>
      {/* TODO[skill:letter] */}
    </div>
  );
}

// ── 朋友圈文案（可复制）─────────────────────────────────────
function SocialCard({ posts }: { posts: { title: string; content: string }[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(content: string, title: string) {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(title);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <SectionCard title="📱 朋友圈文案">
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.title} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-3 py-2"
              style={{ background: "#fde8dc" }}>
              <span className="text-xs font-semibold" style={{ color: "#c0674a" }}>
                {post.title}
              </span>
              <button
                onClick={() => handleCopy(post.content, post.title)}
                className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all"
                style={{ background: copied === post.title ? "#e8836a" : "white", color: copied === post.title ? "white" : "#c0674a" }}>
                {copied === post.title ? "✓ 已复制" : "复制"}
              </button>
            </div>
            <p className="text-xs leading-relaxed p-3 whitespace-pre-line"
              style={{ background: "white", color: "var(--foreground)" }}>
              {post.content}
            </p>
          </div>
        ))}
      </div>
      {/* TODO[skill:social] */}
    </SectionCard>
  );
}

// ── 即将上线占位卡 ───────────────────────────────────────────
function ComingSoonCard() {
  const items = [
    { icon: "🎬", label: "成长视频脚本生成" },   // TODO[skill:video]
    { icon: "🎨", label: "专属插画提示词生成" }, // TODO[skill:illustration]
    { icon: "🎙", label: "语音信件生成" },         // TODO[skill:voice]
  ];
  return (
    <div className="rounded-2xl p-5 border-dashed mb-4"
      style={{ border: "1.5px dashed var(--border)" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
        🚀 即将上线
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
            style={{ background: "var(--accent)", color: "var(--text-muted)" }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 原始材料标签页
// ─────────────────────────────────────────────────────────────
function RawContent({ rawMaterial, photos }: { rawMaterial: RawMaterial; photos: PhotoItem[] }) {
  const styleLabel: Record<string, string> = {
    warm: "🌸 温暖", playful: "🎈 俏皮", documentary: "📷 纪实", literary: "🍃 文艺",
  };

  return (
    <div className="space-y-4 pt-6">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        这是你填写的原始记录。接入真实 AI 后，这些材料会被完整传递给大模型，生成更丰富的内容。
      </p>

      <SectionCard title="📋 基本信息">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["孩子昵称", rawMaterial.childName],
            ["年龄", `${rawMaterial.childAge} 岁`],
            ["总结年份", `${rawMaterial.reportYear} 年`],
            ["父母称呼", rawMaterial.parentName],
            ["文案风格", styleLabel[rawMaterial.style] ?? rawMaterial.style],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      {photos.length > 0 && (
        <SectionCard title={`📸 照片（${photos.length} 张）`}>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.previewUrl} alt="照片"
                className="w-full aspect-square object-cover rounded-xl" />
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            照片仅在本地预览，接入 AI 后会传至安全存储
          </p>
        </SectionCard>
      )}

      {rawMaterial.qaList.length > 0 && (
        <SectionCard title={`💬 问答记录（${rawMaterial.qaList.length} 条）`}>
          <div className="space-y-4">
            {rawMaterial.qaList.map((qa, i) => (
              <div key={i}>
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{ background: "#fde8dc", color: "#c0674a" }}>
                    Q{i + 1}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{qa.question}</span>
                </p>
                <p className="text-sm leading-relaxed p-3 rounded-xl"
                  style={{ background: "white", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {rawMaterial.freeNote && (
        <SectionCard title="📓 其他记录">
          <p className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: "var(--foreground)" }}>
            {rawMaterial.freeNote}
          </p>
        </SectionCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 通用卡片容器
// ─────────────────────────────────────────────────────────────
function SectionCard({
  title, children, className = "mb-4",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>{title}</p>
      {children}
    </div>
  );
}
