// lib/supabase/browserClient.ts
// 客户端 Supabase client helper（Phase 14.2）。
// 基于 @supabase/ssr createBrowserClient，管理 cookie-based session。
// env 未配置时返回 null，不影响离线运行。
// 不自动查询 archive，不自动上传 localStorage 数据。

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  isSupabaseConfigured,
} from "./env";

/**
 * 获取 Supabase browser client。
 * 仅用于 client component 登录 / session 管理。
 * env 未配置时返回 null（不 throw）。
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
