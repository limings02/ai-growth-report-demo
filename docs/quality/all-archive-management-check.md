# All Archive Management Check - Phase 13.9

> 完成时间：Phase 13.9（2026-05-22）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `components/archive/AllArchivePage.tsx` | mode 筛选 / 搜索 / 单条删除 / 未知 mode 兜底 / 可刷新 state |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 实现说明

### mode 筛选

```ts
const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
// filteredItems = items.filter(item => modeFilter === "all" || item.mode === modeFilter)
```

5 个筛选按钮（全部 / 家庭 / 情侣 / 个人 / 纪念），选中态橙色背景。

### 搜索（本地 contains 匹配）

```ts
const [searchQuery, setSearchQuery] = useState("");
// 搜索范围：title + summary + keywords + source.inputTitle + source.inputSummary
```

### 单条删除

```
点击"删除" → pendingDeleteId = item.id
  → 点击"确认删除" → deleteArchiveItem(id) → refreshItems()
  → 点击"取消"    → pendingDeleteId = null
```

卡片重构为 `<article>` + 内嵌 `<button>`（主体）+ 独立删除区，无 button 嵌套。

### 未知 mode 兜底

```ts
function isSupportedArchiveMode(mode: string): mode is ArchiveMode {
  return mode === "family" || mode === "couple" || mode === "personal" || mode === "memorial";
}
// loadAllArchiveItems() 中 .filter(item => isSupportedArchiveMode(item.mode))
```

防止 localStorage 被污染时页面崩溃（undefined 访问 MODE_LABEL 等）。

---

## 4. 浏览器手动验收

### Case A：mode 筛选

前置：四个 mode 各至少 1 条 ArchiveItem

- "全部"展示所有 item ✅
- "家庭"只展示 family ✅
- 切换 mode 后搜索词不清空 ✅

### Case B-C：搜索标题 / 关键词

输入标题/关键词片段 → 只展示匹配 item ✅

### Case D：无搜索结果

预期："没有找到匹配的记忆册"提示，原始数据不变 ✅

### Case E：删除单条

1. 点击"删除"
2. 点击"确认删除"

预期：item 消失，localStorage 对应 id 删除，其他 item 保留 ✅

### Case F：取消删除

点击"取消" → item 不删除 ✅

### Case G：详情回看不回归

family / couple / personal / memorial 详情均正常，均不显示"保存到本地" ✅

### Case H：FamilyArchivePage 不回归

family landing 的"我的成长册"仍可进入 FamilyArchivePage，专属删除/清空/导出/导入仍正常 ✅

---

## 5. 当前限制

| 限制 | 说明 |
|------|------|
| 搜索是本地 contains 匹配 | 不支持模糊/拼音/全文 |
| 不支持统一批量删除 | Phase 14 考虑 |
| 不支持统一清空 | FamilyArchivePage 专属 |
| 不支持统一导出/导入 | FamilyArchivePage 专属 |
| 不支持云端同步 | Phase 14 |
