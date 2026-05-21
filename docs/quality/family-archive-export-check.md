# Family Archive Export Check - Phase 13.5

> 完成时间：Phase 13.5（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `lib/archive/exportArchive.ts` | **新增**：`createArchiveExportBundle` / `createArchiveExportFileName` / `downloadJsonFile` |
| `lib/archive/index.ts` | 新增 `export * from "./exportArchive"` |
| `components/archive/FamilyArchivePage.tsx` | 新增导出按钮、`operationStatus` 状态区分、隐私说明 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. Export Bundle Schema

```json
{
  "exportVersion": "1",
  "exportedAt": "2026-05-21T10:00:00.000Z",
  "mode": "family",
  "itemCount": 2,
  "items": [
    {
      "id": "family_1234567890_abc123",
      "mode": "family",
      "title": "豆豆的2024成长礼物",
      "keywords": ["一年级", "大海"],
      "createdAt": "...",
      "updatedAt": "...",
      "artifact": { ... },
      "source": { "photoCount": 4, "sourceQuestionCount": 5 },
      "localOnly": true
    }
  ]
}
```

**隐私边界**：
- ✅ 包含 AI 生成的 narrative / graph / extensions
- ✅ 包含 ArchiveSourceSnapshot（photoCount / questionCount / style 等低敏摘要）
- ❌ 不包含照片 blob / File 对象
- ❌ 不包含照片 previewUrl（blob: URL 在会话外失效）

---

## 4. 浏览器手动验收

### Case A：有 family item 时导出

前置：localStorage 至少 1 条 family ArchiveItem

1. 进入"我的成长册"
2. 点击"导出 JSON"
3. 浏览器下载文件

预期：
- 文件名：`memory-wiki-family-archive-YYYYMMDD.json`
- JSON 结构：`exportVersion / exportedAt / mode / itemCount / items`
- `mode === "family"`
- `items` 全部满足 `item.mode === "family"`
- `itemCount === items.length`

### Case B：不导出其他 mode item

前置：localStorage 同时有 family 和其他 mode item

预期：
- 下载的 JSON 中 `items` 只含 `mode === "family"` 的记录

### Case C：无照片 blob

预期：
- JSON 中无 `File` 对象
- JSON 中无 `blob:` URL 字符串
- `source.photoCount` 可存在（只是数字）

### Case D：空列表不显示导出按钮

1. 清空 family archive
2. 进入"我的成长册"

预期：
- 顶部"导出 JSON"按钮不出现（`items.length === 0` 时隐藏）
- 空状态正常

### Case E：导出失败反馈

可 monkey patch `URL.createObjectURL` 抛错测试。

预期：
- 页面不崩溃
- 显示"导出失败，请稍后重试"（红色提示）

---

## 5. 当前限制

| 限制 | 说明 |
|------|------|
| 只支持导出 family | couple/personal/memorial 待后续 |
| 不支持导入 | Phase 13.6 考虑 |
| 不加密 | Phase 14 考虑 |
| 不包含照片文件 | blob 在会话外失效，不适合导出 |
| 导出文件由用户自行保管 | 不上传到服务器 |
