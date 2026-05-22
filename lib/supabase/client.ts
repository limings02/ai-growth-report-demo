// lib/supabase/client.ts
// Supabase client helper（Phase 14.1 schema spike）。
//
// 重要约束：
// - env 未配置时返回 null，不 throw，不影响离线运行
// - 使用 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY（publishable key）
// - 不使用 service role / secret key
// - 不在模块初始化时直接创建 client
// - 不自动上传任何数据
// - Phase 14.1 不做真实 query，只提供 helper

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** env 是否已配置 Supabase。未配置时 app 仍可完全离线运行。 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

/**
 * 获取 Supabase client 实例。
 * env 未配置时返回 null（不 throw），确保 app 可离线运行。
 * Phase 14.1 只提供 helper，暂不做真实 query。
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }
  return createClient(supabaseUrl, supabasePublishableKey);
}
