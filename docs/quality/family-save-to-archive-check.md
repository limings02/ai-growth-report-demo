# Family Save to Archive Check - Phase 13.2

> 完成时间：Phase 13.2（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `components/memory/MemoryArtifactPreview.tsx` | 新增 `topActionsSlot?: React.ReactNode`（插入顶部右侧按钮组）|
| `components/family/FamilyArtifactPreview.tsx` | 新增保存状态/函数/按钮，通过 `topActionsSlot` 传入 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 实现逻辑说明

### 保存流程

```
用户点击「保存到本地」
  → buildFamilyArchiveSourceSnapshot()（从 rawMaterial / photos 提取 metadata）
  → createArchiveItemFromArtifact({ artifact, mode: "family", source })
  → savedArchiveId 存在则复用同 id（不产生重复记录）
  → upsertArchiveItem(itemToSave)
    → localStorage "memory_wiki_archive_v1" 写入
  → setSaveStatus("saved") / setSaveStatus("error")
```

### ArchiveSourceSnapshot 字段映射

| 字段 | 来源 | 说明 |
|------|------|------|
| `inputTitle` | `rawMaterial?.childName` | 孩子昵称 |
| `inputSummary` | `${reportYear} 年，${qaList.length} 条问答，${photoCount} 张照片` | 一句话摘要 |
| `sourceQuestionCount` | `rawMaterial?.qaList.length` | 问答数量 |
| `photoCount` | `photos?.length ?? rawMaterial?.photoUrls.length ?? 0` | **只保存数量，不保存 blob/URL** |
| `style` | `rawMaterial?.style` | warm / literary / simple |

### 按钮状态

| 状态 | 文案 | 颜色 |
|------|------|------|
| `idle` | 保存到本地 | 绿色淡底（#e8f5e9）|
| `saved` | 已保存 ✓ | 绿色淡底 |
| `error` | 保存失败，再试 | 浅红底（#fff0ee）|

### 重复保存防护

- 第一次点击：生成新 `ArchiveItem`，保存 `savedArchiveId`
- 后续点击：复用 `savedArchiveId`，更新同一条记录的 `updatedAt`，不产生重复项

---

## 4. 浏览器手动验收

### Case A：首次保存

1. 进入 family mode，填写最小有效输入，点击生成
2. 结果页点击「保存到本地」
3. 按钮变成「已保存 ✓」
4. 打开浏览器 Console 验证：

```js
JSON.parse(localStorage.getItem("memory_wiki_archive_v1") ?? "{}")
```

预期：
```
version: "1"
items.length >= 1
items[0].mode === "family"
items[0].artifact.mode === "family"
items[0].source.photoCount === 0（无照片时）或 > 0
items[0].artifact 中不含 File / blob
items[0].localOnly === true
```

### Case B：重复点击保存

- 同一结果页连续点击「保存到本地」两次
- 检查 `localStorage.items.length` 不增加
- 同一 `id` 的 `updatedAt` 更新

### Case C：无照片保存

- 填写无照片输入，生成，保存
- 预期：`source.photoCount === 0`，保存成功

### Case D：localStorage 失败容错

- 隐私模式 / 模拟写入失败时，当前结果页不崩溃，按钮显示「保存失败，再试」

---

## 5. 打印验证

- `topActionsSlot` 位于顶部操作栏（已有 `print:hidden`），不出现在打印页 ✅

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 只支持 family | couple/personal/memorial 待 Phase 13.3 逐步接入 |
| 只保存当前浏览器 | 不跨设备 |
| 不保存照片 blob | 只保存数量 |
| 暂无历史列表 UI | Phase 13.3 |
| 暂无 archive 详情页 | Phase 13.4 |
| 不加密 | Phase 14 |
