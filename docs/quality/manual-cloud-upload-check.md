# Manual Cloud Upload Check - Phase 14.3

> 完成时间：Phase 14.3（2026-05-22）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `lib/archive/cloudArchiveSync.ts` | **新增**：手动上传逻辑（INSERT ONLY）|
| `components/auth/AuthPanel.tsx` | 新增同步区域 + `handleManualUploadArchive` |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 人工验收问题

| 问题 | 预期 | 实际 |
|------|------|------|
| Q1：是否自动上传 localStorage？ | 否 | ✅ |
| Q2：是否只有登录后显示同步按钮？ | 是 | ✅ |
| Q3：是否只在用户点击后上传？ | 是 | ✅ |
| Q4：是否覆盖云端已有同 id 记录？ | 否，同 id 跳过 | ✅ |
| Q5：是否上传 previewUrl/blob/File？ | 否，blocked item 被 rejected | ✅ |
| Q6：是否读取 cloud archive 写回 localStorage？ | 否 | ✅ |
| Q7：是否做删除同步？ | 否 | ✅ |
| Q8：是否保留本地 archive 功能？ | 是 | ✅ |

---

## 4. 上传流程说明

```
用户点击「同步到云端」
  → readArchiveCollection()（读取本地 localStorage）
  → uploadLocalArchiveItemsToCloud({ supabase, userId, items })
      1. containsBlockedCloudArchiveFields() 过滤 → rejected
      2. SELECT id FROM archive_items WHERE id IN (...) → existingIds
      3. filter(item => !existingIds.has(item.id)) → rowsToInsert
      4. mapArchiveItemToCloudInsert() 映射
      5. INSERT INTO archive_items → uploadedCount
  → 显示：本地 N 条 / 上传 N 条 / 跳过已有 N 条 / 拒绝 N 条
```

---

## 5. 浏览器手动验收

### Case A：未登录

预期：不显示"同步到云端"按钮 ✅

### Case B：已登录 + 本地无 archive

预期：显示"本地 0 条，上传 0 条" ✅

### Case C：已登录 + 本地有 archive（需手动 apply migration）

前置：Supabase migration `0001_life_archive_schema.sql` 已 apply

预期：
- archive_items 插入对应行
- `user_id = auth.uid()`
- `artifact` 是 jsonb（无照片 blob）

### Case D：重复点击同步

预期：第二次跳过已有 id，不重复插入 ✅

### Case E：blocked fields

预期：previewUrl/blob/File item 被 rejected，其他仍可上传 ✅

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 不做云端读取 | Phase 14.4 |
| 不做 cloud → local 恢复 | Phase 14.4 |
| 不做双向同步 | Phase 14.5 |
| 不做删除同步 | Phase 14.5 |
| 不做冲突覆盖 | 明确设计决策 |
| 不做后台自动同步 | 始终用户主动触发 |
