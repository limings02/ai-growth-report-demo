# Mobile Beta QA Check

> 文档创建：Phase 15.1A（2026-05-22）  
> 更新：Phase 15.1C（2026-05-22）  
> 用途：移动端验收清单，Beta 部署前人工逐项验证

---

## Phase 15.1B 验收方式说明

**静态代码分析**（已完成）：通过 `grep`/代码审查对所有关键属性进行逐项核查。  
**真实浏览器验收**：未完成。Phase 15.1C 完成全量静态代码验收，代码层面无阻塞。真实浏览器 375px / 390px / 430px 视觉验收仍需人工操作（DevTools Device Toolbar 或真实设备）。

---

## Phase 15.1A.1 修复备注

- **FamilyLandingPage**：已将 LandingHero / FutureScene / ValueCards / HowItWorks 全部包入 `relative z-10` 容器，所有正文内容均应在 EmotionalBackdrop（fixed z-0）上方。
- **MemorialLandingPage**：已清理源码注释中的高风险表达，改为抽象工程约束；用户可见文案的克制边界声明保持不变。

---

## 静态分析结论（Phase 15.1B）

| 检查项 | 静态结论 | 备注 |
|--------|---------|------|
| 所有 mode 状态均为 `available` | ✅ | 无"即将开放"/"后续开放"触发 |
| 用户可见文案无 Preview / mock / 下一阶段 | ✅ | 仅 dev-only 按钮有 mock 字样（生产不显示）|
| memorial 用户页面无高风险表达 | ✅ | 代码注释已抽象化，边界声明克制 |
| AuthPanel 无"同步到云端"按钮 | ✅ | Beta 前已隐藏，代码注释保留 |
| print:hidden 已覆盖：sticky nav / reveal hint / backdrop / quality+sourceTrace | ✅ | MemoryArtifactPreview 逐行确认 |
| EmotionalBackdrop overflow:hidden（chips 不溢出视口） | ✅ | backdrop 有 overflow-hidden |
| 主要内容 relative z-10（backdrop 不遮挡） | ✅ | 所有 5 个页面已修复 |
| couple 聊天气泡 max-w-xs 防溢出 | ✅ | 气泡每条最大 70% 宽度 |
| grid-cols-1 sm:grid-cols-2（移动单列）| ✅ | couple / personal 功能卡片均有 |
| Hero CTA 在页面早期位置 | ✅ | 所有 landing 页均有首屏或近首屏 CTA |
| Dev-only mock 按钮生产不显示 | ✅ | 受 NODE_ENV=development 控制 |

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

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 页面不横向溢出 | 待人工确认 | 静态：max-w-5xl + px-5 保护 |
| EmotionalBackdrop glow 不遮挡文字 | 待人工确认 | 静态：main z-10 已设置 |
| 标题可读，动效轻柔 | 待人工确认 | |
| 四个 mode 卡片不挤压 | 待人工确认 | 静态：grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 |
| 四个 mode 全部标注可体验（无"后续开放"）| ✅（静态）| 所有 mode 均为 available |
| 我的记忆档案按钮可见 | 待人工确认 | |
| 账户 / 登录按钮可见 | 待人工确认 | |
| 底部隐私文案显示"本地浏览器" | ✅（静态）| 文案已修正 |
| CTA 在首屏内或接近首屏 | 待人工确认 | 四张卡片下方 |

---

## 3. Family Landing

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 情绪引导语不溢出 | 待人工确认 | 静态：max-w-sm 限制 |
| 未来打开场景标签自动换行 | 待人工确认 | 静态：flex flex-wrap |
| 我的成长册入口可见 | 待人工确认 | |
| CTA 清晰可点击 | 待人工确认 | |
| glow / chips 不压住主要内容 | ✅（静态）| main>div relative z-10 包裹 |
| LandingHero/FutureScene/ValueCards/HowItWorks 均在 backdrop 上方 | ✅（静态）| Phase 15.1A.1 修复 |

---

## 4. Couple Landing

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 聊天气泡不溢出 | ✅（静态）| max-w-xs + 每条 max-w-[70%] |
| 聊天气泡左右布局清晰 | 待人工确认 | |
| 不出现 Preview / 下一阶段开放 | ✅（静态）| 已清理 |
| 隐私说明可见 | 待人工确认 | |
| CTA 在气泡下方清晰可点 | 待人工确认 | |
| 功能卡片 grid 不溢出 | ✅（静态）| grid-cols-1 sm:grid-cols-2 |
| 不土味 | 待人工确认 | 主观评估 |

---

## 5. Personal Landing

| 检查项 | 状态 | 备注 |
|--------|------|------|
| Hero 文案可读 | 待人工确认 | |
| 不出现 preview / mock / 不调用 AI | ✅（静态）| 已清理 |
| 隐私说明显示本地保存 | ✅（静态）| 文案已修正 |
| CTA 清晰 | 待人工确认 | |
| 情绪场景卡片移动端单列可读 | ✅ 静态 / 待人工确认 | grid-cols-1 sm:grid-cols-2（Phase 15.1B.1 已修），真实阅读节奏待人工确认 |

---

## 6. Memorial Landing

| 检查项 | 状态 | 备注 |
|--------|------|------|
| Hero 文案庄重可读 | 待人工确认 | |
| 不出现 preview / mock | ✅（静态）| 已清理 |
| 边界声明不含禁用词 | ✅（静态）| Phase 15.1A 已修复，注释也已清理 |
| 边界声明可读，不溢出 | 待人工确认 | |
| 隐私说明可见 | 待人工确认 | |
| CTA 清晰 | 待人工确认 | |

---

## 7. 结果页 Reveal（MemoryArtifactPreview + MemoryCoverSection）

| 检查项 | 状态 | 备注 |
|--------|------|------|
| reveal hint 在顶部可见 | 待人工确认 | 静态：print:hidden 已设置 |
| 封面卡片有阴影、keywords 浮标 | 待人工确认 | |
| reveal-up 动效轻柔 | 待人工确认 | |
| 顶部操作栏不遮挡内容 | 待人工确认 | 静态：sticky z-20 print:hidden |
| 保存 PDF / 再做一本按钮可点 | 待人工确认 | |
| 保存到本地按钮可见（family）| 待人工确认 | showArchiveSaveButton=true 时 |

---

## 8. 打印 / PDF

| 检查项 | 状态 | 备注 |
|--------|------|------|
| EmotionalBackdrop print:hidden | ✅（静态）| EmotionalBackdrop 有 print:hidden class |
| reveal hint print:hidden | ✅（静态）| 代码确认 `className="print:hidden ..."` |
| 顶部操作栏不打印 | ✅（静态）| sticky nav 有 print:hidden |
| quality/sourceTrace 不打印 | ✅（静态）| 包裹 div print:hidden |
| CSS 动效 @media print 下禁用 | ✅（静态）| globals.css 已设置 |
| 封面、时间线、信件可正常打印 | 待人工确认 | 无 print:hidden |
| family 照片区打印版 hidden print:block | ✅（静态）| FamilyArtifactPreview 代码确认 |
| 打印内容不截断 | 待人工确认 | 需要真实打印测试 |

---

## 9. AuthPanel

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 未配置 env 显示"云端同步未配置" | ✅（静态）| isSupabaseConfigured()=false 走相应分支 |
| 不出现"同步到云端"按钮 | ✅（静态）| Beta 前已隐藏，grep 确认 |
| 已登录显示"内测中"说明 | ✅（静态）| 代码确认 |
| 登录 / 注册 / 登出可用 | 待人工确认 | 需要配置 Supabase env |
| 登录后本地 archive 不自动上传 | ✅（静态）| 无自动 upload 逻辑 |

---

## 10. Phase 15.1B 整体结论

| 维度 | 结论 |
|------|------|
| 静态分析 | ✅ 全部通过（无旧文案/无高风险词/无同步按钮/print:hidden 完整）|
| 真实浏览器验收 | ⬜ **未完成**，Phase 15.1C 静态验收已完成，真实浏览器仍需人工 |
| 代码修复 | 无（静态分析无阻塞问题）|
| Beta 可进入部署准备 | ✅ **代码层面准备就绪（Phase 15.2A）** |

---

## 11. 已知限制

| 限制 | 说明 |
|------|------|
| EmotionalBackdrop chips 固定文案 | 非个性化，仅增强氛围 |
| FamilyLandingPage 子组件未重写 | LandingHero 等原样保留，已被 relative z-10 容器保护 |
| 云端同步 Beta 前暂停 | cloudArchiveSync.ts 能力保留，UI 不展示 |
| 真实浏览器测试未完成 | Phase 15.1C 完成全量静态验收；真实浏览器 375/390/430px 仍需人工确认 |
| personal 情绪场景卡片（已修）| Phase 15.1B.1 改为 grid-cols-1 sm:grid-cols-2 |

---

## Phase 15.1C 验收记录（2026-05-22）

### 验收方式

- 无 Playwright / Puppeteer / Cypress（未安装）
- 开发服务器运行中（http://localhost:3000，HTTP 200 ✅）
- 本阶段验收方式：**全量静态代码分析**（grep / 代码审查）
- 真实浏览器 375/390/430px 视觉验收：仍为人工待确认

### 静态分析汇总

| 检查维度 | 结果 | 说明 |
|---------|------|------|
| npm run lint | ✅ 通过 | 零错误 |
| npm run build | ✅ 通过 | 零 TypeScript 错误，6 个 route |
| memorial 用户可见禁用词（复活/召回/再见一面等）| ✅ 无 | grep 逐项确认 |
| memorial 用户可见"对话模拟 / 模拟离世者 / 数字形象" | ✅ 已移除 | Phase 15.1B.1 修复 |
| AuthPanel "同步到云端"按钮 | ✅ 已隐藏 | grep 返回空 |
| 所有 mode 状态均为 available | ✅ | modes.ts 确认无 coming_soon |
| mock 按钮生产不显示 | ✅ | NODE_ENV=development 守卫 |
| print:hidden 覆盖（backdrop / nav / quality / sourceTrace）| ✅ | MemoryArtifactPreview + EmotionalBackdrop 逐行确认 |
| EmotionalBackdrop z-index 层级 | ✅ | fixed z-0，所有页面正文 relative z-10 |
| personal 情绪场景卡片 grid | ✅ | grid-cols-1 sm:grid-cols-2 |
| memorial 记忆细节卡片 grid | ✅ | grid-cols-1 sm:grid-cols-2 |
| MemoryModeHome 首页 grid | ✅ | grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 |
| couple Galaxy overflow 保护 | ✅ | overflow-hidden + flex-wrap |
| couple Galaxy 星点 absolute 溢出 | ✅ | 在 overflow-hidden 容器内 |
| family Before/After 宽度保护 | ✅ | max-w-lg mx-auto + px-5 |
| personal Hero CTA 位置 | ✅ | 约 412px 处，在 667px 首屏内 |
| memorial Hero CTA 位置 | ✅ | 约 480px 处，在 667px 首屏内 |
| couple Hero CTA 位置 | ✅ | Hero 区末尾，接近首屏 |
| gentle-glow personal 色彩一致性 | ✅ | Phase 15.1B.1 改为 gentle-glow-blue（蓝色系）|

### 375 / 390 / 430px 验收状态

| 页面 | 375px | 390px | 430px | 备注 |
|------|-------|-------|-------|------|
| MemoryModeHome | ✅ 静态 | ✅ 静态 | ✅ 静态 | grid-cols-1 保证单列；待真实确认卡片高度 |
| FamilyLandingPage | ✅ 静态 | ✅ 静态 | ✅ 静态 | Before/After max-w-lg；待确认与 LandingHero 视觉节奏 |
| CoupleLandingPage | ✅ 静态 | ✅ 静态 | ✅ 静态 | w-full max-w-2xl + overflow-hidden Galaxy；待人工确认节点排列 |
| PersonalLandingPage | ✅ 静态 | ✅ 静态 | ✅ 静态 | grid-cols-1 sm:grid-cols-2；待真实确认阅读节奏 |
| MemorialLandingPage | ✅ 静态 | ✅ 静态 | ✅ 静态 | grid-cols-1 sm:grid-cols-2；边界说明温柔版；待视觉确认 |
| MemoryArtifactPreview 结果页 | ⬜ 待确认 | ⬜ 待确认 | ⬜ 待确认 | max-w-2xl px-4；whitespace-pre-line 需人工确认不溢出 |
| AuthPanel（未配置 env）| ✅ 静态 | ✅ 静态 | ✅ 静态 | 显示"云端同步未配置"，无同步按钮 |
| 打印预览 | ⬜ 待确认 | — | — | print:hidden 静态验证通过；实际打印对话框待人工 |

### Phase 15.1C 代码修复记录

**本阶段（Phase 15.1C）无代码修复**——静态分析未发现代码层面阻塞问题。  
所有代码修复均已在 Phase 15.1B.1 完成。

### 仍需人工确认项（Phase 15.2 前）

| 项目 | 优先级 | 说明 |
|------|--------|------|
| couple Relationship Galaxy 在 375px 下节点排列可读 | 高 | flex-wrap 节点可能堆叠，需视觉确认 |
| family Before/After → LandingHero 视觉节奏不重复 | 中 | 两个区域都传递"整理成礼物"信息，需人工判断 |
| MemoryArtifactPreview 结果页 375px 无横向滚动 | 高 | whitespace-pre-line 长行边缘情况 |
| 打印预览实际内容完整性 | 高 | 需真实触发浏览器打印 |
| 动效在真实设备上轻柔不廉价 | 中 | 主观评估，需真实设备 |
| couple Galaxy 在深色系统模式下可读 | 低 | 浅色/深色系统切换 |
| 所有 CTA 在 375px 下可点击（触摸区域足够）| 高 | py-4 = 16px，触摸区域约 56px，应足够 |

### Phase 15.1C 整体结论

| 维度 | 结论 |
|------|------|
| 静态分析 | ✅ 全部通过 |
| 代码层阻塞问题 | ✅ 无 |
| 真实浏览器验收 | ⬜ 未完成（无浏览器工具，需人工）|
| 人工确认项 | 7 项，其中高优先 4 项 |
| 是否可进入 Phase 15.2 | ✅ **代码层面准备就绪，建议进入 Beta Deployment Prep** |
