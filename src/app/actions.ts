'use server'

interface SurveyData {
  [key: string]: any
}

interface SubmitSurveyResult {
  success: boolean
  message?: string
  error?: string
}

/**
 * Server Action 來提交問卷數據到 Google Script
 * 使用 Server Action 可以避免 CORS 問題
 * 
 * @param data - 問卷數據對象
 * @returns 提交結果
 */
export async function submitSurvey(
  data: SurveyData
): Promise<SubmitSurveyResult> {
  try {
    // 檢查環境變數（使用 NEXT_PUBLIC_ 前綴以確保 Vercel 部署時可讀取）
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

    if (!googleScriptUrl) {
      console.error('NEXT_PUBLIC_GOOGLE_SCRIPT_URL 未設定')
      return {
        success: false,
        error: '伺服器配置錯誤：缺少 Google Script URL'
      }
    }

    // 驗證數據
    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: '請提供有效的問卷數據'
      }
    }

    console.log('正在提交問卷數據到 Google Script...')

    // 發送 POST 請求到 Google Script
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // 設定超時保護
      signal: AbortSignal.timeout(30000), // 30 秒超時
    })

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      const errorText = await response.text().catch(() => '無法讀取錯誤訊息')
      console.error('Google Script 返回錯誤:', response.status, errorText)
      return {
        success: false,
        error: `提交失敗：HTTP ${response.status}`
      }
    }

    // 解析回應
    let result
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      console.log('Google Script 回應:', text)
      result = { message: text }
    }

    console.log('問卷提交成功')
    return {
      success: true,
      message: result.message || '問卷提交成功'
    }

  } catch (error: any) {
    console.error('提交問卷時發生錯誤:', error)

    // 處理不同類型的錯誤
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return {
        success: false,
        error: '請求超時，請稍後再試'
      }
    }

    if (error.message?.includes('fetch')) {
      return {
        success: false,
        error: '網絡連接錯誤，請檢查您的網絡設定'
      }
    }

    return {
      success: false,
      error: error.message || '提交問卷時發生未知錯誤'
    }
  }
}
