"use client";

// components/archive/FamilyArchivePage.tsx
// family 历史成长册列表页（Phase 13.3）。
// 读取 localStorage memory_wiki_archive_v1，只展示 mode === "family" 的 ArchiveItem。
// 点击卡片进入详情回看（复用 FamilyArtifactPreview，不显示"保存"按钮）。
// 不保存、不读取照片 blob；不做删除/编辑；不做云同步。

import { useState } from "react";
import type { ArchiveItem } from "@/lib/archive";
import { readArchiveCollection } from "@/lib/archive";
import FamilyArtifactPreview from "@/components/family/FamilyArtifactPreview";

type Props = {
  onBackToLanding: () => void;
  onCreateNew: () => void;
  onBackToHome: () => void;
};

function formatArchiveDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知时间";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FamilyArchivePage({
  onBackToLanding,
  onCreateNew,
  onBackToHome,
}: Props) {
  // 懒初始化：只在客户端 mount 时读取一次 localStorage（SSR 返回空数组）
  const [items] = useState<ArchiveItem[]>(() => {
    if (typeof window === "undefined") return [];
    return readArchiveCollection().items.filter((item) => item.mode === "family");
  });
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  // 详情回看：复用 FamilyArtifactPreview，禁用保存按钮
  if (selectedItem) {
    return (
      <FamilyArtifactPreview
        artifact={selectedItem.artifact}
        backLabel="← 返回我的成长册"
        onBackToEdit={() => setSelectedItem(null)}
        onCreateAnother={onCreateNew}
        onBackToHome={onBackToHome}
        showArchiveSaveButton={false}
      />
    );
  }

  // 列表页
  return (
    <div className="min-h-screen" style={{ background: "#fffaf7" }}>
      {/* 顶部 sticky 导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between gap-3"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBackToLanding}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#9d7b72" }}
        >
          ← 返回家庭成长册
        </button>
        <button
          onClick={onCreateNew}
          className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
          style={{ background: "#fde8dc", color: "#c0674a" }}
        >
          + 新建成长册
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
        {/* 标题区 */}
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#2d1f1a" }}>
          我的成长册
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9d7b72" }}>
          保存在当前浏览器中的本地记忆 · 仅本设备可见
        </p>

        {/* 空状态 */}
        {items.length === 0 && (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: "#fff8f5", border: "1.5px dashed #f0ddd5" }}
          >
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-base font-semibold mb-2" style={{ color: "#7a5a52" }}>
              还没有保存过成长册
            </p>
            <p className="text-sm mb-6" style={{ color: "#b08878" }}>
              生成一本成长册后，点击结果页的「保存到本地」即可在这里回看。
            </p>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 rounded-full text-white text-sm font-semibold cursor-pointer shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
            >
              去生成第一本成长册 ✨
            </button>
          </div>
        )}

        {/* 列表 */}
        {items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="w-full text-left rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer"
                style={{
                  background: "#fffaf7",
                  border: "1px solid #f0ddd5",
                }}
              >
                {/* 标题 + 日期 */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-base font-bold leading-snug" style={{ color: "#2d1f1a" }}>
                    {item.title}
                  </h2>
                  <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "#b08878" }}>
                    {formatArchiveDate(item.createdAt)}
                  </span>
                </div>

                {/* 摘要 */}
                {item.summary && (
                  <p
                    className="text-sm mb-3 line-clamp-2 leading-relaxed"
                    style={{ color: "#7a5a52" }}
                  >
                    {item.summary}
                  </p>
                )}

                {/* 关键词 */}
                {item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: "#fde8dc", color: "#c0674a" }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* 底部 metadata */}
                <div className="flex items-center gap-3 text-xs" style={{ color: "#c0a090" }}>
                  {item.source.sourceQuestionCount !== undefined && (
                    <span>📝 {item.source.sourceQuestionCount} 条问答</span>
                  )}
                  {item.source.photoCount !== undefined && item.source.photoCount > 0 && (
                    <span>📷 {item.source.photoCount} 张照片</span>
                  )}
                  {item.localOnly && (
                    <span>🔒 仅本设备</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
