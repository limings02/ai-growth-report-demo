# Supabase Schema Spike Check - Phase 14.1

> 完成时间：Phase 14.1（2026-05-22）

---

## 1. 检查范围

| 文件 | 内容 |
|------|------|
| `package.json` | 新增 `@supabase/supabase-js` 依赖 |
| `lib/supabase/client.ts` | Supabase client helper（env 安全 / 返回 null）|
| `lib/archive/cloudArchiveMapper.ts` | 本地 ArchiveItem → 云端 insert row 纯函数映射 |
| `supabase/migrations/0001_life_archive_schema.sql` | profiles + archive_items 表 + RLS policy |

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
| Q1：是否新增了 Supabase client 依赖？ | 是，只新增 `@supabase/supabase-js` | ✅ |
| Q2：env 未配置时是否会抛错？ | 否，`getSupabaseClient()` 返回 null | ✅ |
| Q3：是否使用 publishable key 命名？ | 是，`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ |
| Q4：是否使用了 secret/service role key？ | 否 | ✅ |
| Q5：是否改动了现有 localStorage archive 逻辑？ | 否 | ✅ |
| Q6：是否自动上传了 localStorage 数据？ | 否 | ✅ |
| Q7：SQL migration 是否包含 RLS？ | 是，profiles + archive_items 均启用 | ✅ |
| Q8：archive_items 是否保留本地 ArchiveItem.id？ | 是，`id text primary key` | ✅ |
| Q9：mapper 是否只是纯函数？ | 是，不发网络请求 | ✅ |
| Q10：未配置 env 时 app 是否仍可 build/run？ | 是 | ✅ |

---

## 4. SQL Migration 摘要

### profiles 表

```sql
id           uuid primary key references auth.users(id)
display_name text
created_at   timestamptz
updated_at   timestamptz
```

RLS：`id = auth.uid()`（用户只能访问自己的 profile）

### archive_items 表

```sql
id                text       primary key        -- 沿用本地 ArchiveItem.id
user_id           uuid       references users    -- 用于 RLS 隔离
mode              text       check (mode in (...))
title/subtitle/summary/keywords/artifact_version
artifact          jsonb      -- 完整 MemoryArtifact，无照片 blob
source            jsonb      -- ArchiveSourceSnapshot
local_created_at/updated_at  -- 来自本地时间戳
created_at/updated_at        -- 云端时间戳
deleted_at                   -- soft delete 预留（Phase 14.5）
```

RLS：4 个独立 policy（SELECT/INSERT/UPDATE/DELETE），均 `user_id = auth.uid()`

---

## 5. env 命名说明

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key（非 anon key / 非 secret key）|

**不使用旧命名 `NEXT_PUBLIC_SUPABASE_ANON_KEY`**

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 不做登录 | Phase 14.2 |
| 不做真实同步 | Phase 14.3 |
| 不做云端读取 | Phase 14.4 |
| 不做自动迁移 | Phase 14.3+ |
| 不做删除同步 | Phase 14.5 |
| SQL migration 不自动执行 | 需要手动 apply |
