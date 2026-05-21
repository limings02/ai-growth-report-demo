// lib/archive/types.ts
// Life Archive 数据模型类型定义（Phase 13.1）
// 不依赖登录/数据库，设计为可迁移：localStorage → IndexedDB → 云端

import type { MemoryArtifact } from "@/lib/memory-core/types";
import type { MemoryMode } from "@/lib/memory-core/modes";

export type ArchiveMode = MemoryMode;

/**
 * 输入来源轻量摘要。
 * 只保存少量 metadata，不保存完整原始输入，不保存照片 blob。
 */
export type ArchiveSourceSnapshot = {
  inputTitle?: string;           // 孩子昵称 / 伴侣名字 / 主人公名字等
  inputSummary?: string;         // 一句话描述输入内容
  sourceQuestionCount?: number;  // 回答了几道问题
  photoCount?: number;           // 上传了几张照片（只记数量，不保存 blob）
  style?: string;                // 文案风格（warm / literary / simple 等）
};

/**
 * 一次被保存的记忆生成结果。
 * id 格式："{mode}_{timestamp}_{random}"，不依赖 crypto.randomUUID。
 */
export type ArchiveItem = {
  id: string;
  mode: ArchiveMode;
  title: string;
  subtitle?: string;
  summary?: string;
  keywords: string[];
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  artifactVersion: string;
  artifact: MemoryArtifact;
  source: ArchiveSourceSnapshot;
  localOnly: true;         // 字面类型，明确标记为本地存储
};

/**
 * 本地所有保存记录的集合。
 * items 按 updatedAt 倒序排列，最多 MAX_ARCHIVE_ITEMS 条。
 */
export type ArchiveCollection = {
  version: "1";
  items: ArchiveItem[];
  updatedAt: string;
};
