// lib/archive/exportArchive.ts
// family archive JSON 导出工具（Phase 13.5）
// 不引入依赖；不做导入；不保存照片 blob。

import type { ArchiveItem, ArchiveMode } from "./types";

export type ArchiveExportBundle = {
  exportVersion: "1";
  exportedAt: string;       // ISO 8601
  mode: ArchiveMode;        // 当前只支持 "family"
  itemCount: number;
  items: ArchiveItem[];     // 只含指定 mode 的 item，不含照片 blob
};

/** 构造导出 bundle，只保留指定 mode 的 item。 */
export function createArchiveExportBundle(params: {
  mode: ArchiveMode;
  items: ArchiveItem[];
  now?: Date;
}): ArchiveExportBundle {
  const { mode, items, now = new Date() } = params;
  const filteredItems = items.filter((item) => item.mode === mode);
  return {
    exportVersion: "1",
    exportedAt: now.toISOString(),
    mode,
    itemCount: filteredItems.length,
    items: filteredItems,
  };
}

/** 生成导出文件名，格式：memory-wiki-{mode}-archive-YYYYMMDD.json */
export function createArchiveExportFileName(params: {
  mode: ArchiveMode;
  now?: Date;
}): string {
  const { mode, now = new Date() } = params;
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `memory-wiki-${mode}-archive-${yyyy}${mm}${dd}.json`;
}

/**
 * 触发浏览器下载 JSON 文件。
 * SSR 安全：window / document 不存在时返回 false。
 * 失败时捕获异常返回 false，不抛出。
 */
export function downloadJsonFile(params: {
  fileName: string;
  data: unknown;
}): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    const json = JSON.stringify(params.data, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = params.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
