/**
 * 香港利是地圖常量設定
 * Hong Kong Lai See Map Constants
 */

/**
 * 香港十八區
 */
export const HK_DISTRICTS = [
  '中西區',
  '灣仔',
  '東區',
  '南區',
  '油尖旺',
  '深水埗',
  '九龍城',
  '黃大仙',
  '觀塘',
  '葵青',
  '荃灣',
  '屯門',
  '元朗',
  '北區',
  '大埔',
  '沙田',
  '西貢',
  '離島',
] as const

export type HKDistrict = typeof HK_DISTRICTS[number]

/**
 * 身份類別
 */
export interface Identity {
  id: string
  name: string
  emoji: string
  description: string
}

/**
 * 派利是者身份選項 (Giver)
 * 反映財力和社會地位
 */
export const GIVER_IDENTITIES: Identity[] = [
  { id: 'boss', name: '老闆 / 管理層', emoji: '👔', description: '派開大封' },
  { id: 'professional', name: '專業人士', emoji: '💼', description: '醫生、律師、金融才俊' },
  { id: 'civil_servant', name: '公務員', emoji: '🏛️', description: '鐵飯碗，穩定派' },
  { id: 'office_worker', name: '一般打工仔', emoji: '🧑‍💻', description: '普遍大眾' },
  { id: 'freelancer', name: '自僱 / Freelancer', emoji: '🎨', description: '彈性收入' },
  { id: 'homemaker', name: '全職主婦 / 主夫', emoji: '🏠', description: '掌握家中財政大權' },
  { id: 'retiree', name: '退休人士', emoji: '🧓', description: '派畀孫仔孫女' },
  { id: 'service', name: '服務業', emoji: '🍡', description: '前線人員' },
]

/**
 * 收利是者身份選項 (Receiver)
 * 反映收利是的場景
 */
export const RECEIVER_IDENTITIES: Identity[] = [
  { id: 'student', name: '在學學生', emoji: '📚', description: '讀緊書，利是錢好重要' },
  { id: 'fresh_grad', name: '職場新人 / Fresh Grad', emoji: '🎓', description: '啱啱出嚟做嘢' },
  { id: 'unmarried', name: '未婚單身貴族', emoji: '💎', description: '未結婚，繼續收' },
  { id: 'security', name: '保安 / 物管', emoji: '🛡️', description: '日日幫你守門口' },
  { id: 'service_staff', name: '餐飲 / 服務員', emoji: '🍜', description: '招呼街坊' },
  { id: 'cleaner', name: '清潔 / 後勤', emoji: '🧹', description: '默默付出' },
  { id: 'kids', name: '小朋友 / BB', emoji: '👶', description: '逗利是最開心' },
  { id: 'other', name: '待業 / 其他', emoji: '🙋', description: '其他身份' },
]

/**
 * 所有身份選項合併（用於查找）
 */
export const ALL_IDENTITIES: Identity[] = [...GIVER_IDENTITIES, ...RECEIVER_IDENTITIES]

/**
 * @deprecated 使用 GIVER_IDENTITIES / RECEIVER_IDENTITIES / ALL_IDENTITIES
 */
export const IDENTITIES = ALL_IDENTITIES

/**
 * 年齡組別
 */
export const AGE_GROUPS = [
  '18歲以下',
  '18-22歲',
  '23-30歲',
  '31-40歲',
  '41-50歲',
  '51歲以上',
] as const

export type AgeGroup = typeof AGE_GROUPS[number]

/**
 * 用戶角色 - 派利是或收利是
 */
export interface Role {
  id: string
  label: string
}

export const ROLES: Role[] = [
  {
    id: 'giver',
    label: '我要派利是',
  },
  {
    id: 'receiver',
    label: '我係收利是',
  },
]

/**
 * 常見派利是對象
 */
export const RELATIONS = [
  '阿媽',
  '阿爸',
  '老婆',
  '老公',
  '仔女',
  '姪仔姪女',
  '同事',
  '下屬',
  '老細',
  '朋友仔女',
  '看更',
  '保安',
  '清潔姐姐',
  '茶記伙記',
  '侍應',
  '速遞員',
  '司機',
  '補習老師',
  '興趣班導師',
  '屋企工人',
  '親戚',
  '長輩',
  '後輩',
] as const

export type Relation = typeof RELATIONS[number]

/**
 * 常見利是金額（港幣）
 */
export const AMOUNTS = [20, 50, 100, 500, 1000] as const

export type Amount = typeof AMOUNTS[number]

/**
 * 利是封顏色（傳統吉祥色）
 */
export const LAI_SEE_COLORS = [
  { name: '大紅', value: '#E63946', emoji: '🧧' },
  { name: '金黃', value: '#FFD700', emoji: '✨' },
  { name: '鴻運紅', value: '#DC143C', emoji: '🎊' },
  { name: '招財金', value: '#FFA500', emoji: '💰' },
] as const

/**
 * 新年祝福語
 */
export const GREETINGS = [
  '恭喜發財',
  '身體健康',
  '心想事成',
  '萬事如意',
  '財源廣進',
  '步步高陞',
  '龍馬精神',
  '生意興隆',
  '大吉大利',
  '如意吉祥',
] as const

export type Greeting = typeof GREETINGS[number]
