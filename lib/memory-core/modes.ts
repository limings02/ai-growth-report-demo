// lib/memory-core/modes.ts
// Memory Engine 的模式注册表。
// 项目从单一孩子成长 demo 演化为 multi-mode memory product，
// 每个 mode 代表一种不同的「记忆主题」，共享同一套生成 + 展示基础设施。

// ── 模式标识 ────────────────────────────────────────────────────
/**
 * MemoryMode 是整个产品的顶层分类维度。
 * - couple：情侣 / 恋爱周年，聊天记录 + 照片 → 恋爱 Wiki
 * - family：家庭亲子，孩子成长记录（当前已有功能归属此 mode）
 * - personal：个人人生 Wiki，自我回忆录，人生阶段总结
 * - memorial：纪念馆，逝者回忆，家族精神遗产传承
 */
export type MemoryMode = "couple" | "family" | "personal" | "memorial";

// ── 模式上线状态 ─────────────────────────────────────────────────
/**
 * available：已接入真实生成流程，可用 MVP 或完整功能
 * preview：可体验输入页或原型页，但还没有接入真实 AI 生成
 * coming_soon：只展示占位说明，不进入业务流程
 */
export type MemoryModeStatus = "available" | "preview" | "coming_soon";

// ── 模式配置结构 ─────────────────────────────────────────────────
/**
 * 每个 mode 的完整配置。
 * UI 层（ModeSelector）从此处读取文案和状态，
 * 不在组件里硬编码任何 mode 相关字符串。
 */
export type MemoryModeConfig = {
  /** 模式唯一标识，与 MemoryMode 一致 */
  id: MemoryMode;
  /** 展示名称，简短（4–6 字） */
  title: string;
  /** 一行副标题，说明核心受众 */
  subtitle: string;
  /** 2–3 行描述，说明这个 mode 能生成什么 */
  description: string;
  /** 模式对应的 emoji，用于卡片图标 */
  emoji: string;
  /** 当前上线状态 */
  status: MemoryModeStatus;
  /** 最典型的使用场景（一句话），用于 coming soon 卡片上的预期描述 */
  primaryUseCase: string;
};

// ── 模式注册表 ───────────────────────────────────────────────────
/**
 * 所有 mode 的配置数组。
 * 顺序决定 ModeSelector 卡片的显示顺序。
 * family 排第一，因为它是当前唯一完整可用（available）的 mode。
 */
export const MEMORY_MODES: MemoryModeConfig[] = [
  {
    id: "family",
    title: "家庭成长册",
    subtitle: "孩子成长 · 亲子记忆",
    description: "记录孩子这一年的成长故事，AI 帮你生成一份可打印的成长礼物——关键词、时间线、给未来孩子的信。",
    emoji: "🌱",
    status: "available",
    primaryUseCase: "用孩子的故事，生成一份 18 岁时可以翻看的成长年册",
  },
  {
    id: "couple",
    title: "恋爱纪念册",
    subtitle: "情侣 · 恋爱周年",
    description: "填写情侣信息、粘贴聊天片段和恋爱故事，AI 为你们生成恋爱时间线、关系关键词、周年信和 Relationship Galaxy 雏形。",
    emoji: "💑",
    status: "available",
    primaryUseCase: "把你们的聊天、纪念日和故事，生成一份可保存的恋爱纪念册",
  },
  {
    id: "personal",
    title: "个人人生册",
    subtitle: "个人 · 人生阶段回忆录",
    description: "填写人生阶段、时间跨度、回忆问答和自由记录，AI 为你生成阶段时间线、关键词、写给未来自己的信和个人记忆图谱。",
    emoji: "📖",
    status: "available",
    primaryUseCase: "把某段人生，整理成一本有时间线、有情绪底色、写给未来自己的个人回忆录",
  },
  {
    id: "memorial",
    title: "纪念册",
    subtitle: "人生故事 · 家族记忆传承",
    description: "把关于一个人的记忆材料——故事、照片数量、问答、自由文字——整理成一份可保存的家族纪念册，留给后辈也留给自己。",
    emoji: "🕯️",
    status: "preview",
    primaryUseCase: "把对家人或挚友的回忆，整理成一份克制、有温度的人生故事",
  },
];

// ── 默认 mode ────────────────────────────────────────────────────
/**
 * 当用户没有显式选择 mode 时的默认值。
 * 对应当前已有孩子成长功能，保持向后兼容。
 */
export const DEFAULT_MEMORY_MODE: MemoryMode = "family";

// ── 工具函数 ─────────────────────────────────────────────────────
/**
 * 按 id 查找 mode 配置。
 * 如果传入未知 id（不应发生，TypeScript 会在编译期拦截），抛出明确错误。
 */
export function getMemoryModeConfig(mode: MemoryMode): MemoryModeConfig {
  const config = MEMORY_MODES.find((m) => m.id === mode);
  if (!config) {
    throw new Error(`[memory-core] Unknown MemoryMode: "${mode}"`);
  }
  return config;
}
