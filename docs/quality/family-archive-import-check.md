# Family Archive Import Check - Phase 13.6

> 完成时间：Phase 13.6（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `lib/archive/importArchive.ts` | **新增**：解析/校验/非破坏性导入工具 |
| `lib/archive/index.ts` | 新增 `export * from "./importArchive"` |
| `components/archive/FamilyArchivePage.tsx` | 导入按钮 + file input + 导入逻辑 + 冲突说明 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 导入 Bundle 校验逻辑

```
parseArchiveImportText(text)
  → JSON.parse
  → validateArchiveExportBundle:
      - exportVersion === "1" ✓
      - mode === "family" ✓
      - items 是数组 ✓
```

---

## 4. 非破坏性合并策略

```
importArchiveItemsFromBundle({ bundle, mode: "family" })

对每个 bundle.item：
  1. isValidArchiveItemForMode: 结构验证（id/mode/title/createdAt/updatedAt/artifactVersion/localOnly/artifact）
  2. containsBlockedPhotoFields: 拒绝包含 previewUrl/blob:/file/File 的 item
  3. existingIds.has(item.id): 重复 id → 跳过（不覆盖）
  4. 通过所有检查 → importedItems.push(item)

合并：
  - 保留 nonTargetItems（mode !== family，不受影响）
  - 新导入的 targetItems + 已有 targetItems → 按 updatedAt 倒序 → 取前 MAX_ARCHIVE_ITEMS 槽
  - writeArchiveCollection()
```

---

## 5. 浏览器手动验收

### Case A：导入 Phase 13.5 导出的 family JSON

1. 先导出一份 family archive JSON
2. 清空本地 family archive
3. 点击「导入 JSON」→ 选择文件

预期：
- 成功导入，列表刷新
- 可点击卡片回看详情

### Case B：重复导入

1. 连续导入同一文件两次

预期：
- 第二次反馈：跳过重复 N 条
- 列表记录数不增加

### Case C：非 JSON 文件

选择 `.txt` 或 `.png` 文件 → 显示「请选择 JSON 文件」

### Case D：错误 JSON

选择内容不是合法 JSON 的 `.json` 文件 → 显示「JSON 文件格式错误，无法解析」

### Case E：非 family bundle

手动改 JSON：`"mode": "couple"` → 显示「当前只支持导入家庭成长册 archive」

### Case F：含 previewUrl 的 item

手动在 item 中加 `"previewUrl": "blob:xxx"` → 该 item 被拒绝，rejectedCount 增加

### Case G：不误删其他 mode

前置：localStorage 中存在 couple/personal/memorial item
导入 family JSON 后 → 其他 mode item 仍在 localStorage

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 只支持 family 导入 | 其他 mode 待后续 |
| 重复 id 默认跳过，不支持覆盖 | 简单场景够用 |
| 不支持导入预览 | 直接合并 |
| 不保存照片文件 | blob 在会话外失效 |
| 不支持云端同步 | Phase 14 |
