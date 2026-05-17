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
- 本地内容整理（根据填写内容生成个性化文案，不调用外部 API）
- 成长礼物展示（封面、关键词标签、成长总结、竖线时间线、手账信件、朋友圈文案）
- 朋友圈文案一键复制
- 原始材料归档展示（与整理内容分开标签页）
- 打印 / 保存 PDF（打印专用排版，自动隐藏操作按钮）

### 当前版本边界（有意不做）

- 不做登录注册
- 不做数据库
- 不做云存储
- 照片不上传服务器
- 第一版使用本地整理逻辑，未接入 AI API

---

## 如何接入真实 AI

架构已预留好接口，切换时只需两步：

### 第一步：新建 AI 生成器

新建 `lib/aiReportGenerator.ts`，实现 `ReportGeneratorI` 接口：

```ts
import Anthropic from "@anthropic-ai/sdk";
import { ReportGeneratorI, RawMaterial, ReportData } from "./types";

class AiReportGenerator implements ReportGeneratorI {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  private model = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7";

  async generate(material: RawMaterial): Promise<ReportData> {
    // 把 material 转为 prompt，调用 Claude API
    const prompt = buildPrompt(material); // 自行实现

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    // 解析返回内容，映射到 ReportData 结构
    return parseResponse(response); // 自行实现
  }
}

export const aiGenerator = new AiReportGenerator();
```

在 `.env.local` 里配置：

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-opus-4-7
```

### 第二步：替换生成器

在 `components/GrowthReportApp.tsx` 第 8 行：

```ts
// 把注释打开，把下面那行注释掉
import { aiGenerator } from "@/lib/aiReportGenerator";
const generator = aiGenerator;

// const generator = mockGenerator; // 注释掉这行
```

其他代码**完全不需要改动**。

### 各模块扩展点

每个内容模块都有 `TODO[skill:xxx]` 注释标记，后续可拆分为独立调用：

| 标记 | 说明 |
|------|------|
| `TODO[skill:keywords]` | 关键词提取 |
| `TODO[skill:summary]` | 成长总结 |
| `TODO[skill:timeline]` | 时间线结构化 |
| `TODO[skill:letter]` | 亲子信件 |
| `TODO[skill:social]` | 朋友圈文案 |
| `TODO[skill:video]` | 成长视频脚本（未来） |
| `TODO[skill:illustration]` | 插画提示词（未来） |
| `TODO[skill:voice]` | 语音信件（未来） |

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
