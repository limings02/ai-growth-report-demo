// lib/archive/cloudArchiveMapper.ts
// 本地 ArchiveItem → 云端 archive_items insert row 映射（Phase 14.1）。
//
// 纯函数映射，不发网络请求，不引用 Supabase client。
// Phase 14.3 上传时复用本文件的类型和函数。
//
// 不保存照片 blob / File / previewUrl。
// 映射只取 ArchiveItem 的低敏字段。

import type { ArchiveItem } from "./types";

/** 对应 Supabase archive_items 表的 insert row（Phase 14.1 草案）。 */
export type CloudArchiveItemInsert = {
  id: string;
  user_id: string;
  mode: ArchiveItem["mode"];
  title: string;
  subtitle: string | null;
  summary: string | null;
  keywords: string[];
  artifact_version: string;
  artifact: ArchiveItem["artifact"];   // 完整 MemoryArtifact（不含照片 blob）
  source: ArchiveItem["source"];       // ArchiveSourceSnapshot（低敏摘要）
  local_created_at: string;            // 来自本地 createdAt
  local_updated_at: string;            // 来自本地 updatedAt
};

/** 把本地 ArchiveItem 映射成云端 insert row。 */
export function mapArchiveItemToCloudInsert(params: {
  item: ArchiveItem;
  userId: string;
}): CloudArchiveItemInsert {
  const { item, userId } = params;
  return {
    id:                 item.id,
    user_id:            userId,
    mode:               item.mode,
    title:              item.title,
    subtitle:           item.subtitle ?? null,
    summary:            item.summary ?? null,
    keywords:           item.keywords,
    artifact_version:   item.artifactVersion,
    artifact:           item.artifact,
    source:             item.source,
    local_created_at:   item.createdAt,
    local_updated_at:   item.updatedAt,
  };
}

/**
 * 检查 ArchiveItem 是否包含不应上传到云端的字段。
 * 上传前调用，阻止 previewUrl/blob/File 污染云端数据。
 */
export function containsBlockedCloudArchiveFields(item: ArchiveItem): boolean {
  const json = JSON.stringify(item);
  return (
    json.includes("previewUrl") ||
    json.includes("blob:") ||
    json.includes('"file"') ||
    json.includes('"File"')
  );
}
