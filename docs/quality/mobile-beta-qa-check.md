# Mobile Beta QA Check - Phase 15.1A

> 文档创建：Phase 15.1A（2026-05-22）  
> 用途：移动端验收清单，Beta 部署前人工逐项验证

---

## 1. 测试环境

| 项目 | 建议 |
|------|------|
| 屏幕宽度 | 375px（iPhone SE）/ 390px（iPhone 14）/ 430px（iPhone 15 Plus）|
| 浏览器 | Chrome（Android）/ Safari（iOS）|
| 模拟工具 | Chrome DevTools Device Toolbar |
| 是否真实 Supabase env | 可选；未配置时验证降级行为 |

---

## 2. 首页 MemoryModeHome

| 检查项 | 结果 | 备注 |
|--------|------|------|
| 页面不横向溢出 | 待验收 | |
| EmotionalBackdrop glow 不遮挡文字 | 待验收 | chips/glow 在 z-0，内容在 z-10 |
| 标题可读，动效轻柔 | 待验收 | |
| 四个 mode 卡片不挤压 | 待验收 | 单列 grid |
| 四个 mode 全部标注可体验 | 待验收 | 不出现"后续开放" |
| 我的记忆档案按钮可见 | 待验收 | |
| 账户 / 登录按钮可见 | 待验收 | |
| 底部隐私文案显示"本地浏览器" | 待验收 | 不出现"自动上传" |
| CTA 在首屏内或接近首屏 | 待验收 | |

---

## 3. Family Landing

| 检查项 | 结果 | 备注 |
|--------|------|------|
| 情绪引导语不溢出 | 待验收 | |
| 未来打开场景标签自动换行 | 待验收 | flex-wrap |
| 我的成长册入口可见 | 待验收 | |
| CTA 清晰可点击 | 待验收 | |
| glow / chips 不压住主要内容 | 待验收 | main z-10 |

---

## 4. Couple Landing

| 检查项 | 结果 | 备注 |
|--------|------|------|
| 聊天气泡不溢出 | 待验收 | max-w-xs 限制 |
| 聊天气泡左右布局清晰 | 待验收 | |
| 不出现 Preview / 下一阶段开放 | 待验收 | |
| 隐私说明可见 | 待验收 | |
| CTA 在气泡下方清晰可点 | 待验收 | |
| 功能卡片 grid 不溢出 | 待验收 | sm:grid-cols-2 |

---

## 5. Personal Landing

| 检查项 | 结果 | 备注 |
|--------|------|------|
| Hero 文案可读 | 待验收 | |
| 不出现 preview / mock / 不调用 AI | 待验收 | |
| 隐私说明显示本地保存 | 待验收 | |
| CTA 清晰 | 待验收 | |
| glow 不压内容 | 待验收 | |

---

## 6. Memorial Landing

| 检查项 | 结果 | 备注 |
|--------|------|------|
| Hero 文案庄重可读 | 待验收 | |
| 不出现 preview / mock | 待验收 | |
| 边界声明不含禁用词（复活/再见一面等）| 待验收 | 已改为"不制造仿佛重逢的体验" |
| 边界声明可读，不溢出 | 待验收 | |
| 隐私说明可见 | 待验收 | |
| CTA 清晰 | 待验收 | |

---

## 7. 结果页 Reveal（MemoryArtifactPreview + MemoryCoverSection）

| 检查项 | 结果 | 备注 |
|--------|------|------|
| reveal hint 在顶部可见 | 待验收 | print:hidden |
| 封面卡片有阴影、keywords 浮标 | 待验收 | |
| reveal-up 动效轻柔 | 待验收 | |
| 顶部操作栏不遮挡内容 | 待验收 | sticky z-20 |
| 保存 PDF / 再做一本按钮可点 | 待验收 | |
| 保存到本地按钮可见（family）| 待验收 | |

---

## 8. 打印 / PDF

| 检查项 | 结果 | 备注 |
|--------|------|------|
| EmotionalBackdrop print:hidden | 待验收 | |
| reveal hint print:hidden | 待验收 | |
| CSS 动效 print 下禁用 | 待验收 | @media print { animation: none } |
| 封面、时间线、信件完整打印 | 待验收 | |
| quality/sourceTrace 不打印 | 待验收 | print:hidden |
| 照片区（family）打印版显示 | 待验收 | hidden print:block |

---

## 9. AuthPanel

| 检查项 | 结果 | 备注 |
|--------|------|------|
| 未配置 env 显示"云端同步未配置" | 待验收 | |
| 不出现"同步到云端"按钮 | 待验收 | Beta 前已隐藏 |
| 已登录显示"内测中"说明 | 待验收 | |
| 登录 / 注册 / 登出可用 | 待验收 | |
| 登录后本地 archive 不自动上传 | 待验收 | |

---

## 10. Phase 15.1A.1 修复备注

- **FamilyLandingPage**：已将 LandingHero / FutureScene / ValueCards / HowItWorks 全部包入 `relative z-10` 容器，所有正文内容均应在 EmotionalBackdrop（fixed z-0）上方。
- **MemorialLandingPage**：已清理源码注释中的高风险表达，改为抽象工程约束（"避免使用高风险的拟人化、重逢式、人格化表达"）；用户可见文案的克制边界声明保持不变。

---

## 11. 已知限制

| 限制 | 说明 |
|------|------|
| EmotionalBackdrop chips 固定文案 | 非个性化，仅增强氛围 |
| floating chips 在极窄屏可能位置不佳 | 可接受，chips 不影响交互 |
| FamilyLandingPage 子组件未完整重写 | LandingHero 等原样保留 |
| 云端同步 Beta 前暂停 | cloudArchiveSync.ts 能力保留，UI 不展示 |
| 真实浏览器测试未完成 | 静态代码分析 + DevTools 模拟为主 |
