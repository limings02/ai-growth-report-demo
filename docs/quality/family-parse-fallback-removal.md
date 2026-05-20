# Family Parse Fallback Removal - Phase 12.6C

> 完成时间：Phase 12.6C（2026-05-20）  
> 前置：Phase 12.6B 已删除 dev legacy UI fallback；family prompt 自 Phase 12.5 起稳定输出 MemoryArtifact

---

## 1. 背景

- Phase 12.5 已让 family-memory 直接输出 MemoryArtifact，旧格式路径不再被触发。
- Phase 12.6B 已删除 dev legacy UI fallback（ReportPreview / LifeGraphPreview）。
- 本阶段删除旧 GrowthMemoryArtifact parse fallback，让 parseMemoryArtifact.ts 更干净。
- rollback path（`runGrowthMemorySkill`）仍保留，留到 Phase 12.6D。

---

## 2. 删除范围

| 文件 / 逻辑 | 处理 |
|---|---|
| `parseMemoryArtifact.ts` 中 `parseGrowthMemoryArtifact` import | 删除 |
| `parseMemoryArtifact.ts` 中 `growthArtifactToMemoryArtifact` import | 删除 |
| `parseMemoryArtifact.ts` 中 `childName` / `reportYear` 提取 | 删除（仅供旧 parser 使用）|
| `parseMemoryArtifact.ts` JSON parse 失败时 family 旧 parser fallback | 删除 |
| `parseMemoryArtifact.ts` `parsed.report` 旧格式分支 | 删除 |
| `lib/skill-runtime/parseGrowthMemoryArtifact.ts` | 删除 |
| `artifactAdapter.ts` 中 `growthArtifactToMemoryArtifact` 函数 | 删除 |
| `artifactAdapter.ts` 中 `toMemoryGraphNodeType` helper（仅被 growthArtifactToMemoryArtifact 使用）| 删除 |

---

## 3. 保留范围

| 文件 / 逻辑 | 原因 |
|---|---|
| `runGrowthMemorySkill.ts` | Phase 12.6D rollback path |
| `memoryArtifactToGrowthArtifact` | `runGrowthMemorySkill.ts` 仍调用 |
| `GrowthMemoryArtifact` 类型（`lib/skill-runtime/types.ts`）| `runGrowthMemorySkill.ts` 返回值类型 |
| `toGrowthGraphNodeType` helper | `memoryArtifactToGrowthArtifact` 调用 |
| `.skills/growth-memory` | 后续归档 |
| `makeMinimalMemoryArtifact` | malformed JSON 兜底 |
| `normalizeMemoryArtifact` | 标准 MemoryArtifact 规范化 |

---

## 4. grep 验证结果

| 符号 | 代码引用 | 注释/历史引用 | 说明 |
|------|---------|-------------|------|
| `parseGrowthMemoryArtifact` | **0** | 0 | 文件已删除，无残留 |
| `growthArtifactToMemoryArtifact` | **0** | 1 处（`artifactAdapter.ts` 顶部注释）| 说明文字，不影响行为 |
| `parsed.report` | **0** | 0 | |
| `memoryArtifactToGrowthArtifact` | **✅ 存在** | — | `runGrowthMemorySkill.ts` 正常使用 |
| `GrowthMemoryArtifact` | **✅ 存在** | — | `skill-runtime/types.ts` 定义，rollback path 使用 |

---

## 5. 功能验收

### lint / build

| 命令 | 结果 |
|------|------|
| `npm run lint` | ✅ 零错误 |
| `npm run build` | ✅ TypeScript 零错误，6 个 route 正常编译 |

### API 验证（真实调用）

调用 `/api/generate-report`（最小 2 问答输入），返回：

```
mode: family                             ✅
has_narrative: True                      ✅
has_report (should be False): False      ✅
narrative.title: 测试的 2024 成长礼物     ✅
longFormText.voice: parent-letter        ✅
risk: medium                             ✅（2条短问答，评估正确）
has_qualityReview: True                  ✅
```

新版 parse 路径（标准 MemoryArtifact → normalizeMemoryArtifact）工作正常。旧 parse fallback 路径已删除，API 调用证实不再需要它。

### malformed JSON 兜底验证

未做直接 `parseMemoryArtifact("not json", material)` 单元测试调用。

代码静态分析确认：
- `try { parsed = JSON.parse(...) } catch { return makeMinimalMemoryArtifact(...) }` 路径完整
- malformed JSON 直接进 catch 分支，返回最小 MemoryArtifact，不抛异常
- `makeMinimalMemoryArtifact` 函数未改动，兜底逻辑与 Phase 12.6B 前一致

### 真实浏览器验证

**未完成真实浏览器交互验证**（需人工操作浏览器）。

静态分析确认：
- `GrowthReportApp` result 分支只渲染 `FamilyArtifactPreview`，传入 MemoryArtifact 直接渲染
- parse 路径变更不影响前端（前端只消费最终 MemoryArtifact）

---

## 6. parseMemoryArtifact.ts 改动摘要

删除前主函数：
- 提取 `childName` / `reportYear`（family-specific）
- JSON parse 失败 → family mode 尝试 `parseGrowthMemoryArtifact` → `growthArtifactToMemoryArtifact`
- JSON parse 成功 → `parsed.narrative && parsed.graph` → `normalizeMemoryArtifact`（保留）
- JSON parse 成功 → `material.mode === "family" && parsed.report` → 旧 parser → 转换
- 全部失败 → `makeMinimalMemoryArtifact`（保留）

删除后主函数（Phase 12.6C）：
- JSON parse 失败 → `makeMinimalMemoryArtifact`
- JSON parse 成功 → `parsed.narrative && parsed.graph` → `normalizeMemoryArtifact`
- JSON parse 成功但格式不对 → `makeMinimalMemoryArtifact`

---

## 7. 结论

| 检查项 | 状态 |
|--------|------|
| lint | ✅ 通过 |
| build | ✅ 通过 |
| `parseGrowthMemoryArtifact` 代码引用 | ✅ 0 |
| `growthArtifactToMemoryArtifact` 代码引用 | ✅ 0 |
| `parsed.report` 代码引用 | ✅ 0 |
| `memoryArtifactToGrowthArtifact` 仍保留 | ✅ |
| `GrowthMemoryArtifact` 类型仍保留 | ✅ |
| API 正常生成标准 MemoryArtifact | ✅ |
| 是否允许进入 Phase 12.6D | ✅ **允许** |
