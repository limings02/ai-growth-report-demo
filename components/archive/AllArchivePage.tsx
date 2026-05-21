"use client";

// components/archive/AllArchivePage.tsx
// 跨 mode 统一 archive 列表页（Phase 13.8）。
// 只读：展示所有 mode 的 ArchiveItem，按 updatedAt 倒序。
// 点击卡片按 mode 进入对应详情回看（不显示"保存到本地"）。
// 不做删除/清空/导出/导入；这些由 FamilyArchivePage 负责。

import { useState } from "react";
import type { ArchiveItem, ArchiveMode } from "@/lib/archive";
import { readArchiveCollection } from "@/lib/archive";
import type { MemoryMode } from "@/lib/memory-core/modes";
import FamilyArtifactPreview from "@/components/family/FamilyArtifactPreview";
import CoupleArtifactPreview from "@/components/couple/CoupleArtifactPreview";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import PersonalMemoryGraphPreview from "@/components/personal/PersonalMemoryGraphPreview";
import MemorialMemoryGraphPreview from "@/components/memorial/MemorialMemoryGraphPreview";

type Props = {
  onBackToHome: () => void;
  onCreateNewByMode: (mode: MemoryMode) => void;
};

const MODE_LABEL: Record<ArchiveMode, string> = {
  family:   "家庭成长册",
  couple:   "恋爱纪念册",
  personal: "个人回忆录",
  memorial: "纪念册",
};

const MODE_EMOJI: Record<ArchiveMode, string> = {
  family:   "🌱",
  couple:   "💑",
  personal: "📖",
  memorial: "🕯️",
};

const MODE_BADGE_STYLE: Record<ArchiveMode, React.CSSProperties> = {
  family:   { background: "#e8f5e9", color: "#2e7d32" },
  couple:   { background: "#fce4ec", color: "#c62828" },
  personal: { background: "#e3f2fd", color: "#1565c0" },
  memorial: { background: "#f3e5f5", color: "#6a1b9a" },
};

function loadAllArchiveItems(): ArchiveItem[] {
  if (typeof window === "undefined") return [];
  return [...readArchiveCollection().items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function formatArchiveDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知时间";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AllArchivePage({ onBackToHome, onCreateNewByMode }: Props) {
  const [items] = useState<ArchiveItem[]>(() => loadAllArchiveItems());
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  // ── 详情回看（按 mode 渲染，均不显示"保存到本地"）────────────

  if (selectedItem?.mode === "family") {
    return (
      <FamilyArtifactPreview
        artifact={selectedItem.artifact}
        backLabel="← 返回我的记忆档案"
        onBackToEdit={() => setSelectedItem(null)}
        onCreateAnother={() => onCreateNewByMode("family")}
        onBackToHome={onBackToHome}
        showArchiveSaveButton={false}
      />
    );
  }

  if (selectedItem?.mode === "couple") {
    return (
      <CoupleArtifactPreview
        artifact={selectedItem.artifact}
        onBackToEdit={() => setSelectedItem(null)}
        onCreateAnother={() => onCreateNewByMode("couple")}
        onBackToHome={onBackToHome}
        showArchiveSaveButton={false}
      />
    );
  }

  if (selectedItem?.mode === "personal") {
    return (
      <MemoryArtifactPreview
        artifact={selectedItem.artifact}
        onBackToEdit={() => setSelectedItem(null)}
        onCreateAnother={() => onCreateNewByMode("personal")}
        onBackToHome={onBackToHome}
        backLabel="← 返回我的记忆档案"
        modeLabel="个人回忆录"
        badge="📖 个人回忆录"
        fallbackTitle="个人回忆录"
        printBrandText="由 Memory Wiki 生成"
        emptyKeywordsHint="还没有提炼出稳定关键词。"
        timelineTitle="⏱ 人生阶段时间线"
        emptyTimelineHint="还没有足够材料生成时间线。"
        longFormFallbackTitle="写给未来自己的信"
        socialPostsTitle="📱 分享文案"
        emptySocialPostsHint="这次没有生成分享文案。"
        usagePrimaryTip="你可以把这份个人回忆录保存成 PDF，作为阶段总结、生日礼物或未来回看的材料。"
        usageSecondaryTip="如果想生成新版本，可以重新创建一份个人回忆录。"
        graphSlot={<PersonalMemoryGraphPreview graph={selectedItem.artifact.graph} />}
      />
    );
  }

  if (selectedItem?.mode === "memorial") {
    return (
      <MemoryArtifactPreview
        artifact={selectedItem.artifact}
        onBackToEdit={() => setSelectedItem(null)}
        onCreateAnother={() => onCreateNewByMode("memorial")}
        onBackToHome={onBackToHome}
        backLabel="← 返回我的记忆档案"
        modeLabel="纪念册"
        badge="🕯️ 纪念册"
        fallbackTitle="纪念册"
        printBrandText="由 Memory Wiki 整理"
        emptyKeywordsHint="还没有提炼出关键词。"
        timelineTitle="⏱ 人生片段时间线"
        emptyTimelineHint="还没有足够材料生成时间线。"
        longFormFallbackTitle="写给家人的纪念文"
        socialPostsTitle="📱 纪念页文案"
        emptySocialPostsHint="这次没有生成纪念文案。"
        usagePrimaryTip="你可以把这份纪念册保存成 PDF，作为家庭记忆资料长期留存。"
        usageSecondaryTip="如果想生成新版本，可以重新创建一份纪念册。"
        graphSlot={<MemorialMemoryGraphPreview graph={selectedItem.artifact.graph} />}
      />
    );
  }

  // ── 列表页 ────────────────────────────────────────────────────
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
          onClick={onBackToHome}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#9d7b72" }}
        >
          ← 返回首页
        </button>
        <button
          onClick={onBackToHome}
          className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
          style={{ background: "#fde8dc", color: "#c0674a" }}
        >
          + 新建记忆
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        {/* 标题区 */}
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#2d1f1a" }}>
          我的记忆档案
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9d7b72" }}>
          保存在当前浏览器中的所有记忆册 · 仅本设备可见
        </p>

        {/* 空状态 */}
        {items.length === 0 && (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: "#fff8f5", border: "1.5px dashed #f0ddd5" }}
          >
            <div className="text-4xl mb-4">🌌</div>
            <p className="text-base font-semibold mb-2" style={{ color: "#7a5a52" }}>
              还没有保存过记忆册
            </p>
            <p className="text-sm mb-6" style={{ color: "#b08878" }}>
              在任意 mode 生成结果后，点击「保存到本地」即可在这里汇总回看。
            </p>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 rounded-full text-white text-sm font-semibold cursor-pointer shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
            >
              去创建第一份记忆 ✨
            </button>
          </div>
        )}

        {/* 卡片列表（响应式双列）*/}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="text-left rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer"
                style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
              >
                {/* mode badge + 日期 */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={MODE_BADGE_STYLE[item.mode as ArchiveMode]}
                  >
                    {MODE_EMOJI[item.mode as ArchiveMode]} {MODE_LABEL[item.mode as ArchiveMode]}
                  </span>
                  <span className="text-xs flex-shrink-0" style={{ color: "#b08878" }}>
                    {formatArchiveDate(item.createdAt)}
                  </span>
                </div>

                {/* 标题 */}
                <h2 className="text-base font-bold leading-snug mb-2" style={{ color: "#2d1f1a" }}>
                  {item.title}
                </h2>

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
                  {item.localOnly && <span>🔒 仅本设备</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
