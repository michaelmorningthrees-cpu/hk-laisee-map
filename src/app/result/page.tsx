'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Home, Share2, AlertTriangle, Sparkles, TrendingUp, Copy, Check, Map, Unlock, Award } from 'lucide-react'
import { ALL_IDENTITIES } from '@/lib/constants'
import ShareButtons from '@/components/ShareButtons'
import { fetchSurveyData } from '@/lib/api'
import { calculateDistrictStats } from '@/lib/stats'

export default function ResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [copied, setCopied] = useState(false)
  const [districtAverage, setDistrictAverage] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  
  // 從 URL 獲取參數
  const identityId = searchParams.get('identity') || 'professional'
  const district = searchParams.get('district') || ''
  const relation = searchParams.get('relation') || ''
  const amount = parseInt(searchParams.get('amount') || '0')
  const greeting = searchParams.get('greeting') || '恭喜發財'

  const currentIdentity = ALL_IDENTITIES.find(i => i.id === identityId) || ALL_IDENTITIES[0]

  // 載入真實的地區平均數據
  useEffect(() => {
    loadDistrictStats()
  }, [district])

  const loadDistrictStats = async () => {
    if (!district) {
      setIsLoadingStats(false)
      return
    }

    setIsLoadingStats(true)
    try {
      const allData = await fetchSurveyData()
      const districtData = allData.filter(survey => survey.district === district)
      const amounts = districtData
        .map(survey => survey.amount)
        .filter(amount => amount && amount > 0)
      
      const stats = calculateDistrictStats(amounts)
      setDistrictAverage(stats.average)
    } catch (error) {
      console.error('載入地區統計失敗:', error)
      setDistrictAverage(50) // 容錯：使用預設值
    } finally {
      setIsLoadingStats(false)
    }
  }

  // 意頭分析邏輯
  const analyzeLuckiness = (amount: number) => {
    const amountStr = amount.toString()
    
    // 檢查是否有 8
    if (amountStr.includes('8')) {
      return {
        type: 'lucky',
        icon: '🎉',
        title: '發發發！',
        message: '好意頭！金額有「8」字，寓意發財！',
        color: 'text-yellow-300',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-400',
      }
    }
    
    // 檢查是否為單數
    if (amount % 2 !== 0) {
      return {
        type: 'warning',
        icon: '⚠️',
        title: '大吉利是！',
        message: '提提你：單數利是喺傳統上較少見，雙數會更好！',
        color: 'text-orange-300',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-400',
      }
    }
    
    // 一般情況
    return {
      type: 'normal',
      icon: '✨',
      title: '好意頭！',
      message: '雙數利是，寓意好事成雙！',
      color: 'text-green-300',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400',
    }
  }

  const luckAnalysis = analyzeLuckiness(amount)

  // 計算與地區平均的差異
  const difference = amount - districtAverage
  const percentDiff = districtAverage > 0 
    ? ((difference / districtAverage) * 100).toFixed(0)
    : '0'

  // 生成分享文字
  const generateShareText = () => {
    const text = `
🧧 全港利是行情地圖 2026 🧧

${currentIdentity.emoji} ${currentIdentity.name}
📍 地區：${district}
👤 對象：${relation}
💰 金額：$${amount}

${luckAnalysis.icon} ${luckAnalysis.title}
${luckAnalysis.message}

📊 ${district}同區平均：$${districtAverage}
${difference > 0 ? `高出 ${percentDiff}%！慷慨！` : difference < 0 ? `低過平均 ${Math.abs(parseInt(percentDiff))}%` : '剛好平均！'}

🎊 ${greeting}

#利是行情 #香港利是地圖 #${district}
    `.trim()
    
    return text
  }

  const handleShare = async () => {
    const shareText = generateShareText()
    
    try {
      // 嘗試使用 Clipboard API
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback: 創建 textarea 複製
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-900">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要內容 */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start px-6 py-12">
        {/* 成功標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* 馬到功成徽章 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="relative bg-gradient-to-br from-yellow-400 to-red-500 rounded-full p-6 shadow-2xl border-4 border-yellow-300">
                <span className="text-5xl">🐎</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-yellow-400/40 rounded-full blur-xl"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white shadow-lg"
              >
                <CheckCircle2 size={24} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* 馬到功成標語 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="mb-4 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-500/30 to-red-500/30 backdrop-blur-md border-2 border-yellow-400/60 rounded-full"
          >
            <Award className="text-yellow-400" size={20} />
            <span className="text-yellow-300 font-black text-lg"
                  style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}>
              馬到功成
            </span>
            <span className="text-2xl">🎊</span>
          </motion.div>
          
          <h1 className="text-4xl font-black text-yellow-300 mb-2"
              style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
            多謝你！
          </h1>
          <p className="text-yellow-200/80 text-lg">你嘅利是行情已經記錄咗</p>
          
          {/* 慶祝 confetti */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex justify-center gap-2 text-3xl"
          >
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>🎉</motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>✨</motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>🎊</motion.span>
          </motion.div>
        </motion.div>

        {/* 結果卡 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* 吉祥物資訊 */}
          <div className="bg-gradient-to-br from-red-700/50 to-red-800/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-yellow-500/30 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-yellow-500/20 border-4 border-yellow-400 shadow-lg flex items-center justify-center text-5xl">
                {currentIdentity.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-300 mb-1">
                  {currentIdentity.name}
                </h2>
                <p className="text-yellow-200/70 text-sm">{currentIdentity.description}</p>
              </div>
            </div>

            {/* 基本資訊 */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-yellow-100">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-yellow-300/70">地區</p>
                  <p className="font-semibold">{district}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-yellow-100">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-xs text-yellow-300/70">派畀</p>
                  <p className="font-semibold">{relation}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-yellow-100">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-yellow-300/70">金額</p>
                  <p className="font-bold text-3xl text-yellow-300">${amount}</p>
                </div>
              </div>

              {greeting && (
                <div className="flex items-center gap-3 text-yellow-100">
                  <span className="text-2xl">🎊</span>
                  <div>
                    <p className="text-xs text-yellow-300/70">祝福語</p>
                    <p className="font-semibold">{greeting}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 意頭分析 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-4 ${luckAnalysis.bgColor} border-2 ${luckAnalysis.borderColor} rounded-2xl mb-4`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{luckAnalysis.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${luckAnalysis.color} mb-1`}>
                    {luckAnalysis.title}
                  </h3>
                  <p className="text-yellow-100/90 text-sm leading-relaxed">
                    {luckAnalysis.message}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 平均值比較 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-blue-500/20 border-2 border-blue-400/50 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="text-blue-300 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-300 mb-2">
                    {district} 同區平均
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    {isLoadingStats ? (
                      <span className="inline-block w-20 h-10 bg-blue-500/30 animate-pulse rounded"></span>
                    ) : (
                      <span className="text-3xl font-bold text-blue-200">${districtAverage}</span>
                    )}
                  </div>
                  
                  {difference !== 0 && (
                    <div className="flex items-center gap-2">
                      {difference > 0 ? (
                        <>
                          <span className="text-green-300 font-semibold">↑ 高出 {percentDiff}%</span>
                          <span className="text-sm text-green-200/80">慷慨！</span>
                        </>
                      ) : (
                        <>
                          <span className="text-orange-300 font-semibold">↓ 低過平均 {Math.abs(parseInt(percentDiff))}%</span>
                          <span className="text-sm text-orange-200/80">慳啲啦</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {difference === 0 && (
                    <span className="text-blue-200/80 text-sm">剛好平均！</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 分享按鈕 */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/30 mb-6"
          >
            {copied ? (
              <>
                <Check size={24} />
                已複製到剪貼簿！
              </>
            ) : (
              <>
                <Share2 size={24} />
                分享結果
              </>
            )}
          </motion.button>

          {/* 解鎖地圖按鈕 - 顯著的獎勵 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
            className="mb-6"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2)',
                  '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
                  '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative rounded-2xl overflow-hidden"
            >
              {/* 閃爍背景 */}
              <motion.div
                animate={{ 
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-xl"
              />
              
              <button
                onClick={() => router.push('/map')}
                className="relative w-full flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-black text-xl rounded-2xl hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all shadow-2xl group"
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Unlock size={28} className="drop-shadow-lg" />
                </motion.div>
                
                <div className="text-center">
                  <p className="text-white drop-shadow-lg leading-tight">
                    查看全港利是行情地圖
                  </p>
                  <p className="text-yellow-100 text-sm font-bold drop-shadow-md">
                    (解鎖)
                  </p>
                </div>
                
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Map size={28} className="drop-shadow-lg" />
                </motion.div>

                {/* Shine 效果 */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </button>
            </motion.div>

            {/* 獎勵說明 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-yellow-200/80 text-sm mt-3 font-medium"
            >
              🎁 你已解鎖地圖功能！睇下全港邊區最慷慨！
            </motion.p>
          </motion.div>

          {/* 其他按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col gap-3"
          >
            {/* WhatsApp 分享按鈕 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-2"
            >
              <ShareButtons 
                shareText={`我啱啱填咗香港利是行情地圖！${district} ${relation} 收到 $${amount}！快啲睇下你嗰區行情係點？🧧`}
              />
            </motion.div>

            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-red-900 font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30"
            >
              <Home size={20} />
              返回首頁
            </button>

            <button
              onClick={() => router.push(`/survey?identity=${identityId}`)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-red-800/50 border-2 border-yellow-500/30 text-yellow-300 font-semibold rounded-xl hover:border-yellow-400 transition-all"
            >
              <Sparkles size={20} />
              再填一份問卷
            </button>
          </motion.div>
        </motion.div>

        {/* 底部說明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-yellow-200/50 text-xs px-6"
        >
          * 平均值數據會隨著更多人參與而更新
        </motion.p>
      </main>
    </div>
  )
}
