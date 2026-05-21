# All Archive Page Check - Phase 13.8

> 完成时间：Phase 13.8（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `components/MemoryModeHome.tsx` | 新增 `onOpenArchive?` prop + "📚 我的记忆档案"按钮 |
| `app/page.tsx` | 新增 `all-archive` screen + `handleCreateNewByMode` helper |
| `components/archive/AllArchivePage.tsx` | **新增**：跨 mode 统一只读列表 + 详情回看 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 首页入口说明

- `MemoryModeHome` 四个 mode 卡片之后、底部版权说明之前，新增"📚 我的记忆档案"按钮
- `onOpenArchive` 为可选 prop，不传时按钮不渲染（向下兼容）
- `app/page.tsx` 传 `onOpenArchive={() => setScreen("all-archive")}`

---

## 4. AllArchivePage 列表逻辑

```ts
// useState 懒初始化，SSR 安全，按 updatedAt 倒序
useState<ArchiveItem[]>(() => {
  if (typeof window === "undefined") return [];
  return [...readArchiveCollection().items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
});
```

- 读取所有 mode 的 ArchiveItem（family / couple / personal / memorial）
- 不过滤 mode，全量展示
- 按 updatedAt 倒序

---

## 5. 各 mode 详情回看逻辑

| mode | 渲染组件 | 保存按钮 |
|------|---------|---------|
| family | `FamilyArtifactPreview` | `showArchiveSaveButton={false}` |
| couple | `CoupleArtifactPreview` | `showArchiveSaveButton={false}` |
| personal | `MemoryArtifactPreview` + `PersonalMemoryGraphPreview` | 不传 `topActionsSlot`（自然无保存按钮）|
| memorial | `MemoryArtifactPreview` + `MemorialMemoryGraphPreview` | 不传 `topActionsSlot`（自然无保存按钮）|

- `backLabel="← 返回我的记忆档案"`（family / personal / memorial）
- 不展示历史照片 blob（archive 本身不保存照片）

---

## 6. 浏览器手动验收

### Case A：首页入口

1. 打开首页
2. 点击"📚 我的记忆档案"
3. 进入统一 archive 列表

### Case B：空列表

```js
localStorage.removeItem("memory_wiki_archive_v1")
```

预期：空状态 + "去创建第一份记忆 ✨" CTA → 返回首页

### Case C：多 mode 列表

前置：四个 mode 各保存至少 1 条

预期：
- 全部展示
- 卡片有 mode badge（颜色区分）
- 按 updatedAt 倒序
- 不展示 File / blob

### Case D-G：各 mode 详情回看

按 Case 验证每个 mode 详情页：进入正常 / 无"保存到本地"按钮 / 可保存 PDF / 返回列表

### Case H：family 管理页不回归

- family landing 的"我的成长册"仍进入 `FamilyArchivePage`
- 删除 / 清空 / 导出 / 导入仍正常

---

## 7. 为什么统一页本阶段只读

统一列表的跨 mode 删除/清空策略复杂（每个 mode 有不同的权限边界），且 family 已有专属管理页。本阶段只做只读总览，提供最小可用的"查看所有记忆"体验，管理功能待 Phase 13.9。

---

## 8. 当前限制

| 限制 | 说明 |
|------|------|
| 只读 | 不支持统一删除/清空 |
| 不支持搜索 | Phase 13.9 |
| 不支持筛选 | Phase 13.9 |
| 不支持导出/导入 | family 专属管理页已支持 |
| 不支持云端同步 | Phase 14 |
