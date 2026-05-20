"use client";

// components/family/FamilyArtifactPreview.tsx
// family mode 的 MemoryArtifactPreview wrapper。
//
// 页面结构：
// - 封面（cover）
// - 照片区（afterCoverSections）— print:hidden，紧接封面增强礼物感
// - 时间线 / 信件 / 分享文案 / 星图 / 质量说明 / 使用建议
// - 原始记录折叠区（extraSections）— print:hidden，位置靠后，不干扰主叙事
//
// 照片打印策略：照片区 print:hidden，不纳入礼物 PDF。
// 原始记录打印策略：折叠区 print:hidden，不适合直接打印。

import { useState } from "react";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import type { RawMaterial, PhotoItem } from "@/lib/types";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import FamilyMemoryGraphPreview from "./FamilyMemoryGraphPreview";

const MAX_PHOTOS = 6;

const STYLE_LABEL: Record<string, string> = {
  warm:     "温馨版",
  literary: "文艺版",
  simple:   "简洁版",
};

type Props = {
  artifact: MemoryArtifact;
  rawMaterial?: RawMaterial;   // 照片/原始记录承接；Phase 12.4A 后为常规传入
  photos?: PhotoItem[];        // 本地预览，不上传，不传 AI
  backLabel?: string;          // 透传给 MemoryArtifactPreview 的返回按钮文案
  onBackToEdit: () => void;
  onCreateAnother: () => void;
  onBackToHome?: () => void;
};

export default function FamilyArtifactPreview({
  artifact,
  rawMaterial,
  photos,
  backLabel,
  onBackToEdit,
  onCreateAnother,
  onBackToHome,
}: Props) {
  const [rawMaterialOpen, setRawMaterialOpen] = useState(false);
  const visiblePhotos = photos?.slice(0, MAX_PHOTOS) ?? [];

  // ── 照片区（afterCoverSections：封面后、时间线前）────────────
  // print:hidden — 照片不纳入礼物 PDF
  const familyAfterCoverSections = visiblePhotos.length > 0 ? (
    <div
      className="print:hidden rounded-2xl p-5 mb-5"
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      <p className="text-xs font-semibold mb-3" style={{ color: "#9d7b72" }}>
        📷 这一年的照片
        {photos && photos.length > MAX_PHOTOS && (
          <span className="ml-1 font-normal" style={{ color: "#c0a090" }}>
            （展示前 {MAX_PHOTOS} 张，共 {photos.length} 张）
          </span>
        )}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {visiblePhotos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square rounded-xl overflow-hidden"
            style={{ border: "1px solid #f0ddd5" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.previewUrl}
              alt="成长照片"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // ── 原始记录折叠区（extraSections：页面底部）─────────────────
  // print:hidden — 折叠交互区不适合打印
  const familyExtraSections = rawMaterial ? (
    <div
      className="print:hidden rounded-2xl p-5 mb-5"
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      <button
        type="button"
        onClick={() => setRawMaterialOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold cursor-pointer hover:underline"
        style={{ color: "#9d7b72" }}
      >
        <span>{rawMaterialOpen ? "▾" : "▸"}</span>
        <span>📋 原始记录</span>
      </button>

      {rawMaterialOpen && (
        <div className="mt-3 space-y-3 text-xs" style={{ color: "#7a5a52" }}>
          <div
            className="rounded-xl p-4 space-y-1"
            style={{ background: "#fff8f5", border: "1px solid #f0ddd5" }}
          >
            <p><span className="font-medium">孩子昵称：</span>{rawMaterial.childName}</p>
            {rawMaterial.childAge !== "" && (
              <p><span className="font-medium">年龄：</span>{rawMaterial.childAge} 岁</p>
            )}
            <p><span className="font-medium">年份：</span>{rawMaterial.reportYear}</p>
            <p><span className="font-medium">父母称呼：</span>{rawMaterial.parentName}</p>
            <p><span className="font-medium">风格：</span>{STYLE_LABEL[rawMaterial.style] ?? rawMaterial.style}</p>
            {rawMaterial.photoUrls.length > 0 && (
              <p><span className="font-medium">照片数量：</span>{rawMaterial.photoUrls.length} 张（仅本地预览）</p>
            )}
          </div>

          {rawMaterial.qaList.length > 0 && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: "#fff8f5", border: "1px solid #f0ddd5" }}
            >
              <p className="font-semibold" style={{ color: "#9d7b72" }}>回答的问题</p>
              {rawMaterial.qaList.map((qa, i) => (
                <div key={i}>
                  <p className="font-medium mb-0.5">{qa.question}</p>
                  <p className="leading-relaxed" style={{ color: "#5a4a42" }}>{qa.answer}</p>
                </div>
              ))}
            </div>
          )}

          {rawMaterial.freeNote?.trim() && (
            <div
              className="rounded-xl p-4"
              style={{ background: "#fff8f5", border: "1px solid #f0ddd5" }}
            >
              <p className="font-semibold mb-1" style={{ color: "#9d7b72" }}>自由记录</p>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: "#5a4a42" }}>
                {rawMaterial.freeNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <MemoryArtifactPreview
      artifact={artifact}
      onBackToEdit={onBackToEdit}
      onCreateAnother={onCreateAnother}
      onBackToHome={onBackToHome}
      backLabel={backLabel}
      modeLabel="家庭成长册"
      badge="🌱 家庭成长册"
      fallbackTitle="家庭成长册"
      printBrandText="由 Memory Wiki 生成"
      emptyKeywordsHint="还没有提炼出成长关键词。可以补充更具体的事件、习惯、作品或亲子互动后重新生成。"
      timelineTitle="⏱ 成长时间线"
      emptyTimelineHint="还没有足够材料生成成长时间线。可以补充具体月份、事件、第一次、变化或亲子片段。"
      longFormFallbackTitle="写给未来孩子的信"
      socialPostsTitle="📱 分享文案"
      emptySocialPostsHint="这次没有生成分享文案。可以补充更具体的成长瞬间或想分享给亲友的话。"
      usagePrimaryTip="你可以把这份成长册保存成 PDF，作为生日、毕业、18 岁成人礼或家庭纪念资料留存。"
      usageSecondaryTip="如果想让下一版更贴近真实成长，可以补充更具体的时间、地点、孩子说过的话、作品、照片背景和亲子互动。"
      graphSlot={<FamilyMemoryGraphPreview graph={artifact.graph} />}
      afterCoverSections={familyAfterCoverSections}
      extraSections={familyExtraSections}
    />
  );
}
