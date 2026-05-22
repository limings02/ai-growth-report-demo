// lib/supabase/serverClient.ts
// 服务端 Supabase client helper（Phase 14.2）。
// 基于 @supabase/ssr createServerClient，管理 cookie-based session。
// env 未配置时返回 null，不影响离线运行。
//
// 注意：
// - 本阶段不在主流程中使用 server client
// - 完整 SSR session refresh 可后移到 Phase 14.2B / 14.3
// - Server Components 可能无法 set cookies（只读 context），已做 try/catch 处理

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  isSupabaseConfigured,
} from "./env";

/**
 * 获取 Supabase server client。
 * 仅用于 Server Components / Route Handlers 获取 session。
 * env 未配置时返回 null（不 throw）。
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured() || !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies.
          // Auth refresh via middleware can be introduced in Phase 14.2B if needed.
        }
      },
    },
  });
}
