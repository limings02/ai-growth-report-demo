# 当前过渡态说明

> 这份文档解释当前架构中「看起来绕了一圈」的地方，防止未来误删兼容代码。

---

## 为什么看起来有点绕

当前 family mode 的链路是这样的：

```
family-memory skill pack
  └── AI 输出 GrowthMemoryArtifact（旧格式）
       │ parseMemoryArtifact 识别旧格式
       ▼
  MemoryArtifact（通用格式）
       │ memoryArtifactToGrowthArtifact
       ▼
  GrowthMemoryArtifact（旧格式）
       │
  ReportPreview / LifeGraphPreview（消费旧格式）
```

转了两次格式，表面上看很多余。

**原因：**

- `ReportPreview` 和 `LifeGraphPreview` 还没有泛化为 `MemoryArtifactPreview` 和 `MemoryGraphPreview`
- 重构策略是「runtime 先泛化，前端后迁移」
- 先让 `runMemorySkill` 走通用链路，前端不感知
- 等前端泛化完成后，这两次转换可以删除

这是有意的，不是 bug，不是代码重复。

---

## 这些代码暂时不能删

### 运行时兼容层

| 文件 | 不能删的原因 |
|------|-------------|
| `lib/skill-runtime/runGrowthMemorySkill.ts` | `/api/generate-report` 调用它，是当前生产入口 |
| `lib/skill-runtime/buildGrowthMemoryPrompt.ts` | 暂时保留作旧 growth-memory 链路回溯和应急 fallback 参考；当前主链路不直接调用它 |
| `lib/skill-runtime/parseGrowthMemoryArtifact.ts` | `parseMemoryArtifact` 中 family fallback 路径调用它 |
| `lib/skill-runtime/types.ts` | `GrowthMemoryArtifact` 类型，全项目引用 |

### Skill pack

| 目录 | 不能删的原因 |
|------|-------------|
| `.skills/growth-memory/` | `skillRegistry.ts` 中 family 的 fallbackSkillDir，`loadMemorySkillPrompt` 会 fallback 到这里 |

### 图谱兼容层

| 文件 | 不能删的原因 |
|------|-------------|
| `lib/graph/buildLifeGraph.ts` | `LifeGraphPreview` 仍调用它（`useMemo(() => buildLifeGraph(...))`) |
| `lib/graph/types.ts` 中的 `LifeGraphData` | `LifeGraphPreview` 的内部类型，未改 |

### 前端组件

| 组件 | 不能删的原因 |
|------|-------------|
| `components/LifeGraphPreview.tsx` | `ReportPreview` 仍 import 它 |
| `components/ReportPreview.tsx` 的 `GrowthMemoryArtifact` props | 未泛化 |

---

## 什么条件下可以删除

### 条件 A：ReportPreview 泛化

**当** `ReportPreview` 改为消费 `MemoryArtifact` 后：

- 可删除 `memoryArtifactToGrowthArtifact` 在 wrapper 中的调用
- 可删除 `runGrowthMemorySkill` 中的转换逻辑
- `GrowthMemoryArtifact` 兼容层可逐步退出

### 条件 B：family-memory 直接输出 MemoryArtifact

**当** `.skills/family-memory/02_output_contract.md` 改为要求输出 `MemoryArtifact` 格式后：

- `parseMemoryArtifact` 中的 `GrowthMemoryArtifact` 识别逻辑可以删除
- `growthArtifactToMemoryArtifact` 可以删除
- `.skills/growth-memory` 可以退出 fallback 角色（仍保留作历史参考）

### 条件 C：MemoryGraphPreview 替代 LifeGraphPreview

**当** 新建 `MemoryGraphPreview` 并在 `ReportPreview` 中替换后：

- `buildLifeGraph`（wrapper）可以删除
- `LifeGraphData` 兼容类型可以逐步清理

### 条件 D：growth-memory fallback 不再需要

**当** `.skills/family-memory` 稳定运行且无需 fallback 后：

- `skillRegistry.ts` 中 `family.fallbackSkillDir` 可以删除
- `.skills/growth-memory` 可以归档（不一定要删，留作参考）

---

## 渐进迁移路线建议

```
阶段 1（已完成）：
  runtime 泛化（MemoryRawMaterial / MemoryArtifact / runMemorySkill）
  旧前端通过 adapter 兼容
  family-memory skill pack 上线

阶段 2（已完成）：
  couple mode 接入（直接输出 MemoryArtifact，不走旧兼容）
  MemoryArtifactPreview 通用展示容器建立（Phase 9.3）

阶段 3（已完成）：
  personal mode 接入（直接输出 MemoryArtifact，Phase 10.2）
  personal-memory skill pack 上线

阶段 4（进行中）：
  family-memory 改为直接输出 MemoryArtifact
  ReportPreview 泛化为 MemoryArtifactPreview
  LifeGraphPreview → MemoryGraphPreview
  删除 GrowthMemoryArtifact 兼容层

阶段 5（进行中）：
  memorial mode preview 骨架（Phase 11.1 已完成，不调用 AI，展示 mock 结果）
  memorial 真实 AI 生成留到 Phase 11.2

阶段 6（长期）：
  memorial mode 真实 AI 接入（.skills/memorial-memory 完善 + API route 新增）
  统一 MemoryArtifactPreview 跨 mode 展示
```

---

## 一句话总结

> 当前的「绕」是为了让旧前端在不改动的情况下继续工作，同时新的 runtime 已经走通了。
> 等旧前端逐步泛化，这些兼容层会一个一个被干净地删掉。
