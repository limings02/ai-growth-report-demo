# Memorial Memory Skill

## 定位

这是 **memorial mode** 的 skill pack，用于把用户填写的纪念材料整理成一份完整的 MemoryArtifact。

用途：家族纪念册 / 人生故事整理 / 家族记忆传承。

## 当前状态

**Phase 11.2 起可用于真实 memorial mode 生成。**

## 安全边界（必须严格遵守）

- **不以逝者第一人称说话**
- **不模拟逝者语气或意愿**
- **不做 AI 复活**
- **不写"ta 想对你说""ta 希望你……"**
- **不编造任何具体事实**（出生年份、职业、地点、家庭成员等）
- **不做哀伤治疗或心理建议**

## 输入

`MemoryRawMaterial`（mode: "memorial"）

关键字段：
- `subject.primaryName`：被纪念者称呼
- `subject.timeRange`：时间跨度
- `participants`：通常包含 deceased 和 narrator
- `style`：文稿风格（documentary / warm / solemn / family）
- `qaList`：家人回答的纪念问题
- `freeNote`：自由记录
- `domainPayload.deceasedName`：被纪念者称呼
- `domainPayload.narratorName`：撰写者称呼（可选）
- `domainPayload.relationship`：关系（如"外孙女""儿子"）
- `domainPayload.timeRange`：时间跨度

## 输出

标准 `MemoryArtifact`（不走 GrowthMemoryArtifact）

包含：
- narrative：title / keywords / summary / timeline / longFormText / socialPosts
- graph：title / subtitle / centerDescription / nodes
- extensions：sourceTrace / qualityReview
