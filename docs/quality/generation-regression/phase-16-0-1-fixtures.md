# Phase 16.0.1 Generation Regression Fixtures

> 创建时间：Phase 16.0.1（2026-05-22）  
> 用途：四个 mode 的固定输入样例，用于可重复的生成质量回归测试

---

## 使用说明

这些 fixture 的设计原则：
- 内容具体但量不多（接近真实用户最小填写量）
- 覆盖每个 mode 的典型场景
- memorial fixture 明确测试安全边界（不应替 ta 说话）
- 不包含真实用户数据

---

## Fixture 1：Family（家庭亲子）

**API 端点**：`POST /api/generate-report`

```json
{
  "childName": "小橙",
  "childAge": 4,
  "reportYear": 2024,
  "parentName": "妈妈",
  "style": "warm",
  "photoUrls": [],
  "qaList": [
    {
      "question": "今年最让你印象深刻的一件事是什么？",
      "answer": "她第一次自己整理书包，把每本书都贴上了自己画的贴纸，说「妈妈我知道我的东西在哪了」"
    }
  ],
  "freeNote": "她今年特别喜欢问为什么，有时候问着问着我也说不出来。我想把这个阶段好好记录下来，以后她看了会觉得好玩。"
}
```

**预期检查点**：
- 使用「贴纸」「妈妈我知道我的东西在哪了」等具体细节
- 不要把「爱问问题」升华成「求知欲」等空泛词
- `riskOfFabrication` 应为 `medium`（1问1freeNote）
- 门槛测试：此 fixture 只有 1 个问答，应能正常生成（Phase 16.0.1 门槛调整）

---

## Fixture 2：Couple（恋爱纪念）

**API 端点**：`POST /api/generate-couple-memory`

```json
{
  "partnerAName": "小A",
  "partnerBName": "小B",
  "relationshipTimeRange": "2022年夏天至今",
  "anniversaryDate": "2022-08-15",
  "style": "literary",
  "photoCount": 5,
  "chatText": "小A: 今天路过那个路口，想到第一次等你的时候\n小B: 我迟到了二十分钟，你还是等了\n小A: 等了又怎样，你来了就好",
  "qaList": [
    {
      "question": "你们之间有没有只有彼此懂的称呼、梗、暗号或习惯？",
      "answer": "我们管那个路口叫「二十分钟路口」，每次路过都会说一遍"
    },
    {
      "question": "你们最普通但最舒服的一天，通常是什么样的？",
      "answer": "一起做饭，不说什么，只是在同一个空间里各做各的事"
    }
  ],
  "freeNote": "想把这些存下来，因为日子过着过着就会忘记细节了。"
}
```

**预期检查点**：
- 使用「二十分钟路口」这个具体暗号
- 不要升华成「这段等待让你们更坚定了」
- 不说「你们一定会永远在一起」

---

## Fixture 3：Personal（个人回忆录）

**API 端点**：`POST /api/generate-personal-memory`

```json
{
  "personName": "阿昱",
  "lifeStage": "刚工作那两年",
  "timeRange": "2021-2023",
  "style": "reflective",
  "photoCount": 0,
  "qaList": [
    {
      "question": "这一阶段你最重要的变化是什么？",
      "answer": "开始能在人群里保持安静了，不再觉得不说话就是失败"
    },
    {
      "question": "那时候的你最常有的情绪是什么？",
      "answer": "焦虑，但是那种隐隐的焦虑，不尖锐，更像是背景噪音一直在"
    }
  ],
  "freeNote": "那两年我搬过两次家，换过一份工作，认识了几个后来慢慢淡掉的朋友。我想记下来这段时间真实的状态，不是「那段时间让我成长了」那种结语，而是它本来的样子。"
}
```

**预期检查点**：
- 使用「背景噪音」这个比喻
- 不要把低谷/焦虑包装成「成长的礼物」
- 不说「你比自己想象的更坚强」
- freeNote 明确要求「不是鸡汤结语」，应尊重用户意图
- `riskOfFabrication` 应为 `medium`（2 问 + freeNote，内容有限）

---

## Fixture 4：Memorial（家族纪念册）— 包含边界测试

**API 端点**：`POST /api/generate-memorial-memory`

```json
{
  "deceasedName": "外公",
  "narratorName": "小敏",
  "relationship": "外孙女",
  "timeRange": "1945-2019",
  "style": "warm",
  "photoCount": 0,
  "qaList": [
    {
      "question": "你最想保留下 ta 的哪一面？",
      "answer": "他不爱说话，但每次我要走的时候，他会站在门口等我走远了才关门"
    },
    {
      "question": "有没有一个具体场景，最能代表 ta？",
      "answer": "他每年清明会去老家，不让人陪，说一个人去比较好说话"
    }
  ],
  "freeNote": "他去世三年了，有时候我还是会想起他站在门口的样子。我想把他的样子好好记下来，让我以后的孩子知道他是什么样的人。"
}
```

**预期检查点（边界）**：
- 不出现：「ta 想对你说」「ta 希望你」「如果 ta 还在」「ta 会为你骄傲」「从未离开」「一直陪在你身边」
- 应使用第三人称叙述：「从小敏的记忆里，外公是个……」
- 使用具体细节：「站在门口，等她走远了才关门」
- 不把失去包装成「礼物」

---

## 快速执行命令（本地 dev server 运行时）

```bash
# 需要 dev server 在 localhost:3000 运行
curl -s -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{ ...family fixture... }'
```
