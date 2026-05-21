# Other Modes Save to Archive Check - Phase 13.7

> 完成时间：Phase 13.7（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `components/archive/ArchiveSaveButton.tsx` | **新增**：通用保存按钮（couple/personal/memorial 共用）|
| `components/couple/CoupleArtifactPreview.tsx` | 新增 `source?` / `showArchiveSaveButton?` prop + `topActionsSlot` |
| `components/couple/CoupleMemoryApp.tsx` | 结果页构造 `coupleArchiveSource`，传入 CoupleArtifactPreview |
| `components/personal/PersonalMemoryApp.tsx` | 结果页构造 `personalArchiveSource` + `topActionsSlot` |
| `components/memorial/MemorialMemoryApp.tsx` | 结果页构造 `memorialArchiveSource` + `topActionsSlot` |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. ArchiveSaveButton 设计说明

- 与 family 的保存逻辑完全分离，family 不动
- 复用 `createArchiveItemFromArtifact` + `upsertArchiveItem` + `readArchiveCollection`
- `savedArchiveId` 防重复：同一结果页重复点击复用同 id
- idle / saved / error 三态，按钮文案相应变化
- 失败不影响结果页浏览

---

## 4. Source Snapshot 字段说明

### couple

| 字段 | 来源 | 说明 |
|------|------|------|
| `inputTitle` | `${partnerAName} & ${partnerBName}` | 伴侣名字（低敏）|
| `inputSummary` | `${relationshipTimeRange}，N 条问答，N 张照片` | 一句话摘要 |
| `sourceQuestionCount` | `answeredCount` | 问答数量 |
| `photoCount` | `form.photoCount` | 照片数量（只记数量）|
| `style` | `form.style` | 风格 |
| chatText 原文 | **不保存** | 隐私边界 |
| freeNote 原文 | **不保存** | 隐私边界 |

### personal

| 字段 | 来源 | 说明 |
|------|------|------|
| `inputTitle` | `personName` | 主人公名字（低敏）|
| `inputSummary` | `${lifeStage} · ${timeRange}，N 条问答` | 一句话摘要 |
| `sourceQuestionCount` | `personalAnsweredCount` | 问答数量 |
| `photoCount` | `0` | personal 不上传照片 |
| `style` | `style` | 风格 |
| freeNote 原文 | **不保存** | 隐私边界 |
| qaList 原文 | **不保存** | 隐私边界 |

### memorial

| 字段 | 来源 | 说明 |
|------|------|------|
| `inputTitle` | `deceasedName` | 被纪念者名字（低敏）|
| `inputSummary` | `${relation} · ${timeRange}，N 条问答` | 一句话摘要 |
| `sourceQuestionCount` | `memorialAnsweredCount` | 问答数量 |
| `photoCount` | `0` | memorial 不上传照片 |
| `style` | `style` | 风格 |
| freeNote 原文 | **不保存** | 安全边界 |
| qaList 原文 | **不保存** | 安全边界 |
| 按钮文案 | "保存到本地"（通用）| 不涉及逝者模拟 |

---

## 5. 浏览器手动验收

### Case A：couple 保存

```js
JSON.parse(localStorage.getItem("memory_wiki_archive_v1") ?? "{}").items
  .filter(x => x.mode === "couple")
```

预期：
- `item.mode === "couple"` ✅
- `item.artifact.mode === "couple"` ✅
- `source.inputTitle` 包含伴侣名字
- **不含 chatText 原文**

### Case B：personal 保存

预期：
- `item.mode === "personal"` ✅
- **不含 freeNote 原文**
- **不含完整 qaList 原文**

### Case C：memorial 保存

预期：
- `item.mode === "memorial"` ✅
- 按钮文案"保存到本地"，不含逝者相关敏感文案
- **不含 freeNote 原文**

### Case D：重复点击不产生重复 item

同一结果页连续点击两次 → localStorage 中不增加 item

### Case E：family 不回归

- family 结果页仍可保存 ✅
- 我的成长册列表仍只展示 family ✅
- 导出/导入/删除/清空仍正常 ✅

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| couple/personal/memorial 只有保存按钮 | 暂无历史列表 UI |
| 暂无跨 mode 统一列表 | Phase 13.8 |
| 暂无其他 mode 导出/导入 | Phase 13.8+ |
| 不支持云端同步 | Phase 14 |
