# Life Archive Data Model - Phase 13.1

> 文档创建：Phase 13.1（2026-05-21）  
> 状态：数据模型设计完成，UI 接入待 Phase 13.2

---

## 1. 背景

当前产品已支持 family / couple / personal / memorial 四种 mode 的单次 AI 生成。用户生成结果后，刷新页面即丢失。

下一步目标：从"一次性生成结果页"升级为"可保存、可回看、可继续整理的人生 Wiki 原型"。

Phase 13.1 只做数据模型和本地存储工具函数，不改 UI，不接数据库。

---

## 2. 设计目标

- 每次生成的 `MemoryArtifact` 可以保存为 `ArchiveItem`
- 不同 mode 共用统一 archive schema
- 不依赖登录 / 数据库 / 云端
- 先使用 `localStorage`（简单，立刻可用）
- 后续可无缝迁移到 IndexedDB / Supabase / 后端数据库
- 不保存本地照片 blob，只保存照片数量等 metadata

---

## 3. 核心概念

| 概念 | 说明 |
|------|------|
| `MemoryArtifact` | AI 生成结果，当前已存在 |
| `ArchiveItem` | 一次被保存的记忆生成结果，包含 artifact + metadata |
| `ArchiveCollection` | 本地所有已保存记录的集合 |
| `ArchiveSourceSnapshot` | 输入来源的轻量摘要（不含敏感原始内容）|

---

## 4. ArchiveItem 字段设计

```ts
type ArchiveItem = {
  id: string;               // "${mode}_${timestamp}_${random}"
  mode: ArchiveMode;        // "family" | "couple" | "personal" | "memorial"
  title: string;            // narrative.title 或 fallback
  subtitle?: string;        // graph.subtitle（氛围文案）
  summary?: string;         // narrative.summary 摘要
  keywords: string[];       // narrative.keywords
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
  artifactVersion: string;  // artifact.artifactVersion
  artifact: MemoryArtifact; // 完整 artifact（不含照片 blob）
  source: ArchiveSourceSnapshot;
  localOnly: true;          // 字面类型，明确标记为本地
};
```

---

## 5. ArchiveSourceSnapshot 字段设计

不保存完整原始输入，只保存摘要，用于列表展示和归档说明：

```ts
type ArchiveSourceSnapshot = {
  inputTitle?: string;          // 表单标题（如孩子昵称、伴侣名字）
  inputSummary?: string;        // 一句话描述输入内容
  sourceQuestionCount?: number; // 回答了几道问题
  photoCount?: number;          // 上传了几张照片
  style?: string;               // 文案风格（warm / literary / simple）
};
```

---

## 6. ArchiveCollection 字段设计

```ts
type ArchiveCollection = {
  version: "1";         // schema 版本，未来迁移用
  items: ArchiveItem[]; // 按 updatedAt 倒序
  updatedAt: string;    // 整个集合的最后更新时间
};
```

---

## 7. localStorage 存储策略

| 项目 | 设计 |
|------|------|
| storage key | `memory_wiki_archive_v1` |
| 最大条数 | 50 条（超出删除最旧项）|
| 照片 | 不保存 blob，只保存 photoCount |
| 失败处理 | 所有读写 try/catch，失败不影响生成页 |
| SSR 兼容 | 所有 localStorage 访问先判断 `typeof window !== "undefined"` |
| schema 版本 | key 中包含版本号，未来迁移时可读旧 key 转换 |

---

## 8. ID 生成策略

```
id = `${mode}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
```

- 不依赖 `crypto.randomUUID`（避免浏览器兼容和 SSR 差异）
- 时间戳保证排序参考
- 随机后缀防止同毫秒碰撞

---

## 9. 类型文件位置

```
lib/archive/
  types.ts             # ArchiveItem / ArchiveCollection / ArchiveSourceSnapshot
  createArchiveItem.ts # 从 MemoryArtifact 构造 ArchiveItem
  localArchiveStore.ts # localStorage 读写工具函数
  index.ts             # barrel export
```

---

## 10. 后续演进路线

| Phase | 内容 |
|-------|------|
| 13.2 | family 结果页新增"保存"按钮，调用 upsertArchiveItem |
| 13.3 | 历史记录列表页（各 mode 已保存的 ArchiveItem）|
| 13.4 | 详情页回看（从 archive 加载 artifact 渲染结果页）|
| 13.5 | 导出 / 导入 JSON |
| 14 | 账户系统 + 云端保存（可选）|

---

## 11. 设计约束

- 不保存照片 blob（blob URL 在会话外失效，且占用大量空间）
- 不加密（localStorage 明文，本阶段可接受）
- 不跨设备同步
- 不登录
- localStorage 约 5-10MB 限制：50 条 artifact（每条估计 5-20KB JSON）约 250KB-1MB，远低于上限
