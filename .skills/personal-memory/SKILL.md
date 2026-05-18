# Personal Memory Skill

## 定位

这是 **personal mode** 的 skill pack，用于把用户填写的个人阶段记忆材料，整理成一份完整的 MemoryArtifact。

用途：个人人生 Wiki / 自我回忆录 / 人生阶段总结。

## 当前状态

**Phase 10.2 接入**：已升级为真实 prompt，接入 AI 生成链路。

## 输入

`MemoryRawMaterial`（mode: "personal"）

关键字段：
- `subject.title`：人生阶段标题
- `subject.primaryName`：用户名字或称呼
- `subject.timeRange`：时间跨度
- `participants`：通常只有 self
- `style`：文案风格（documentary / literary / reflective / warm）
- `qaList`：用户回答的访谈问题
- `freeNote`：自由记录
- `domainPayload.personName`：用户名字
- `domainPayload.lifeStage`：人生阶段描述
- `domainPayload.timeRange`：时间跨度

## 输出

标准 `MemoryArtifact`（不走 GrowthMemoryArtifact）

包含：
- narrative：title / keywords / summary / timeline / longFormText / socialPosts
- graph：title / subtitle / centerDescription / nodes
- extensions：sourceTrace / qualityReview
