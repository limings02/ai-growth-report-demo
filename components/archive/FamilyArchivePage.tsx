"use client";

// components/archive/FamilyArchivePage.tsx
// family 历史成长册列表页（Phase 13.4）。
// 读取 localStorage memory_wiki_archive_v1，只展示 mode === "family" 的 ArchiveItem。
// 点击卡片进入详情回看；支持删除单条（二次确认）和清空 family（二次确认）。
// 清空只删除 family mode，不影响其他 mode 的 ArchiveItem。
// 不保存照片 blob；不做编辑；不做导出/导入；不做云同步。

import { useState } from "react";
import type { ArchiveItem } from "@/lib/archive";
import {
  readArchiveCollection,
  deleteArchiveItem,
  deleteArchiveItemsByMode,
} from "@/lib/archive";
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

function loadFamilyArchiveItems(): ArchiveItem[] {
  if (typeof window === "undefined") return [];
  return readArchiveCollection().items.filter((item) => item.mode === "family");
}

export default function FamilyArchivePage({
  onBackToLanding,
  onCreateNew,
  onBackToHome,
}: Props) {
  // 懒初始化，SSR 安全；items 可更新（删除/清空后调用 refreshItems）
  const [items, setItems] = useState<ArchiveItem[]>(() => loadFamilyArchiveItems());
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [operationMessage, setOperationMessage] = useState<string | null>(null);

  function refreshItems() {
    setItems(loadFamilyArchiveItems());
  }

  // ── 单条删除 ────────────────────────────────────────────────────
  function handleDeleteConfirm(id: string) {
    const ok = deleteArchiveItem(id);
    if (ok) {
      setOperationMessage("已删除这本成长册");
      // 如果当前详情页展示的就是被删除的 item，回到列表
      if (selectedItem?.id === id) setSelectedItem(null);
    } else {
      setOperationMessage("删除失败，请稍后重试");
    }
    setPendingDeleteId(null);
    refreshItems();
  }

  // ── 清空 family ─────────────────────────────────────────────────
  function handleClearConfirm() {
    const ok = deleteArchiveItemsByMode("family");
    if (ok) {
      setOperationMessage("已清空本地成长册");
    } else {
      setOperationMessage("清空失败，请稍后重试");
    }
    setConfirmClear(false);
    refreshItems();
  }

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
        <p className="text-sm mb-4" style={{ color: "#9d7b72" }}>
          保存在当前浏览器中的本地记忆 · 仅本设备可见
        </p>

        {/* 操作反馈 */}
        {operationMessage && (
          <div
            className="mb-5 rounded-xl px-4 py-2 text-sm"
            style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }}
          >
            {operationMessage}
          </div>
        )}

        {/* 空状态 */}
        {items.length === 0 && (
          <div
            className="rounded-3xl p-10 text-center mt-4"
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
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl p-5 transition-all hover:shadow-sm"
                  style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
                >
                  <div className="flex items-start gap-3">
                    {/* 卡片主体点击进入详情 */}
                    <button
                      type="button"
                      onClick={() => {
                        setPendingDeleteId(null);
                        setSelectedItem(item);
                      }}
                      className="flex-1 text-left cursor-pointer"
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
                        {item.localOnly && <span>🔒 仅本设备</span>}
                      </div>
                    </button>

                    {/* 删除操作区（独立于卡片点击，避免 button 嵌套） */}
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
                            setConfirmClear(false);
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

            {/* 清空操作区 */}
            <div
              className="mt-10 pt-6"
              style={{ borderTop: "1px solid #f0ddd5" }}
            >
              <p className="text-xs mb-3" style={{ color: "#c0a090" }}>
                危险操作 · 清空只影响家庭成长册，不影响未来其他类型记忆
              </p>
              {confirmClear ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "#7a5a52" }}>
                    确认清空所有家庭成长册？
                  </span>
                  <button
                    type="button"
                    onClick={handleClearConfirm}
                    className="text-sm px-3 py-1.5 rounded-full cursor-pointer"
                    style={{ background: "#fff0ee", color: "#c0674a", border: "1px solid #f4b8a0" }}
                  >
                    确认清空
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="text-sm px-3 py-1.5 rounded-full cursor-pointer"
                    style={{ background: "#f5f0ee", color: "#9d7b72" }}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPendingDeleteId(null);
                    setConfirmClear(true);
                  }}
                  className="text-sm cursor-pointer hover:underline"
                  style={{ color: "#c0a090" }}
                >
                  清空本地成长册
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
