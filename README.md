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
- 成长星图（LifeGraphPreview，AI 语义节点优先，fallback 前端派生）
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
- **family MemoryArtifact 迁移完整链路已完成，进入清理阶段**（Phase 12.6A）：`/api/generate-report` 返回标准 `MemoryArtifact`；prompt 直接输出 MemoryArtifact；Phase 12.6B 将删除 dev-only legacy `ReportPreview` fallback；旧 parse fallback 路径仍保留待后续清理
- 开发环境下 family 结果页右下角有 dev-only 按钮「🧪 查看旧版 ReportPreview」，可对比新旧展示；生产环境不显示

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
  → memoryArtifactToGrowthArtifact
  → GrowthMemoryArtifact
  → ReportPreview / LifeGraphPreview
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
  LifeGraphPreview.tsx             # 成长星图（支持通用节点类型）
  ReportPreview.tsx                # 成长报告展示

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
      artifactAdapter.ts           # GrowthMemoryArtifact ↔ MemoryArtifact
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

  skill-runtime/
    runGrowthMemorySkill.ts        # 旧入口（现为兼容 wrapper）
    buildGrowthMemoryPrompt.ts
    parseGrowthMemoryArtifact.ts
    loadSkillPrompt.ts
    types.ts                       # GrowthMemoryArtifact 类型定义

  graph/
    types.ts                       # LifeGraphData（兼容旧 UI）
    buildLifeGraph.ts              # 旧兼容 wrapper

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
  quality/
    personal-generation-eval.md   # personal 生成质量评测（Phase 10.3）
    deepseek-v4-pro-compat.md     # DeepSeek V4 Pro thinking 模式兼容说明（Phase 10.3.1）
    memorial-generation-eval.md   # memorial 真实生成质量与安全边界评测（Phase 11.3）
    family-ui-migration-regression.md  # family 新旧 UI 回归验收（Phase 12.4A.2）
    family-api-memoryartifact-migration.md      # family API MemoryArtifact 迁移验证（Phase 12.4B）
    family-memoryartifact-prompt-migration.md     # family-memory prompt 输出合约迁移验证（Phase 12.5）
    family-memoryartifact-prompt-quality-tuning.md  # prompt 质量微调 + 兼容层引用审计（Phase 12.5.1）
```

---

## 技术栈

- Next.js 16 + React + TypeScript
- Tailwind CSS
- DeepSeek API
- 无数据库
- 无独立后端服务（使用 Next.js API Route 调用 DeepSeek）
- 无第三方 UI 库
