"use client";

// components/archive/FamilyArchivePage.tsx
// family 历史成长册列表页（Phase 13.6）。
// 读取 localStorage memory_wiki_archive_v1，只展示 mode === "family" 的 ArchiveItem。
// 点击卡片进入详情回看；支持删除单条/清空 family/导出 JSON/导入 JSON。
// 导入采用非破坏性合并：相同 id 跳过，不覆盖；不导入 previewUrl/blob/File。
// 清空/导出/导入只影响 family mode，不影响其他 mode 的 ArchiveItem。
// 不保存照片 blob；不做编辑；不做云同步。

import { useRef, useState } from "react";
import type { ArchiveItem } from "@/lib/archive";
import {
  readArchiveCollection,
  deleteArchiveItem,
  deleteArchiveItemsByMode,
  createArchiveExportBundle,
  createArchiveExportFileName,
  downloadJsonFile,
  parseArchiveImportText,
  importArchiveItemsFromBundle,
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
  // 懒初始化，SSR 安全；items 可更新（删除/清空/导入后调用 refreshItems）
  const [items, setItems] = useState<ArchiveItem[]>(() => loadFamilyArchiveItems());
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [operationMessage, setOperationMessage] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<"success" | "error">("success");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  function showOperationMessage(message: string, status: "success" | "error" = "success") {
    setOperationMessage(message);
    setOperationStatus(status);
  }

  function refreshItems() {
    setItems(loadFamilyArchiveItems());
  }

  // ── 单条删除 ────────────────────────────────────────────────────
  function handleDeleteConfirm(id: string) {
    const ok = deleteArchiveItem(id);
    if (ok) {
      showOperationMessage("已删除这本成长册");
      if (selectedItem?.id === id) setSelectedItem(null);
    } else {
      showOperationMessage("删除失败，请稍后重试", "error");
    }
    setPendingDeleteId(null);
    refreshItems();
  }

  // ── 清空 family ─────────────────────────────────────────────────
  function handleClearConfirm() {
    const ok = deleteArchiveItemsByMode("family");
    if (ok) {
      showOperationMessage("已清空本地成长册");
    } else {
      showOperationMessage("清空失败，请稍后重试", "error");
    }
    setConfirmClear(false);
    refreshItems();
  }

  // ── 导出 JSON ───────────────────────────────────────────────────
  function handleExportFamilyArchive() {
    if (items.length === 0) {
      showOperationMessage("没有可导出的成长册", "error");
      return;
    }
    const bundle = createArchiveExportBundle({ mode: "family", items });
    const fileName = createArchiveExportFileName({ mode: "family" });
    const ok = downloadJsonFile({ fileName, data: bundle });
    if (ok) {
      showOperationMessage(`已导出 ${bundle.itemCount} 本成长册`);
    } else {
      showOperationMessage("导出失败，请稍后重试", "error");
    }
  }

  // ── 导入 JSON ───────────────────────────────────────────────────
  function handleImportButtonClick() {
    importInputRef.current?.click();
  }

  async function handleImportFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 重置 input，允许重复选择同一文件
    event.target.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      showOperationMessage("请选择 JSON 文件", "error");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseArchiveImportText(text);
      if (!parsed.ok || !parsed.bundle) {
        showOperationMessage(parsed.error ?? "导入文件无效", "error");
        return;
      }

      const result = importArchiveItemsFromBundle({
        bundle: parsed.bundle,
        mode: "family",
      });

      if (!result.ok) {
        showOperationMessage(result.error ?? "导入失败，请稍后重试", "error");
        return;
      }

      refreshItems();

      if (result.importedCount === 0) {
        showOperationMessage(
          `没有新增成长册，跳过重复 ${result.skippedDuplicateCount} 条，拒绝 ${result.rejectedCount} 条`,
          result.rejectedCount > 0 ? "error" : "success"
        );
      } else {
        showOperationMessage(
          `已导入 ${result.importedCount} 本成长册，跳过重复 ${result.skippedDuplicateCount} 条，拒绝 ${result.rejectedCount} 条`
        );
      }
    } catch {
      showOperationMessage("读取文件失败，请稍后重试", "error");
    }
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
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleExportFamilyArchive}
              title="导出当前浏览器中的家庭成长册 JSON 备份"
              className="text-sm px-3 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
              style={{ background: "#e8f5e9", color: "#2e7d32" }}
            >
              导出 JSON
            </button>
          )}
          <button
            type="button"
            onClick={handleImportButtonClick}
            title="从 JSON 备份恢复家庭成长册"
            className="text-sm px-3 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#f5f0ee", color: "#9d7b72" }}
          >
            导入 JSON
          </button>
          <button
            onClick={onCreateNew}
            className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#fde8dc", color: "#c0674a" }}
          >
            + 新建成长册
          </button>
        </div>
        {/* 隐藏的文件选择 input（由导入按钮触发）*/}
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFileChange}
        />
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
            style={
              operationStatus === "error"
                ? { background: "#fff0ee", color: "#c0674a", border: "1px solid #f4b8a0" }
                : { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }
            }
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

            {/* 数据说明 + 清空操作区 */}
            <div
              className="mt-10 pt-6"
              style={{ borderTop: "1px solid #f0ddd5" }}
            >
              <p className="text-xs mb-2" style={{ color: "#c0a090" }}>
                导出的 JSON 包含 AI 生成内容与低敏来源摘要，不包含原始照片文件。
              </p>
              <p className="text-xs mb-4" style={{ color: "#c0a090" }}>
                导入 JSON 时会跳过本地已存在的同 id 记录，不覆盖已有成长册。
              </p>
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
