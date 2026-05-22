# Auth Shell Check - Phase 14.2

> 完成时间：Phase 14.2（2026-05-22）

---

## 1. 检查范围

| 文件 | 内容 |
|------|------|
| `package.json` | 新增 `@supabase/ssr` |
| `lib/supabase/env.ts` | 统一 env 读取（PUBLISHABLE_KEY）|
| `lib/supabase/browserClient.ts` | `@supabase/ssr` browser client，env 安全 |
| `lib/supabase/serverClient.ts` | `@supabase/ssr` server client，备用 |
| `lib/supabase/client.ts` | 兼容 re-export（向下兼容）|
| `components/auth/AuthPanel.tsx` | 登录/注册/登出 UI |
| `app/page.tsx` | 新增 `auth` screen |
| `components/MemoryModeHome.tsx` | 新增 `onOpenAuth?` + "👤 账户 / 登录"按钮 |

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
| Q1：是否新增 `@supabase/ssr`？ | 是 | ✅ |
| Q2：是否仍使用 publishable key？ | 是，`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ |
| Q3：env 未配置时是否崩溃？ | 否，显示"云端同步未配置" | ✅ |
| Q4：是否实现登录/注册/登出？ | 是，email/password | ✅ |
| Q5：是否自动上传 localStorage archive？ | 否 | ✅ |
| Q6：是否读取 cloud archive_items？ | 否 | ✅ |
| Q7：登录后是否明确提示不自动同步？ | 是 | ✅ |
| Q8：现有本地 archive 功能是否不受影响？ | 是 | ✅ |
| Q9：是否引入 service role / secret key？ | 否 | ✅ |
| Q10：是否修改 API / prompt / DeepSeek？ | 否 | ✅ |

---

## 4. AuthPanel 交互说明

### env 未配置
- 显示"🔌 云端同步未配置"卡片
- 展示需要配置的 env 变量名
- 提示本地功能仍可正常使用

### env 已配置 + 未登录
- 登录 / 注册 tab 切换
- email + password 表单
- 提交后调用 `signInWithPassword` / `signUp`
- status 反馈（绿色成功 / 红色失败）
- **安全文案：** "登录不会自动上传你的本地记忆档案。同步功能将在后续阶段由你手动触发。"

### env 已配置 + 已登录
- 显示用户 email
- **提醒：** "当前不会自动上传你的本地记忆档案"
- 退出登录按钮

---

## 5. 本阶段没有做什么

| 未做 | 说明 |
|------|------|
| archive 同步按钮 | Phase 14.3 |
| cloud archive 读取 | Phase 14.4 |
| OAuth | 不在计划内 |
| Magic Link | 不在计划内 |
| profile 编辑 | 不在计划内 |
| 受保护路由 | Phase 14.2B 可选 |
| SSR token refresh middleware | Phase 14.2B 可选 |

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 只做 session 管理 | 不同步 archive |
| SSR token refresh 未实现 | 下次刷新页面 session 可能需要重新验证 |
| 不做 OAuth | 仅 email/password |
| 不做 Magic Link | 不在当前阶段 |
