# Next：Couple Mode MVP 规划

> 这是 couple mode 从 coming soon 到真实可用的规划文档。
> 写给未来接手此项目的开发者（包括 AI 助手）。

---

## 当前进度

**Phase 8.1 已完成：**

- couple mode 从 `ComingSoonModePage` 改为进入 `CoupleMemoryApp`（输入骨架）
- 已支持情侣基本信息（昵称、恋爱时间、纪念日、文案风格）
- 已支持手动粘贴聊天文本（chatText），不读取微信数据库
- 已支持 7 道默认访谈问题和自由文本
- 已支持照片数量记录（本地预览，不上传）
- 点击"生成"后展示 `MemoryRawMaterial` JSON 预览，**当前不调用 AI**
- `lib/domains/couple/adapter.ts` 已新增 `chatText` 字段
- `lib/domains/couple/defaultQuestions.ts` 已创建

**Phase 8.1.1 已完成：**

- `MemoryModeStatus` 新增 `preview` 状态，couple 从 `coming_soon` 改为 `preview`
- `MemoryModeHome` 支持三种状态：可生成（green）/ 可体验（orange）/ 即将开放（rose）
- 新增 `CoupleLandingPage`（恋爱纪念册介绍页）
- 进入顺序改为：`MemoryModeHome → CoupleLandingPage → CoupleMemoryApp`
- `CoupleMemoryApp` 顶部返回按钮从「返回记忆主题」改为「返回恋爱纪念册介绍」
- 当前仍不调用 AI，只预览 `MemoryRawMaterial`

**Phase 8.1.2 已完成：**

- 重写 `CoupleLandingPage`，从功能说明页改为情绪落地页
- Hero 改为画面感文案（「从第一句晚安，到后来每一次想念」）
- 去掉用户侧「MemoryRawMaterial」，改称「记忆材料」
- 新增「它会帮你整理什么」4 个卡片（时间线/关键词/纪念信/Galaxy）
- 新增「适合什么时候生成」使用场景标签
- 新增静态样例预览（时间线 + 周年信片段示例）
- 隐私说明改为温柔语气（你掌控自己要交出的记忆）
- 阶段边界从大块警告改为底部轻量说明
- CTA 在 Hero 和底部各出现一次
- 仍然不接入 AI 生成

**Phase 8.2 已完成：**

- `.skills/couple-memory` 从占位改为真实 prompt（01_task.md / 02_output_contract.md / 03_quality_rules.md）
- 新增 `app/api/generate-couple-memory/route.ts`（couple 专用 API route，不复用 family route）
- `CoupleMemoryApp` 从 JSON 预览升级为 input / generating / result / error 状态机
- 新增 `CoupleArtifactPreview`（展示 narrative / graph nodes / qualityReview）
- couple mode 直接生成 `MemoryArtifact`，不走 `GrowthMemoryArtifact` 兼容层
- family mode 不受影响

**Phase 8.2.1 已完成 / 稳定性修复：**

- 修复 `/api/generate-couple-memory` 的 qaList 畸形输入校验（null 安全守卫）
- 修正 `couple output contract` 中 graph node type 示例，避免模型输出联合字符串
- 新增 `CoupleArtifactPreview` fallback artifact 识别与提示
- 新增空数据区域的引导性空状态
- `CoupleMemoryApp` 新增 chatText 前端长度限制（>12000 字禁用生成按钮）
- 新增生成前隐私说明文字

**Phase 8.4 已完成：**

- 清理 README / memory-engine.md 中 couple-memory 的过时占位描述
- 新增 `RelationshipGalaxyPreview`（轻量 SVG 星图，不引入新依赖）
- `CoupleArtifactPreview` 使用 `RelationshipGalaxyPreview` 替代原节点卡片列表
- Galaxy 基于 MemoryArtifact.graph.nodes，支持节点点击和详情卡片
- 不修改 AI runtime / API / prompt

---

**Phase 8.5 已完成：**

- 新增 `CouplePrintButton`
- `CoupleArtifactPreview` 已接入浏览器打印 / 保存 PDF
- 打印时隐藏返回修改、再做一本、保存 PDF 等交互按钮
- 打印时显示纪念册标题和 Memory Wiki 标识
- `RelationshipGalaxyPreview` 已增加打印节点摘要
- 未修改 runtime / API / prompt

**Phase 8.6 已完成：**

- 新增 `lib/domains/couple/mockArtifact.ts`
- `CoupleMemoryApp` 在 development 环境提供 mock 结果预览入口
- mock 预览不调用 DeepSeek，不调用 `/api/generate-couple-memory`
- 修复 `RelationshipGalaxyPreview`：`effectiveSelectedId` 替代 `selectedId` 用于 SVG 高亮和详情卡片
- README 已说明 mock 入口只在开发环境显示
- 更新浏览器标签页标题为「Memory Wiki｜AI 记忆整理与纪念生成器」
- 未修改 runtime / API / prompt

**Phase 8.7 已完成：**

- 优化 mock 入口说明文字（「不会调用 DeepSeek，也不会发送当前表单内容」）
- 给 couple 结果页增加「回到首页」入口（顶部操作栏）
- 给结果页增加「保存与使用建议」MemorySectionCard
- 未修改 runtime / API / prompt

**Phase 9.1 已完成：**

- 抽出通用 MemoryArtifact 展示小组件（`components/memory/`）
- 新增：MemorySectionCard / MemoryPrintButton / MemoryQualityReviewPanel / MemorySourceTraceDetails
- `CoupleArtifactPreview` 接入上述组件，删除本地 SectionCard
- family `ReportPreview` 暂不迁移
- 未修改 API / runtime / prompt

**Phase 9.2 已完成：**

- 继续抽出通用 MemoryArtifact 叙事展示组件
- 新增：MemoryFallbackNotice / MemoryCoverSection / MemoryTimelineSection / MemoryLongFormSection / MemorySocialPostsSection / MemoryUsageTipsSection
- `CoupleArtifactPreview` 替换所有本地叙事展示逻辑为通用组件，仅保留 couple-specific 文案通过 props 传入
- family `ReportPreview` 暂不迁移
- 未修改 API / runtime / prompt

**Phase 9.3 已完成：**

- 新增 `MemoryArtifactPreview`（完整页面 shell 容器）
  - 包含：顶部操作栏、打印标题区、fallback/cover/timeline/longForm/socialPosts/qualityReview/usageTips/sourceTrace、底部按钮
  - 支持 `graphSlot` 插槽，由各 mode 传入对应图谱组件
- `CoupleArtifactPreview` 已精简为薄 wrapper，只传入 couple-specific 文案和 `<RelationshipGalaxyPreview>`
- family `ReportPreview` 暂不迁移
- 未修改 API / runtime / prompt

> **历史接入路线说明：** 下方 Step 1-8 是规划接入路线，其中 Step 1-7 已基本完成；Step 8（Relationship Galaxy 视觉化）已在 Phase 8.4 完成；Phase 8.5 完成打印保存能力；当前 Phase 8.6 推进稳定性修复和开发体验。

---

## 1. Couple Mode 定位

**情侣恋爱纪念 / 恋爱周年 Wiki**

核心不是「聊天记录总结器」，而是：

> 把你们在一起的每一个瞬间，整理成一本会被珍藏的恋爱纪念册。

包含：
- 恋爱时间线（重要节点、第一次、里程碑）
- 情绪叙事（这段关系的底色和故事）
- Relationship Galaxy（关系图谱，视觉化情感连接）
- 可分享纪念册（周年信、朋友圈文案）

---

## 2. MVP 输入

```typescript
CoupleRawInput = {
  partnerAName: string;
  partnerBName: string;
  relationshipTimeRange: string;  // 如 "2021.06 - 至今"
  anniversaryDate?: string;
  style: "romantic" | "documentary" | "playful" | "literary";
  photoCount: number;             // 只传数量，不传文件
  chatMessageCount?: number;      // 用户手动粘贴的聊天条数估算
  chatText?: string;              // 用户手动粘贴的聊天文本（MVP 新增）
  qaList: { question: string; answer: string }[];
  freeNote: string;
}
```

**重要约束：**
- 不读取微信数据库
- 不自动导入微信聊天记录
- 不绕过系统权限
- 照片仍只在本地预览，不上传服务器，不传给 AI
- chatText 是用户主动粘贴，不是自动采集

### chatText 处理边界

- 前端可做简单截断提示（如超过 5000 字提示精简）
- 不处理敏感内容自动读取
- 不假设聊天来源（可以是任何平台）
- 传给 AI 前应提示："以下是用户手动提供的聊天片段，可能不完整"

---

## 3. MVP 输出

生成的 MemoryArtifact 应包含：

```
narrative:
  title:         恋爱纪念册标题
  keywords:      关系关键词（5-8 个，从真实材料提炼）
  summary:       恋爱故事总结（3-4 段，有情感深度）
  timeline:      恋爱时间线（5-8 条重要节点）
  longFormText:  周年信 / 写给对方的信（至少 200 字）
  socialPosts:   朋友圈 / 小红书文案（3 条）

graph:
  Relationship Galaxy 语义节点
  节点类型：person / time / event / emotion / message / keyword

extensions:
  sourceTrace
  qualityReview
```

---

## 4. 技术接入路线

建议按以下顺序推进：

```
Step 1. 新增 components/couple/CoupleMemoryApp.tsx
        - 参考 GrowthReportApp 的状态机结构
        - 包含表单 + 生成等待 + 结果展示三态

Step 2. 新增 couple input form 组件
        - 情侣昵称、恋爱时间、纪念日
        - 文案风格选择
        - 照片本地预览（复用 PhotoUploader）
        - 聊天文本粘贴区（新增，带字数提示）
        - 访谈问答（复用 InterviewForm 或新建 couple 版）
        - 自由文本

Step 3. 更新 app/page.tsx
        - couple mode 从 ComingSoonModePage 改为进入 CoupleMemoryApp

Step 4. 更新 lib/domains/couple/adapter.ts
        - 在 CoupleRawInput 中加入 chatText?: string
        - 更新 coupleRawInputToMemoryRawMaterial 的映射

Step 5. 更新 .skills/couple-memory
        - 从占位改成真实 prompt（参考 family-memory 结构）
        - 01_task.md 理解 MemoryRawMaterial 和 chatText
        - 02_output_contract.md 直接要求输出 MemoryArtifact（不走旧兼容）

Step 6. runMemorySkill 直接返回 MemoryArtifact
        - couple mode 不经过 GrowthMemoryArtifact 兼容层

Step 7. 新增结果展示组件
        - 选项 A：新增 MemoryArtifactPreview（推荐，同时可替代 ReportPreview）
        - 选项 B：先做 CoupleArtifactPreview（快速验证）

Step 8. 图谱展示
        - 复用 MemoryGraphData 渲染层
        - Relationship Galaxy 节点类型：person / time / emotion / message / event
        - 可复用 LifeGraphPreview，也可以新建 RelationshipGalaxy 组件
```

---

## 5. 情绪产品原则

| 原则 | 说明 |
|------|------|
| 讲故事 | 不要只输出高频词，要把关系的情绪线织进叙事 |
| 有仪式感 | 生成的内容要让人愿意截图、保存、分享 |
| 不编造 | 严格基于用户提供的材料，不虚构约会地点或对话 |
| 不评判 | 不对感情状态做道德评判 |
| 允许不完整 | 信息不足时诚实说明，不用模板填充 |

---

## 6. 风险和边界

| 风险 | 处理方式 |
|------|----------|
| 聊天记录隐私 | 用户主动粘贴，不自动读取；前端不持久化 chatText |
| 分手/矛盾内容 | prompt 中说明：不对感情状态做评判，不美化矛盾 |
| 未成年人 | 表单不做年龄验证，但 prompt 中不应生成涉及未成年的情感内容 |
| 过度煽情 | qualityReview 中监控 riskOfFabrication，prompt 明确不编造 |
| 事实编造 | 严格事实原则，同 family mode 的质量规则 |
| 用户上传内容 | 照片本地预览，chatText 在 session 期间存在，刷新即丢失 |

---

## 7. 第一版验收标准

```
✅ family mode 不受影响（生成链路完整可用）
✅ couple mode 有独立入口（不再是 coming soon）
✅ 可以填写情侣昵称、恋爱时间、粘贴聊天文本
✅ 可以回答至少 2 个问题后生成
✅ 生成结果包含：标题、关键词、恋爱时间线、周年信
✅ 可以看到 Relationship Galaxy 雏形（基于 MemoryGraphData）
✅ MemoryArtifact 格式直接输出（不走 GrowthMemoryArtifact 兼容）
✅ npm run lint 和 npm run build 通过
```
