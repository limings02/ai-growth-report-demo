# Beta Deployment Checklist

> 创建时间：Phase 15.1B（2026-05-22）  
> 更新：Phase 15.2A（2026-05-22）  
> 适用范围：首次 Beta 部署（Vercel 或同类平台）  
> 注意：本 checklist 描述部署配置；公开 Beta 前还需完成 beta-release-gate.md 中的 10 项 Hard Gate 人工验收

---

## 1. 必须配置的环境变量

### AI 生成（必须）

| 变量 | 说明 | 示例 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-...` |
| `DEEPSEEK_MODEL` | 模型名称 | `deepseek-v4-pro` |
| `DEEPSEEK_BASE_URL` | API base URL | `https://api.deepseek.com` |
| `DEEPSEEK_MAX_TOKENS` | 最大 token 数（建议 8192）| `8192` |
| `DEEPSEEK_THINKING` | thinking 模式，推荐 disabled | `disabled` |
| `DEEPSEEK_JSON_MODE` | JSON 模式 | `true` |

### 云端同步（可选，Beta 可不配）

| 变量 | 说明 | Beta 状态 |
|------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 可选，不配时同步 UI 自动降级 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key（非 anon key）| 可选 |

**注意：**
- Supabase env 不配时 app 完全离线可用，登录 UI 显示"云端同步未配置"
- 不要配置 service role / secret key 到前端
- 不要使用旧命名 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Beta 阶段产品边界

| 功能 | Beta 状态 | 说明 |
|------|---------|------|
| family / couple / personal / memorial 生成 | ✅ 可用 | 四种 mode 均可体验 |
| 本地 archive 保存 / 列表 / 详情 | ✅ 可用 | localStorage，仅本设备 |
| family archive 导出 / 导入 | ✅ 可用 | JSON 文件 |
| 登录 / 注册 / 登出 | ✅ 可测试 | 需配置 Supabase env |
| 云端同步 UI | ⏸️ 暂停 | 代码存在但 Beta 前不展示 |
| memorial 对话模拟 | ❌ 不做 | 仅整理纪念资料，不模拟对话 |
| 多人协作 / 社交分享 | ❌ 不做 | Beta 后规划 |
| 照片云存储 | ❌ 不做 | 照片仅本地预览 |
| PDF 保存 | ✅ 可用 | 依赖浏览器打印能力 |

---

## 3. Vercel 部署配置

### 基础配置

```
Framework Preset: Next.js
Build Command:    npm run build（默认）
Output Directory: .next（默认）
Install Command:  npm install（默认）
```

### Node 版本

Next.js 16 推荐 Node 18+。Vercel 默认 Node 20，兼容。

### Environment Variables

在 Vercel Dashboard → Project → Settings → Environment Variables 中配置：

```
DEEPSEEK_API_KEY        = <你的 DeepSeek Key>
DEEPSEEK_MODEL          = deepseek-v4-pro
DEEPSEEK_BASE_URL       = https://api.deepseek.com
DEEPSEEK_MAX_TOKENS     = 8192
DEEPSEEK_THINKING       = disabled
DEEPSEEK_JSON_MODE      = true
```

可选（Supabase）：
```
NEXT_PUBLIC_SUPABASE_URL               = <Supabase project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   = <publishable key>
```

### 首次部署后 Smoke Test

按顺序执行，全部通过才视为部署成功：

- [ ] 1. 首页可访问，四个 mode 卡片正常显示，无白屏
- [ ] 2. 四个 mode landing page 均可进入
- [ ] 3. 四个 mode 输入页均可进入并显示表单
- [ ] 4. 至少一个 mode（建议 family）完整生成结果，无 API 报错
- [ ] 5. 结果页可执行：返回首页 / 再做一本 / 保存 PDF
- [ ] 6. archive 本地保存 / 列表 / 删除 可用
- [ ] 7. AuthPanel 未配置 Supabase env 时降级正常（显示"云端同步未配置"）
- [ ] 8. memorial 页面无高风险表达（边界说明文案正确）
- [ ] 9. 移动端 375px 首页不横向滚动（DevTools 或真实设备）
- [ ] 10. 控制台无明显 runtime error

---

## 4. Beta 发布前手动验收清单

### 必须通过

| 项目 | 状态 |
|------|------|
| 首页正常渲染，四种主题均可进入 | ⬜ 待验收 |
| family 生成成功，结果页正常 | ⬜ 待验收 |
| couple 生成成功，结果页正常 | ⬜ 待验收 |
| personal 生成成功，结果页正常 | ⬜ 待验收 |
| memorial 生成成功，结果页正常 | ⬜ 待验收 |
| 结果页 PDF 打印不出现工程化内容 | ⬜ 待验收 |
| 本地 archive 保存/读取/删除 | ⬜ 待验收 |
| AuthPanel 未配置 env 时降级正常 | ⬜ 待验收 |
| 移动端（375px）各页面不横向溢出 | ⬜ 待验收 |
| memorial 页面无高风险表达 | ✅（静态验证）|
| 无"Preview/mock/下一阶段开放"旧文案 | ✅（静态验证）|
| 无"同步到云端"按钮暴露 | ✅（静态验证）|

### 可选（Beta 后迭代）

- [ ] 登录功能真实测试（需配置 Supabase env）
- [ ] 云端上传功能测试（仅内测账号）
- [ ] 多设备 archive 同步测试

---

## 5. 不在本阶段做

| 功能 | 说明 |
|------|------|
| 云端 archive 读取 / 合并 | Phase 14.4，暂缓 |
| 多设备同步 | Phase 14.5+，暂缓 |
| 支付 / 会员 | 未规划 |
| 用户公开分享页 | 未规划 |
| memorial 对话化功能 | 明确不做 |
| 照片云存储 | 明确不做 |

---

## 6. 回滚策略

- Vercel 支持一键回滚到上一个 deployment。
- localStorage 数据在浏览器本地，回滚不影响用户已保存的 archive。
- DeepSeek API 配置错误时会在 API 路由返回明确错误，不会破坏前端。

---

## 7. 监控建议（Beta 阶段）

- Vercel Function Logs：监控 `/api/generate-*` 路由的错误率和响应时间
- DeepSeek 控制台：监控 token 消耗和配额
- 暂不引入第三方监控平台（可 Beta 后评估）
