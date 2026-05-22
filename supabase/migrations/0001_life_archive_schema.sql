-- Life Archive cloud schema - Phase 14.1
-- This file is a migration draft / schema spike.
-- It is NOT automatically applied by the app.
-- Apply manually via Supabase dashboard SQL editor or `supabase db push`.
--
-- Security notes:
--   - RLS is enabled on both tables.
--   - All policies use auth.uid() — users can only access their own data.
--   - No public access. No service role key in frontend.
--   - artifact column stores MemoryArtifact JSON (no photo blobs).


-- ── profiles ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_own_user_all" on public.profiles;
create policy "profiles_own_user_all"
  on public.profiles
  for all
  using     (id = auth.uid())
  with check (id = auth.uid());


-- ── archive_items ────────────────────────────────────────────────────────────

create table if not exists public.archive_items (
  id                text       primary key,
  user_id           uuid       not null references auth.users(id) on delete cascade,
  mode              text       not null check (mode in ('family', 'couple', 'personal', 'memorial')),
  title             text       not null,
  subtitle          text,
  summary           text,
  keywords          jsonb      not null default '[]'::jsonb,
  artifact_version  text       not null,
  artifact          jsonb      not null,           -- complete MemoryArtifact, no photo blobs
  source            jsonb      not null default '{}'::jsonb,  -- ArchiveSourceSnapshot
  local_created_at  timestamptz,
  local_updated_at  timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz                    -- soft delete (reserved for Phase 14.5)
);

create index if not exists archive_items_user_mode_idx
  on public.archive_items (user_id, mode);

create index if not exists archive_items_user_local_updated_idx
  on public.archive_items (user_id, local_updated_at desc nulls last);

alter table public.archive_items enable row level security;

-- SELECT: users see only their own non-deleted items
drop policy if exists "archive_items_own_user_select" on public.archive_items;
create policy "archive_items_own_user_select"
  on public.archive_items
  for select
  using (user_id = auth.uid() and deleted_at is null);

-- INSERT: users can only insert rows with their own user_id
drop policy if exists "archive_items_own_user_insert" on public.archive_items;
create policy "archive_items_own_user_insert"
  on public.archive_items
  for insert
  with check (user_id = auth.uid());

-- UPDATE: users can only update their own rows
drop policy if exists "archive_items_own_user_update" on public.archive_items;
create policy "archive_items_own_user_update"
  on public.archive_items
  for update
  using     (user_id = auth.uid())
  with check (user_id = auth.uid());

-- DELETE: physical delete allowed (product logic recommends soft delete via deleted_at)
drop policy if exists "archive_items_own_user_delete" on public.archive_items;
create policy "archive_items_own_user_delete"
  on public.archive_items
  for delete
  using (user_id = auth.uid());
