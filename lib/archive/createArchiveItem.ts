// lib/archive/createArchiveItem.ts
// 从 MemoryArtifact 构造 ArchiveItem 的工厂函数（Phase 13.1）

import type { MemoryArtifact } from "@/lib/memory-core/types";
import type { ArchiveItem, ArchiveMode, ArchiveSourceSnapshot } from "./types";

const MODE_TITLE_FALLBACK: Record<ArchiveMode, string> = {
  family:   "家庭成长册",
  couple:   "恋爱纪念册",
  personal: "个人记忆",
  memorial: "人生故事",
};

function createArchiveId(mode: ArchiveMode, now: Date): string {
  return `${mode}_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createArchiveItemFromArtifact(params: {
  artifact: MemoryArtifact;
  mode: ArchiveMode;
  source?: ArchiveSourceSnapshot;
  now?: Date;
}): ArchiveItem {
  const { artifact, mode, source = {}, now = new Date() } = params;
  const { narrative, graph, artifactVersion } = artifact;

  const isoNow = now.toISOString();

  return {
    id: createArchiveId(mode, now),
    mode,
    title: narrative.title || MODE_TITLE_FALLBACK[mode],
    subtitle: graph?.subtitle || undefined,
    summary: narrative.summary || undefined,
    keywords: narrative.keywords ?? [],
    createdAt: isoNow,
    updatedAt: isoNow,
    artifactVersion,
    artifact,
    source,
    localOnly: true,
  };
}
