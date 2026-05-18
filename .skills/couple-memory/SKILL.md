# Couple Memory Skill

## 定位

这是 **couple mode** 的 skill pack（占位，当前不接入真实生成）。

用途：情侣恋爱纪念 / 恋爱周年 Wiki。

## 当前状态

**⚠ 未开放**：此 skill pack 当前只是占位，不接入任何真实 AI 生成。

应用层（app/page.tsx）会在用户点击 couple mode 时展示 ComingSoonModePage，不会调用此 skill。

## 未来规划

- 输入：`MemoryRawMaterial`（mode: "couple"）
- 输出：`MemoryArtifact`

未来功能：
- 生成恋爱时间线
- 关系关键词星图（Relationship Galaxy）
- 聊天摘录整理
- 周年纪念信
- 朋友圈 / 小红书文案

## 数据隐私约束

- MVP 只允许用户**手动粘贴**聊天文本
- 不读取微信数据库
- 不绕过系统权限
- 不做自动导入微信聊天记录
- 照片只在本地预览，不上传服务器
