# Life Archive Data Model Check - Phase 13.1

> 完成时间：Phase 13.1（2026-05-21）

---

## 1. 检查范围

| 文件 | 内容 |
|------|------|
| `lib/archive/types.ts` | `ArchiveMode` / `ArchiveSourceSnapshot` / `ArchiveItem` / `ArchiveCollection` |
| `lib/archive/createArchiveItem.ts` | `createArchiveItemFromArtifact()` 工厂函数 |
| `lib/archive/localArchiveStore.ts` | `localStorage` 读写工具：read / write / upsert / delete / clear |
| `lib/archive/index.ts` | barrel export |

---

## 2. 静态验收

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

---

## 3. 类型约束验证

| 约束 | 验证方式 | 结果 |
|------|---------|------|
| `ArchiveMode` 复用 `MemoryMode` | `type ArchiveMode = MemoryMode` | ✅ |
| `ArchiveItem` 嵌入 `MemoryArtifact` | `artifact: MemoryArtifact` | ✅ |
| `localOnly` 字面类型 | `localOnly: true` | ✅ |
| 不保存照片 blob | `ArchiveItem` 无 `photos` / `blob` 字段 | ✅ |
| `ArchiveCollection.version` 字面类型 | `version: "1"` | ✅ |

---

## 4. 函数行为说明

### `createArchiveItemFromArtifact`

- `title` 取 `narrative.title`，为空时用 mode fallback（家庭成长册/恋爱纪念册/个人记忆/人生故事）
- `subtitle` 取 `graph?.subtitle`
- `id` 格式：`{mode}_{timestamp}_{6位随机字符}`，不依赖 `crypto.randomUUID`
- `source` 可选，默认空对象
- `localOnly: true` 字面类型，后续迁移到云端时可添加 `cloudId` 字段

### `localArchiveStore`

| 函数 | SSR 安全 | 失败处理 |
|------|---------|---------|
| `readArchiveCollection()` | ✅（返回空集合）| ✅（catch 返回空集合）|
| `writeArchiveCollection()` | ✅（返回 false）| ✅（catch 返回 false）|
| `upsertArchiveItem()` | ✅ | ✅ |
| `deleteArchiveItem()` | ✅ | ✅ |
| `clearArchiveCollection()` | ✅（返回 false）| ✅ |

---

## 5. 手动验证建议（Phase 13.2 接 UI 后）

在浏览器 console 中临时验证：

```ts
import {
  readArchiveCollection,
  upsertArchiveItem,
  deleteArchiveItem,
  clearArchiveCollection,
  createArchiveItemFromArtifact,
} from "@/lib/archive";

// 读取当前 archive
const col = readArchiveCollection();
console.log("items:", col.items.length);

// 保存一个 item（生成结果页已有 artifact 时）
const item = createArchiveItemFromArtifact({ artifact, mode: "family" });
upsertArchiveItem(item);

// 删除
deleteArchiveItem(item.id);

// 清空
clearArchiveCollection();
```

---

## 6. 当前限制

| 限制 | 说明 |
|------|------|
| 不保存照片 blob | blob URL 在会话外失效；保存会大幅超出 localStorage 限制 |
| localStorage 容量 | 约 5-10MB；50 条 artifact（估计每条 5-20KB）约 250KB-1MB，安全 |
| 不跨设备同步 | Phase 14 考虑 |
| 不加密 | Phase 14 考虑 |
| 不登录 | Phase 14 考虑 |
| SSR 不可用 | 所有函数均处理，返回空集合或 false |

---

## 7. 下一步（Phase 13.2）

- family `FamilyArtifactPreview` 结果页新增「保存到本地」按钮
- 点击后调用 `createArchiveItemFromArtifact` + `upsertArchiveItem`
- 按钮反馈：保存成功 / 失败提示
- 本阶段不做历史列表 UI
