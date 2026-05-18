# Family Memory Skill

## 定位

这是 **family mode** 的 skill pack。

当前覆盖的第一个场景是：**孩子成长记录 / 亲子成长礼物**。

## 输入格式

输入是通用的 `MemoryRawMaterial`，对应 `mode: "family"`。

```typescript
MemoryRawMaterial {
  mode: "family"

  subject: {
    title: string       // 如 "小熊宝的 2024 成长记录"
    primaryName: string // 孩子昵称
    timeRange: string   // 如 "2024"
  }

  participants: {
    id: string    // "child" | "parent"
    name: string
    role: string  // "child" | "parent"
  }[]

  style: string   // "warm" | "playful" | "documentary" | "literary"

  media: {
    type: "photo" | "chat" | "note" | "audio" | "video"
    count?: number
    localOnly?: boolean   // 照片只在本地预览，不传给 AI
    description?: string
  }[]

  qaList: { question: string; answer: string }[]

  freeNote: string

  domainPayload?: {
    childName?: string
    childAge?: number | ""
    reportYear?: number
    parentName?: string
  }

  // legacyFamilyInput：Phase 4 过渡兼容字段
  // 包含旧 RawMaterial 的关键字段，供提示词识别
  // 后续 family-memory prompt 完全迁移后可以忽略此字段
  legacyFamilyInput?: {
    childName?: string
    childAge?: number | ""
    reportYear?: number
    parentName?: string
    style?: string
    photoCount?: number
    qaList?: { question: string; answer: string }[]
    freeNote?: string
  }
}
```

### 读取优先级

1. 优先读取 `legacyFamilyInput` 中的字段（兼容旧链路）
2. 若 `legacyFamilyInput` 缺失或字段为空，再从以下位置推断：
   - `childName`：`domainPayload.childName` 或 `subject.primaryName`
   - `childAge`：`domainPayload.childAge`
   - `reportYear`：`domainPayload.reportYear` 或 `subject.timeRange`
   - `parentName`：`domainPayload.parentName` 或 participants 中 role=parent 的 name
   - `photoCount`：media 中 type=photo 的 count
   - `qaList`：顶层 `qaList`
   - `freeNote`：顶层 `freeNote`

### 媒体说明

- 照片只传入**数量**，不传入图片内容或 URL
- 照片在浏览器本地预览，不上传服务器，不传给 AI

## 输出格式

当前仍输出旧结构 `GrowthMemoryArtifact`，兼容现有 ReportPreview：

```typescript
GrowthMemoryArtifact {
  artifactVersion: "0.1"
  report: ReportData
  graph: AiGraphHints
  videoScript: VideoScript
  sourceTrace: SourceTrace
  qualityReview: QualityReview
}
```

> 说明：这是为了兼容当前 ReportPreview。
> Phase 4 的 `parseMemoryArtifact` 会自动识别旧格式并转换为 `MemoryArtifact`，再由 wrapper 转回 `GrowthMemoryArtifact`。
> 后续会迁移为直接输出标准 `MemoryArtifact`。

## 与 growth-memory 的关系

- `.skills/growth-memory`：旧 skill pack，输入为旧 `RawMaterial`，保留作为 fallback 和历史兼容，不删除
- `.skills/family-memory`：新 skill pack，输入为通用 `MemoryRawMaterial`，`01_task.md` 原生理解新格式
- `skillRegistry.ts` 中 family 的查找顺序：`family-memory` → `growth-memory`（fallback）
