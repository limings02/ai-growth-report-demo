"use client";

// components/couple/CoupleArtifactPreview.tsx
// couple mode 结果展示——MemoryArtifactPreview 的薄 wrapper。
// Phase 13.7：新增 source / showArchiveSaveButton prop，支持"保存到本地"按钮。

import type { MemoryArtifact } from "@/lib/memory-core/types";
import type { ArchiveSourceSnapshot } from "@/lib/archive";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import RelationshipGalaxyPreview from "./RelationshipGalaxyPreview";
import ArchiveSaveButton from "@/components/archive/ArchiveSaveButton";

type Props = {
  artifact: MemoryArtifact;
  onBackToEdit: () => void;
  onCreateAnother: () => void;
  onBackToHome?: () => void;
  source?: ArchiveSourceSnapshot;
  showArchiveSaveButton?: boolean;
};

export default function CoupleArtifactPreview({
  artifact,
  onBackToEdit,
  onCreateAnother,
  onBackToHome,
  source,
  showArchiveSaveButton = true,
}: Props) {
  return (
    <MemoryArtifactPreview
      artifact={artifact}
      onBackToEdit={onBackToEdit}
      onCreateAnother={onCreateAnother}
      onBackToHome={onBackToHome}
      topActionsSlot={
        showArchiveSaveButton ? (
          <ArchiveSaveButton artifact={artifact} mode="couple" source={source} />
        ) : undefined
      }
      modeLabel="恋爱纪念册"
      badge="💑 恋爱纪念册"
      fallbackTitle="恋爱纪念册"
      printBrandText="由 Memory Wiki 生成"
      emptyKeywordsHint="这次材料中还没有提炼出稳定关键词。可以补充更多聊天片段或具体故事后重新生成。"
      timelineTitle="⏱ 恋爱时间线"
      emptyTimelineHint="还没有足够材料生成恋爱时间线。可以补充第一次见面、一次旅行、一次争吵与和好、一个普通但想保存的日常。"
      longFormFallbackTitle="写给未来你们的信"
      socialPostsTitle="📱 分享文案"
      emptySocialPostsHint="这次没有生成分享文案。可以补充更具体的纪念日、想表达的情绪或送礼场景后重新生成。"
      usagePrimaryTip="你可以把这份纪念册保存成 PDF，作为周年日、生日或某个普通日子的纪念。"
      usageSecondaryTip="如果想让下一版更贴近你们，可以返回修改，补充更具体的聊天片段、地点、称呼、一次争吵与和好，或一段你想对 TA 说的话。"
      graphSlot={<RelationshipGalaxyPreview graph={artifact.graph} />}
    />
  );
}
