# Family Archive Management Check - Phase 13.4

> 完成时间：Phase 13.4（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `lib/archive/localArchiveStore.ts` | 新增 `deleteArchiveItemsByMode(mode)` |
| `components/archive/FamilyArchivePage.tsx` | 支持删除单条 + 清空 family；UI 刷新逻辑 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 实现说明

### 单条删除流程

```
点击"删除" → pendingDeleteId = item.id（进入确认态）
  → 点击"确认删除" → deleteArchiveItem(id) → refreshItems()
  → 点击"取消"    → pendingDeleteId = null（恢复）
```

- 卡片结构改为 `<article>` + 内嵌 `<button>`（主体）+ 独立操作区，**无 button 嵌套**
- 删除后如果当前详情页展示的是被删项，自动回到列表

### 清空 family 流程

```
点击"清空本地成长册" → confirmClear = true（进入确认态）
  → 点击"确认清空" → deleteArchiveItemsByMode("family") → refreshItems()
  → 点击"取消"    → confirmClear = false（恢复）
```

- **不调用 `clearArchiveCollection()`**（全量清空，会误删其他 mode）
- `deleteArchiveItemsByMode("family")` 只过滤掉 `mode === "family"` 的 item
- 清空文案明确说明"只清空家庭成长册，不影响未来其他类型记忆"

### UI 刷新

```ts
function refreshItems() {
  setItems(loadFamilyArchiveItems()); // 重新从 localStorage 读取
}
```

- 删除/清空后立即调用，无需重新进入页面

---

## 4. 浏览器手动验收

### Case A：删除单条成长册

前置：localStorage 中至少 2 条 family ArchiveItem

1. 进入"我的成长册"
2. 点击某张卡片的"删除"
3. 点击"确认删除"

预期：
- 该卡片从列表消失
- `localStorage.getItem("memory_wiki_archive_v1")` 中对应 id 已删除
- 其他 family item 保留

### Case B：取消删除

1. 点击"删除"
2. 点击"取消"

预期：item 不被删除，列表不变

### Case C：清空 family 成长册

1. 点击底部"清空本地成长册"
2. 点击"确认清空"

预期：
- family item 全部消失，进入空状态
- localStorage 中非 family item 不受影响（可在 console 手动验证）

### Case D：不误删其他 mode

在 console 手动注入一条 couple item：
```js
const col = JSON.parse(localStorage.getItem("memory_wiki_archive_v1"));
col.items.push({ id: "couple_test", mode: "couple", title: "测试couple", localOnly: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), artifactVersion: "0.1", keywords: [], source: {}, artifact: {} });
localStorage.setItem("memory_wiki_archive_v1", JSON.stringify(col));
```

执行清空 family 后检查：couple_test item 仍在 collection.items 中。

### Case E：详情回看仍正常

1. 点击未删除记录进入详情
2. 确认不显示"保存到本地"按钮
3. 点击"← 返回我的成长册"回到列表

---

## 5. 为什么不能用 `clearArchiveCollection()`

`clearArchiveCollection()` 直接调用 `localStorage.removeItem(ARCHIVE_STORAGE_KEY)`，会删除整个 collection（包含所有 mode 的 item）。

当 couple / personal / memorial 也开始接入 archive 保存后，这会造成数据丢失。

正确方式：`deleteArchiveItemsByMode("family")`，只过滤掉 `mode === "family"` 的 item，保留其他 mode 数据。

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 不支持编辑 | Phase 13.5+ |
| 不支持导出 JSON | Phase 13.5 |
| 不支持导入 JSON | Phase 13.5+ |
| 操作反馈不自动消失 | 下次操作时覆盖，可接受 |
| 只管理 family | couple/personal/memorial 待后续 |
