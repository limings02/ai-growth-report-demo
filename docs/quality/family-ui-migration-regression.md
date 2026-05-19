# Family UI Migration Regression - Phase 12.4A.1

> 创建时间：2026-05-19  
> 阶段：Phase 12.4A.2 验收（进入 Phase 12.4B 前必须完成）  
> 负责人：待填写

---

## 1. 背景

- Phase 12.4A 已将 family 默认结果页从 `ReportPreview` 切换为 `FamilyArtifactPreview`。
- `/api/generate-report` 仍返回 `GrowthMemoryArtifact`，前端本地调用 `growthArtifactToMemoryArtifact` 转为 `MemoryArtifact`。
- `ReportPreview` 仍保留作为 dev-only legacy fallback，可通过「🧪 查看旧版 ReportPreview」切换对比。
- 本验收文档用于确认新版 UI 没有关键功能回归，为进入 Phase 12.4B 提供判断依据。

---

## 2. 验收范围

用 dev-only legacy fallback 对比新旧版，逐项填写：

| 能力 | 旧 ReportPreview | 新 FamilyArtifactPreview | 是否通过 | 备注 |
|------|-----------------|--------------------------|---------|------|
| 封面标题 | 待验收 | 待验收 | 待填 | |
| 关键词 | 待验收 | 待验收 | 待填 | |
| 年度总结 / summary | 待验收 | 待验收 | 待填 | |
| 时间线 | 待验收 | 待验收 | 待填 | |
| 给孩子的信 | 待验收 | 待验收 | 待填 | |
| 分享文案 | 待验收 | 待验收 | 待填 | |
| 分享文案复制按钮 | 待验收 | 待验收 | 待填 | |
| 成长星图（FamilyMemoryGraphPreview） | 不存在 | 待验收 | 待填 | 新版增项 |
| 质量说明 | 待验收 | 待验收 | 待填 | |
| source trace / 溯源折叠 | 待验收 | 待验收 | 待填 | |
| 照片预览（上传了照片时） | 待验收 | 待验收 | 待填 | 新版 print:hidden |
| 原始记录折叠区 | 待验收 | 待验收 | 待填 | 新版 print:hidden |
| 返回修改（回到输入表单） | 待验收 | 待验收 | 待填 | |
| 再做一本（清空重置） | 待验收 | 待验收 | 待填 | |
| 保存 PDF / 打印 | 待验收 | 待验收 | 待填 | 照片/原始记录暂 print:hidden |
| 首页（onBackToHome） | 待验收 | 待验收 | 待填 | |
| dev-only legacy 按钮可见 | N/A | 待验收 | 待填 | production 不显示 |
| production 不显示 dev 按钮 | 待验收 | 待验收 | 待填 | |

---

## 3. 推荐测试样例

### 样例 A：丰富输入

```
childName: 小熊宝
childAge: 5
reportYear: 2024
parentName: 爸爸/妈妈
style: warm
photos: 上传 3-6 张照片
questions: 至少 5 个完整回答
freeNote: 一段具体的文字记录
```

验收目标：确认丰富材料下 FamilyArtifactPreview 能完整展示所有内容区域。

---

### 样例 B：最小可用输入

```
childName: 宝宝
childAge: 3
reportYear: 2024
parentName: 妈妈
photos: 不上传
questions: 恰好 2 个回答，其他留空
freeNote: 空
```

验收目标：确认最少材料下不崩溃；空状态提示正常显示；照片区不出现；原始记录区可折叠查看。

---

### 样例 C：长文本输入

```
childName: 小明
childAge: 6
reportYear: 2023
parentName: 爸爸
photos: 0
questions: 2 个非常长的回答（各 200 字以上）
freeNote: 一段 300 字以上的文字
```

验收目标：UI 不溢出；折叠区可读；打印不截断关键内容。

---

## 4. 手动验收步骤

```
1. npm run dev
2. 进入首页 → family mode → 孩子成长册
3. 填写样例 A（丰富输入）
4. 点击「生成成长礼物 ✨」
5. 等待生成完成

6. 确认默认进入 FamilyArtifactPreview（不是旧 ReportPreview）
7. 逐项检查验收范围表格（上方）

8. 点击右下角 dev-only 「🧪 查看旧版 ReportPreview」
9. 在旧版逐项对比，填写旧版状态
10. 点击「🌱 返回新版 FamilyArtifactPreview」
11. 确认切回新版

12. 在新版点击「← 返回修改」
13. 确认回到输入表单，不是旧版 ReportPreview
14. 修改一处内容，重新生成
15. 确认新生成后默认仍进入新版（不卡在旧版）

16. 测试「再做一本」
    - 确认清空旧结果，回到输入表单
    - 重新填写，重新生成，再次确认默认新版

17. 测试保存 PDF
    - 确认照片区和原始记录不出现在打印预览（暂 print:hidden）
    - 确认成长内容正常打印

18. 重复样例 B、C
```

---

## 5. 已知差异 / 待解决项

| 差异 | 描述 | 优先级 | 计划解决阶段 |
|------|------|--------|-------------|
| 照片打印 | 照片区暂 print:hidden | 低 | Phase 12.4B 或单独 Phase |
| 原始记录打印 | 原始记录折叠区暂 print:hidden | 低 | Phase 12.4B 或单独 Phase |
| 旧版原始记录 Tab | ReportPreview 的"原始记录"标签页比新版折叠区更完整 | 中 | Phase 12.4A.2 验收期间确认差距 |

---

## 6. Phase 12.4B 准入标准

**必须全部满足才能进入 Phase 12.4B：**

- [ ] 样例 A、B、C 验收均已完成
- [ ] 验收范围表格无"未通过"项（或有明确说明且已接受的差异）
- [ ] dev-only legacy fallback 状态流转验证通过（返回修改后再次生成仍默认新版）
- [ ] 已知差异（照片/原始记录打印）已记录并接受当前策略
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] README / handoff / migration plan 状态一致、无过时描述

**如果任何一项不满足，Phase 12.4B 不得启动。**

---

## 7. 验收结论

> 待填写：
> - 验收日期：
> - 验收人：
> - 整体结论（通过 / 未通过 / 有条件通过）：
> - 发现的问题：
> - 是否允许进入 Phase 12.4B：
