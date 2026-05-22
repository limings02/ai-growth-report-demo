// lib/supabase/client.ts
// 兼容性 re-export（Phase 14.2）。
// 保留 getSupabaseClient() 和 isSupabaseConfigured() 的导出，
// 底层改为使用 @supabase/ssr browser client 和统一 env helper。
// 已有调用此文件的代码不需要修改。

export { isSupabaseConfigured } from "./env";
export { getSupabaseBrowserClient as getSupabaseClient } from "./browserClient";
