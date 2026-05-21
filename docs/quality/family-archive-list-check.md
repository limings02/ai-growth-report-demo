# Family Archive List Check - Phase 13.3

> 完成时间：Phase 13.3（2026-05-21）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `app/page.tsx` | 新增 `family-archive` screen；`FamilyLandingPage` 传 `onOpenArchive` |
| `components/family/FamilyLandingPage.tsx` | 新增 `onOpenArchive?` prop 和"📚 我的成长册"按钮 |
| `components/family/FamilyArtifactPreview.tsx` | 新增 `showArchiveSaveButton?` prop，默认 `true` |
| `components/archive/FamilyArchivePage.tsx` | **新增**：列表页 + 详情回看 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误（修复了 `react-hooks/set-state-in-effect`，改用 `useState` 懒初始化）|
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 实现逻辑说明

### 入口路径

```
FamilyLandingPage（顶部右侧"📚 我的成长册"按钮）
  → app/page.tsx screen = "family-archive"
  → FamilyArchivePage
```

### 列表读取

```ts
// useState 懒初始化，SSR 安全
useState<ArchiveItem[]>(() => {
  if (typeof window === "undefined") return [];
  return readArchiveCollection().items.filter((item) => item.mode === "family");
});
```

- 只读取一次（mount 时）
- SSR 返回空数组，不崩溃
- 只展示 `mode === "family"` 的记录

### 详情回看禁用保存

```tsx
<FamilyArtifactPreview
  artifact={selectedItem.artifact}
  showArchiveSaveButton={false}  // ← 禁用保存按钮
  ...
/>
```

`showArchiveSaveButton` 默认 `true`（生成结果页行为不变），archive 回看时传 `false`。

---

## 4. 浏览器手动验收

### Case A：有保存记录时进入"我的成长册"

前置：已完成 Phase 13.2 保存至少一本 family 成长册

1. 进入 family landing
2. 点击"📚 我的成长册"
3. 查看列表

预期：
- 可以看到已保存的成长册卡片
- 卡片展示标题/摘要/日期/关键词/照片数量/问答数量
- 不展示 File / blob

### Case B：点击卡片回看详情

步骤：点击任意成长册卡片

预期：
- 进入 FamilyArtifactPreview 回看页
- 能看到封面/关键词/时间线/长文/分享文案/星图
- **不显示"保存到本地"按钮**（showArchiveSaveButton=false 生效）
- 仍可"保存 PDF"
- 点击"← 返回我的成长册"回到列表

### Case C：空列表

```js
localStorage.removeItem("memory_wiki_archive_v1")
```

进入"我的成长册"：
- 显示空状态 + "去生成第一本成长册 ✨" CTA

### Case D：不影响其他 mode

- couple / personal / memorial 入口正常进入，无 archive 相关报错

---

## 5. 当前限制

| 限制 | 说明 |
|------|------|
| 只支持 family | couple/personal/memorial 待后续 |
| 不支持删除 | Phase 13.4 |
| 不支持编辑 | Phase 13.4+ |
| 不保存照片 blob | 详情页不展示历史照片 |
| 只保存在当前浏览器 | 不跨设备 |
| 列表读取一次不实时刷新 | 切回 landing 再进入可刷新 |
