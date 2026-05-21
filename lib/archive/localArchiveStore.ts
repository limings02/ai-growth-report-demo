"use client";

// lib/archive/localArchiveStore.ts
// localStorage 读写工具（Phase 13.1）
// 所有 localStorage 访问先判断 typeof window !== "undefined"（SSR 安全）。
// 所有读写均 try/catch，失败不影响生成页。

import type { ArchiveCollection, ArchiveItem } from "./types";

export const ARCHIVE_STORAGE_KEY = "memory_wiki_archive_v1";
export const MAX_ARCHIVE_ITEMS = 50;

export function createEmptyArchiveCollection(): ArchiveCollection {
  return {
    version: "1",
    items: [],
    updatedAt: new Date().toISOString(),
  };
}

export function readArchiveCollection(): ArchiveCollection {
  if (typeof window === "undefined") return createEmptyArchiveCollection();
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return createEmptyArchiveCollection();
    const parsed = JSON.parse(raw) as ArchiveCollection;
    if (parsed.version !== "1" || !Array.isArray(parsed.items)) {
      return createEmptyArchiveCollection();
    }
    return parsed;
  } catch {
    return createEmptyArchiveCollection();
  }
}

export function writeArchiveCollection(collection: ArchiveCollection): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(collection));
    return true;
  } catch {
    return false;
  }
}

export function upsertArchiveItem(item: ArchiveItem): boolean {
  const collection = readArchiveCollection();

  // 替换同 id 的旧项，否则追加
  const existingIdx = collection.items.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    collection.items[existingIdx] = item;
  } else {
    collection.items.unshift(item);
  }

  // 按 updatedAt 倒序，超过上限只保留最新 MAX_ARCHIVE_ITEMS 条
  collection.items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  if (collection.items.length > MAX_ARCHIVE_ITEMS) {
    collection.items = collection.items.slice(0, MAX_ARCHIVE_ITEMS);
  }

  collection.updatedAt = new Date().toISOString();
  return writeArchiveCollection(collection);
}

export function deleteArchiveItem(id: string): boolean {
  const collection = readArchiveCollection();
  const before = collection.items.length;
  collection.items = collection.items.filter((i) => i.id !== id);
  if (collection.items.length === before) return false; // id 不存在
  collection.updatedAt = new Date().toISOString();
  return writeArchiveCollection(collection);
}

export function clearArchiveCollection(): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(ARCHIVE_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
