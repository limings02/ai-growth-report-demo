// lib/archive/cloudArchiveSync.ts
// 手动上传本地 ArchiveItem 到 Supabase（Phase 14.3）。
//
// 策略：INSERT ONLY，不 upsert，不覆盖。
// - 云端已有同 id 的 item → 跳过（skipped）
// - 包含 previewUrl/blob/File 的 item → 拒绝（rejected）
// - 新 id → 插入 archive_items
//
// 不做：
// - cloud → local 读取
// - 自动同步
// - 删除同步
// - 双向合并
// - 覆盖云端已有数据
//
// 函数纯参数化，不引用 localStorage，方便单元测试。
// 不引用 React。

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArchiveItem } from "./types";
import {
  containsBlockedCloudArchiveFields,
  mapArchiveItemToCloudInsert,
} from "./cloudArchiveMapper";

export type CloudArchiveUploadResult = {
  ok: boolean;
  totalLocalCount: number;
  uploadedCount: number;
  skippedExistingCount: number;
  rejectedCount: number;
  error?: string;
};

/**
 * 手动上传本地 ArchiveItem 数组到 Supabase archive_items 表。
 * 调用方负责传入已登录的 supabase client 和 userId。
 */
export async function uploadLocalArchiveItemsToCloud(params: {
  supabase: SupabaseClient;
  userId: string;
  items: ArchiveItem[];
}): Promise<CloudArchiveUploadResult> {
  const { supabase, userId, items } = params;

  if (items.length === 0) {
    return { ok: true, totalLocalCount: 0, uploadedCount: 0, skippedExistingCount: 0, rejectedCount: 0 };
  }

  // 1. 过滤包含 blocked fields 的 item（blob/previewUrl/File）
  const safeItems: ArchiveItem[] = [];
  let rejectedCount = 0;

  for (const item of items) {
    if (containsBlockedCloudArchiveFields(item)) {
      rejectedCount += 1;
      continue;
    }
    safeItems.push(item);
  }

  if (safeItems.length === 0) {
    return { ok: true, totalLocalCount: items.length, uploadedCount: 0, skippedExistingCount: 0, rejectedCount };
  }

  // 2. 查询云端已存在的 id（只查 id，不读取内容）
  const ids = safeItems.map((item) => item.id);

  const { data: existingRows, error: existingError } = await supabase
    .from("archive_items")
    .select("id")
    .in("id", ids);

  if (existingError) {
    return {
      ok: false,
      totalLocalCount: items.length,
      uploadedCount: 0,
      skippedExistingCount: 0,
      rejectedCount,
      error: existingError.message,
    };
  }

  const existingIds = new Set((existingRows ?? []).map((row) => row.id as string));

  // 3. 只 insert 云端不存在的 item
  const rowsToInsert = safeItems
    .filter((item) => !existingIds.has(item.id))
    .map((item) => mapArchiveItemToCloudInsert({ item, userId }));

  const skippedExistingCount = safeItems.length - rowsToInsert.length;

  if (rowsToInsert.length === 0) {
    return { ok: true, totalLocalCount: items.length, uploadedCount: 0, skippedExistingCount, rejectedCount };
  }

  const { error: insertError } = await supabase
    .from("archive_items")
    .insert(rowsToInsert);

  if (insertError) {
    return {
      ok: false,
      totalLocalCount: items.length,
      uploadedCount: 0,
      skippedExistingCount,
      rejectedCount,
      error: insertError.message,
    };
  }

  return {
    ok: true,
    totalLocalCount: items.length,
    uploadedCount: rowsToInsert.length,
    skippedExistingCount,
    rejectedCount,
  };
}
