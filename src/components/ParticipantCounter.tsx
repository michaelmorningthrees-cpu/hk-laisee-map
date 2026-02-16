'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp } from 'lucide-react'
import { getParticipantCount } from '@/lib/api'

/**
 * 參與者計數器組件
 * 顯示問卷參與總人數
 */
export default function ParticipantCounter() {
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCount()
  }, [])

  const loadCount = async () => {
    setIsLoading(true)
    try {
      const totalCount = await getParticipantCount()
      setCount(totalCount)
    } catch (error) {
      console.error('載入參與者數量失敗:', error)
      setCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  // 數字動畫計數
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (count === 0) return

    let start = 0
    const duration = 1000 // 1 秒
    const increment = count / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= count) {
        setDisplayCount(count)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [count])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-md border-2 border-yellow-400/50 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/30 rounded-full">
        <Users className="text-yellow-300" size={24} />
      </div>

      <div>
        <p className="text-yellow-200/80 text-sm font-semibold">參與人數</p>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 bg-yellow-500/30 animate-pulse rounded"></div>
          </div>
        ) : (
          <motion.p
            key={displayCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-yellow-300 text-3xl font-black"
          >
            {displayCount.toLocaleString()}
          </motion.p>
        )}
      </div>

      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <TrendingUp className="text-green-400" size={20} />
        </motion.div>
      )}
    </motion.div>
  )
}
