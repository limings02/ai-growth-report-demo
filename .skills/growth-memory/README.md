# growth-memory skill pack — ARCHIVED

> **归档状态**：此 skill pack 已在 Phase 12.6D 归档，不再被任何运行时路径调用。

## 历史用途

这是 family mode 的原始 skill pack，输出格式为旧 `GrowthMemoryArtifact` JSON。

### 旧运行时链路（已删除）

```
RawMaterial
  → buildGrowthMemoryPrompt()   # lib/skill-runtime/buildGrowthMemoryPrompt.ts（已删除）
  → callDeepSeek()
  → parseGrowthMemoryArtifact() # lib/skill-runtime/parseGrowthMemoryArtifact.ts（已删除）
  → GrowthMemoryArtifact        # lib/skill-runtime/types.ts（已删除）
```

## 当前 family mode 链路

```
RawMaterial
  → familyRawMaterialToMemoryRawMaterial
  → runMemorySkill → .skills/family-memory
  → MemoryArtifact
```

family mode 使用 `.skills/family-memory/` 作为当前 skill pack（自 Phase 12.5 起直接输出 MemoryArtifact）。

## 归档原因

- Phase 12.4B：`/api/generate-report` 改为调用 `runFamilyMemorySkill`，不再使用此 skill pack
- Phase 12.5：`.skills/family-memory` 已完全迁移到 MemoryArtifact 输出格式
- Phase 12.6D：rollback path（`runGrowthMemorySkill`）已删除，此 skill pack 无任何引用

## 保留理由

作为历史参考保留，不急于删除。如需恢复，可通过 git 历史找回对应的运行时代码。
