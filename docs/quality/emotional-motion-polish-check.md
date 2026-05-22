# Emotional Motion Polish Check - Phase 15.0

> 完成时间：Phase 15.0（2026-05-22）

---

## 1. 检查范围

| 文件 | 改动 |
|------|------|
| `app/globals.css` | 新增 5 个 CSS 动效 keyframe + utility class + prefers-reduced-motion + print 禁用 |
| `components/visual/EmotionalBackdrop.tsx` | **新增**：mode-specific 情绪背景层（radial glow + floating chips）|
| `components/MemoryModeHome.tsx` | 情绪升级：Backdrop / 文案 / 状态修正 / 卡片 CTA / 底部隐私文案 |
| `components/family/FamilyLandingPage.tsx` | 新增 Backdrop + 情绪引导语 + 未来打开场景标签 |
| `components/couple/CoupleLandingPage.tsx` | 删除 Preview/旧阶段文案；升级 hero；加 Backdrop |
| `components/personal/PersonalLandingPage.tsx` | 删除 preview/mock 文案；升级 hero；隐私说明规范化；加 Backdrop |
| `components/memorial/MemorialLandingPage.tsx` | 删除 preview/mock 文案；升级 hero；新增明确边界声明；加 Backdrop |
| `components/memory/MemoryArtifactPreview.tsx` | 新增结果页 reveal hint（print:hidden）|
| `components/memory/MemoryCoverSection.tsx` | 新增 reveal-up 动效 + 增强封面阴影 + keywords 背景升级 |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误（修复 memorial JSX 引号转义）|
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 关键改动说明

### 首页状态修正

- 旧：`🟢 可生成：家庭亲子记忆、情侣恋爱纪念 · ⏳ 后续开放：个人、纪念馆`
- 新：`四种记忆主题均可体验 · 当前档案默认保存在本地浏览器`

### 旧文案清理

| 旧文案 | 位置 | 处理 |
|--------|------|------|
| `恋爱纪念册 · Preview` | CoupleLandingPage | 删除 Preview |
| `完整 AI 纪念册生成将在下一阶段开放` | CoupleLandingPage | 删除整个 orange box |
| `填写完成后，可以预览 AI 将如何整理你们的记忆材料` | CoupleLandingPage | 改为正常产品文案 |
| `📖 个人回忆录 · preview 体验` | PersonalLandingPage | 删除 preview 体验 |
| `当前阶段展示的是 mock 结果预览，不会调用 AI` | PersonalLandingPage | 删除，改为隐私说明 |
| `🕯️ 纪念册 · preview 体验` | MemorialLandingPage | 删除 preview 体验 |
| `当前阶段展示的是 mock 结果预览，不会调用 AI` | MemorialLandingPage | 删除，改为边界声明 |

### memorial 安全边界声明（新增）

```
我们不会做什么：
· 不模拟 ta 说话，不制造对话
· 不使用「复活」「再见一面」等表达
· 不替代真实的怀念和悲伤
· 只帮助整理你愿意留下的故事
```

---

## 4. 打印 / PDF 兼容性

- `EmotionalBackdrop` 有 `print:hidden` class ✅
- 所有 CSS 动效在 `@media print` 下禁用 ✅
- `reveal hint` 在 MemoryArtifactPreview 有 `print:hidden` ✅
- `reveal-up` 动效只影响浏览器渲染，不影响 PDF 内容 ✅

---

## 5. 当前限制

| 限制 | 说明 |
|------|------|
| 不新增动画库 | 全部纯 CSS keyframe |
| EmotionalBackdrop chips 固定文案 | 非 AI 生成，无法个性化 |
| FamilyLandingPage 子组件未重写 | 只在外层增加 Backdrop 和引导语 |
| 不做真实样例预览 | 当前只是静态文案 |
