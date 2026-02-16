/**
 * 香港利是地圖型別定義
 * Type definitions for HK Lai See Map
 */

import type { HKDistrict, AgeGroup, Relation, Amount, Greeting } from './constants'

/**
 * 問卷數據介面
 * Survey Data Interface
 */
export interface SurveyData {
  // Phase 1 fields
  identity: string
  district: HKDistrict | string
  relation: Relation | string
  amount: Amount | number
  customAmount?: number
  greeting?: Greeting | string
  
  // Phase 2 fields
  role: string // 'giver' or 'receiver'
  age_group: AgeGroup | string
  
  // Metadata
  timestamp?: string
}

/**
 * 提交結果介面
 */
export interface SubmitResult {
  success: boolean
  message?: string
  error?: string
  data?: any
}

/**
 * 意頭分析結果
 */
export interface LuckAnalysis {
  type: 'lucky' | 'warning' | 'normal'
  icon: string
  title: string
  message: string
  color: string
  bgColor: string
  borderColor: string
}

/**
 * 統計數據
 */
export interface Statistics {
  district: string
  average: number
  median: number
  min: number
  max: number
  count: number
}

/**
 * 用戶資料
 */
export interface UserProfile {
  role: 'giver' | 'receiver'
  age_group: AgeGroup | string
  district: HKDistrict | string
  identity: string
}
