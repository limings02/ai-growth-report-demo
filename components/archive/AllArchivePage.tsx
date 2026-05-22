"use client";

// components/archive/AllArchivePage.tsx
// 跨 mode 统一 archive 列表页（Phase 13.9）。
// 支持 mode 筛选、关键词搜索、单条删除（二次确认）。
// 详情回看：family/couple/personal/memorial 各自 preview，均不显示"保存到本地"。
// 不做统一清空/导出/导入；family 专属管理页（FamilyArchivePage）负责这些。

import { useState } from "react";
import type { ArchiveItem, ArchiveMode } from "@/lib/archive";
import { readArchiveCollection, deleteArchiveItem } from "@/lib/archive";
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

type ModeFilter = "all" | ArchiveMode;

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

const MODE_FILTERS: { value: ModeFilter; label: string }[] = [
  { value: "all",      label: "全部" },
  { value: "family",   label: "家庭" },
  { value: "couple",   label: "情侣" },
  { value: "personal", label: "个人" },
  { value: "memorial", label: "纪念" },
];

function isSupportedArchiveMode(mode: string): mode is ArchiveMode {
  return mode === "family" || mode === "couple" || mode === "personal" || mode === "memorial";
}

function loadAllArchiveItems(): ArchiveItem[] {
  if (typeof window === "undefined") return [];
  return [...readArchiveCollection().items]
    .filter((item) => isSupportedArchiveMode(item.mode))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function formatArchiveDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知时间";
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

function archiveItemMatchesQuery(item: ArchiveItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    item.title,
    item.summary,
    ...item.keywords,
    item.source.inputTitle,
    item.source.inputSummary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export default function AllArchivePage({ onBackToHome, onCreateNewByMode }: Props) {
  const [items, setItems] = useState<ArchiveItem[]>(() => loadAllArchiveItems());
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [operationMessage, setOperationMessage] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<"success" | "error">("success");

  function showOperationMessage(message: string, status: "success" | "error" = "success") {
    setOperationMessage(message);
    setOperationStatus(status);
  }

  function refreshItems() {
    setItems(loadAllArchiveItems());
  }

  function handleDeleteConfirm(id: string) {
    const ok = deleteArchiveItem(id);
    if (ok) {
      showOperationMessage("已删除这份记忆");
      if (selectedItem?.id === id) setSelectedItem(null);
    } else {
      showOperationMessage("删除失败，请稍后重试", "error");
    }
    setPendingDeleteId(null);
    refreshItems();
  }

  // ── 筛选 + 搜索 ──────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    const modeMatched = modeFilter === "all" || item.mode === modeFilter;
    const queryMatched = archiveItemMatchesQuery(item, searchQuery);
    return modeMatched && queryMatched;
  });

  // ── 详情回看（均不显示"保存到本地"）────────────────────────────

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
        <p className="text-sm mb-5" style={{ color: "#9d7b72" }}>
          保存在当前浏览器中的所有记忆册 · 仅本设备可见
        </p>

        {/* 操作反馈 */}
        {operationMessage && (
          <div
            className="mb-4 rounded-xl px-4 py-2 text-sm"
            style={
              operationStatus === "error"
                ? { background: "#fff0ee", color: "#c0674a", border: "1px solid #f4b8a0" }
                : { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }
            }
          >
            {operationMessage}
          </div>
        )}

        {/* 有数据时才显示筛选 + 搜索 */}
        {items.length > 0 && (
          <>
            {/* mode 筛选按钮 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {MODE_FILTERS.map((filter) => {
                const isActive = modeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setModeFilter(filter.value)}
                    className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all"
                    style={
                      isActive
                        ? { background: "#e07a5f", color: "white" }
                        : { background: "#f5f0ee", color: "#9d7b72" }
                    }
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* 搜索框 */}
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索标题、摘要或关键词"
              className="w-full text-sm px-4 py-2 rounded-xl mb-6 outline-none"
              style={{
                background: "#fff8f5",
                border: "1px solid #f0ddd5",
                color: "#2d1f1a",
              }}
            />
          </>
        )}

        {/* 完全没有 archive */}
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

        {/* 筛选/搜索无结果 */}
        {items.length > 0 && filteredItems.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "#fff8f5", border: "1px solid #f0ddd5" }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "#7a5a52" }}>
              没有找到匹配的记忆册
            </p>
            <p className="text-xs" style={{ color: "#b08878" }}>
              可以切换筛选条件，或清空搜索词。
            </p>
          </div>
        )}

        {/* 卡片列表（响应式双列；卡片改为 article + 内嵌 button 避免嵌套）*/}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl p-5 transition-all hover:shadow-sm"
                style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
              >
                <div className="flex items-start gap-2">
                  {/* 卡片主体点击进入详情 */}
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeleteId(null);
                      setSelectedItem(item);
                    }}
                    className="flex-1 text-left cursor-pointer"
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

                  {/* 删除操作区（独立，避免嵌套 button）*/}
                  <div className="flex-shrink-0 flex flex-col items-end gap-1 pt-0.5">
                    {pendingDeleteId === item.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDeleteConfirm(item.id)}
                          className="text-xs px-2.5 py-1 rounded-full cursor-pointer"
                          style={{ background: "#fff0ee", color: "#c0674a", border: "1px solid #f4b8a0" }}
                        >
                          确认删除
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="text-xs px-2.5 py-1 rounded-full cursor-pointer"
                          style={{ background: "#f5f0ee", color: "#9d7b72" }}
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(item.id);
                        }}
                        className="text-xs cursor-pointer hover:underline"
                        style={{ color: "#c0a090" }}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
