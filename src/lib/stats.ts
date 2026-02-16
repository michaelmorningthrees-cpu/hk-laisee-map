/**
 * 統計工具函數
 * 用於計算利是金額的各種統計數據
 */

export interface DistrictStats {
  average: number
  median: number
  count: number
  min: number
  max: number
}

/**
 * 計算地區統計數據
 * @param amounts - 金額陣列
 * @returns 包含平均值、中位數、數量、最小值、最大值的統計對象
 */
export function calculateDistrictStats(amounts: number[]): DistrictStats {
  // 處理空陣列
  if (!amounts || amounts.length === 0) {
    return {
      average: 0,
      median: 0,
      count: 0,
      min: 0,
      max: 0,
    }
  }

  // 過濾掉無效數值 (null, undefined, NaN, negative)
  const validAmounts = amounts.filter(
    (amount) => 
      amount !== null && 
      amount !== undefined && 
      !isNaN(amount) && 
      amount >= 0
  )

  // 如果過濾後沒有有效數值
  if (validAmounts.length === 0) {
    return {
      average: 0,
      median: 0,
      count: 0,
      min: 0,
      max: 0,
    }
  }

  const count = validAmounts.length

  // 計算平均值
  const sum = validAmounts.reduce((acc, amount) => acc + amount, 0)
  const average = Math.round(sum / count)

  // 計算中位數
  const sortedAmounts = [...validAmounts].sort((a, b) => a - b)
  let median: number
  
  if (sortedAmounts.length % 2 === 0) {
    // 偶數：取中間兩個數的平均值
    const mid1 = sortedAmounts[sortedAmounts.length / 2 - 1]
    const mid2 = sortedAmounts[sortedAmounts.length / 2]
    median = Math.round((mid1 + mid2) / 2)
  } else {
    // 奇數：取中間的數
    median = Math.round(sortedAmounts[Math.floor(sortedAmounts.length / 2)])
  }

  // 計算最小值和最大值
  const min = Math.min(...validAmounts)
  const max = Math.max(...validAmounts)

  return {
    average,
    median,
    count,
    min,
    max,
  }
}

/**
 * 格式化金額為港幣顯示
 * @param amount - 金額
 * @returns 格式化後的字串，例如 "HK$100"
 */
export function formatCurrency(amount: number): string {
  return `HK$${amount.toLocaleString('zh-HK')}`
}

/**
 * 計算百分比差異
 * @param value - 當前值
 * @param baseline - 基準值
 * @returns 百分比差異（正數表示高於基準，負數表示低於基準）
 */
export function calculatePercentDifference(value: number, baseline: number): number {
  if (baseline === 0) return 0
  return Math.round(((value - baseline) / baseline) * 100)
}

/**
 * 根據金額判斷是否為「好意頭」數字
 * @param amount - 金額
 * @returns 吉祥程度分析
 */
export function analyzeLuckiness(amount: number): {
  isLucky: boolean
  reason: string
  emoji: string
} {
  const amountStr = amount.toString()

  // 包含 8 (發)
  if (amountStr.includes('8')) {
    return {
      isLucky: true,
      reason: '有「8」字，寓意發財！',
      emoji: '🎉',
    }
  }

  // 包含 6 (順)
  if (amountStr.includes('6')) {
    return {
      isLucky: true,
      reason: '有「6」字，寓意順利！',
      emoji: '✨',
    }
  }

  // 包含 9 (長久)
  if (amountStr.includes('9')) {
    return {
      isLucky: true,
      reason: '有「9」字，寓意長久！',
      emoji: '🎊',
    }
  }

  // 雙數
  if (amount % 2 === 0) {
    return {
      isLucky: true,
      reason: '雙數利是，好事成雙！',
      emoji: '💰',
    }
  }

  // 單數（較少見）
  return {
    isLucky: false,
    reason: '單數利是較少見，雙數會更好！',
    emoji: '⚠️',
  }
}
