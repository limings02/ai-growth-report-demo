# 🌌 Memory Wiki｜AI 记忆整理与纪念生成器

> 把重要的人、关系和人生片段，整理成会被珍藏的记忆。

这是一个 **multi-mode memory product demo**，底层为通用 Memory Engine，支持不同记忆主题的内容生成。

**当前可用模式：**
- `family mode`：家庭亲子记忆 / 孩子成长礼物（第一个上线的场景）
- `couple mode`：恋爱纪念册 MVP，AI 生成恋爱时间线、关系关键词、周年信和 Relationship Galaxy 星图
- `personal mode`：个人人生 Wiki / 自我回忆录 MVP，AI 生成人生阶段时间线、关键词、写给未来自己的信和个人记忆图谱
- `memorial mode`：家族纪念册 MVP，AI 整理人生片段时间线、关键词、纪念文和记忆图谱（不模拟逝者说话，只整理家人提供的材料）


---

## 安装依赖

需要 Node.js 18 及以上版本。

```bash
npm install
```

## 启动

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000`。

---

## 如何使用

1. **打开首页** — 进入「记忆主题选择页」（MemoryModeHome）
2. **选择 `family mode：家庭成长册`** — 点击卡片进入孩子成长 landing page
3. **点击「开始记录这一年」** — 进入填写表单
4. **填写基本信息** — 孩子昵称、年龄、总结年份、父母称呼、文案风格
5. **上传照片** — 点击上传区选择照片，支持多选，可单张删除（**照片仅在本地预览，不上传服务器，不传给 AI**）
6. **回答问题** — 8 道引导性问题，至少回答 2 道后可生成；支持修改标题、删除题目、添加自定义问题
7. **自由记录** — 底部自由文本区，可粘贴日记、育儿备忘录或任何想对宝贝说的话
8. **生成成长礼物** — 点击生成，等待 DeepSeek 返回结果
9. **查看成长报告** — 年度关键词、成长总结、重要瞬间时间线、给孩子的信、朋友圈文案
10. **查看成长星图** — 封面下方的 LifeGraphPreview，点击节点可查看详情
11. **切换原始记录** — 点击「📋 原始记录」标签查看你填写的所有原始内容
12. **打印 / 保存 PDF** — 点击「🖨️ 打印 / 保存 PDF」，在浏览器打印对话框中选择「另存为 PDF」

> couple / personal / memorial mode 均已支持 AI 生成；personal 和 memorial 在开发环境仍保留 mock 预览按钮，方便调试结果页；四个 mode 均不再是 coming soon。

---

## 当前版本功能

### 已实现

#### Multi-mode 首页
- `MemoryModeHome`：记忆主题选择页（默认首屏）
- `family mode` 可用，点击进入孩子成长 landing
- `couple mode` 可用，点击进入恋爱纪念册流程（介绍页 → 输入页 → 生成结果）
- `personal mode` available，点击进入 PersonalLandingPage → PersonalMemoryApp → AI 生成结果页
- `memorial mode` available，点击进入 MemorialLandingPage → MemorialMemoryApp → AI 生成结果页

#### Family mode
- 孩子信息表单（昵称、年龄、总结年份、父母称呼、文案风格）
- 照片本地预览（多选、缩略图、hover 删除）
- 访谈问题（可增删改，至少回答 2 道）
- 自由文本区
- DeepSeek 大模型生成（只传文本，不上传照片）
- 成长报告展示（封面、关键词、总结、时间线、信件、朋友圈文案）
- 成长星图（FamilyMemoryGraphPreview，AI 语义节点，SVG 星图展示）
- 朋友圈文案一键复制
- 原始材料归档展示
- 打印 / 保存 PDF

#### Memory Engine（底层架构）
- `MemoryRawMaterial`：跨 mode 通用输入层
- `MemoryArtifact`：跨 mode 通用输出层
- Domain adapters：family / couple / personal / memorial
- Skill registry：按 mode 查找对应 skill pack
- `runMemorySkill`：通用 runtime 入口
- `family-memory` skill pack：原生理解 MemoryRawMaterial
- `MemoryGraphData`：通用图谱渲染层

### 当前版本边界（有意不做）

- 不做登录注册
- 不做数据库
- 不做云存储
- 照片不上传服务器
- 照片不上传给 AI（只传文本和照片数量）
- couple mode 不读取微信数据库，不自动导入微信聊天记录，只处理用户主动粘贴的文本
- couple mode 照片当前只记录数量，不上传服务器，不传给 AI
- Couple 结果页支持「回到首页」「返回修改」「再做一本」三个本地状态流转，不做账户系统或云端保存
- PDF 保存依赖浏览器打印功能，不上传服务器，不生成云端文件
- 开发环境下 couple 输入页提供 mock 结果预览按钮，方便不调用 DeepSeek 调试结果页；生产环境不显示
- 开发环境 mock 预览不会调用 DeepSeek，也不会发送当前表单内容
- personal mode 不上传照片，只处理用户主动填写的文字内容
- 开发环境下 personal 输入页提供 mock 结果预览按钮，方便不调用 DeepSeek 调试结果页；生产环境不显示
- memorial mode 不上传照片，只处理用户主动填写的文字内容
- 不使用「AI 复活」「与逝者对话」等表达，不模拟逝者说话，定位为人生故事整理与家族记忆传承
- 开发环境下 memorial 输入页提供 mock 预览按钮；生产环境不显示
- 当前仍是单次 DeepSeek 调用，不做多阶段 agent workflow
- **family MemoryArtifact 迁移已完成**（Phase 12.6D）：旧 UI fallback、parse fallback、rollback path 均已清理；`.skills/growth-memory` 已归档；family 链路完全使用 `MemoryArtifact`
- **family 体验优化已通过人工 E2E 验收**（Phase 12.7C.2）：照片区前移至封面后；照片纳入礼物 PDF 打印；星图去掉双标题、节点截断放宽；质量/溯源 section 不出现在 PDF；小屏照片布局优化；浏览器主流程/打印预览/移动端均已人工验收通过
- **Phase 13.1 开始引入 Life Archive 本地数据层**：定义 `ArchiveItem` / `ArchiveCollection` 类型，提供 `localStorage` 读写工具函数；暂不接入 UI、登录或数据库
- **Phase 13.2 family 保存入口**：family 结果页已支持将当前 MemoryArtifact 保存为本地 ArchiveItem，写入 localStorage；当前仅本设备可见，不保存照片 blob，不涉及登录、数据库或云同步
- **Phase 13.3 family 历史记录**：family landing 页新增"我的成长册"入口，可读取 localStorage 中的 family ArchiveItem 列表，并回看已保存的 MemoryArtifact；当前不保存照片 blob，不支持跨设备同步
- **Phase 13.4 family archive 管理**：我的成长册支持删除单条记录和清空本地 family 成长册；清空只影响 family mode，不清空其他 mode 的 ArchiveItem
- **Phase 13.5 family archive 导出**：我的成长册支持将本地 family ArchiveItem 导出为 JSON 备份文件；导出内容包含 MemoryArtifact 和低敏来源摘要，不包含照片 blob/File/previewUrl
- **Phase 13.6 family archive 导入**：我的成长册支持从 Phase 13.5 导出的 JSON 文件恢复 family ArchiveItem；导入采用非破坏性合并，相同 id 默认跳过，不覆盖本地已有成长册
- **Phase 13.7 其他 mode 保存入口**：couple / personal / memorial 结果页已接入"保存到本地"按钮，复用统一 ArchiveItem 数据层；当前仅保存 MemoryArtifact 和低敏来源摘要，不保存聊天全文、freeNote 原文或照片文件
- **Phase 13.8 跨 mode 统一档案页**：首页新增"我的记忆档案"入口，可统一查看 family / couple / personal / memorial 保存到本地的 ArchiveItem，并按 mode 进入对应详情回看；当前统一页只读，不提供删除、导出或导入
- **Phase 13.9 统一档案管理增强**：我的记忆档案支持按 mode 筛选、按标题/摘要/关键词本地搜索，并可在统一列表中删除单条 ArchiveItem；当前不支持统一批量清空、导出或导入
- **Phase 14.0 云端同步架构设计**：在本地 Life Archive 闭环完成后，新增云端同步 / 账户系统设计文档，明确 Supabase schema 草案、RLS 权限边界、本地到云端迁移策略、隐私边界和 Phase 14.1 最小实现计划；本阶段不接入真实云端服务
- **Phase 14.1 Supabase schema spike**：新增 `@supabase/supabase-js` 依赖、Supabase client helper（env 缺失时返回 null）、云端 row mapper（纯函数）和 SQL migration（profiles + archive_items + RLS）；本阶段无登录 UI、无真实同步、未配置 env 时 app 仍可完全离线运行
- **Phase 14.2 Auth shell**：新增 `@supabase/ssr`、登录/注册/登出 UI（email/password），首页增加"账户 / 登录"入口；登录后只显示 session 状态，不同步 archive；未配置 env 时显示"云端同步未配置"，本地功能不受影响
- **Phase 14.3 手动上传本地 archive**：登录后账户页出现"同步到云端"按钮，用户主动点击将 localStorage ArchiveItem 上传到 Supabase；INSERT ONLY（同 id 跳过，不覆盖），不上传照片 blob，不读取云端数据
- **Phase 15.0 Emotional Motion Polish**：首页、四个 mode 落地页和结果页第一屏完成情绪化与轻量动效升级；清理所有 preview/mock 旧文案；四种主题均标注可体验；memorial 新增明确边界声明；不新增任何依赖
- **Phase 15.1A Visual Layer Fix + Mobile Beta QA**：修复情绪背景层级和 glow transform 问题，增强 couple 聊天气泡，移除 memorial 敏感表达，Beta 前弱化云端同步入口，并补充移动端验收清单
- **Phase 15.1A.1 Hotfix**：补齐 Family landing 正文层级（LandingHero 等均包入 relative z-10），清理 memorial 源码注释里的高风险表达
- **Phase 15.1B Landing Emotional Storytelling Expansion**：四个落地页情绪叙事全面扩写——PersonalLandingPage 新增情绪场景卡片 / Before-After / 示例预览 / 未来打开场景（约 165→280 行）；MemorialLandingPage 新增为什么整理 / 记忆细节卡片 / 示例预览 / 温柔边界声明（约 153→300 行）；CoupleLandingPage 新增"从聊天到纪念册"Before-After 和 Relationship Galaxy 宇宙示意；FamilyLandingPage 新增"从照片到成长册"Before-After 和 18 岁/毕业/离家仪式感场景；MemoryModeHome 四个 mode 情绪差异更鲜明；新增 5 个 CSS 动效（slow-fade-in / memory-card-float / gentle-glow / soft-slide-up / constellation-pulse），已配置 prefers-reduced-motion + print 禁用

---

## 如何接入 DeepSeek

### 第一步：配置环境变量

复制模板文件：

```bash
cp .env.local.example .env.local
```

在 `.env.local` 中填入：

```
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_THINKING=disabled
DEEPSEEK_JSON_MODE=true
DEEPSEEK_MAX_TOKENS=8192
```

**注意：**
- `.env.local` 不会被提交到 Git，请勿分享给他人
- 当前版本**只传递文本内容**给 DeepSeek，照片继续只在本地预览
- `deepseek-v4-pro` 是 thinking 模型，设置 `DEEPSEEK_THINKING=disabled` 可确保最终 JSON 回到 `message.content` 字段，适合本项目的结构化 JSON 生成任务
- 项目不会读取或展示 `reasoning_content`（推理过程）
- 如果遇到 `response_format` 相关报错，将 `DEEPSEEK_JSON_MODE` 改为 `false`

### 第二步：确认 AI 生成器已启用

`components/GrowthReportApp.tsx` 开头确认：

```typescript
import { aiGenerator } from "@/lib/aiReportGenerator";
const generator = aiGenerator;
```

### 第三步：启动

```bash
npm run dev
```

---

## Supabase / Cloud Sync Spike

Phase 14.1 introduces a minimal Supabase schema spike.

Required env vars for future cloud features (add to `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

**Notes:**
- Cloud sync is not active yet. The app still works fully offline when these env vars are missing.
- No local archive data is uploaded automatically.
- Do not expose Supabase secret keys in the frontend.
- SQL migration is at `supabase/migrations/0001_life_archive_schema.sql` — apply manually.

### Auth shell status

Phase 14.2 adds a lightweight account panel.

- Email/password sign in and sign up are supported when Supabase env vars are configured.
- Signing in does **not** upload local archive data.
- Cloud sync is manually triggered by the user (Phase 14.3).
- Local archive features continue to work without Supabase env vars.

### Manual cloud upload status

Phase 14.3 adds a manual "sync to cloud" action for signed-in users.

- Sync is user-triggered only.
- Existing cloud rows with the same ArchiveItem id are skipped.
- Local archive data is not uploaded automatically.
- Photo blob/File/previewUrl values are blocked from upload.
- Cloud-to-local restore is not implemented yet.

---

## Memory Engine Architecture

详细架构文档见 [`docs/architecture/memory-engine.md`](docs/architecture/memory-engine.md)。

以下是简要说明。

### Mode Registry

`lib/memory-core/modes.ts` 注册四个 mode：

| mode | 状态 |
|------|------|
| `family` | available |
| `couple` | available |
| `personal` | available |
| `memorial` | available |

### 输入层：MemoryRawMaterial

`lib/memory-core/types.ts`

MemoryRawMaterial 是跨 mode 的统一输入。Family 的表单数据通过 `familyRawMaterialToMemoryRawMaterial` 转换后进入通用 runtime。

### 输出层：MemoryArtifact

MemoryArtifact 是未来统一输出结构。当前 family 为兼容旧前端，经过：

```
MemoryArtifact
  ↔ GrowthMemoryArtifact（兼容适配层）
```

### Runtime 链路

```
Family form
  → RawMaterial
  → familyRawMaterialToMemoryRawMaterial
  → MemoryRawMaterial
  → runMemorySkill
  → .skills/family-memory（prompt）
  → DeepSeek
  → parseMemoryArtifact
  → MemoryArtifact
  → FamilyArtifactPreview
```

---

## Skill Packs

当前项目使用项目级 skill pack 封装 prompt、输出合约和质量规则。Prompt 以文件形式存储，修改不需要重新 build。

### family-memory

`.skills/family-memory/` 是当前真正运行的 family mode skill pack。

- 输入：MemoryRawMaterial（含 legacyFamilyInput 兼容字段）
- 输出：标准 MemoryArtifact（Phase 12.5 迁移完成）
- 用途：孩子成长记录 / 亲子成长礼物

### couple-memory

`.skills/couple-memory/` 是 couple mode 的真实 skill pack（Phase 8.2）。

- 输入：MemoryRawMaterial（mode: "couple"）
- 输出：标准 MemoryArtifact（不走 GrowthMemoryArtifact 兼容层）
- 用途：恋爱纪念册 MVP，生成恋爱时间线、关系关键词、周年信和 Relationship Galaxy

### growth-memory

`.skills/growth-memory/` 是旧 skill pack。

- 输入：旧 RawMaterial
- 输出：GrowthMemoryArtifact
- 当前保留为 fallback，不删除，便于回溯

### personal-memory

`.skills/personal-memory/` 是 personal mode 的真实 skill pack（Phase 10.2）。

- 输入：MemoryRawMaterial（mode: "personal"）
- 输出：标准 MemoryArtifact（不走 GrowthMemoryArtifact 兼容层）
- 用途：个人人生阶段回忆录，生成时间线、关键词、信件和记忆图谱

### memorial-memory

当前只是占位，不接入真实生成。

---

## 项目结构

```
app/
  page.tsx                         # 全局状态路由（默认 MemoryModeHome）
  api/
    generate-report/
      route.ts                     # family 生成 API（返回 GrowthMemoryArtifact）
    generate-couple-memory/
      route.ts                     # couple 生成 API（返回 MemoryArtifact）
    generate-personal-memory/
      route.ts                     # personal 生成 API（返回 MemoryArtifact）
    generate-memorial-memory/
      route.ts                     # memorial 生成 API（返回 MemoryArtifact）

components/
  MemoryModeHome.tsx               # 全局首页（记忆主题选择）
  ComingSoonModePage.tsx            # coming soon 页面
  family/
    FamilyLandingPage.tsx          # family mode landing
    FamilyArtifactPreview.tsx      # family 的 MemoryArtifactPreview wrapper（Phase 12.2 新增，未接主链路）
    FamilyMemoryGraphPreview.tsx   # family 的成长星图 graphSlot（Phase 12.2 新增）
  couple/
    CoupleLandingPage.tsx          # couple mode landing
    CoupleMemoryApp.tsx            # couple 主状态机
    CoupleArtifactPreview.tsx      # couple 结果展示（MemoryArtifactPreview 的 couple-specific wrapper）
    RelationshipGalaxyPreview.tsx  # Relationship Galaxy SVG 星图
    CouplePrintButton.tsx          # 打印按钮（MemoryPrintButton wrapper）
    mockArtifact.ts                # 开发环境 mock artifact
  personal/
    PersonalLandingPage.tsx        # personal mode landing
    PersonalMemoryApp.tsx          # personal 主状态机（AI 生成，dev 环境保留 mock 预览按钮）
    PersonalMemoryGraphPreview.tsx # personal 记忆 SVG 星图（Phase 10.4 升级）
  memorial/
    MemorialLandingPage.tsx        # memorial mode landing
    MemorialMemoryApp.tsx          # memorial 主状态机（AI 生成，dev 环境保留 mock 预览按钮）
    MemorialMemoryGraphPreview.tsx # memorial 记忆图谱 SVG 星图（克制色调）
  memory/
    MemoryArtifactPreview.tsx      # 通用 MemoryArtifact 展示容器（完整页面 shell）
    MemorySectionCard.tsx          # 通用展示 section 容器
    MemoryPrintButton.tsx          # 通用浏览器打印按钮
    MemoryQualityReviewPanel.tsx   # 通用生成质量说明面板
    MemorySourceTraceDetails.tsx   # 通用内容溯源折叠区
    MemoryFallbackNotice.tsx       # 通用 fallback 提示（生成结果不完整）
    MemoryCoverSection.tsx         # 通用封面区（标题/关键词/总结）
    MemoryTimelineSection.tsx      # 通用时间线展示区
    MemoryLongFormSection.tsx      # 通用长文展示区（信件/纪念文等）
    MemorySocialPostsSection.tsx   # 通用分享文案区（含复制按钮）
    MemoryUsageTipsSection.tsx     # 通用保存与使用建议区
  GrowthReportApp.tsx              # family 主状态机

lib/
  memory-core/
    modes.ts                       # Mode Registry
    types.ts                       # MemoryRawMaterial / MemoryArtifact
    graphTypes.ts                  # MemoryGraphData（渲染层）
    skillRegistry.ts               # Skill pack 目录映射
    loadMemorySkillPrompt.ts       # Prompt 加载器
    buildMemoryPrompt.ts           # MemoryRawMaterial → ChatMessage[]
    parseMemoryArtifact.ts         # LLM 输出 → MemoryArtifact
    runMemorySkill.ts              # 通用 runtime 入口

  domains/
    family/
      adapter.ts                   # RawMaterial → MemoryRawMaterial
      runFamilyMemorySkill.ts      # family server 入口
      buildFamilyMemoryGraph.ts    # family → MemoryGraphData
    couple/
      adapter.ts                   # CoupleRawInput → MemoryRawMaterial
      defaultQuestions.ts          # couple 默认访谈问题
      mockArtifact.ts              # couple 结果页开发预览用 mock artifact
    personal/
      adapter.ts                   # PersonalRawInput → MemoryRawMaterial
      defaultQuestions.ts          # personal 默认访谈问题（Phase 10.1 新增）
      mockArtifact.ts              # personal 开发预览用 mock artifact
    memorial/
      adapter.ts                   # MemorialRawInput → MemoryRawMaterial
      defaultQuestions.ts          # memorial 默认访谈问题（Phase 11.1 新增）
      mockArtifact.ts              # memorial 开发预览用 mock artifact

  archive/                           # Life Archive 本地数据层（Phase 13.1）
    types.ts                         # ArchiveItem / ArchiveCollection / ArchiveSourceSnapshot
    createArchiveItem.ts             # 从 MemoryArtifact 构造 ArchiveItem
    localArchiveStore.ts             # localStorage 读写工具函数
    index.ts                         # barrel export

.skills/
  family-memory/                   # 当前可用
  growth-memory/                   # 旧 skill，保留为 fallback
  couple-memory/                   # couple mode 真实 skill pack（Phase 8.2）
  personal-memory/                 # 当前可用（Phase 10.2）
  memorial-memory/                 # 当前可用（Phase 11.2）

docs/
  architecture/
    memory-engine.md               # 架构详解
    next-couple-mode-plan.md       # couple MVP 规划
    current-transition-state.md              # 当前过渡态说明
    family-memoryartifact-migration-plan.md  # family 旧链路迁移到 MemoryArtifact 的阶段计划
    family-legacy-cleanup-plan.md            # family 兼容层清理计划（Phase 12.6A）
    life-archive-data-model.md              # Life Archive 数据模型设计（Phase 13.1）
    cloud-sync-plan.md                      # 云端同步 / 账户系统架构设计（Phase 14.0）
  quality/
    personal-generation-eval.md   # personal 生成质量评测（Phase 10.3）
    deepseek-v4-pro-compat.md     # DeepSeek V4 Pro thinking 模式兼容说明（Phase 10.3.1）
    memorial-generation-eval.md   # memorial 真实生成质量与安全边界评测（Phase 11.3）
    family-ui-migration-regression.md  # family 新旧 UI 回归验收（Phase 12.4A.2）
    family-api-memoryartifact-migration.md      # family API MemoryArtifact 迁移验证（Phase 12.4B）
    family-memoryartifact-prompt-migration.md     # family-memory prompt 输出合约迁移验证（Phase 12.5）
    family-memoryartifact-prompt-quality-tuning.md  # prompt 质量微调 + 兼容层引用审计（Phase 12.5.1）
    family-dev-fallback-removal.md               # dev legacy UI fallback 删除验收（Phase 12.6B）
    family-parse-fallback-removal.md             # 旧格式 parse fallback 删除验收（Phase 12.6C）
    family-rollback-path-removal.md              # rollback path 删除验收（Phase 12.6D）
    family-final-regression.md                  # family 最终回归 + 产品体验审计（Phase 12.7）
    family-manual-e2e-checklist.md              # family 人工 E2E 验收 checklist（发布前门禁）
    life-archive-data-model-check.md            # Life Archive 数据模型静态验收（Phase 13.1）
    family-save-to-archive-check.md             # family 保存按钮验收（Phase 13.2）
```

---

## 技术栈

- Next.js 16 + React + TypeScript
- Tailwind CSS
- DeepSeek API
- 无数据库
- 无独立后端服务（使用 Next.js API Route 调用 DeepSeek）
- 无第三方 UI 库
