# API 使用指南

## 📚 可用函數

### 1. `fetchSurveyData()`

獲取所有問卷數據。

```typescript
import { fetchSurveyData } from '@/lib/api'

const data = await fetchSurveyData()
console.log(`總共 ${data.length} 筆數據`)
```

**返回值**: `Promise<SurveyData[]>`

**特點**:
- ✅ 自動 Fallback 到 Mock 數據
- ✅ 完整錯誤處理
- ✅ 30 秒超時保護

---

### 2. `getParticipantCount()` ⭐ 新增

獲取參與者總數（推薦使用）。

```typescript
import { getParticipantCount } from '@/lib/api'

const count = await getParticipantCount()
console.log(`參與人數: ${count}`)
```

**返回值**: `Promise<number>`

**特點**:
- ✅ 使用現有的 `fetchSurveyData()` 並返回長度
- ✅ 失敗時返回 0（不會拋出錯誤）
- ✅ 自動處理 Mock 數據

**使用場景**:
- 顯示總參與人數
- 統計頁面計數器
- 可信度指標

---

### 3. `getParticipantCountLite()` ⭐ 新增

輕量級版本：僅獲取數量。

```typescript
import { getParticipantCountLite } from '@/lib/api'

const count = await getParticipantCountLite()
console.log(`參與人數: ${count}`)
```

**返回值**: `Promise<number>`

**特點**:
- ✅ 獨立的 fetch 請求
- ✅ 10 秒超時（比完整請求更快）
- ✅ 支持 Google Script 的 `?action=count` 參數
- ✅ 失敗時返回 100（Mock 數據數量）

**優勢**:
- 更快的響應時間
- 減少數據傳輸
- 適合頻繁輪詢

**需要 Google Script 支持**:
```javascript
// Google Apps Script
function doGet(e) {
  if (e.parameter.action === 'count') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const count = sheet.getLastRow() - 1; // 排除標題行
    return ContentService
      .createTextOutput(JSON.stringify({ count: count }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // ... 其他邏輯
}
```

---

### 4. `calculateStatistics()`

計算統計數據。

```typescript
import { fetchSurveyData, calculateStatistics } from '@/lib/api'

const data = await fetchSurveyData()
const stats = calculateStatistics(data)

console.log(`平均金額: HK$${stats.averageAmount}`)
console.log(`中位數: HK$${stats.medianAmount}`)
console.log(`最小值: HK$${stats.minAmount}`)
console.log(`最大值: HK$${stats.maxAmount}`)
```

**返回值**:
```typescript
{
  totalCount: number
  averageAmount: number
  medianAmount: number
  minAmount: number
  maxAmount: number
  byDistrict: Record<string, { count: number; average: number }>
  byRole: Record<string, number>
  byAgeGroup: Record<string, number>
}
```

---

### 5. `getDistrictAverage()`

獲取特定地區的平均金額。

```typescript
import { getDistrictAverage } from '@/lib/api'

const average = await getDistrictAverage('中西區')
console.log(`中西區平均: HK$${average}`)
```

**返回值**: `Promise<number>`

**特點**:
- ✅ 自動過濾指定地區
- ✅ 失敗時返回 0

---

## 🎯 使用示例

### 示例 1: 在 React 組件中顯示參與人數

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getParticipantCount } from '@/lib/api'

export default function ParticipantBadge() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCount() {
      const total = await getParticipantCount()
      setCount(total)
      setLoading(false)
    }
    loadCount()
  }, [])

  if (loading) return <div>載入中...</div>

  return (
    <div className="badge">
      已有 {count} 人參與
    </div>
  )
}
```

### 示例 2: 輪詢更新參與人數

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getParticipantCountLite } from '@/lib/api'

export default function LiveCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 立即載入一次
    loadCount()

    // 每 30 秒更新一次
    const interval = setInterval(loadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  async function loadCount() {
    const total = await getParticipantCountLite()
    setCount(total)
  }

  return (
    <div className="counter">
      <span className="number">{count.toLocaleString()}</span>
      <span className="label">參與者</span>
    </div>
  )
}
```

### 示例 3: 綜合統計儀表板

```typescript
import { fetchSurveyData, calculateStatistics, getParticipantCount } from '@/lib/api'

export default async function StatsPage() {
  // 並行獲取數據
  const [data, participantCount] = await Promise.all([
    fetchSurveyData(),
    getParticipantCount()
  ])

  const stats = calculateStatistics(data)

  return (
    <div className="stats-dashboard">
      <h1>統計資訊</h1>
      
      <div className="stat-card">
        <h2>參與人數</h2>
        <p className="big-number">{participantCount}</p>
      </div>

      <div className="stat-card">
        <h2>全港平均</h2>
        <p className="big-number">HK${stats.averageAmount}</p>
      </div>

      <div className="stat-card">
        <h2>中位數</h2>
        <p className="big-number">HK${stats.medianAmount}</p>
      </div>

      <div className="districts">
        <h2>各區統計</h2>
        {Object.entries(stats.byDistrict).map(([district, data]) => (
          <div key={district}>
            <span>{district}</span>
            <span>平均: HK${data.average}</span>
            <span>({data.count} 筆)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 示例 4: 錯誤處理最佳實踐

```typescript
import { getParticipantCount } from '@/lib/api'

async function displayCount() {
  try {
    const count = await getParticipantCount()
    
    if (count === 0) {
      console.log('暫無數據或連接失敗')
      // 可以顯示友好的提示訊息
    } else {
      console.log(`✅ 成功獲取：${count} 位參與者`)
    }
    
    return count
    
  } catch (error) {
    // getParticipantCount 不會拋出錯誤，但為了安全起見還是加上 try-catch
    console.error('意外錯誤:', error)
    return 0
  }
}
```

---

## 🔧 性能優化建議

### 1. 使用輕量級函數

當只需要數量時，使用 `getParticipantCountLite()`:

```typescript
// ❌ 不推薦：獲取完整數據只為了計數
const data = await fetchSurveyData()
const count = data.length

// ✅ 推薦：使用專門的計數函數
const count = await getParticipantCountLite()
```

### 2. 快取數據

避免頻繁請求：

```typescript
let cachedCount = 0
let lastFetch = 0
const CACHE_DURATION = 60000 // 1 分鐘

async function getCachedCount() {
  const now = Date.now()
  
  if (now - lastFetch < CACHE_DURATION) {
    return cachedCount
  }
  
  cachedCount = await getParticipantCount()
  lastFetch = now
  
  return cachedCount
}
```

### 3. 並行請求

當需要多個數據時：

```typescript
// ❌ 串行請求（慢）
const count = await getParticipantCount()
const data = await fetchSurveyData()
const average = await getDistrictAverage('中西區')

// ✅ 並行請求（快）
const [count, data, average] = await Promise.all([
  getParticipantCount(),
  fetchSurveyData(),
  getDistrictAverage('中西區')
])
```

---

## ⚠️ 注意事項

1. **所有函數都支持 Mock 數據**
   - 未設置 Google Script 時自動使用測試數據
   - 不會拋出錯誤，確保應用可用

2. **錯誤時返回安全值**
   - `getParticipantCount()` 返回 0
   - `getDistrictAverage()` 返回 0
   - `fetchSurveyData()` 返回 Mock 數據

3. **超時設置**
   - `fetchSurveyData()`: 30 秒
   - `getParticipantCountLite()`: 10 秒

4. **快取策略**
   - 所有請求使用 `cache: 'no-store'`
   - 確保獲取最新數據
   - 如需快取，請在應用層實現

---

## 📖 相關文檔

- [GOOGLE_SCRIPT_SETUP.md](../GOOGLE_SCRIPT_SETUP.md) - Google Script 設置指南
- [README.md](../README.md) - 項目總覽
- [types.ts](../src/lib/types.ts) - TypeScript 型別定義

---

**更新日期**: 2026-02-17
