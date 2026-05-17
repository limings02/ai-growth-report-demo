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
 * available：当前已有完整功能，可进入生成流程
 * coming_soon：占位预留，仅展示卡片和说明，不进入生成流程
 */
export type MemoryModeStatus = "available" | "coming_soon";

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
 * family 排第一，因为它是当前唯一可用的 mode。
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
    description: "上传聊天记录、照片、约会故事，AI 为你们生成一本专属的恋爱 Wiki。",
    emoji: "💑",
    status: "coming_soon",
    primaryUseCase: "把恋爱的每一个瞬间，变成可以珍藏一生的纪念册",
  },
  {
    id: "personal",
    title: "个人人生册",
    subtitle: "个人 · 人生阶段回顾",
    description: "记录人生某个阶段的感悟、经历与转折，AI 帮你整理成一份私人人生 Wiki。",
    emoji: "📖",
    status: "coming_soon",
    primaryUseCase: "把自己的某段人生，整理成一本清晰、有温度的回忆录",
  },
  {
    id: "memorial",
    title: "纪念馆",
    subtitle: "逝者记忆 · 家族传承",
    description: "为挚爱的人留下一座数字纪念馆，收录他们的故事、声音与精神，让记忆永远不消散。",
    emoji: "🕯️",
    status: "coming_soon",
    primaryUseCase: "把对逝去之人的思念，变成可以代代相传的家族记忆",
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
