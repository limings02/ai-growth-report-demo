# Landing Emotional Storytelling Check — Phase 15.1B

> 创建时间：Phase 15.1B（2026-05-22）  
> 用途：四个落地页情绪叙事扩写验收记录

---

## 本阶段目标

把四个 mode landing page 从"功能介绍页"提升为"情绪叙事页"。
重点扩写 PersonalLandingPage 和 MemorialLandingPage，补齐与 FamilyLandingPage 的内容深度差距。

---

## 各页面新增 Section 列表

### PersonalLandingPage（完整重写）

| Section | 内容 |
|---------|------|
| Hero 情绪区 | 扩写 hero 标题、情绪文案、浮动记忆 chips、Hero CTA |
| 情绪场景卡片（6 张）| 毕业前后 / 搬去新城市 / 第一份工作 / 走出低谷 / 某段关系结束 / 三十岁前后 |
| Before/After | "整理前" 散落碎片 → "AI 整理之后" 时间线/关键词/信件/图谱 |
| 它会整理什么（4 张） | 时间线 / 关键词 / 写给未来自己的信 / 个人记忆图谱（加长情绪描述）|
| 示例预览 | 时间线片段示例 + 关键词示例 + 写给未来自己的信片段 |
| 未来重新打开场景（4 条）| 半年后 / 换工作前 / 30 岁生日 / 很久以后 |
| 适合什么时候整理 | 场景标签（8 个）|
| 隐私说明 | 本地保存，登录不自动上传 |
| 底部 CTA | "开始整理这段人生 →" |

**从约 165 行扩写至约 280 行，情绪层次显著提升。**

---

### MemorialLandingPage（完整重写）

| Section | 内容 |
|---------|------|
| Hero 情绪区 | 扩写 hero 文案，主 CTA 提前出现 |
| 为什么值得整理（4 条）| 细节模糊 / 旧照片需要文字 / 家族故事传承 / 整理即告别 |
| 记忆细节卡片（5 张）| 常坐位置 / 爱做一道菜 / 总说一句话 / 旧照片背后故事 / 家里某个物件 |
| 它会整理什么（4 张）| 人生片段时间线 / 家族记忆整理 / 重要人物关系 / 可保存纪念文（加长情绪描述）|
| 示例预览 | 纪念文片段 + 时间线片段 + 记忆细节片段 |
| 适合什么时候整理 | 场景标签（6 个）|
| 中部 CTA | "开始整理这份记忆 →" |
| 边界说明（温柔版）| 非警告框，逐条柔性呈现，保持完整边界内容 |
| 隐私说明 | 照片不上传，本地保存 |
| 底部 CTA | "开始整理这份记忆 →" |

**从约 153 行扩写至约 300 行，仪式感和空间感显著提升。**

---

### CoupleLandingPage（增强）

| 新增 Section | 内容 |
|--------------|------|
| 从聊天到纪念册（Before/After）| 整理前碎片化聊天截图 → 整理后时间线/关键词/周年信/Galaxy |
| Relationship Galaxy 示意 | 深色宇宙背景，浮动节点（你 / Ta / 老地方 / 争吵 / 和好 / 纪念日 / 暗号 / 第一次旅行 / 晚安），星点 constellation-pulse 动效 |

**原有：Hero 气泡 + 功能介绍 + 场景标签 + 样例预览 + 隐私 + CTA**  
**新增两个 section，整体更有"关系叙事"深度。**

---

### FamilyLandingPage（增强）

| 新增 Section | 内容 |
|--------------|------|
| 从照片到成长册（Before/After）| 置于 LandingHero 前，散落照片/视频 → 一本有封面/时间线/信件/星图的成长册 |
| 在这些时刻打开成长册（4 条）| 置于 HowItWorks 后，18 岁生日 / 毕业 / 离家上大学前 / 很久以后孩子自己看 |

**不修改 LandingHero / FutureScene / ValueCards / HowItWorks 核心逻辑。**

---

### MemoryModeHome（微调）

| 改动 | 内容 |
|------|------|
| 四个 mode 卡片底部打开场景文字 | 添加副标题，每个 mode 情绪差异更明显 |
| family | "给未来孩子的礼物，现在开始整理" |
| couple | "聊天 · 关键词 · Relationship Galaxy" |
| personal | "毕业 · 换城市 · 30 岁前后" |
| memorial | "整理记忆 · 不做对话模拟" |

---

## 各页面情绪目标

| 页面 | 情绪目标 | 关键词 |
|------|---------|---------|
| family | 温暖、礼物感、未来打开 | 18岁生日、毕业、离家、成长礼物 |
| couple | 浪漫、聊天记录、关系星图、周年感 | 晚安、争吵、和好、两个人的宇宙 |
| personal | 克制、回望、自我理解、阶段复盘 | 低谷、毕业、换城市、写给未来自己 |
| memorial | 庄重、安静、家族记忆、留下故事 | 慢慢读起、旧照片、习惯、留给后来的人 |

---

## 动效使用情况

| 动效类 | 使用位置 | 用途 |
|--------|---------|------|
| `reveal-up` | 所有 landing 页 Hero h1 | 首屏标题浮现 |
| `slow-fade-in` | personal 浮动 chips | 关键词轻柔出现 |
| `soft-slide-up` | personal/memorial 功能卡片 | 卡片渐入 |
| `gentle-glow-blue` | personal CTA 按钮（两处）| 蓝色系呼吸感召唤（Phase 15.1B.1 改名）|
| `constellation-pulse` | couple Relationship Galaxy 星点 | 宇宙感闪烁 |

### 兼容性保证

- `@media (prefers-reduced-motion: reduce)` 下所有动效 `animation: none !important`
- `@media print` 下所有动效 `animation: none !important`
- 所有新动效类均已加入两个 media query 的禁用列表

---

## 移动端风险点

| 风险 | 级别 | 备注 |
|------|------|------|
| personal 情绪场景卡片移动端密度 | ✅ 已修 | Phase 15.1B.1 改为 grid-cols-1 sm:grid-cols-2 |
| couple Relationship Galaxy 节点换行 | ⚠️ 待确认 | flex-wrap + overflow-hidden，静态分析正常，待人工 375px 确认 |
| memorial 记忆细节卡 5 张（4+1）布局 | ✅ 已修 | Phase 15.1B.1 改为 grid-cols-1 sm:grid-cols-2 + 第 5 张全宽 |
| family 新增 Before/After + 仪式感 section 总页面长度 | ⚠️ 待确认 | 页面变长无溢出风险，与 LandingHero 视觉节奏待人工确认 |
| EmotionalBackdrop 遮挡主内容 | ✅ | 所有页面 relative z-10 已保证 |

---

## memorial 边界检查（Phase 15.1B）

### 用户可见文案禁用词检查

| 禁用词 | Phase 15.1B | Phase 15.1B.1 |
|--------|------------|---------------|
| 复活 | ✅ | ✅ |
| 召回 | ✅ | ✅ |
| 再见一面 | ✅ | ✅ |
| 和 ta 对话 | ✅ | ✅ |
| 数字生命 | ✅ | ✅ |
| 模拟 ta | ✅ | ✅ |
| 让 ta 回来 | ✅ | ✅ |
| 对话模拟 | ⚠️ 首页出现 | ✅ 已移除 |
| 模拟离世者 | ⚠️ 边界声明出现 | ✅ 已移除 |
| 数字形象 | ⚠️ 边界声明出现 | ✅ 已移除 |

### 边界声明当前形式（Phase 15.1B.1 更新）

Phase 15.1B.1 进一步克制化边界声明（移除"模拟离世者 / 数字形象"等高风险概念），当前用户可见版本：

- ✓ 只整理你主动提供的照片、文字和故事
- · 不创造新的个人表达
- · 不包装成交互式人格
- · 不替代真实的怀念与悲伤
- ✓ 帮助这些记忆被家人慢慢读起

> 旧版本（Phase 15.1B）曾包含"不模拟离世者发言 / 不包装成数字人格"等表述已于 Phase 15.1B.1 中移除。

---

## Phase 15.1C 验收记录（2026-05-22）

验收方式：全量静态代码分析（无浏览器工具）。真实浏览器 375/390/430px 仍为人工待确认。

| 检查项 | 状态 |
|--------|------|
| landing-emotional-storytelling-check.md 旧边界声明残留 | ✅ 已修正（本阶段 Task 0）|
| 动效类名文档一致性（gentle-glow → gentle-glow-blue）| ✅ 已修正 |
| 移动端风险表更新（grid-cols-2 修复状态）| ✅ 已更新 |
| personal 情绪场景卡片 375px 下单列可读 | ✅ 静态（grid-cols-1 sm:grid-cols-2）|
| memorial 记忆细节卡 375px 下单列可读 | ✅ 静态（grid-cols-1 sm:grid-cols-2）|
| couple Galaxy 375px 不溢出 | ✅ 静态（overflow-hidden + flex-wrap）|
| memorial 边界说明温柔可读 | ⬜ 待人工真实视觉确认 |
| couple Galaxy 主观视觉感受 | ⬜ 待人工真实确认 |
| 动效轻柔不廉价 | ⬜ 待人工真实确认 |

---

## 待人工验收项（Phase 15.1C → Phase 15.2 前）

| 检查项 | 状态 |
|--------|------|
| personal 情绪场景卡片 375px 下可读性 | ⬜ 待验收 |
| memorial 记忆细节卡 2 列在小屏不挤压 | ⬜ 待验收 |
| couple Relationship Galaxy 在 375px 下布局正常 | ⬜ 待验收 |
| family before/after + 仪式感 section 不与原有 LandingHero 重复 | ⬜ 待验收 |
| 所有 landing 页 EmotionalBackdrop 不遮挡新增 section | ⬜ 待验收 |
| personal / memorial 底部 CTA 首屏附近可见 | ⬜ 待验收 |
| memorial 边界说明版式在手机上温柔可读 | ⬜ 待验收 |
| couple Galaxy 深色区域在系统深色模式下正常 | ⬜ 待验收 |
| 所有动效轻柔不廉价（主观评估）| ⬜ 待验收 |

---

## Phase 15.1B.1 修复记录（2026-05-22）

| 修复项 | 改动内容 |
|--------|---------|
| memorial 用户可见边界文案 | MemoryModeHome "不做对话模拟" → "整理故事 · 保留家族记忆"；MemorialLandingPage 边界声明改用正向措辞，移除"模拟离世者 / 数字形象"等概念 |
| personal 情绪场景卡片移动端 | `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`，移动端单列阅读 |
| memorial 记忆细节卡片移动端 | `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`，移动端单列阅读 |
| gentle-glow 动效拆分 | 删除通用 `gentleGlow`，新增 `gentleGlowWarm` / `gentleGlowBlue` / `gentleGlowMemorial` 三种 tone；personal CTA 改用 `gentle-glow-blue` |
| 新动效类 reduced-motion/print | 三个新 glow 类均已加入 `prefers-reduced-motion` 和 `@media print` 禁用列表 |
| lint/build 验证 | npm run lint ✅，npm run build ✅ |

---

## Phase 15.1B 结论

| 维度 | 结论 |
|------|------|
| PersonalLandingPage 扩写 | ✅ 从约 165 行扩至 280 行，新增 6 个 section |
| MemorialLandingPage 扩写 | ✅ 从约 153 行扩至 300 行，新增 6 个 section |
| CoupleLandingPage 增强 | ✅ 新增 Before/After + Relationship Galaxy |
| FamilyLandingPage 增强 | ✅ 新增 Before/After + 仪式感打开场景 |
| MemoryModeHome 微调 | ✅ 四个 mode 情绪差异更鲜明 |
| memorial 边界检查 | ✅ 无禁用词，边界声明完整 |
| 动效兼容性 | ✅ reduced-motion + print 均已禁用 |
| 新增依赖 | ✅ 无 |
| npm run lint / build | ✅ 零错误零 warning |
