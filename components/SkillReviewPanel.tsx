"use client";

// 开发调试面板：仅在 development 环境渲染，展示 artifact 的质量自检结果
// 不面向正式用户，不打印到 PDF

import type { SourceTrace, QualityReview, VideoScript } from "@/lib/skill-runtime/types";

type Props = {
  sourceTrace: SourceTrace;
  qualityReview: QualityReview;
  videoScript?: VideoScript;
};

const RISK_COLOR: Record<string, string> = {
  low:    "#4a7c59",
  medium: "#a07020",
  high:   "#c0392b",
};

export default function SkillReviewPanel({ sourceTrace, qualityReview, videoScript }: Props) {
  const riskColor = RISK_COLOR[qualityReview.riskOfFabrication] ?? "#666";

  return (
    <div className="mt-6 rounded-2xl overflow-hidden text-xs"
      style={{ border: "1.5px dashed #c8b8b0", background: "#faf6f4" }}>

      {/* 标题栏 */}
      <div className="px-4 py-2 flex items-center gap-2"
        style={{ background: "#f0e8e4", borderBottom: "1px solid #c8b8b0" }}>
        <span className="font-mono font-bold" style={{ color: "#7a5a52" }}>🔧 DEV · Skill Review Panel</span>
        <span className="ml-auto font-mono" style={{ color: "#b09080" }}>只在 development 环境显示</span>
      </div>

      <div className="p-4 space-y-4">

        {/* 质量自检 */}
        <section>
          <p className="font-semibold mb-2" style={{ color: "#5a3d35" }}>qualityReview</p>
          <div className="space-y-1 font-mono">
            <div className="flex gap-2">
              <span style={{ color: "#9d7b72" }}>riskOfFabrication:</span>
              <span style={{ color: riskColor, fontWeight: "bold" }}>{qualityReview.riskOfFabrication}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "#9d7b72" }}>emotionalTone:</span>
              <span style={{ color: "#3d2c2c" }}>{qualityReview.emotionalTone || "—"}</span>
            </div>
            {qualityReview.weaknesses.length > 0 && (
              <div>
                <span style={{ color: "#9d7b72" }}>weaknesses:</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {qualityReview.weaknesses.map((w, i) => (
                    <li key={i} style={{ color: "#7a5a52" }}>· {w}</li>
                  ))}
                </ul>
              </div>
            )}
            {qualityReview.suggestionsForBetterInput.length > 0 && (
              <div>
                <span style={{ color: "#9d7b72" }}>suggestionsForBetterInput:</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {qualityReview.suggestionsForBetterInput.map((s, i) => (
                    <li key={i} style={{ color: "#7a5a52" }}>· {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <hr style={{ borderColor: "#e0d4cc" }} />

        {/* 输入溯源 */}
        <section>
          <p className="font-semibold mb-2" style={{ color: "#5a3d35" }}>sourceTrace</p>
          <div className="space-y-1 font-mono">
            <div className="flex gap-2">
              <span style={{ color: "#9d7b72" }}>usedFreeNote:</span>
              <span style={{ color: sourceTrace.usedFreeNote ? "#4a7c59" : "#9d7b72" }}>
                {sourceTrace.usedFreeNote ? "true" : "false"}
              </span>
            </div>
            {sourceTrace.usedQuestions.length > 0 && (
              <div>
                <span style={{ color: "#9d7b72" }}>usedQuestions ({sourceTrace.usedQuestions.length}):</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {sourceTrace.usedQuestions.map((q, i) => (
                    <li key={i} style={{ color: "#7a5a52" }}>· {q}</li>
                  ))}
                </ul>
              </div>
            )}
            {sourceTrace.missingContext.length > 0 && (
              <div>
                <span style={{ color: "#a07020" }}>missingContext:</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {sourceTrace.missingContext.map((m, i) => (
                    <li key={i} style={{ color: "#a07020" }}>· {m}</li>
                  ))}
                </ul>
              </div>
            )}
            {sourceTrace.groundingNotes.length > 0 && (
              <div>
                <span style={{ color: "#9d7b72" }}>groundingNotes:</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {sourceTrace.groundingNotes.map((n, i) => (
                    <li key={i} style={{ color: "#7a5a52" }}>· {n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* videoScript 摘要 */}
        {videoScript && (videoScript.title || videoScript.scenes.length > 0) && (
          <>
            <hr style={{ borderColor: "#e0d4cc" }} />
            <section>
              <p className="font-semibold mb-2" style={{ color: "#5a3d35" }}>videoScript</p>
              <div className="space-y-1 font-mono">
                <div className="flex gap-2">
                  <span style={{ color: "#9d7b72" }}>title:</span>
                  <span style={{ color: "#3d2c2c" }}>{videoScript.title || "—"}</span>
                </div>
                <div className="flex gap-2">
                  <span style={{ color: "#9d7b72" }}>duration:</span>
                  <span style={{ color: "#3d2c2c" }}>{videoScript.duration}</span>
                </div>
                <div className="flex gap-2">
                  <span style={{ color: "#9d7b72" }}>scenes:</span>
                  <span style={{ color: "#3d2c2c" }}>{videoScript.scenes.length} 个场景</span>
                </div>
                {videoScript.musicMood && (
                  <div className="flex gap-2">
                    <span style={{ color: "#9d7b72" }}>musicMood:</span>
                    <span style={{ color: "#3d2c2c" }}>{videoScript.musicMood}</span>
                  </div>
                )}
                {videoScript.endingLine && (
                  <div className="flex gap-2">
                    <span style={{ color: "#9d7b72" }}>endingLine:</span>
                    <span style={{ color: "#3d2c2c" }}>{videoScript.endingLine}</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
