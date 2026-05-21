"use client";

// components/archive/ArchiveSaveButton.tsx
// 通用 archive 保存按钮（Phase 13.7）。
// 供 couple / personal / memorial 使用；family 有独立实现，不改动。
// 同一结果页重复点击复用同一 id，不产生重复 item。

import { useState } from "react";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import type { ArchiveMode, ArchiveSourceSnapshot } from "@/lib/archive";
import {
  createArchiveItemFromArtifact,
  upsertArchiveItem,
  readArchiveCollection,
} from "@/lib/archive";

type Props = {
  artifact: MemoryArtifact;
  mode: ArchiveMode;
  source?: ArchiveSourceSnapshot;
  label?: string;
};

const SAVE_LABEL: Record<"idle" | "saved" | "error", string> = {
  idle:  "保存到本地",
  saved: "已保存 ✓",
  error: "保存失败，再试",
};

export default function ArchiveSaveButton({
  artifact,
  mode,
  source = {},
  label,
}: Props) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [savedArchiveId, setSavedArchiveId] = useState<string | null>(null);

  function handleSaveToArchive() {
    try {
      const item = createArchiveItemFromArtifact({ artifact, mode, source });

      // 复用已保存的 id，避免同一结果页重复点击产生重复记录
      const itemToSave = savedArchiveId
        ? {
            ...item,
            id: savedArchiveId,
            createdAt:
              readArchiveCollection().items.find((x) => x.id === savedArchiveId)?.createdAt
              ?? item.createdAt,
            updatedAt: new Date().toISOString(),
          }
        : item;

      const ok = upsertArchiveItem(itemToSave);
      if (ok) {
        setSavedArchiveId(itemToSave.id);
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleSaveToArchive}
      title="保存到本地浏览器，仅当前设备可见，不上传任何数据"
      aria-label="保存当前记忆册到本地浏览器"
      className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
      style={
        saveStatus === "error"
          ? { background: "#fff0ee", color: "#c0674a" }
          : { background: "#e8f5e9", color: "#2e7d32" }
      }
    >
      {label ?? SAVE_LABEL[saveStatus]}
    </button>
  );
}
