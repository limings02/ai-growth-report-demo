# Beta Release Gate

> 创建时间：Phase 15.2A（2026-05-22）  
> 用途：Beta 公开发布前的 Go/No-Go 判断标准

---

## 1. 当前结论

| 维度 | 状态 |
|------|------|
| 代码层面 | ✅ 可进入部署准备 |
| lint/build | ✅ 通过（Phase 15.2A）|
| 真实浏览器验收 | ⬜ 未完成，需人工确认 |
| 外部公开发布 | ⛔ 暂不建议 |
| 建议当前阶段 | 部署到 preview/staging URL，仅自己或少数测试者访问 |

---

## 2. 必须人工确认后才能公开 Beta（Hard Gates）

以下 10 项全部通过，才可对外公开 Beta：

| # | 验收项 | 状态 |
|---|--------|------|
| 1 | 375px / 390px / 430px 首页无横向滚动 | ⬜ 待人工 |
| 2 | 四个 landing page 在 375px 下 CTA 可点击（触摸区域足够）| ⬜ 待人工 |
| 3 | couple Relationship Galaxy 在 375px 下节点可读、不拥挤 | ⬜ 待人工 |
| 4 | personal / memorial 长页面阅读节奏可接受 | ⬜ 待人工 |
| 5 | family Before/After 与 LandingHero 不显得重复 | ⬜ 待人工 |
| 6 | MemoryArtifactPreview 结果页 375px 无横向滚动 | ⬜ 待人工 |
| 7 | 打印预览内容完整，操作栏 / backdrop / reveal hint 不打印 | ⬜ 待人工 |
| 8 | AuthPanel 不出现"同步到云端"按钮 | ✅ 静态确认 |
| 9 | memorial 用户可见区域不出现高风险概念 | ✅ 静态确认（Phase 15.1B.1）|
| 10 | 至少成功生成一次 family / couple / personal / memorial 四个 mode 的结果 | ⬜ 待人工 |

---

## 3. 可接受的 Beta 限制

以下限制在 Beta 阶段属于已知、可接受的范围，**不需要修复后才能 Beta**：

| 限制 | 说明 |
|------|------|
| archive 本地保存 | 默认仅当前浏览器，不跨设备 |
| 登录功能 | 可测试，但不自动同步 archive |
| 云端同步入口 | 暂停展示（Beta 后评估）|
| PDF 保存 | 依赖浏览器打印能力，不生成云端文件 |
| 照片处理 | 不上传服务器，当前仅本地预览或记录数量 |
| EmotionalBackdrop chips | 固定文案，非个性化 |
| 真实移动端视觉 | 仍需测试者反馈，静态验收已通过 |
| couple Galaxy 深色模式 | 未专门适配，待反馈 |
| AI 生成速度 | 取决于 DeepSeek API 响应时间，无保证 |

---

## 4. 不允许在 Beta 中承诺

以下功能当前**不存在**，不得在任何对外文案中暗示或承诺：

- 多设备同步 / 云端永久保存
- 自动读取聊天记录（微信 / iMessage 等）
- 自动读取相册
- memorial 对话化体验（与逝者对话、人格重建等任何形式）
- 公开分享页
- 支付 / 会员体系

---

## 5. Go / No-Go 判断

### Go 条件（全部满足才可公开 Beta）

- [ ] `npm run lint` + `npm run build` 通过
- [ ] staging URL 可从外部访问
- [ ] Hard Gate 表中 10 项全部通过或评估为非阻塞
- [ ] 用户隐私边界文案清晰（照片不上传 / 本地保存 / 登录不自动同步）
- [ ] 生成失败有 fallback 提示，不白屏
- [ ] 控制台无明显 runtime error
- [ ] DeepSeek API Key 已配置且可调用

### No-Go 条件（任一成立则不得公开发布）

- [ ] 移动端横向滚动明显（任一页面）
- [ ] 结果页打印预览失败或内容残缺
- [ ] memorial 用户可见区域出现高风险概念
- [ ] AuthPanel 暴露"同步到云端"按钮
- [ ] 任一 mode 生成链路白屏或无 fallback
- [ ] 环境变量配置错误导致生产环境完全不可用

---

## 6. 当前阶段边界

| 阶段 | 状态 |
|------|------|
| Phase 15.1C 静态代码验收 | ✅ 完成 |
| Phase 15.2A Beta 部署准备文档 | ✅ 完成 |
| Phase 15.2B Preview/Staging 部署 | ⬜ 待执行 |
| Phase 15.2C 真实浏览器 Hard Gate 验收 | ⬜ 待执行 |
| 外部公开 Beta | ⛔ 未开放（等待 15.2C 完成）|
