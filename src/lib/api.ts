/**
 * API 函數集合
 * API Functions for HK Lai See Map
 */

import type { SurveyData } from './types'

/**
 * 獲取問卷數據錯誤類別
 */
export class FetchSurveyDataError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'FetchSurveyDataError'
  }
}

/**
 * 生成 Mock 數據用於測試
 */
function generateMockData(): SurveyData[] {
  const mockData: SurveyData[] = []
  const districts = ['中西區', '灣仔', '東區', '南區', '油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘', '葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島']
  const relations = ['阿媽', '老婆', '同事', '看更', '茶記伙記', '仔女', '姪仔姪女']
  const amounts = [20, 50, 100, 200, 500, 1000]
  const roles = ['giver', 'receiver']
  const ageGroups = ['18-22歲', '23-30歲', '31-40歲', '41-50歲']

  // 生成 100 筆測試數據
  for (let i = 0; i < 100; i++) {
    mockData.push({
      role: roles[Math.floor(Math.random() * roles.length)],
      age_group: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      identity: 'professional',
      district: districts[Math.floor(Math.random() * districts.length)],
      relation: relations[Math.floor(Math.random() * relations.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      greeting: '恭喜發財',
      timestamp: new Date().toISOString(),
    })
  }

  return mockData
}

/**
 * 獲取所有問卷數據
 * Fetches all survey results from Google Script
 * 
 * @returns Promise<SurveyData[]> - 問卷數據數組
 * @throws FetchSurveyDataError - 當請求失敗時
 */
export async function fetchSurveyData(): Promise<SurveyData[]> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

  // 檢查環境變數
  if (!scriptUrl) {
    console.error('❌ NEXT_PUBLIC_GOOGLE_SCRIPT_URL 未設定')
    console.error('請在 .env.local 文件中設置 NEXT_PUBLIC_GOOGLE_SCRIPT_URL')
    // 返回空數組而不是 Mock 數據
    return []
  }

  try {
    console.log('🔄 正在從 Google Sheets 獲取數據...')
    console.log('📍 URL:', scriptUrl)

    // 發送 GET 請求
    const response = await fetch(scriptUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 設定超時保護 (30 秒)
      signal: AbortSignal.timeout(30000),
      // 不使用快取，確保獲取最新數據
      cache: 'no-store',
    })

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      const errorText = await response.text().catch(() => '無法讀取錯誤訊息')
      console.error('Google Script 返回錯誤:', response.status, errorText)
      throw new FetchSurveyDataError(
        `獲取數據失敗：HTTP ${response.status}`,
        response.status
      )
    }

    // 解析 JSON 回應
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('回應不是 JSON 格式，嘗試解析...')
    }

    const data = await response.json()

    // 驗證數據格式
    if (!Array.isArray(data)) {
      console.error('❌ 回應數據不是數組:', typeof data)
      console.error('收到的數據:', data)
      throw new FetchSurveyDataError('數據格式錯誤：預期為數組')
    }

    console.log(`✅ 成功獲取 ${data.length} 筆真實數據`)
    
    // 如果沒有數據，記錄一下
    if (data.length === 0) {
      console.warn('⚠️ Google Sheet 目前沒有數據')
      return []
    }
    
    // 修正欄位名稱映射（兼容不同的 Google Script 版本）
    const normalizedData = data.map((item: any) => {
      // 創建一個新對象，確保所有欄位名稱都是小寫+下劃線
      const normalized: any = {}
      
      Object.keys(item).forEach(key => {
        const lowerKey = key.toLowerCase().replace(/ /g, '_')
        normalized[lowerKey] = item[key]
      })
      
      // 特殊映射：wish -> greeting
      if (normalized.wish && !normalized.greeting) {
        normalized.greeting = normalized.wish
      }
      
      // 確保數值型欄位是數字
      if (normalized.amount) {
        normalized.amount = typeof normalized.amount === 'number' 
          ? normalized.amount 
          : parseFloat(normalized.amount) || 0
      }
      
      return normalized
    })
    
    console.log('📊 數據示例（第一筆）:', normalizedData[0])
    return normalizedData as SurveyData[]

  } catch (error: any) {
    console.error('❌ 無法連接到 Google Script')
    console.error('錯誤詳情:', error)
    
    // 在開發模式下，拋出錯誤以便調試
    if (process.env.NODE_ENV === 'development') {
      console.error('🔍 調試資訊:')
      console.error('- Script URL:', scriptUrl)
      console.error('- 錯誤類型:', error.name)
      console.error('- 錯誤訊息:', error.message)
    }
    
    // 生產環境：返回空數組而不是 Mock 數據
    // 這樣用戶會看到"未有數據"而不是假數據
    console.warn('⚠️ 返回空數據數組（無 Mock 數據）')
    return []
  }
}

/**
 * 獲取統計數據
 * 從問卷數據中計算統計資訊
 * 
 * @param surveyData - 問卷數據數組
 * @returns 統計數據對象
 */
export function calculateStatistics(surveyData: SurveyData[]) {
  if (!surveyData || surveyData.length === 0) {
    return {
      totalCount: 0,
      averageAmount: 0,
      medianAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      byDistrict: {},
      byRole: {},
      byAgeGroup: {},
    }
  }

  // 提取所有金額
  const amounts = surveyData
    .map(survey => survey.amount)
    .filter(amount => amount && amount > 0)
    .sort((a, b) => a - b)

  // 計算平均值
  const averageAmount = amounts.length > 0
    ? Math.round(amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length)
    : 0

  // 計算中位數
  const medianAmount = amounts.length > 0
    ? amounts[Math.floor(amounts.length / 2)]
    : 0

  // 按地區統計
  const byDistrict: Record<string, { count: number; average: number }> = {}
  surveyData.forEach(survey => {
    if (!survey.district) return
    if (!byDistrict[survey.district]) {
      byDistrict[survey.district] = { count: 0, average: 0 }
    }
    byDistrict[survey.district].count++
  })

  // 計算每個地區的平均值
  Object.keys(byDistrict).forEach(district => {
    const districtData = surveyData.filter(s => s.district === district)
    const districtAmounts = districtData
      .map(s => s.amount)
      .filter(a => a && a > 0)
    byDistrict[district].average = districtAmounts.length > 0
      ? Math.round(districtAmounts.reduce((sum, a) => sum + a, 0) / districtAmounts.length)
      : 0
  })

  // 按角色統計
  const byRole: Record<string, number> = {}
  surveyData.forEach(survey => {
    if (!survey.role) return
    byRole[survey.role] = (byRole[survey.role] || 0) + 1
  })

  // 按年齡組別統計
  const byAgeGroup: Record<string, number> = {}
  surveyData.forEach(survey => {
    if (!survey.age_group) return
    byAgeGroup[survey.age_group] = (byAgeGroup[survey.age_group] || 0) + 1
  })

  return {
    totalCount: surveyData.length,
    averageAmount,
    medianAmount,
    minAmount: amounts.length > 0 ? amounts[0] : 0,
    maxAmount: amounts.length > 0 ? amounts[amounts.length - 1] : 0,
    byDistrict,
    byRole,
    byAgeGroup,
  }
}

/**
 * 獲取特定地區的平均利是金額
 * 
 * @param district - 地區名稱
 * @returns Promise<number> - 該地區的平均金額
 */
export async function getDistrictAverage(district: string): Promise<number> {
  try {
    const data = await fetchSurveyData()
    const districtData = data.filter(survey => survey.district === district)
    
    if (districtData.length === 0) {
      return 0
    }

    const amounts = districtData
      .map(survey => survey.amount)
      .filter(amount => amount && amount > 0)

    if (amounts.length === 0) {
      return 0
    }

    return Math.round(amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length)
  } catch (error) {
    console.error(`獲取 ${district} 平均金額失敗:`, error)
    return 0
  }
}

/**
 * 獲取參與者總數
 * Get the total count of survey participants
 * 
 * @returns Promise<number> - 問卷記錄總數
 */
export async function getParticipantCount(): Promise<number> {
  try {
    console.log('正在獲取參與者總數...')
    
    const data = await fetchSurveyData()
    const count = data.length
    
    console.log(`✅ 參與者總數: ${count}`)
    return count
    
  } catch (error) {
    console.error('獲取參與者總數失敗:', error)
    // 錯誤時返回 0
    return 0
  }
}

/**
 * 輕量級：僅獲取記錄數量（不返回完整數據）
 * Lightweight version: only get the count without fetching full data
 * 
 * 注意：此版本仍需要調用 Google Script 的 doGet
 * 如果 Google Script 支持 count 參數，可以優化為只返回數量
 * 
 * @returns Promise<number> - 問卷記錄總數
 */
export async function getParticipantCountLite(): Promise<number> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

  // 如果沒有設置 URL，返回 Mock 數據數量
  if (!scriptUrl) {
    console.warn('未設置 Google Script URL，返回 Mock 數據數量')
    return 100 // Mock 數據固定為 100 筆
  }

  try {
    // 嘗試獲取數據並返回數量
    // 如果 Google Script 支持 ?action=count 參數，可以這樣實現：
    // const response = await fetch(`${scriptUrl}?action=count`)
    
    // 目前使用現有的 doGet 端點
    const response = await fetch(scriptUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 秒超時
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      return data.length
    }

    // 如果返回的是 { count: number } 格式
    if (data && typeof data.count === 'number') {
      return data.count
    }

    return 0

  } catch (error) {
    console.warn('無法獲取參與者數量，使用 Mock 數據')
    // 錯誤時返回 Mock 數據數量
    return 100
  }
}
