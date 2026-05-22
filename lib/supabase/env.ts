// lib/supabase/env.ts
// Supabase env 读取（Phase 14.2）。
// 所有 Supabase client helper 复用此文件，避免重复读取 env。
// 使用 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY（不使用旧命名 ANON_KEY）。

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** env 是否已配置 Supabase。未配置时 app 仍可完全离线运行。 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}
