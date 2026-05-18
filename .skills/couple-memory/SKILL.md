# Couple Memory Skill

## 定位

这是 **couple mode** 的 skill pack。

用途：情侣恋爱纪念 / 恋爱周年 Wiki。

输入：`MemoryRawMaterial`（mode: "couple"）
输出：标准 `MemoryArtifact`（不输出 GrowthMemoryArtifact，不经过 family 兼容层）

## 输入结构

核心材料来自：

- `subject`：恋爱记忆主题（title / primaryName / timeRange）
- `participants`：partnerA 和 partnerB
- `qaList`：用户回答的恋爱访谈问题
- `freeNote`：用户自由记录
- `domainPayload.chatText`：用户手动粘贴的聊天文本
- `domainPayload.partnerAName`
- `domainPayload.partnerBName`
- `domainPayload.relationshipTimeRange`
- `domainPayload.anniversaryDate`（可选）

媒体说明：
- `media` 只包含照片数量和聊天条数估算，不包含实际文件
- 照片不上传服务器，不传给 AI

## 输出结构

标准 `MemoryArtifact`：

- `artifactVersion`："0.1"
- `mode`："couple"
- `narrative`：title / keywords / summary / timeline / longFormText / socialPosts
- `graph`：title / subtitle / centerDescription / nodes
- `extensions`：sourceTrace / qualityReview

## 隐私边界

- 用户聊天文本必须来自主动粘贴
- 不读取微信数据库
- 不自动导入聊天记录
- 不假设聊天记录完整
- 不编造具体地点、日期、对话
- 不对关系做道德评判
- 不夸大承诺

## 目录结构

```
.skills/couple-memory/
  SKILL.md
  prompts/
    00_system_role.md
    01_task.md
    02_output_contract.md
    03_quality_rules.md
```
