"use client";

// components/family/FamilyArtifactPreview.tsx
// family mode 的 MemoryArtifactPreview 薄 wrapper（Phase 12.2 新增）。
//
// 注意：本组件是迁移准备组件，尚未接入 GrowthReportApp 主链路。
// 当前 family 生成仍走 GrowthReportApp → ReportPreview → LifeGraphPreview 旧链路。
// Phase 12.4 完成后，本组件将替换 ReportPreview 成为 family 的主展示层。
//
// 本版本不处理 rawMaterial / photos，待迁移时承接。

import type { MemoryArtifact } from "@/lib/memory-core/types";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import FamilyMemoryGraphPreview from "./FamilyMemoryGraphPreview";

type Props = {
  artifact: MemoryArtifact;
  onBackToEdit: () => void;
  onCreateAnother: () => void;
  onBackToHome?: () => void;
};

export default function FamilyArtifactPreview({ artifact, onBackToEdit, onCreateAnother, onBackToHome }: Props) {
  return (
    <MemoryArtifactPreview
      artifact={artifact}
      onBackToEdit={onBackToEdit}
      onCreateAnother={onCreateAnother}
      onBackToHome={onBackToHome}
      modeLabel="家庭成长册"
      badge="🌱 家庭成长册"
      fallbackTitle="家庭成长册"
      printBrandText="由 Memory Wiki 生成"
      emptyKeywordsHint="还没有提炼出成长关键词。可以补充更具体的事件、习惯、作品或亲子互动后重新生成。"
      timelineTitle="⏱ 成长时间线"
      emptyTimelineHint="还没有足够材料生成成长时间线。可以补充具体月份、事件、第一次、变化或亲子片段。"
      longFormFallbackTitle="写给未来孩子的信"
      socialPostsTitle="📱 分享文案"
      emptySocialPostsHint="这次没有生成分享文案。可以补充更具体的成长瞬间或想分享给亲友的话。"
      usagePrimaryTip="你可以把这份成长册保存成 PDF，作为生日、毕业、18 岁成人礼或家庭纪念资料留存。"
      usageSecondaryTip="如果想让下一版更贴近真实成长，可以补充更具体的时间、地点、孩子说过的话、作品、照片背景和亲子互动。"
      graphSlot={<FamilyMemoryGraphPreview graph={artifact.graph} />}
    />
  );
}
