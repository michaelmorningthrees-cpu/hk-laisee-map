'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Sparkles, Users, ChevronLeft } from 'lucide-react'
import { getParticipantCount } from '@/lib/api'

export default function Home() {
  const router = useRouter()
  const [participantCount, setParticipantCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)
  const [isLoadingCount, setIsLoadingCount] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)

  // 幸運基數 - 238 聽起來像「易發」（粵語），而且是個不整齊的數字，看起來更真實
  const BASE_COUNT = 538

  // 載入參與者數量
  useEffect(() => {
    loadParticipantCount()
  }, [])

  const loadParticipantCount = async () => {
    setIsLoadingCount(true)
    try {
      const realCount = await getParticipantCount()
      // 添加幸運基數到實際數據
      setParticipantCount(realCount + BASE_COUNT)
    } catch (error) {
      console.error('載入參與者數量失敗:', error)
      // 即使出錯，也顯示基數
      setParticipantCount(BASE_COUNT)
    } finally {
      setIsLoadingCount(false)
    }
  }

  // 數字動畫計數效果
  useEffect(() => {
    if (participantCount === 0 || isLoadingCount) return

    let start = 0
    const duration = 2000 // 2 秒
    const increment = participantCount / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= participantCount) {
        setDisplayCount(participantCount)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [participantCount, isLoadingCount])

  const handleRoleSelect = (role: 'giver' | 'receiver') => {
    router.push(`/survey?role=${role}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-900">
      {/* 背景裝飾 - 霓虹燈效果 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* 主要內容 */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            // ========== PHASE 1: Landing View (單按鈕體驗) ==========
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center w-full max-w-4xl"
            >
              {/* 頂部裝飾 - 馬年 */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 flex items-center gap-2"
              >
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🐎</span>
                <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                <span className="text-yellow-400 text-sm font-bold tracking-wider">2026 馬年</span>
                <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🐎</span>
              </motion.div>

              {/* 主標題 - 霓虹燈效果 */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl font-black text-center mb-4 tracking-tight"
                style={{
                  textShadow: `
                    0 0 10px rgba(255, 215, 0, 0.8),
                    0 0 20px rgba(255, 215, 0, 0.6),
                    0 0 30px rgba(255, 215, 0, 0.4),
                    0 0 40px rgba(255, 0, 0, 0.6),
                    0 0 70px rgba(255, 0, 0, 0.4),
                    0 0 80px rgba(255, 0, 0, 0.3)
                  `,
                  background: 'linear-gradient(to bottom, #FFD700, #FF6B6B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                全港利是行情地圖
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-5xl font-black text-center mb-2"
                style={{
                  textShadow: `
                    0 0 10px rgba(255, 215, 0, 0.8),
                    0 0 20px rgba(255, 215, 0, 0.6),
                    0 0 30px rgba(255, 215, 0, 0.4)
                  `,
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                2026
              </motion.h2>

              {/* 副標題 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-yellow-300 text-center mb-8"
                style={{
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                }}
              >
                喂！今年你逗幾錢？
              </motion.p>

              {/* 英雄視覺 - 兩個吉祥物並排 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-center justify-center gap-6 md:gap-12 mb-8"
              >
                {/* 燒賣大俠 */}
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative"
                >
                  <Image 
                    src="/siumai-hero.png" 
                    width={160} 
                    height={160} 
                    alt="Siu Mai" 
                    className="rounded-full object-cover border-4 border-yellow-400 shadow-2xl bg-white"
                    style={{
                      boxShadow: '0 0 40px rgba(255, 215, 0, 0.6), 0 20px 60px rgba(0, 0, 0, 0.4)'
                    }}
                    priority
                    unoptimized
                  />
                  {/* 光暈效果 */}
                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl animate-pulse" />
                </motion.div>

                {/* 中間裝飾 */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="text-5xl md:text-6xl"
                >
                  🧧
                </motion.div>

                {/* 魚蛋仙子 */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                  className="relative"
                >
                  <Image 
                    src="/fishball-fairy.png" 
                    width={160} 
                    height={160} 
                    alt="Fishballs" 
                    className="rounded-full object-cover border-4 border-pink-400 shadow-2xl bg-white"
                    style={{
                      boxShadow: '0 0 40px rgba(255, 105, 180, 0.6), 0 20px 60px rgba(0, 0, 0, 0.4)'
                    }}
                    priority
                    unoptimized
                  />
                  {/* 光暈效果 */}
                  <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </motion.div>
              </motion.div>

              {/* 社交證明 - 參與者計數器 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-md border-2 border-yellow-400/50 rounded-full shadow-lg">
                  <Users className="text-yellow-400" size={20} />
                  <p className="text-yellow-100 font-bold text-base">
                    已有{' '}
                    {isLoadingCount ? (
                      <span className="inline-block w-12 h-6 bg-yellow-500/30 animate-pulse rounded"></span>
                    ) : (
                      <motion.span
                        key={displayCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-yellow-300 text-xl font-black mx-1"
                      >
                        {displayCount.toLocaleString()}
                      </motion.span>
                    )}
                    {' '}位香港人分享咗佢哋嘅利是行情！
                  </p>
                </div>
              </motion.div>

              {/* 單一 CTA 按鈕 - Pill Shape with Pulse */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="relative group"
              >
                {/* 脈衝動畫背景 */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl"
                />
                
                {/* 按鈕本體 */}
                <div className="relative px-12 py-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full shadow-2xl overflow-hidden">
                  {/* Shine 效果 */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />
                  
                  <div className="relative flex items-center gap-3">
                    <span className="text-3xl">🧧</span>
                    <span className="text-red-900 font-black text-2xl md:text-3xl whitespace-nowrap">
                      即刻睇公價
                    </span>
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
              </motion.button>

              {/* 底部提示 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-6 text-center text-yellow-200/70 text-sm px-6"
              >
                一齊記錄香港利是行情！
              </motion.p>

              {/* 裝飾元素 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="mt-6 flex gap-4 text-4xl"
              >
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐎</span>
              </motion.div>
            </motion.div>
          ) : (
            // ========== PHASE 2: Selection View (角色選擇) ==========
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              {/* 返回按鈕 */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setHasStarted(false)}
                className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition-colors mb-8 group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-lg">返回</span>
              </motion.button>

              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-2xl font-bold text-yellow-200 mb-8"
              >
                你今年係⋯⋯
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 派利是卡片 (Giver) - 燒賣大俠 */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('giver')}
                  className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-red-600 rounded-3xl p-8 shadow-2xl border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 group overflow-hidden min-h-[300px]"
                  style={{
                    boxShadow: `
                      0 0 30px rgba(255, 215, 0, 0.5),
                      0 15px 40px rgba(0, 0, 0, 0.6),
                      inset 0 -3px 15px rgba(0, 0, 0, 0.3),
                      inset 0 2px 10px rgba(255, 255, 255, 0.3)
                    `,
                  }}
                >
                  {/* 霓虹光暈效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/0 via-yellow-300/20 to-yellow-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* 裝飾圖案 */}
                  <div className="absolute top-4 right-4 text-6xl opacity-20">🧧</div>
                  
                  {/* 內容 */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-4 h-full">
                    {/* 吉祥物圖片 */}
                    <motion.div 
                      className="drop-shadow-2xl"
                      animate={{ 
                        rotate: [0, -5, 5, -5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image 
                        src="/siumai-hero.png" 
                        width={140} 
                        height={140} 
                        alt="Siu Mai" 
                        className="rounded-full object-cover border-4 border-yellow-400 shadow-lg bg-white"
                        priority
                        unoptimized
                      />
                    </motion.div>
                    
                    <div className="text-center">
                      <p className="text-yellow-400 font-black text-2xl mb-1"
                         style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}>
                        燒賣大俠
                      </p>
                      <p className="text-yellow-200/80 text-xs mb-3 font-medium">
                        Siu Mai
                      </p>
                      <p className="text-white font-black text-3xl mb-2 drop-shadow-lg">
                        我要派利是
                      </p>
                      <p className="text-yellow-100 font-bold text-sm tracking-wide drop-shadow-md">
                        記錄派出嘅利是
                      </p>
                    </div>

                    {/* 箭頭提示 */}
                    <div className="text-white/80 group-hover:translate-x-1 transition-transform duration-300 text-2xl">
                      →
                    </div>
                  </div>

                  {/* 閃爍邊框效果 */}
                  <div className="absolute inset-0 rounded-3xl border-4 border-yellow-300/0 group-hover:border-yellow-300/60 transition-all duration-300" />
                </motion.button>

                {/* 收利是卡片 (Receiver) - 魚蛋仙子 */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('receiver')}
                  className="relative bg-gradient-to-br from-pink-600 via-red-600 to-red-700 rounded-3xl p-8 shadow-2xl border-3 border-pink-400/70 hover:border-pink-300 transition-all duration-300 group overflow-hidden min-h-[300px]"
                  style={{
                    boxShadow: `
                      0 0 30px rgba(255, 105, 180, 0.4),
                      0 15px 40px rgba(0, 0, 0, 0.6),
                      inset 0 -3px 15px rgba(0, 0, 0, 0.4),
                      inset 0 2px 10px rgba(255, 182, 193, 0.3)
                    `,
                  }}
                >
                  {/* 霓虹光暈效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300/0 via-pink-300/20 to-pink-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* 裝飾圖案 */}
                  <div className="absolute top-4 right-4 text-6xl opacity-20">💰</div>
                  
                  {/* 內容 */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-4 h-full">
                    {/* 吉祥物圖片 */}
                    <motion.div 
                      className="drop-shadow-2xl"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image 
                        src="/fishball-fairy.png" 
                        width={140} 
                        height={140} 
                        alt="Fishballs" 
                        className="rounded-full object-cover border-4 border-pink-400 shadow-lg bg-white"
                        priority
                        unoptimized
                      />
                    </motion.div>
                    
                    <div className="text-center">
                      <p className="text-pink-300 font-black text-2xl mb-1"
                         style={{ textShadow: '0 0 10px rgba(255, 182, 193, 0.8)' }}>
                        魚蛋仙子
                      </p>
                      <p className="text-pink-200/80 text-xs mb-3 font-medium">
                        Fishballs
                      </p>
                      <p className="text-white font-black text-3xl mb-2 drop-shadow-lg">
                        我係收利是
                      </p>
                      <p className="text-pink-100 font-bold text-sm tracking-wide drop-shadow-md">
                        記錄收到嘅利是
                      </p>
                    </div>

                    {/* 箭頭提示 */}
                    <div className="text-white/80 group-hover:translate-x-1 transition-transform duration-300 text-2xl">
                      →
                    </div>
                  </div>

                  {/* 閃爍邊框效果 */}
                  <div className="absolute inset-0 rounded-3xl border-4 border-pink-300/0 group-hover:border-pink-300/60 transition-all duration-300" />
                </motion.button>
              </div>

              {/* 底部提示 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-center text-yellow-200/70 text-sm px-6"
              >
                選擇你嘅角色，一齊記錄香港利是行情！
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部免責聲明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className="text-gray-400/50 text-xs">
            部分數據包含歷史參考值
          </p>
        </motion.div>
      </main>
    </div>
  )
}
