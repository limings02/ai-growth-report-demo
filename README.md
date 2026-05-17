# 🌸 给未来的你｜孩子的成长礼物

> 有一天，孩子会看见自己是如何被爱着长大的。

上传这一年的照片和故事，整理成一份未来会被珍藏的成长礼物。

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

## 如何使用

1. **首页** — 点击「开始记录这一年」进入填写页面
2. **填写基本信息** — 孩子昵称、年龄、总结年份、父母称呼、文案风格
3. **上传照片** — 点击上传区选择照片，支持多选，可单张删除（照片仅在本地预览，不上传服务器）
4. **回答问题** — 8 道引导性问题，可以修改问题标题、删除不想回答的题目、添加自己的问题，至少回答 2 道后可生成
5. **自由记录** — 底部自由文本区，可粘贴日记、育儿备忘录或任何想对宝贝说的话
6. **生成成长礼物** — 填写基本信息并回答至少 2 个问题后点击生成，约 2 秒完成
7. **查看成长礼物** — 包含年度关键词、成长总结、重要瞬间时间线、给孩子的信、朋友圈文案
8. **切换原始记录** — 点击「📋 原始记录」标签查看你填写的所有原始内容
9. **打印 / 保存 PDF** — 点击「🖨️ 打印 / 保存 PDF」，在浏览器打印对话框中选择「另存为 PDF」

---

## 当前版本功能

### 已实现

- 情感型首页（4 屏：Hero、未来场景、价值卡片、使用步骤）
- 孩子信息表单（昵称、年龄、年份、父母称呼、文案风格选择）
- 照片本地预览（多选、预览缩略图、hover 删除）
- 访谈问题（8 道示例问题，可编辑标题、删除题目、添加自定义问题）
- 自由文本区（粘贴日记、备忘录等）
- DeepSeek 大模型生成（调用 `/api/generate-report` 服务端路由，只传文本，不上传照片）
- 成长礼物展示（封面、关键词标签、成长总结、竖线时间线、手账信件、朋友圈文案）
- 朋友圈文案一键复制
- 原始材料归档展示（与整理内容分开标签页）
- 打印 / 保存 PDF（打印专用排版，自动隐藏操作按钮）

### 当前版本边界（有意不做）

- 不做登录注册
- 不做数据库
- 不做云存储
- 照片不上传服务器
- 照片不上传给 AI（只传文字材料）
- 不做登录/数据库/云存储
- 不把生成拆成多次 API 调用（降延迟、降成本）

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
- 当前版本**只传递文本内容**给 DeepSeek，照片继续只在本地预览，不上传给 API
- 如果遇到 `response_format` 相关报错（模型不支持 JSON mode），将 `DEEPSEEK_JSON_MODE` 改为 `false`

### 第二步：切换到 AI 生成器

> 注意：`lib/aiReportGenerator.ts` 将在接入 DeepSeek 时一起创建，完成后再做此步骤。

`components/GrowthReportApp.tsx` 开头：

```typescript
// 把这两行取消注释
import { aiGenerator } from "@/lib/aiReportGenerator";
const generator = aiGenerator;

// 注释掉这行
// const generator = mockGenerator;
```

### 第三步：启动

```bash
npm run dev
```

### 各模块扩展点

代码中每个生成模块都有 `TODO[skill:xxx]` 标记，后续可拆为独立 AI 调用：

| 标记 | 说明 |
|------|------|
| `TODO[skill:keywords]` | 关键词提取 |
| `TODO[skill:summary]` | 成长总结 |
| `TODO[skill:timeline]` | 时间线结构化 |
| `TODO[skill:letter]` | 亲子信件 |
| `TODO[skill:social]` | 朋友圈文案 |
| `TODO[skill:video]` | 成长视频脚本（未来） |
| `TODO[skill:illustration]` | 插画提示词（未来） |

---

## 成长星图 Life Graph

生成成长礼物后，系统会在网页内**自动生成一张成长星图**，呈现在封面下方。

- v0.4 起：星图节点由 AI 直接生成（带情绪标签、诗意描述），比前端派生更有深度
- 若 AI 未返回星图数据，自动 fallback 到前端从报告内容派生
- **不依赖 Obsidian**，不需要用户学习任何知识管理工具
- 点击任意节点可查看详情和情绪关键词
- 成长星图当前是基于单次生成结果即时构建，后续可以把多次生成串联成长期人生星图

---

## Growth Memory Skill Pack

`.skills/growth-memory/` 是项目级 skill pack，借鉴 llm-wiki-agent 的思想：

- 原始材料（RawMaterial）进入 skill → skill 输出结构化 artifact（GrowthMemoryArtifact）
- prompt、schema、examples、tests 全部独立封装在 `.skills/growth-memory/` 目录
- 运行时通过 `fs.readFileSync` 读取 prompt 文件，**修改 prompt 不需要重新 build**
- 当前仍是一次 DeepSeek 调用，输出：report + graph + videoScript + sourceTrace + qualityReview
- 后续可以把各模块拆成多阶段 agent workflow（见 `lib/skills/reportSkillPlan.ts`）

```
.skills/growth-memory/
  SKILL.md           # Skill 定义（输入、输出、原则、工作流）
  prompts/           # 分层 prompt（运行时加载）
  schemas/           # JSON Schema（输入/输出验证）
  examples/          # 完整示例
  tests/             # 测试用例（minimal/rich/sparse）

lib/skill-runtime/   # Skill 运行时
  runGrowthMemorySkill.ts  # 入口
  buildGrowthMemoryPrompt.ts
  parseGrowthMemoryArtifact.ts
  loadSkillPrompt.ts
  types.ts           # GrowthMemoryArtifact 类型定义
```

---

## 项目结构

```
app/
  page.tsx                    # 页面入口
  layout.tsx                  # 全局布局
  globals.css                 # 全局样式（含打印样式）
components/
  LandingHero.tsx             # 首页第一屏
  FutureScene.tsx             # 首页第二屏
  ValueCards.tsx              # 首页第三屏
  HowItWorks.tsx              # 首页第四屏
  GrowthReportApp.tsx         # 主状态机（input / generating / result）
  ChildInfoForm.tsx           # 基本信息表单
  PhotoUploader.tsx           # 照片上传和本地预览
  InterviewForm.tsx           # 访谈问题（可增删改）
  ReportPreview.tsx           # 成长礼物展示和原始记录
  PrintButton.tsx             # 打印 / 保存 PDF
lib/
  types.ts                    # 所有 TypeScript 类型定义
  extractRawMaterial.ts       # 从表单提取原始材料
  mockReportGenerator.ts      # 本地内容整理（实现 ReportGeneratorI）
docs/
  superpowers/specs/          # 设计文档
```

## 技术栈

- Next.js 16 + React + TypeScript
- Tailwind CSS
- 无数据库、无后端、无第三方 UI 库
