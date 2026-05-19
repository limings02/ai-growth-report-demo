# Family API MemoryArtifact Migration - Phase 12.4B

> 完成时间：2026-05-19  
> 验证方式：真实 API 调用（deepseek-v4-pro + DEEPSEEK_THINKING=disabled）

---

## 1. 背景

- Phase 12.4B 将 `/api/generate-report` 返回结构从 `GrowthMemoryArtifact` 切换为标准 `MemoryArtifact`。
- `.skills/family-memory` 暂不修改，仍可输出旧 `GrowthMemoryArtifact` 格式。
- `parseMemoryArtifact` 负责把旧输出兼容解析为标准 `MemoryArtifact`（已有逻辑，无需修改）。
- 前端 `GrowthReportApp` state 已切换为 `MemoryArtifact`，不再做 `growthArtifactToMemoryArtifact` 主路径转换。
- dev-only legacy `ReportPreview` 通过 `memoryArtifactToGrowthArtifact` 转回旧格式使用。

---

## 2. API Contract

### 旧 API 返回格式（Phase 12.4A 及之前）

```json
{
  "artifactVersion": "0.1",
  "report": {
    "title": "...",
    "keywords": [],
    "yearlySummary": "...",
    "timeline": [],
    "letter": "...",
    "socialPosts": []
  },
  "graph": { ... },
  "videoScript": { ... },
  "sourceTrace": { ... },
  "qualityReview": { ... }
}
```

### 新 API 返回格式（Phase 12.4B 起）

```json
{
  "artifactVersion": "0.1",
  "mode": "family",
  "narrative": {
    "title": "...",
    "keywords": [],
    "summary": "...",
    "timeline": [],
    "longFormText": {
      "title": "给未来的信",
      "content": "...",
      "voice": "parent-letter"
    },
    "socialPosts": []
  },
  "graph": {
    "title": "...",
    "subtitle": "...",
    "centerDescription": "...",
    "nodes": []
  },
  "extensions": {
    "sourceTrace": { ... },
    "qualityReview": { ... },
    "videoScript": { ... }
  }
}
```

**关键变化**：
- 顶层不再有 `report` 字段
- 新增顶层 `mode: "family"`
- 新增顶层 `narrative`（包含原 `report` 的字段）
- `sourceTrace` / `qualityReview` / `videoScript` 移入 `extensions`

---

## 3. 字段映射对照表

| 旧字段 | 新字段 | 说明 |
|--------|--------|------|
| `report.title` | `narrative.title` | 完整映射 |
| `report.keywords` | `narrative.keywords` | 完整映射 |
| `report.yearlySummary` | `narrative.summary` | 完整映射 |
| `report.timeline` | `narrative.timeline` | 完整映射 |
| `report.letter` | `narrative.longFormText.content` | 完整映射；title 固定为"给未来的信" |
| `report.socialPosts` | `narrative.socialPosts` | 完整映射 |
| `graph` | `graph` | 结构同，节点类型兼容 |
| `sourceTrace` | `extensions.sourceTrace` | 移入 extensions |
| `qualityReview` | `extensions.qualityReview` | 移入 extensions |
| `videoScript` | `extensions.videoScript` | 移入 extensions |

---

## 4. 验证命令

```bash
# 样例 A：丰富输入
curl -s -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"childName":"小熊宝","childAge":5,"reportYear":2024,"parentName":"爸爸妈妈","style":"warm","photoUrls":[],"qaList":[{"question":"今年最大变化","answer":"学会自己穿衣服"},{"question":"最印象深刻的事","answer":"生病时他来给我盖被子"}],"freeNote":"懂事了很多"}' \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
print({
  'hasReport': 'report' in d,
  'mode': d.get('mode'),
  'hasNarrative': 'narrative' in d,
  'title': d.get('narrative',{}).get('title'),
  'timelineCount': len(d.get('narrative',{}).get('timeline',[])),
  'graphNodeCount': len(d.get('graph',{}).get('nodes',[]))
})
"
```

**期望输出**：
```json
{
  "hasReport": false,
  "mode": "family",
  "hasNarrative": true
}
```

---

## 5. 验收结果

- **npm run lint**：✅ 通过
- **npm run build**：✅ 通过
- **API 样例 A**（2问答+freeNote）：
  - HTTP 200，6831 bytes
  - `mode: "family"` ✅
  - 无顶层 `report` ✅
  - `narrative.title`: "小熊宝的2024成长礼物" ✅
  - `narrative.keywords`: ['自己穿衣服', '盖被子', '唱歌', '照顾弟弟'] ✅
  - `narrative.timeline` 3条 ✅
  - `extensions.sourceTrace` ✅，`extensions.qualityReview` ✅
- **API 样例 B**（最小输入）：
  - HTTP 200，6758 bytes
  - 标准 MemoryArtifact ✅
  - `narrative.title`: "宝宝的三岁成长礼物" ✅
  - `qualityReview.riskOfFabrication`: "medium"（材料少，评估正确）✅
- **前端 family 生成**：state 直接消费 MemoryArtifact，无主路径转换 ✅
- **dev legacy fallback**：`memoryArtifactToGrowthArtifact` 转换后传给 ReportPreview ✅
- **production 行为**：build 通过，`isDev=false` 不渲染 dev-only 按钮 ✅

---

## 6. 已知遗留项（Phase 12.5+ 处理）

| 项目 | 说明 |
|------|------|
| `.skills/family-memory` 仍输出旧格式 | `parseMemoryArtifact` 兼容转换，暂时可用 |
| `runGrowthMemorySkill` 仍保留 | 作为 legacy wrapper / rollback path |
| `GrowthMemoryArtifact` 类型仍存在 | 被 dev-only legacy fallback 间接使用 |
| `ReportPreview` / `LifeGraphPreview` 仍保留 | dev-only legacy fallback 用到 |
| 信件标题固定"给未来的信" | 可在 growthArtifactToMemoryArtifact 中优化（低优先级）|
