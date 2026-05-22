# Cloud Sync Plan - Phase 14.0

> 文档创建：Phase 14.0（2026-05-22）  
> 状态：架构设计阶段。本文档不代表已接入任何云端服务。

---

## 1. 背景

### 当前本地 Life Archive 能力（Phase 13.1～13.9 已完成）

| 能力 | 状态 |
|------|------|
| ArchiveItem / ArchiveCollection 类型 | ✅ |
| localStorage key: `memory_wiki_archive_v1` | ✅ |
| family / couple / personal / memorial 保存入口 | ✅ |
| AllArchivePage 统一列表（筛选/搜索/单条删除）| ✅ |
| FamilyArchivePage 专属管理（删除/清空/导出/导入）| ✅ |
| ArchiveItem 不保存照片 blob/File/previewUrl | ✅ |

### 当前问题

- **数据孤岛**：数据仅存在于当前浏览器，换设备即丢失
- **无持久化保障**：清理浏览器缓存 / 隐私模式会丢失全部数据
- **无法家庭共享**：家庭成员无法查看同一份成长记录
- **无法跨设备归档**：手机生成、电脑无法查看
- **无法长期保存**：不适合作为"人生 Wiki"长期媒介

---

## 2. 云端同步目标（Phase 14 整体）

- 用户可以注册 / 登录账户
- ArchiveItem 可以同步到云端数据库
- 用户换设备后可以恢复全部 archive
- 本地 localStorage 继续作为离线缓存，登录后作为云端镜像
- 支持从本地 archive 迁移到云端（非破坏性）
- **不上传照片 blob / File / previewUrl**
- **保持 MemoryArtifact schema 稳定，不因云端需求改变本地结构**

---

## 3. 非目标（Phase 14 明确不做）

| 非目标 | 说明 |
|--------|------|
| 社交公开分享 | 不做 public link / 不做公开主页 |
| 多人协作编辑 | 不做实时协同 |
| AI 复活 / 逝者对话 | 严格安全边界，不做 |
| 照片云存储 | 不存储 blob，只存数量 |
| 端到端加密 | Phase 14 不做，后续考虑 |
| 复杂版本控制 | 不做 git-style history |
| 实时协同 | 不做 CRDT / OT |

---

## 4. 推荐技术路线

```
Auth + Database:  Supabase（PostgreSQL + GoTrue Auth）
Frontend:         Next.js client components（现有技术栈）
Archive 本地缓存:  localStorage（现有机制）
Cloud 权威数据源:  Supabase Postgres
```

**重要说明：**
- Phase 14.0 是纯设计阶段，**不接入 Supabase，不写 Supabase 代码**。
- Phase 14.1 才做最小 Supabase schema spike。
- 如果后续不选 Supabase，可替换为 PocketBase / Turso / 自建后端，只要遵守本文档的数据模型设计。

---

## 5. 云端数据模型草案

### 5.1 `profiles` 表

```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

### 5.2 `archive_items` 表

```sql
create table archive_items (
  id                  text primary key,           -- 沿用本地 ArchiveItem.id，方便去重
  user_id             uuid not null references auth.users(id) on delete cascade,
  mode                text not null,              -- "family"|"couple"|"personal"|"memorial"
  title               text not null,
  subtitle            text,
  summary             text,
  keywords            jsonb not null default '[]',
  artifact_version    text not null,
  artifact            jsonb not null,             -- 完整 MemoryArtifact（不含照片 blob）
  source              jsonb not null default '{}',-- ArchiveSourceSnapshot（低敏摘要）
  local_created_at    timestamptz,               -- 来自本地 createdAt
  local_updated_at    timestamptz,               -- 来自本地 updatedAt
  created_at          timestamptz default now(), -- 云端写入时间
  updated_at          timestamptz default now(), -- 云端最后更新时间
  deleted_at          timestamptz                -- soft delete 预留
);

create index on archive_items (user_id, mode);
create index on archive_items (user_id, local_updated_at desc);
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| `id` | 沿用本地 `ArchiveItem.id`（`{mode}_{timestamp}_{random}`），方便本地↔云端去重 |
| `artifact` | 完整 `MemoryArtifact` JSON，**不含照片 blob/File/previewUrl** |
| `source` | `ArchiveSourceSnapshot`（只有 photoCount 数量，无原始输入）|
| `local_created_at/updated_at` | 来自本地时间戳，用于冲突解决 |
| `deleted_at` | 软删除预留，Phase 14.5 启用 |

---

## 6. RLS / 权限边界

```sql
-- 启用 RLS
alter table archive_items enable row level security;
alter table profiles enable row level security;

-- 用户只能操作自己的数据
create policy "archive_items_own_user"
  on archive_items
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "profiles_own_user"
  on profiles
  for all
  using (id = auth.uid())
  with check (id = auth.uid());
```

**权限边界：**
- 用户只能 read / insert / update / soft-delete 自己的 `archive_items`
- **禁止**读取他人 archive
- **禁止**公开访问 `archive_items`
- service_role key 仅用于管理员迁移脚本，不暴露给前端

---

## 7. 本地到云端迁移策略

登录后第一次同步的流程：

```
用户登录
  → 读取 localStorage archive（readArchiveCollection()）
  → 读取云端 archive ids（SELECT id FROM archive_items WHERE user_id = uid）
  → 对每个本地 item：
      if (id 不在云端) → INSERT 到云端
      if (id 已在云端) → 比较 local_updated_at 和云端 updated_at
          → 本地更新更新：UPDATE 云端
          → 云端更新更新：跳过（不覆盖云端，提示用户手动处理）
  → 不自动删除本地 localStorage
  → 同步成功后保留 localStorage 作为离线 cache
```

**第一版原则：**
- **不自动清空 localStorage**（本地仍作为离线 cache）
- **不强行覆盖云端**（云端版本更新时，提示用户手动确认）
- 跳过复杂冲突时给用户轻量提示
- 首次同步完成后展示同步状态（"已同步 N 条"）

---

## 8. 删除同步语义

**当前本地删除：hard delete**
```ts
deleteArchiveItem(id) // 直接从 localStorage 移除
```

**云端建议：soft delete**
```sql
UPDATE archive_items SET deleted_at = now() WHERE id = $1 AND user_id = auth.uid();
```

**Phase 14 阶段性处理：**
- Phase 14.1～14.3：暂不实现删除同步
- Phase 14.4：读取云端时过滤 `deleted_at IS NULL`
- Phase 14.5：本地删除 → 云端 soft delete 同步
- **设计要求：** 本地删除 id 需要记录到一个 pending_deletes 列表，登录后批量同步

---

## 9. 导出 / 导入与云端的关系

| 能力 | 云端前 | 云端后 |
|------|--------|--------|
| family JSON 导出 | ✅ 已支持，保留 | ✅ 继续保留 |
| family JSON 导入 | ✅ 已支持，保留 | ✅ 继续保留（导入到 local，再同步到云） |
| cloud backup export | — | Phase 14.5 考虑（从云端导出全量） |

**重要区分：**
- JSON 导入 = 本地恢复，不直接等同云端恢复
- 导入 JSON → localStorage → 再手动"同步到云端"
- 云端不因为 JSON 导入而自动被覆盖

---

## 10. 隐私与安全边界

| 风险点 | 说明 | 处理方式 |
|--------|------|---------|
| MemoryArtifact 含敏感叙事 | 用户私密记忆 | RLS 隔离；不做公开分享 |
| ArchiveSourceSnapshot | 只含低敏摘要（数量/风格）| 不含原始输入 |
| chatText / freeNote | 不进入 source，但摘要可能进入 artifact | 明确隐私承诺 |
| memorial 内容 | 涉及逝者信息，高度敏感 | RLS 严格隔离；不做公开 |
| 照片 blob / previewUrl | ArchiveItem 不保存 | 设计约束已明确 |
| 云端同步确认 | 不自动上传，需用户主动触发 | 设计原则 |
| JWT 泄露 | 暴露 user archive | 使用 HTTPS；key 不硬编码 |

---

## 11. 分阶段实施计划

| 阶段 | 内容 | 说明 |
|------|------|------|
| Phase 14.0 | 架构设计（本文档）| 不接真实服务 |
| Phase 14.1 | Supabase schema spike | 添加依赖/env；SQL migration 文档；不改主 UI；不自动同步 |
| Phase 14.2 | Auth shell | 登录/登出 UI；获取用户 session；不同步 archive |
| Phase 14.3 | 手动上传本地 archive | 用户点击"同步到云端"触发上传；不后台自动同步 |
| Phase 14.4 | 云端 archive 读取 | 登录后读取云端 archive；与本地合并 |
| Phase 14.5 | 冲突处理 + 删除同步 | updatedAt 冲突处理；soft delete 同步 |
| Phase 14.6 | Cloud backup export | 从云端导出全量 JSON |

---

## 12. 风险清单

| 风险 | 影响 | 缓解 |
|------|------|------|
| 用户误以为已云端保存但数据仍在本地 | 数据丢失误解 | 同步状态明确展示 |
| localStorage 和云端冲突（双端同时更新）| 数据不一致 | Phase 14.5 冲突策略 |
| 删除同步误删（本地删了但云端未同步）| 数据永久丢失 | Phase 14.5 soft delete |
| RLS 配错导致数据泄露 | 隐私事故 | SQL review；service_role 不暴露前端 |
| MemoryArtifact schema 变化 | artifact jsonb 格式不兼容 | 版本字段 + 迁移脚本 |
| Supabase 成本 | 超出免费层 | 监控 DB 大小；每条 artifact 约 5-20KB |
| 登录摩擦影响体验 | 用户流失 | 离线优先，登录可选 |
| memorial 数据敏感 | 隐私 / 伦理风险 | RLS 严格；绝不做公开分享 |
| 浏览器导入坏数据污染云端 | 上传无效数据 | 导入时 validateArchiveExportBundle；上传前再次校验 |
| 多设备同时编辑冲突 | 数据不一致 | Phase 14.5 处理；Phase 14.0 暂不支持 |

---

## 13. Phase 14.1 最小验收标准

如果下一步进入 Supabase schema spike，验收标准为：

| 检查项 | 预期 |
|--------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误 |
| 现有本地功能不受影响 | ✅ localStorage archive 完全不变 |
| 没有自动上传 | ✅ 无任何自动 fetch 到 Supabase |
| 没有破坏 localStorage | ✅ readArchiveCollection / writeArchiveCollection 行为不变 |
| Supabase client 仅在配置了 env 时初始化 | ✅ 未配置 env 时 app 仍可完全离线运行 |
| SQL migration 文件存在 | ✅ 包含 RLS 规则 |
| README 新增 Supabase env 配置说明 | ✅ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY |
| 无真实用户数据写入 | ✅ spike 只用测试账号验证 schema |
