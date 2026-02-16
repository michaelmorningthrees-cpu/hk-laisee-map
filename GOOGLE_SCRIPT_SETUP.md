# Google Script 設置指南

## 🎯 目的
設置 Google Apps Script 來處理問卷數據的存儲和讀取。

## 📝 步驟

### 1. 創建 Google Spreadsheet
1. 前往 [Google Sheets](https://sheets.google.com)
2. 創建一個新的試算表
3. 命名為「香港利是行情數據 2026」

### 2. 設置表頭
在第一行添加以下欄位名稱（**必須按此順序，完全一致**）：

| Timestamp | District | Identity | Role | Age_Group | Relation | Amount | Wish |
|-----------|----------|----------|------|-----------|----------|--------|------|

**✅ 正確的欄位說明**：
- `Timestamp` - 提交時間（ISO 格式）
- `District` - 地區（18 區）
- `Identity` - 身份類別（專業人士、服務業等）
- `Role` - 角色（giver 派利是 / receiver 收利是）
- `Age_Group` - 年齡組別（注意：包含下劃線 `_`）
- `Relation` - 關係（阿媽、同事等）
- `Amount` - 金額（數字）
- `Wish` - 祝福語（恭喜發財等）

**⚠️ 重要注意事項**：
- 欄位名稱區分大小寫，必須完全一致
- `Age_Group` 必須用下劃線（不是空格）
- `Wish` 對應代碼中的 `greeting`
- 不需要 `mascot` 欄位（已從代碼移除）

### 3. 打開 Apps Script 編輯器
1. 在試算表中，點擊「擴充功能」→「Apps Script」
2. 刪除預設代碼

### 4. 添加以下代碼

複製並貼上以下完整代碼：

```javascript
// ========================================
// 香港利是行情地圖 - Google Apps Script
// ========================================

// 處理 POST 請求（提交問卷）
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 按照 Sheet 表頭順序添加數據
    // Timestamp, District, Identity, Role, Age_Group, Relation, Amount, Wish
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.district || '',
      data.identity || '',
      data.role || '',
      data.age_group || '',
      data.relation || '',
      data.amount || 0,
      data.greeting || ''  // greeting 映射到 Wish 欄位
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: '數據已保存' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 GET 請求（獲取數據）
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // 支持查詢參數：?action=count 只返回數量
    const action = e.parameter.action;
    
    if (action === 'count') {
      // 只返回記錄數量（排除標題行）
      const count = data.length > 1 ? data.length - 1 : 0;
      return ContentService
        .createTextOutput(JSON.stringify({ count: count }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.length <= 1) {
      // 沒有數據（只有表頭或空表）
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 第一行是標題
    const headers = data[0];
    const jsonData = [];
    
    // 從第二行開始處理數據
    for (let i = 1; i < data.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        // 將表頭名稱統一處理：
        // "Timestamp" -> "timestamp"
        // "Age_Group" -> "age_group"
        // "Wish" -> "wish" (但前端用 greeting)
        let key = headers[j].toString().toLowerCase();
        
        // 特殊處理：Wish -> greeting (前端使用 greeting)
        if (key === 'wish') {
          key = 'greeting';
        }
        
        row[key] = data[i][j];
      }
      jsonData.push(row);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(jsonData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 5. 部署為 Web App

1. 點擊右上角的「部署」→「新增部署作業」
2. 選擇類型：「網路應用程式」
3. **重要設定**：
   - **執行身分**：選擇「我」
   - **具有存取權的使用者**：選擇「任何人」⚠️ **必須選擇此項以避免 CORS 錯誤**
4. 點擊「部署」
5. 授權應用（第一次需要授權）
6. **複製網路應用程式 URL**（格式類似：`https://script.google.com/macros/s/.../exec`）

### 6. 測試 Google Script

在部署後，直接訪問你的 Script URL（在瀏覽器中打開）：
```
https://script.google.com/macros/s/你的ID/exec
```

你應該會看到：
- 如果沒有數據：`[]`
- 如果有數據：JSON 格式的數據數組

### 7. 更新環境變數

在你的 `.env.local` 文件中，將 URL 更新為你剛剛複製的 URL：

```bash
# Server-side only (用於 Server Actions)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/你的ID/exec

# Client-side accessible (用於 API 調用)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/你的ID/exec
```

### 8. 重新啟動開發伺服器

```bash
# 清除快取
rm -rf .next

# 重新啟動
npm run dev
```

### 9. 測試連接

1. 訪問 `http://localhost:3003/map`
2. 打開瀏覽器 Console（F12）
3. 應該看到：
   ```
   🔄 正在從 Google Sheets 獲取數據...
   📍 URL: https://script.google.com/...
   ✅ 成功獲取 XX 筆真實數據
   ```

如果看到錯誤，請按照下方的故障排除步驟。

---

## 🔧 故障排除

### 問題 1：Console 顯示 "Failed to fetch"

**原因**：CORS 問題或權限設置錯誤

**解決方案**：
1. ✅ 確認部署時選擇了「**任何人**」可存取（不是「只有我」）
2. ✅ 重新部署 Google Script：
   - 點擊「部署」→「管理部署作業」
   - 點擊現有部署旁的 ✏️ 編輯
   - 確認「具有存取權的使用者」是「任何人」
   - 點擊「部署」→ 會生成新的 URL
3. ✅ 將新的 URL 更新到 `.env.local`
4. ✅ 重新啟動服務器

### 問題 2：顯示 "TypeError" 或 "Script URL"

**原因**：環境變數未正確載入

**解決方案**：
1. 確認 `.env.local` 文件在專案根目錄
2. 確認變數名稱正確：`NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
3. 確認 URL 完整（包含 `/exec`）
4. **必須重新啟動服務器**（修改 .env 後）

### 問題 3：數據格式錯誤

**原因**：Google Sheet 表頭與代碼不匹配

**解決方案**：
1. 檢查 Google Sheet 第一行的表頭名稱
2. 必須完全一致：`Timestamp`, `District`, `Identity`, `Role`, `Age_Group`, `Relation`, `Amount`, `Wish`
3. 注意 `Age_Group` 的下劃線和大小寫
4. 確認沒有多餘的空格

### 問題 4：Google Sheet 顯示 "Wish" 但前端用 "greeting"

**不是問題**：
- Google Sheet 使用 `Wish` 欄位名稱（更簡潔）
- Google Script 會自動將 `wish` 轉換為 `greeting`（第 89-92 行）
- 前端代碼使用 `greeting` 欄位
- 這是正常的映射關係

---

## 📊 數據映射關係

### 前端 → Google Sheet
```
前端提交的 JSON:
{
  "timestamp": "2026-02-17...",
  "district": "中西區",
  "identity": "專業人士",
  "role": "giver",
  "age_group": "31-40歲",
  "relation": "同事",
  "amount": 100,
  "greeting": "恭喜發財"
}

↓ Google Script 處理

Google Sheet 寫入順序:
Timestamp | District | Identity | Role | Age_Group | Relation | Amount | Wish
---------------------------------------------------------------------
2026-...  | 中西區   | 專業人士 | giver | 31-40歲  | 同事     | 100   | 恭喜發財
```

### Google Sheet → 前端
```
Google Sheet 讀取:
Timestamp | District | Identity | Role | Age_Group | Relation | Amount | Wish

↓ Google Script 轉換（toLowerCase + 特殊處理）

前端接收的 JSON:
{
  "timestamp": "...",
  "district": "中西區",
  "identity": "專業人士",
  "role": "giver",
  "age_group": "31-40歲",  // Age_Group -> age_group
  "relation": "同事",
  "amount": 100,
  "greeting": "恭喜發財"  // Wish -> greeting (特殊映射)
}
```

---

## 🧪 測試清單

### ✅ 檢查 Google Script 設置
- [ ] Google Sheet 已創建
- [ ] 表頭設置正確（8 個欄位）
- [ ] Apps Script 代碼已貼上
- [ ] 已部署為 Web App
- [ ] 權限設置為「任何人」
- [ ] 已複製部署 URL

### ✅ 檢查前端配置
- [ ] `.env.local` 文件存在
- [ ] `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` 已設置
- [ ] URL 正確（包含 `/exec`）
- [ ] 已重新啟動服務器

### ✅ 測試功能
- [ ] 訪問 Script URL，能看到 JSON 數據
- [ ] Console 顯示「✅ 成功獲取」
- [ ] 提交問卷，數據出現在 Google Sheet
- [ ] Map page 顯示真實統計數據
- [ ] Result page 顯示真實地區平均

---

## 🆘 仍然有問題？

### 快速診斷

在瀏覽器 Console（F12）中檢查錯誤訊息：

1. **看到 "Failed to fetch"**
   → CORS 問題，重新部署並選擇「任何人」

2. **看到 "❌ NEXT_PUBLIC_GOOGLE_SCRIPT_URL 未設定"**
   → 環境變數未載入，重新啟動服務器

3. **看到 "TypeError" 或 "error.name"**
   → 網絡問題或 URL 錯誤，檢查 URL 格式

4. **看到 "⚠️ 返回空數據數組"**
   → Google Sheet 目前沒有數據，這是正常的

---

## 🎉 完成

設置完成後，你的應用將能夠：
- ✅ 提交問卷數據到 Google Sheets
- ✅ 從 Google Sheets 讀取真實數據
- ✅ 在地圖上顯示實時數據
- ✅ 自動更新統計資訊
- ✅ 不再使用 Mock 數據

**驗證成功的標誌**：
- Map page 顯示的「總記錄數」= Google Sheet 的數據行數（排除表頭）
- 地區卡片顯示的金額與 Google Sheet 計算結果一致
- Console 沒有錯誤訊息
