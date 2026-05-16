# AI 成长年报生成器 — 设计文档

## 项目目标

本地可运行的 Demo：用户填写孩子信息和访谈问题，点击生成后展示一份孩子年度成长总结，支持打印/保存 PDF。

## MVP 边界（不做的事）

- 不做登录注册
- 不做数据库
- 不做云存储
- 不做支付
- 不做权限系统
- 不做真实多用户
- 不做完整人生 Wiki
- 不做图片 AI 识别
- 第一版不接真实 AI API，用本地 mock 生成器
- 照片只在浏览器本地预览，不上传服务器

## 技术栈

- Next.js + TypeScript + Tailwind CSS + React
- 不引入复杂第三方依赖

## 视觉风格

**温暖柔和**：奶油白/浅粉底色，圆润字体，像翻开一本家庭相册。

## 页面结构

**单页应用 + 状态机**，三个状态：

```
input → generating → result
```

- `input`：用户填写表单
- `generating`：生成动画（1-2 秒 mock 延迟）
- `result`：展示年报卡片网格

## 文件结构

```
app/
  page.tsx                    # 页面入口，引入 GrowthReportApp
components/
  GrowthReportApp.tsx         # 主状态机，管理三个状态
  ChildInfoForm.tsx           # 孩子基本信息表单
  PhotoUploader.tsx           # 照片上传和本地预览
  InterviewForm.tsx           # 8 道访谈问题
  ReportPreview.tsx           # 年报展示（卡片网格布局）
  PrintButton.tsx             # 打印/保存 PDF 按钮
lib/
  types.ts                    # 所有 TypeScript 类型定义
  mockReportGenerator.ts      # mock 年报生成逻辑（纯函数）
```

## 数据模型

### 照片项（`PhotoItem`）

```ts
type PhotoItem = {
  id: string          // 唯一 ID（用于删除操作）
  file: File          // 原始文件对象
  previewUrl: string  // URL.createObjectURL 生成的本地预览地址
}
```

### 时间线项（`TimelineItem`）

```ts
type TimelineItem = {
  time: string         // 时间描述，如 "3月"、"暑假"
  title: string        // 事件标题
  description: string  // 事件描述
}
```

### 朋友圈文案（`SocialPost`）

```ts
type SocialPost = {
  title: string    // 文案标题/标签
  content: string  // 文案正文
}
```

### 表单输入（`GrowthReportFormData`）

```ts
type GrowthReportFormData = {
  // 孩子信息
  childName: string        // 孩子昵称
  childAge: number         // 孩子年龄
  reportYear: number       // 总结年份
  parentName: string       // 父母称呼
  style: 'warm' | 'playful' | 'documentary' | 'literary'  // 风格

  // 照片（仅本地预览，不上传服务器）
  photos: PhotoItem[]

  // 访谈问题（8道）
  q1: string  // 今年孩子最大的变化是什么？
  q2: string  // 今年最让你印象深刻的一件事是什么？
  q3: string  // 今年孩子学会了什么新能力？
  q4: string  // 今年孩子说过哪句话让你印象很深？
  q5: string  // 今年有没有一次重要旅行、生日、入学或家庭事件？
  q6: string  // 今年孩子最喜欢什么？
  q7: string  // 今年你作为父母最感动的一刻是什么？
  q8: string  // 你想对 18 岁的孩子说什么？
}
```

### 年报输出（`ReportData`）

```ts
type ReportData = {
  title: string              // 年报标题
  keywords: string[]         // 年度关键词（3-5个）
  yearlySummary: string      // 年度成长总结（3-4段）
  timeline: TimelineItem[]   // 重要瞬间时间线
  letter: string             // 父母写给孩子的一封信
  socialPosts: SocialPost[]  // 朋友圈文案（3个版本）
}
```

### mock 生成器签名

```ts
// 纯函数：不操作 DOM，不读写 localStorage，不发请求
function generateMockReport(formData: GrowthReportFormData): ReportData
```

## 组件职责

| 组件 | 职责 | 接收 | 输出 |
|------|------|------|------|
| `GrowthReportApp` | 状态机调度 | — | 渲染当前状态对应组件 |
| `ChildInfoForm` | 基本信息收集 | `formData`, `onChange` | — |
| `PhotoUploader` | 照片本地预览 | `photos`, `onAdd`, `onRemove` | — |
| `InterviewForm` | 访谈问题收集 | `formData`, `onChange` | — |
| `ReportPreview` | 年报卡片展示 | `report`, `photos` | — |
| `PrintButton` | 触发打印弹窗 | — | — |
| `mockReportGenerator` | 纯函数，生成年报 | `FormData` | `ReportData` |

## 年报结果页布局（卡片网格）

```
┌─────────────────────────────────────────────────┐
│         🌸 小明的2024成长年报（标题）             │
├──────────────────┬──────────────────────────────┤
│  📝 年度关键词    │      💛 年度成长总结           │
├──────────────────┴──────────────────────────────┤
│              ⏱️ 重要瞬间时间线                    │
├──────────────────┬──────────────────────────────┤
│  ✉️ 给孩子的信   │      📱 朋友圈文案 3版本        │
└──────────────────┴──────────────────────────────┘
```

## PDF 方案

**打印样式为主**：做专门的 `@media print` 样式，隐藏按钮等无关元素，用户通过浏览器打印对话框"另存为PDF"。零依赖，最稳定，中文字体无问题。

## 开发阶段

| 阶段 | 内容 | 验收标准 |
|------|------|---------|
| 1 | 初始化项目 + 静态首页 | `npm run dev` 启动，看到首页标题 |
| 2 | 表单 + 照片上传预览 | 填写所有字段，照片本地预览 |
| 3 | mock 年报生成器 | 点击生成，控制台输出年报数据 |
| 4 | 结果展示页面 | 卡片网格正常渲染 |
| 5 | 打印/PDF | 打印样式干净，可另存为 PDF |
| 6 | README | 文档完整 |
