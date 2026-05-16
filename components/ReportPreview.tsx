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
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto">

        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-sm cursor-pointer hover:underline"
            style={{ color: "var(--text-muted)" }}>
            ← 返回修改
          </button>
          {/* TODO[print]: 阶段5接入打印功能 */}
          <button
            className="text-sm px-4 py-2 rounded-full cursor-pointer opacity-40"
            style={{ background: "var(--accent)", color: "var(--primary)" }}
            disabled
            title="打印功能将在阶段5实现">
            🖨️ 打印保存（即将上线）
          </button>
        </div>

        {/* 年报标题 */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          🎉 {report.title}
        </h2>

        {/* 标签切换：生成内容 / 原始材料 */}
        <div className="flex gap-2 mb-6">
          {(["generated", "raw"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all"
              style={tab === t
                ? { background: "var(--primary)", color: "white" }
                : { background: "var(--accent)", color: "var(--text-muted)", border: "1px solid var(--border)" }
              }>
              {t === "generated" ? "✨ 生成内容" : "📋 原始材料"}
            </button>
          ))}
        </div>

        {/* ── 生成内容标签页 ────────────────────────────────── */}
        {tab === "generated" && (
          <div className="space-y-4">

            {/* 照片网格（来自原始材料，不是生成内容） */}
            {photos.length > 0 && (
              <Card title="📸 上传的照片">
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={p.previewUrl} alt="照片"
                      className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </Card>
            )}

            {/* 关键词 */}
            <Card title="✨ 年度关键词">
              <div className="flex flex-wrap gap-2">
                {report.keywords.map((kw) => (
                  <span key={kw} className="px-3 py-1 rounded-full text-sm"
                    style={{ background: "#fde8dc", color: "#c0674a" }}>{kw}</span>
                ))}
              </div>
              {/* TODO[skill:keywords] 关键词由 AI skill 生成后替换此处 */}
            </Card>

            {/* 成长总结 */}
            <Card title="💛 年度成长总结">
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
                {report.yearlySummary}
              </p>
              {/* TODO[skill:summary] 总结由 AI skill 生成后替换此处 */}
            </Card>

            {/* 时间线 */}
            <Card title="⏱ 重要瞬间时间线">
              <div className="space-y-3">
                {report.timeline.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold h-fit"
                      style={{ background: "#f4b8a0", color: "#8b4a38" }}>{item.time}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* TODO[skill:timeline] 时间线由 AI skill 结构化提取后替换此处 */}
            </Card>

            {/* 给孩子的信 */}
            <Card title="✉️ 给孩子的信">
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
                {report.letter}
              </p>
              {/* TODO[skill:letter] 信件由 AI skill 生成后替换此处 */}
            </Card>

            {/* 朋友圈文案 */}
            <Card title="📱 朋友圈文案">
              <div className="space-y-4">
                {report.socialPosts.map((post) => (
                  <div key={post.title}>
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#c0674a" }}>— {post.title}</p>
                    <p className="text-sm leading-relaxed whitespace-pre-line p-3 rounded-xl"
                      style={{ background: "white", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
              {/* TODO[skill:social] 朋友圈文案由 AI skill 生成后替换此处 */}
            </Card>

            {/* 未来 skill 占位卡片 */}
            <div className="rounded-2xl p-5 border-dashed"
              style={{ border: "1.5px dashed var(--border)", background: "transparent" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                🚀 即将上线的内容
              </p>
              <div className="space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {/* TODO[skill:video] */}
                <p>🎬 成长视频脚本生成</p>
                {/* TODO[skill:illustration] */}
                <p>🎨 专属插画提示词生成</p>
                {/* TODO[skill:voice] */}
                <p>🎙 语音信件生成</p>
              </div>
            </div>

          </div>
        )}

        {/* ── 原始材料标签页 ────────────────────────────────── */}
        {tab === "raw" && (
          <div className="space-y-4">
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              这是你填写的原始记录，AI 生成内容以此为输入。接入真实 AI 后，这些材料会被完整传递给大模型。
            </p>

            {/* 基本信息 */}
            <Card title="📋 基本信息">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {[
                  ["孩子昵称", rawMaterial.childName],
                  ["年龄", rawMaterial.childAge + " 岁"],
                  ["总结年份", rawMaterial.reportYear + " 年"],
                  ["父母称呼", rawMaterial.parentName],
                  ["文案风格", rawMaterial.style],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</dt>
                    <dd className="font-medium" style={{ color: "var(--foreground)" }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* 照片 */}
            {photos.length > 0 && (
              <Card title={`📸 照片（${photos.length} 张）`}>
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={p.previewUrl} alt="照片"
                      className="w-full aspect-square object-cover rounded-lg" />
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  照片仅在本地预览，接入 AI 后会上传至安全存储
                </p>
              </Card>
            )}

            {/* 问答记录 */}
            {rawMaterial.qaList.length > 0 && (
              <Card title={`💬 问答记录（${rawMaterial.qaList.length} 条）`}>
                <div className="space-y-4">
                  {rawMaterial.qaList.map((qa, i) => (
                    <div key={i}>
                      <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                        Q{i + 1}：{qa.question}
                      </p>
                      <p className="text-sm leading-relaxed p-3 rounded-xl"
                        style={{ background: "white", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 自由文本 */}
            {rawMaterial.freeNote && (
              <Card title="📓 其他记录">
                <p className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: "var(--foreground)" }}>
                  {rawMaterial.freeNote}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* 底部间距 */}
        <div className="h-16" />
      </div>
    </div>
  );
}

// 通用卡片容器
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>{title}</p>
      {children}
    </div>
  );
}
