# 多模态记忆能力路线图

> 创建时间：Phase 16.0（2026-05-22）  
> 状态：规划文档，当前阶段不实装上传/识图/视频

---

## 当前边界声明

| 能力 | 当前状态 |
|------|---------|
| 图片本地预览 | ✅ 已实现（PhotoUploader）|
| 图片上传到服务器 | ❌ 不做 |
| 图片传给 AI | ❌ 不做 |
| 用户为图片写说明 | ⬜ 阶段 1 目标 |
| 真实图片识别 | ⬜ 阶段 3 评估 |
| 视频生成文件 | ❌ 不做 |
| 视频脚本（storyboard）| ⬜ 阶段 5 目标 |

---

## 阶段 1：图片本地预览 + 用户手写图片说明（近期）

**目标**：不上传图片，但让图片内容通过用户描述进入 AI 生成上下文。

**实现方式**：
- 用户在 PhotoUploader 或新的 PhotoCaptionEditor 中为每张图片写一句说明
- 说明文字进入 `MemoryRawMaterial`，以 `mediaDescriptions[]` 字段传给 AI
- 图片本身只在本地预览，不上传，不传给 AI
- 结果页可展示图文并茂排版（图片 + AI 配文）

**隐私边界**：
- 图片 blob URL 不写入 archive（归档时只保存用户文字说明）
- 用户说明明确标注"AI 只看到你写的文字，不会分析图片内容"

---

## 阶段 2：图片进入 MemoryRawMaterial 的 media description

**MemoryMediaRef 建议字段（向后兼容扩展）**：

```typescript
// 建议在 MemoryRawMaterial 的 extensions 中添加（不改主结构）
type MemoryMediaRef = {
  id: string;
  label?: string;           // 用户给这张图起的名字
  userCaption?: string;     // 用户手写说明（传给 AI）
  localPreviewId?: string;  // 本地引用 ID（不存 blob URL）
  takenAtText?: string;     // 用户填写的拍摄时间，如"2021年夏天"
  peopleText?: string;      // 用户填写的照片里的人，如"外婆和我"
  placeText?: string;       // 用户填写的地点，如"老家院子"
};
```

**注意**：
- 不保存 blob URL 到 archive
- archive 只保存用户文字说明
- `localPreviewId` 用于在同一会话中关联预览图（不跨 session）

---

## 阶段 3：真正多模态图片理解 Spike（评估阶段）

**评估方向**：
- 当前使用的 DeepSeek API 是否支持 vision input？
- 图片上传到 AI API 前，是否需要用户显式授权？
- 照片里可能包含人脸、未成年人、私密场景——隐私风险如何处理？
- 是否需要服务端中转（避免把原始 API key 暴露在前端）？

**必须满足的条件才能进入实装**：
1. 用户有清晰的知情同意（图片会被发送给 AI 分析）
2. 图片发送前有压缩/脱敏处理选项
3. AI 图片分析不存储原始图片
4. 不默认上传——用户需要主动触发"让 AI 分析这张图片"

---

## 阶段 4：图文并茂结果页

**目标**：MemoryArtifactPreview 支持展示带图片的 section。

**MemoryArtifact extensions 建议字段**：

```typescript
// 建议在 extensions 中（不改主结构）
type PhotoSection = {
  localPreviewId: string;    // 关联本地预览
  caption?: string;          // AI 生成的图片配文
  memoryText?: string;       // AI 生成的这张图的记忆叙述
  placementHint?: "cover" | "timeline" | "letter" | "appendix";
};

// extensions.photoSections?: PhotoSection[]
```

**PDF/print 处理**：
- 打印时展示 `hidden print:block` 版本（不依赖 blob URL）
- 用用户填写的 `userCaption` 作为打印替代文本
- 不依赖 blob URL（打印时 blob 可能无效）

---

## 阶段 5：视频脚本增强（不生成真实视频文件）

**当前状态**：`extensions.videoScript` 已在 MemoryArtifact 中存在。

**目标**：增强 videoScript 的 storyboard 结构，让用户可以自行制作视频。

**建议 storyboard 格式**：

```typescript
type VideoStoryboardScene = {
  sceneIndex: number;
  durationSec?: number;         // 建议时长（秒）
  visualSuggestion: string;     // 具体建议使用哪张照片或什么画面
  narration: string;            // 旁白文本
  subtitle?: string;            // 字幕（比旁白更简短）
  musicMood?: string;           // 背景音乐情绪建议（如"舒缓、温暖"）
};
```

**明确不做**：
- 不接入视频生成 API（Sora / Pika / Runway 等）
- 不生成真实视频文件
- 不承诺"一键生成视频"
- storyboard 只是让用户知道如何自己拼视频

---

## 阶段总览

| 阶段 | 内容 | 实装状态 | 时间线 |
|------|------|---------|--------|
| 1 | 用户手写图片说明 → 进入 AI 上下文 | ⬜ 未实装 | Phase 16.1 |
| 2 | MemoryMediaRef 字段设计 | ⬜ 设计稿 | Phase 16.2 |
| 3 | Vision API Spike | ⬜ 评估 | TBD |
| 4 | 图文并茂结果页 | ⬜ 未实装 | TBD |
| 5 | 视频脚本 Storyboard 增强 | ⬜ 未实装 | TBD |
| — | 真实视频生成 | ❌ 不做 | — |

---

## 架构原则

1. **用户数据主权**：图片不自动上传，每一步需要用户主动操作
2. **文字优先**：AI 处理的主要是用户描述的文字，不是图片本身
3. **隐私最小化**：收集到 AI 的最少数据，archive 不存 blob
4. **降级优雅**：没有图片说明时，结果页正常展示；print 版本不依赖 blob
