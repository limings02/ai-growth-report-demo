// lib/archive/importArchive.ts
// family archive JSON 导入工具（Phase 13.6）
// 非破坏性合并：相同 id 默认跳过，不覆盖；不导入 previewUrl/blob/File；
// 不误删其他 mode 的 ArchiveItem；遵守 MAX_ARCHIVE_ITEMS 上限。

import type { ArchiveItem, ArchiveMode } from "./types";
import type { ArchiveExportBundle } from "./exportArchive";
import {
  MAX_ARCHIVE_ITEMS,
  readArchiveCollection,
  writeArchiveCollection,
} from "./localArchiveStore";

export type ArchiveImportResult = {
  ok: boolean;
  importedCount: number;
  skippedDuplicateCount: number;
  rejectedCount: number;
  error?: string;
};

// ── 校验 ─────────────────────────────────────────────────────────

export function validateArchiveExportBundle(input: unknown): {
  ok: boolean;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "导入文件不是有效的 archive 对象" };
  }
  const bundle = input as Partial<ArchiveExportBundle>;
  if (bundle.exportVersion !== "1") {
    return { ok: false, error: "暂不支持该导出文件版本" };
  }
  if (bundle.mode !== "family") {
    return { ok: false, error: "当前只支持导入家庭成长册 archive" };
  }
  if (!Array.isArray(bundle.items)) {
    return { ok: false, error: "导入文件缺少 items 数组" };
  }
  return { ok: true };
}

export function parseArchiveImportText(text: string): {
  ok: boolean;
  bundle?: ArchiveExportBundle;
  error?: string;
} {
  try {
    const parsed = JSON.parse(text) as unknown;
    const validation = validateArchiveExportBundle(parsed);
    if (!validation.ok) return { ok: false, error: validation.error };
    return { ok: true, bundle: parsed as ArchiveExportBundle };
  } catch {
    return { ok: false, error: "JSON 文件格式错误，无法解析" };
  }
}

// ── 单 item 防御 ──────────────────────────────────────────────────

function isValidArchiveItemForMode(item: unknown, mode: ArchiveMode): item is ArchiveItem {
  if (!item || typeof item !== "object") return false;
  const c = item as Partial<ArchiveItem>;
  return (
    typeof c.id === "string" &&
    c.mode === mode &&
    typeof c.title === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.updatedAt === "string" &&
    typeof c.artifactVersion === "string" &&
    c.localOnly === true &&
    !!c.artifact &&
    typeof c.artifact === "object"
  );
}

/** 检查是否包含 previewUrl/blob:/File 等不应导入的临时字段。 */
function containsBlockedPhotoFields(item: ArchiveItem): boolean {
  const json = JSON.stringify(item);
  return (
    json.includes("previewUrl") ||
    json.includes("blob:") ||
    json.includes('"file"') ||
    json.includes('"File"')
  );
}

// ── 导入 ─────────────────────────────────────────────────────────

/**
 * 非破坏性合并导入：
 * - 相同 id 跳过，不覆盖本地已有 item
 * - 只导入 bundle.mode === mode 的 item
 * - 不影响 mode !== mode 的其他 ArchiveItem
 * - 遵守 MAX_ARCHIVE_ITEMS 全局上限
 */
export function importArchiveItemsFromBundle(params: {
  bundle: ArchiveExportBundle;
  mode: ArchiveMode;
}): ArchiveImportResult {
  const { bundle, mode } = params;

  if (bundle.mode !== mode) {
    return {
      ok: false,
      importedCount: 0,
      skippedDuplicateCount: 0,
      rejectedCount: 0,
      error: "导入文件 mode 与当前页面不匹配",
    };
  }

  const collection = readArchiveCollection();
  const existingIds = new Set(collection.items.map((item) => item.id));

  const nonTargetItems = collection.items.filter((item) => item.mode !== mode);
  const existingTargetItems = collection.items.filter((item) => item.mode === mode);

  const importedItems: ArchiveItem[] = [];
  let skippedDuplicateCount = 0;
  let rejectedCount = 0;

  for (const rawItem of bundle.items) {
    if (!isValidArchiveItemForMode(rawItem, mode)) {
      rejectedCount += 1;
      continue;
    }
    if (containsBlockedPhotoFields(rawItem)) {
      rejectedCount += 1;
      continue;
    }
    if (existingIds.has(rawItem.id)) {
      skippedDuplicateCount += 1;
      continue;
    }
    importedItems.push(rawItem);
    existingIds.add(rawItem.id);
  }

  if (importedItems.length === 0) {
    return { ok: true, importedCount: 0, skippedDuplicateCount, rejectedCount };
  }

  // 合并：新导入的排前面（按 updatedAt 倒序），再接已有的 target item
  const mergedTargetItems = [...importedItems, ...existingTargetItems].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // 保留非 target mode；target mode 不超过可用槽位
  const maxTargetItems = Math.max(MAX_ARCHIVE_ITEMS - nonTargetItems.length, 0);
  const limitedTargetItems = mergedTargetItems.slice(0, maxTargetItems);

  const nextItems = [...nonTargetItems, ...limitedTargetItems].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const ok = writeArchiveCollection({
    version: "1",
    items: nextItems,
    updatedAt: new Date().toISOString(),
  });

  return {
    ok,
    importedCount: ok ? importedItems.length : 0,
    skippedDuplicateCount,
    rejectedCount,
    error: ok ? undefined : "写入本地 archive 失败",
  };
}
