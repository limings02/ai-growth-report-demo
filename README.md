# 🌌 Memory Wiki｜AI 记忆整理与纪念生成器

> 把重要的人、关系和人生片段，整理成会被珍藏的记忆。

这是一个 **multi-mode memory product demo**，底层为通用 Memory Engine，支持不同记忆主题的内容生成。

**当前可用模式：**
- `family mode`：家庭亲子记忆 / 孩子成长礼物（第一个上线的场景）

**进行中：**
- `couple mode`：恋爱纪念册介绍页与输入页已开放，可体验填写情侣信息、手动粘贴聊天文本并预览记忆材料结构；AI 生成下一阶段接入

**预留模式（coming soon）：**
- `personal mode`：个人人生 Wiki / 自我回忆录
- `memorial mode`：纪念馆 / 逝者回忆 / 家族记忆传承

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

> couple / personal / memorial 当前点击后只进入 coming soon 页面，不触发任何生成。

---

## 当前版本功能

### 已实现

#### Multi-mode 首页
- `MemoryModeHome`：记忆主题选择页（默认首屏）
- `family mode` 可用，点击进入孩子成长 landing
- `couple / personal / memorial` coming soon，点击进入 `ComingSoonModePage`

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
- couple mode 当前有介绍页和输入页骨架，不调用 AI 生成，不生成真实纪念册
- couple mode 不读取微信数据库，只处理用户主动粘贴的文本
- couple mode 不读取微信数据库
- couple mode 不做自动导入微信聊天记录
- memorial / personal mode 暂不开放真实生成
- 当前仍是单次 DeepSeek 调用，不做多阶段 agent workflow

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
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_JSON_MODE=true
```

**注意：**
- `.env.local` 不会被提交到 Git，请勿分享给他人
- 当前版本**只传递文本内容**给 DeepSeek，照片继续只在本地预览
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
| `couple` | coming_soon |
| `personal` | coming_soon |
| `memorial` | coming_soon |

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
- 输出：GrowthMemoryArtifact（暂时，为兼容旧前端）
- 用途：孩子成长记录 / 亲子成长礼物

### growth-memory

`.skills/growth-memory/` 是旧 skill pack。

- 输入：旧 RawMaterial
- 输出：GrowthMemoryArtifact
- 当前保留为 fallback，不删除，便于回溯

### couple-memory / personal-memory / memorial-memory

当前只是占位，不接入真实生成。每个 `01_task.md` 如被误调用会返回最小占位 JSON。

---

## 项目结构

```
app/
  page.tsx                         # 全局状态路由（默认 MemoryModeHome）
  api/
    generate-report/
      route.ts                     # 生成 API（返回 GrowthMemoryArtifact）

components/
  MemoryModeHome.tsx               # 全局首页（记忆主题选择）
  ComingSoonModePage.tsx            # coming soon 页面
  family/
    FamilyLandingPage.tsx          # family mode landing
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
      adapter.ts                   # CoupleRawInput → MemoryRawMaterial（占位）
    personal/
      adapter.ts                   # PersonalRawInput → MemoryRawMaterial（占位）
    memorial/
      adapter.ts                   # MemorialRawInput → MemoryRawMaterial（占位）

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
  couple-memory/                   # 占位
  personal-memory/                 # 占位
  memorial-memory/                 # 占位

docs/
  architecture/
    memory-engine.md               # 架构详解
    next-couple-mode-plan.md       # couple MVP 规划
    current-transition-state.md   # 当前过渡态说明
```

---

## 技术栈

- Next.js 16 + React + TypeScript
- Tailwind CSS
- DeepSeek API
- 无数据库
- 无独立后端服务（使用 Next.js API Route 调用 DeepSeek）
- 无第三方 UI 库
