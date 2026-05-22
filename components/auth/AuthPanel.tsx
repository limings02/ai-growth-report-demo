"use client";

// components/auth/AuthPanel.tsx
// Auth shell（Phase 14.2）。
// 支持 email/password 登录 / 注册 / 登出 / 查看 session。
// 登录后只显示状态，不同步 archive，不上传 localStorage 数据。
// env 未配置时显示"云端同步未配置"，本地功能仍完全可用。

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Props = {
  onBackToHome: () => void;
};

type AuthMode = "sign-in" | "sign-up";

export default function AuthPanel({ onBackToHome }: Props) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info");
  const [isLoading, setIsLoading] = useState(false);

  const configured = isSupabaseConfigured();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!configured || !supabase) return;

    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (error) { setUser(null); return; }
      setUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatusType("error");
      setStatusMessage("Supabase 尚未配置，无法登录。");
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const result =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setStatusType("error");
        setStatusMessage(result.error.message);
        return;
      }
      setStatusType("success");
      setStatusMessage(
        mode === "sign-in"
          ? "登录成功。"
          : "注册请求已提交。如果项目开启邮箱确认，请前往邮箱完成验证。"
      );
      setUser(result.data.user ?? null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      setStatusType("error");
      setStatusMessage(error.message);
      return;
    }
    setUser(null);
    setStatusType("success");
    setStatusMessage("已退出登录。");
  }

  return (
    <div className="min-h-screen" style={{ background: "#fffaf7" }}>
      {/* 顶部 sticky 导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between gap-3"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBackToHome}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#9d7b72" }}
        >
          ← 返回首页
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-10 pb-20">
        {/* 标题区 */}
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#2d1f1a" }}>
          账户与云端同步
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9d7b72" }}>
          当前仅提供登录状态，暂不自动同步本地记忆档案
        </p>

        {/* env 未配置提示 */}
        {!configured && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#fff8f5", border: "1.5px dashed #f0ddd5" }}
          >
            <p className="text-base font-semibold mb-2" style={{ color: "#7a5a52" }}>
              🔌 云端同步未配置
            </p>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: "#b08878" }}>
              请在 <code className="text-xs px-1 rounded" style={{ background: "#fde8dc" }}>.env.local</code> 中配置：
            </p>
            <pre
              className="text-xs p-3 rounded-xl overflow-x-auto"
              style={{ background: "#f5f0ee", color: "#7a5a52" }}
            >
              {`NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`}
            </pre>
            <p className="text-xs mt-3" style={{ color: "#c0a090" }}>
              ✅ 本地记忆档案仍可正常使用，不受影响。
            </p>
          </div>
        )}

        {/* env 已配置 */}
        {configured && (
          <>
            {/* 状态反馈 */}
            {statusMessage && (
              <div
                className="mb-5 rounded-xl px-4 py-2 text-sm"
                style={
                  statusType === "error"
                    ? { background: "#fff0ee", color: "#c0674a", border: "1px solid #f4b8a0" }
                    : statusType === "success"
                    ? { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }
                    : { background: "#f5f0ee", color: "#9d7b72", border: "1px solid #f0ddd5" }
                }
              >
                {statusMessage}
              </div>
            )}

            {/* 已登录 */}
            {user ? (
              <div
                className="rounded-2xl p-6"
                style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "#fde8dc" }}
                  >
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#2d1f1a" }}>
                      {user.email}
                    </p>
                    <p className="text-xs" style={{ color: "#9d7b72" }}>已登录</p>
                  </div>
                </div>

                <div
                  className="rounded-xl px-4 py-3 mb-5 text-xs leading-relaxed"
                  style={{ background: "#f5f0ee", color: "#7a5a52" }}
                >
                  ℹ️ 当前不会自动上传你的本地记忆档案。同步功能将在后续阶段由你手动触发。
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:shadow-md disabled:opacity-50"
                  style={{ background: "#fde8dc", color: "#c0674a" }}
                >
                  {isLoading ? "处理中…" : "退出登录"}
                </button>
              </div>
            ) : (
              /* 未登录：登录 / 注册表单 */
              <div
                className="rounded-2xl p-6"
                style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
              >
                {/* mode tab */}
                <div className="flex gap-2 mb-6">
                  {(["sign-in", "sign-up"] as AuthMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setStatusMessage(null); }}
                      className="flex-1 py-2 rounded-full text-sm cursor-pointer transition-all"
                      style={
                        mode === m
                          ? { background: "#e07a5f", color: "white" }
                          : { background: "#f5f0ee", color: "#9d7b72" }
                      }
                    >
                      {m === "sign-in" ? "登录" : "注册"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#9d7b72" }}>
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "#fff8f5",
                        border: "1px solid #f0ddd5",
                        color: "#2d1f1a",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#9d7b72" }}>
                      密码
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="至少 6 位"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "#fff8f5",
                        border: "1px solid #f0ddd5",
                        color: "#2d1f1a",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full text-sm font-semibold text-white cursor-pointer transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
                  >
                    {isLoading ? "处理中…" : mode === "sign-in" ? "登录" : "注册"}
                  </button>
                </form>

                <p className="text-xs mt-5 text-center leading-relaxed" style={{ color: "#c0a090" }}>
                  🔒 登录不会自动上传你的本地记忆档案。<br />
                  同步功能将在后续阶段由你手动触发。
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
