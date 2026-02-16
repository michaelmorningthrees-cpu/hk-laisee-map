# 🧧 全港利是行情地圖 2026

香港利是地圖 - 記錄和分析全港利是行情的互動式網頁應用。

## ✨ 功能特色

- 🎯 **雙入口設計** - 派利是 / 收利是分開記錄
- 📊 **互動式地圖** - 18 區熱力圖實時顯示平均金額
- 🔍 **智能過濾** - 按角色、年齡、對象篩選數據
- 💰 **統計分析** - 全港平均、中位數、各區比較
- 🎨 **霓虹風格** - 充滿香港味道的 UI 設計
- 📱 **響應式** - 完美適配手機、平板、桌面

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

應用會在 `http://localhost:3003` 啟動

### 3. 瀏覽功能

- **首頁** (`/`) - 選擇派利是或收利是
- **問卷** (`/survey`) - 5 步驟問卷收集數據
- **結果** (`/result`) - 顯示意頭分析和統計
- **地圖** (`/map`) - 互動式 18 區熱力圖

## 🧪 測試模式

應用包含 Mock 數據功能，無需設置 Google Script 即可測試所有功能：

- ✅ 自動生成 100 筆測試數據
- ✅ 涵蓋所有 18 區
- ✅ 包含各種金額範圍
- ✅ 所有功能完全可用

當你看到 "🧪 展示模式：使用測試數據" 提示時，表示正在使用 Mock 數據。

## 📊 連接真實數據

要使用真實數據，請按照以下步驟設置 Google Script：

### 快速設置（5 分鐘）

1. **創建 Google Sheet**
   - 前往 https://sheets.google.com
   - 創建新試算表
   - 添加表頭：`role | age_group | identity | mascot | district | relation | amount | greeting | timestamp`

2. **設置 Apps Script**
   - 點擊「擴充功能」→「Apps Script」
   - 貼上 `GOOGLE_SCRIPT_SETUP.md` 中的代碼
   - 部署為「網路應用程式」
   - 設定存取權限為「任何人」

3. **更新環境變數**
   - 複製部署後的 URL
   - 在 `.env.local` 中更新 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - 重新啟動開發伺服器

詳細步驟請參考：[GOOGLE_SCRIPT_SETUP.md](./GOOGLE_SCRIPT_SETUP.md)

## 🛠️ 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS 4
- **動畫**: Framer Motion
- **圖標**: Lucide React
- **數據**: Google Apps Script + Sheets

## 📁 項目結構

```
src/
├── app/
│   ├── page.tsx           # 首頁（雙入口）
│   ├── survey/
│   │   └── page.tsx       # 問卷頁面（5步驟）
│   ├── result/
│   │   └── page.tsx       # 結果分析頁面
│   ├── map/
│   │   └── page.tsx       # 地圖儀表板
│   ├── actions.ts         # Server Actions
│   └── globals.css        # 全局樣式
├── lib/
│   ├── constants.ts       # 常量定義（18區、年齡組別等）
│   ├── types.ts           # TypeScript 型別
│   ├── api.ts             # API 函數（含 Mock 數據）
│   └── utils.ts           # 工具函數
└── .env.local             # 環境變數
```

## 🎨 設計特色

### 香港街頭小食吉祥物

- 🥟 **燒賣大俠** - 專業人士
- 🍢 **魚蛋仙子** - 服務業
- 🥧 **蛋撻師傅** - 後輩/學生
- 🧇 **雞蛋仔寶寶** - 小朋友

### 霓虹燈風格

- 深紅 + 金黃配色
- 發光文字效果
- 玻璃態 (Glassmorphism) 元素
- 流暢的動畫過渡

### 地圖熱力圖

- 🟥 **未有數據** - 灰色
- 🟥 **偏低 (<HK$50)** - 淺紅
- 🔴 **中等 (HK$50-100)** - 紅色
- 🟡 **偏高 (>HK$100)** - 紅金漸變

## 📱 響應式設計

- **手機** - 2 列網格
- **平板** - 4 列網格
- **桌面** - 6 列網格

## 🔧 開發命令

```bash
# 開發模式
npm run dev

# 建立生產版本
npm run build

# 啟動生產伺服器
npm start

# 代碼檢查
npm run lint
```

## 🌐 部署

### Vercel（推薦）

1. 連接 GitHub repository
2. 導入項目到 Vercel
3. 添加環境變數：
   - `GOOGLE_SCRIPT_URL`
   - `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
4. 部署！

### 其他平台

支持任何支持 Next.js 的平台：
- Netlify
- Railway
- Render
- 自主託管

## 📝 環境變數

```bash
# Server-side only (用於 Server Actions)
GOOGLE_SCRIPT_URL=你的_Google_Script_URL

# Client-side accessible (用於 API 調用)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=你的_Google_Script_URL
```

## 🐛 故障排除

### 問題：顯示 "Failed to fetch"
**解決方案**：這是正常的！應用會自動切換到 Mock 數據模式，所有功能依然可用。

### 問題：Mock 數據提示不消失
**解決方案**：表示 Google Script 尚未正確配置。請參考 `GOOGLE_SCRIPT_SETUP.md`。

### 問題：數據沒有保存
**解決方案**：檢查 Google Script 部署設置，確保選擇「任何人」可存取。

## 📄 授權

MIT License

## 🙏 致謝

- 香港 18 區數據
- 香港街頭小食文化
- 繁體中文（廣東話）支援

---

**Made with ❤️ in Hong Kong 🇭🇰**

恭喜發財！身體健康！🧧
