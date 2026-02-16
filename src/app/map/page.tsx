'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Home, Filter, X, TrendingUp, Users, Database, Info, BarChart3, TrendingDown } from 'lucide-react'
import { HK_DISTRICTS, AGE_GROUPS, RELATIONS, ROLES } from '@/lib/constants'
import { fetchSurveyData, calculateStatistics, FetchSurveyDataError } from '@/lib/api'
import { calculateDistrictStats } from '@/lib/stats'
import type { SurveyData } from '@/lib/types'
import type { DistrictStats } from '@/lib/stats'
import ShareButtons from '@/components/ShareButtons'

export default function MapPage() {
  const router = useRouter()

  // 狀態管理
  const [surveyData, setSurveyData] = useState<SurveyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  // 過濾器狀態
  const [filters, setFilters] = useState({
    role: 'all',
    age_group: 'all',
    relation: 'all',
  })

  // 載入數據
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchSurveyData()
      setSurveyData(data)
      
      if (data.length > 0) {
        console.log(`✅ 成功載入 ${data.length} 筆真實數據`)
      } else {
        console.warn('⚠️ 目前沒有數據')
      }
    } catch (err) {
      console.error('載入數據時發生錯誤:', err)
      setError('載入數據時發生錯誤，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 應用過濾器
  const filteredData = surveyData.filter(survey => {
    if (filters.role !== 'all' && survey.role !== filters.role) return false
    if (filters.age_group !== 'all' && survey.age_group !== filters.age_group) return false
    if (filters.relation !== 'all' && survey.relation !== filters.relation) return false
    return true
  })

  // 計算每個地區的統計數據
  const getDistrictStats = (district: string): DistrictStats => {
    const districtData = filteredData.filter(survey => survey.district === district)
    const amounts = districtData
      .map(survey => survey.amount)
      .filter(amount => amount && amount > 0)
    
    return calculateDistrictStats(amounts)
  }

  // 根據金額返回熱力圖樣式（使用邊框、文字顏色和徽章）
  const getHeatmapStyle = (average: number) => {
    if (average === 0) {
      return {
        cardBg: 'bg-[#FFF9F0]',
        border: 'border border-gray-300',
        amountColor: 'text-gray-400',
        badge: { bg: 'bg-gray-100', text: 'text-gray-500', label: '未有數據', emoji: '' },
        opacity: 'opacity-60',
      }
    } else if (average < 50) {
      // 低 (<$50): 灰色邊框，亮紅色文字
      return {
        cardBg: 'bg-[#FFF9F0]',
        border: 'border border-gray-300',
        amountColor: 'text-[#D92525]',
        badge: { bg: 'bg-red-50', text: 'text-red-700', label: '一般', emoji: '' },
        opacity: '',
      }
    } else if (average >= 50 && average <= 100) {
      // 中 ($50-$100): 紅色邊框，亮紅色文字
      return {
        cardBg: 'bg-[#FFF9F0]',
        border: 'border-2 border-red-500',
        amountColor: 'text-[#D92525]',
        badge: { bg: 'bg-red-100', text: 'text-red-700', label: '熱', emoji: '🔥' },
        opacity: '',
      }
    } else {
      // 高 (>$100): 金色邊框，亮紅色文字
      return {
        cardBg: 'bg-[#FFF9F0]',
        border: 'border-2 border-yellow-500',
        amountColor: 'text-[#D92525]',
        badge: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '豪', emoji: '💰' },
        opacity: '',
      }
    }
  }

  // 香港地區分組
  const DISTRICT_GROUPS = {
    hongKong: {
      name: '港島 Hong Kong Island',
      districts: ['中西區', '灣仔', '東區', '南區'],
    },
    kowloon: {
      name: '九龍 Kowloon',
      districts: ['油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘'],
    },
    newTerritories: {
      name: '新界 New Territories',
      districts: ['葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島'],
    },
  }

  // 重置過濾器
  const resetFilters = () => {
    setFilters({
      role: 'all',
      age_group: 'all',
      relation: 'all',
    })
  }

  // 格式化貨幣
  const formatCurrency = (amount: number) => {
    return `HK$${amount.toLocaleString('en-HK')}`
  }

  const totalRecords = filteredData.length

  // 載入骨架屏組件
  const DistrictSkeleton = () => (
    <div className="bg-gray-700/30 backdrop-blur-sm border-2 border-gray-500/30 rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-gray-600/50 rounded w-3/4 mx-auto mb-3"></div>
      <div className="h-8 bg-gray-600/50 rounded w-1/2 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-600/50 rounded w-2/3 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-600/50 rounded w-1/2 mx-auto"></div>
    </div>
  )

  // 獲取選中地區的詳細統計
  const selectedDistrictStats = selectedDistrict ? getDistrictStats(selectedDistrict) : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-900">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      {/* 地區詳情模態框 */}
      <AnimatePresence>
        {selectedDistrict && selectedDistrictStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedDistrict(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-red-800 via-red-700 to-red-900 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] md:max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-yellow-500/50 relative"
            >
              {/* 裝飾性背景 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]"></div>

              {/* 關閉按鈕 - 移動端優化 */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring',
                  delay: 0.2,
                  damping: 15,
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDistrict(null)}
                className="absolute right-4 top-4 rounded-full bg-white/90 backdrop-blur-sm p-3 text-gray-700 hover:bg-white shadow-xl z-50 border border-gray-200"
              >
                <X size={24} className="md:w-6 md:h-6" />
              </motion.button>

              {/* 內容 */}
              <div className="relative z-10">
                {/* 標題 */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: 'spring',
                    delay: 0.1,
                    damping: 20,
                  }}
                  className="text-center mb-6 md:mb-8 pr-16 md:pr-0"
                >
                  <h2 className="text-3xl md:text-4xl font-black text-yellow-300 mb-2"
                      style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
                    {selectedDistrict} 行情
                  </h2>
                  <p className="text-sm md:text-base text-yellow-200/80 flex items-center justify-center gap-2">
                    <Users size={16} />
                    基於 {selectedDistrictStats.count} 筆記錄
                  </p>
                </motion.div>

                {/* 關鍵統計 - 左右佈局 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: 'spring',
                    delay: 0.2,
                    damping: 20,
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8"
                >
                  {/* 左側：平均數 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: 'spring',
                      delay: 0.3,
                      damping: 20,
                    }}
                    className="bg-red-900/40 backdrop-blur-md rounded-2xl p-5 md:p-6 border-2 border-red-500/50 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <TrendingDown size={18} className="text-red-300" />
                      <h3 className="text-base md:text-lg font-bold text-red-200">平均數</h3>
                    </div>
                    <p className="text-4xl md:text-5xl font-black text-red-100 mb-3">
                      {formatCurrency(selectedDistrictStats.average)}
                    </p>
                    <div className="inline-block px-3 py-1 bg-red-800/50 rounded-full">
                      <p className="text-xs text-red-300 font-semibold">拉上補下</p>
                    </div>
                  </motion.div>

                  {/* 右側：中位數（突出顯示） */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: 'spring',
                      delay: 0.4,
                      damping: 20,
                    }}
                    className="bg-gradient-to-br from-yellow-600/60 to-orange-600/60 backdrop-blur-md rounded-2xl p-5 md:p-6 border-2 border-yellow-400/80 text-center relative overflow-hidden shadow-xl shadow-yellow-500/30"
                  >
                    {/* 閃光效果 */}
                    <motion.div
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-yellow-400/20 rounded-2xl"
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <TrendingUp size={18} className="text-yellow-200" />
                        <h3 className="text-base md:text-lg font-bold text-yellow-100">中位數</h3>
                      </div>
                      <p className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                        {formatCurrency(selectedDistrictStats.median)}
                      </p>
                      <div className="inline-block px-3 py-1 bg-yellow-500/80 rounded-full">
                        <p className="text-xs text-red-900 font-black">真實行情 ⭐</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 額外統計 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: 'spring',
                    delay: 0.5,
                    damping: 20,
                  }}
                  className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-red-900/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-yellow-500/30 text-center"
                  >
                    <p className="text-yellow-200/70 text-xs mb-1">最低</p>
                    <p className="text-yellow-300 text-lg md:text-xl font-bold">
                      {formatCurrency(selectedDistrictStats.min)}
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-red-900/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-yellow-500/30 text-center"
                  >
                    <p className="text-yellow-200/70 text-xs mb-1">最高</p>
                    <p className="text-yellow-300 text-lg md:text-xl font-bold">
                      {formatCurrency(selectedDistrictStats.max)}
                    </p>
                  </motion.div>
                </motion.div>

                {/* 解釋文字 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: 'spring',
                    delay: 0.6,
                    damping: 20,
                  }}
                  className="bg-blue-900/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 mb-4 md:mb-6"
                >
                  <div className="flex items-start gap-3">
                    <Info size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-200 font-semibold mb-1 text-sm">為什麼中位數更準確？</h4>
                      <p className="text-blue-200/80 text-xs leading-relaxed">
                        中位數更能反映大部分人的利是水平，不受極端豪客影響。例如：如果有人派 $10,000，會拉高平均數，但中位數不受影響，更貼近真實情況。
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* 關閉按鈕 */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    delay: 0.7,
                    damping: 15,
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDistrict(null)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black text-base md:text-lg rounded-xl transition-all shadow-lg"
                >
                  <Home size={20} />
                  返回地圖
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要內容 */}
      <main className="relative z-10 min-h-screen pb-20">
        {/* 頂部導航 - 深色主題 */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-red-950/80 border-b border-yellow-500/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition-colors font-semibold"
            >
              <Home size={20} />
              <span>返回首頁</span>
            </button>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all disabled:opacity-50"
            >
              <Database size={16} />
              <span className="text-sm font-semibold">{isLoading ? '載入中...' : '重新載入'}</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          {/* 標題 - 金黃色主題 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-2"
                style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
              全港利是行情地圖
            </h1>
            <p className="text-yellow-200/80 text-lg">
              根據 <span className="font-bold text-yellow-300">{totalRecords}</span> 筆記錄
            </p>
          </motion.div>

          {/* 過濾器欄 - 白色玻璃態 + Sticky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-20 z-40 max-w-6xl mx-auto mb-8"
          >
            <div 
              className="backdrop-blur-xl bg-white/90 border-2 border-yellow-500/40 rounded-2xl p-6 shadow-2xl"
              style={{
                boxShadow: '0 10px 40px 0 rgba(255, 215, 0, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Filter className="text-[#D92525]" size={24} />
                <h2 className="text-xl font-bold text-gray-800">篩選條件</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 角色過濾 */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    角色
                  </label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 font-semibold focus:border-[#D92525] focus:outline-none focus:ring-2 focus:ring-[#D92525]/20 transition-all hover:border-gray-400"
                  >
                    <option value="all">全部</option>
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 年齡組別過濾 */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    年齡組別
                  </label>
                  <select
                    value={filters.age_group}
                    onChange={(e) => setFilters({ ...filters, age_group: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 font-semibold focus:border-[#D92525] focus:outline-none focus:ring-2 focus:ring-[#D92525]/20 transition-all hover:border-gray-400"
                  >
                    <option value="all">全部</option>
                    {AGE_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 關係過濾 */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    對象
                  </label>
                  <select
                    value={filters.relation}
                    onChange={(e) => setFilters({ ...filters, relation: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 font-semibold focus:border-[#D92525] focus:outline-none focus:ring-2 focus:ring-[#D92525]/20 transition-all hover:border-gray-400"
                  >
                    <option value="all">全部</option>
                    {RELATIONS.map((relation) => (
                      <option key={relation} value={relation}>
                        {relation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 重置按鈕 */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D92525] hover:bg-[#B91C1C] border-2 border-[#D92525] text-white rounded-lg transition-all font-bold shadow-sm hover:shadow-md"
                  >
                    <X size={16} />
                    重置
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 載入中骨架屏 */}
          {isLoading && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-8 mb-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
                <p className="text-yellow-300 font-semibold">載入數據中...</p>
              </div>

              {/* 骨架屏網格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 18 }).map((_, index) => (
                  <DistrictSkeleton key={index} />
                ))}
              </div>
            </div>
          )}

          {/* 錯誤狀態 */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400 rounded-xl p-6 text-center">
                <p className="text-red-200 text-lg mb-4">{error}</p>
                <button
                  onClick={loadData}
                  className="px-6 py-2 bg-yellow-500 text-red-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
                >
                  重試
                </button>
              </div>
            </div>
          )}

          {/* 地圖網格 */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-7xl mx-auto"
            >
              {/* 圖例 */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FFF9F0] border border-gray-300 rounded shadow-sm"></div>
                  <span className="text-yellow-100 text-sm font-semibold">一般 (&lt;$50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FFF9F0] border-2 border-red-500 rounded shadow-sm"></div>
                  <span className="text-yellow-100 text-sm font-semibold">熱 ($50-100) 🔥</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FFF9F0] border-2 border-yellow-500 rounded shadow-sm"></div>
                  <span className="text-yellow-100 text-sm font-semibold">豪 (&gt;$100) 💰</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FFF9F0] border border-gray-300 rounded shadow-sm opacity-60"></div>
                  <span className="text-yellow-100/70 text-sm font-semibold">未有數據</span>
                </div>
              </div>

              {/* 提示：點擊查看詳情 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: 'spring',
                  damping: 20,
                }}
                className="text-center mb-8"
              >
                <motion.p 
                  className="text-yellow-300 text-base font-bold flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-flex border border-yellow-500/30"
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Info size={18} />
                  </motion.span>
                  點擊地區卡片查看詳細統計
                </motion.p>
              </motion.div>

              {/* 地區分組顯示 */}
              <div className="space-y-12">
                {Object.entries(DISTRICT_GROUPS).map(([groupKey, group], groupIndex) => (
                  <motion.div
                    key={groupKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + groupIndex * 0.1 }}
                  >
                    {/* 區域標題 - 金色/黃色主題 */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-[#FFD700] rounded-full shadow-lg"
                             style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}></div>
                        <h3 className="text-3xl md:text-4xl font-black text-[#FFD700]"
                            style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)' }}>
                          {group.name}
                        </h3>
                      </div>
                    </div>

                    {/* 該區域的地區卡片 */}
                    <motion.div 
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.1,
                          }
                        }
                      }}
                    >
                      {group.districts.map((district, index) => {
                        const stats = getDistrictStats(district)
                        const style = getHeatmapStyle(stats.average)

                        return (
                          <motion.button
                            key={district}
                            variants={{
                              hidden: { 
                                opacity: 0, 
                                scale: 0.9,
                                y: 20,
                              },
                              show: { 
                                opacity: 1, 
                                scale: 1,
                                y: 0,
                                transition: {
                                  type: 'spring',
                                  damping: 20,
                                  stiffness: 300,
                                }
                              }
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -6,
                              transition: { 
                                type: 'spring',
                                damping: 15,
                                stiffness: 400,
                              }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDistrict(district)}
                            className={`bg-[#FFF9F0] ${style.opacity} ${style.border} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl shadow-md relative group overflow-hidden`}
                          >
                            {/* 懸停光效 */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            />
                            
                            {/* 地區名稱 - 深灰色 */}
                            <h3 className="text-gray-700 font-medium text-sm mb-4 text-center relative z-10">
                              {district}
                            </h3>
                            
                            {/* 金額顯示 - 亮紅色粗體 */}
                            <div className="text-center relative z-10 mb-4">
                              {stats.average > 0 ? (
                                <p className="text-[#D92525] text-3xl font-bold">
                                  ${stats.average}
                                </p>
                              ) : (
                                <p className="text-gray-400 text-2xl font-semibold">
                                  --
                                </p>
                              )}
                            </div>

                            {/* Badge - 居中 */}
                            {stats.average > 0 && (
                              <div className="flex justify-center relative z-10 mb-3">
                                <span className={`${style.badge.bg} ${style.badge.text} px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm`}>
                                  {style.badge.emoji && <span className="text-sm">{style.badge.emoji}</span>}
                                  {style.badge.label}
                                </span>
                              </div>
                            )}

                            {/* 記錄數量 - 中灰色 */}
                            {stats.count > 0 && (
                              <div className="text-center relative z-10">
                                <span className="text-gray-500 text-xs font-medium">
                                  {stats.count} 筆記錄
                                </span>
                              </div>
                            )}

                            {/* 懸停提示 - 桌面版可見 */}
                            {stats.average > 0 && (
                              <motion.div 
                                className="mt-3 hidden md:flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 absolute bottom-2 left-0 right-0"
                                initial={{ y: 10 }}
                                whileHover={{ y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <BarChart3 size={12} className="text-gray-400" />
                                <span className="text-gray-400 text-xs font-semibold">
                                  詳情
                                </span>
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 底部整體統計 */}
          {!isLoading && !error && totalRecords > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-5xl mx-auto mt-16 mb-12"
            >
              <div className="mb-6 text-center">
                <h3 className="text-3xl font-black text-yellow-300 mb-2"
                    style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
                  📊 整體統計
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-transparent rounded-full mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 總記錄數 */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-400 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Users className="text-blue-500" size={24} />
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">總記錄數</p>
                  </div>
                  <p className="text-blue-600 text-5xl font-black text-center">{totalRecords}</p>
                  <p className="text-gray-500 text-xs text-center mt-2">筆資料</p>
                </motion.div>

                {/* 全港平均 */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-400 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <TrendingUp className="text-red-500" size={24} />
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">全港平均</p>
                  </div>
                  <p className="text-red-600 text-5xl font-black text-center">
                    ${calculateStatistics(filteredData).averageAmount}
                  </p>
                  <p className="text-gray-500 text-xs text-center mt-2">平均金額</p>
                </motion.div>

                {/* 中位數 */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-yellow-50 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-500 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
                >
                  {/* 特別強調背景 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <BarChart3 className="text-yellow-600" size={24} />
                      <p className="text-gray-700 text-sm font-bold uppercase tracking-wide">中位數 ⭐</p>
                    </div>
                    <p className="text-yellow-700 text-5xl font-black text-center">
                      ${calculateStatistics(filteredData).medianAmount}
                    </p>
                    <p className="text-gray-600 text-xs text-center mt-2 font-semibold">真實行情</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 分享按鈕區塊 */}
          {!isLoading && !error && totalRecords > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="max-w-2xl mx-auto mt-12 mb-16 px-4"
            >
              <div className="mb-4 text-center">
                <h3 className="text-2xl font-black text-yellow-300 mb-2"
                    style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
                  📱 分享俾朋友
                </h3>
                <p className="text-yellow-200/70 text-sm">睇完行情，即刻 share 出去！</p>
              </div>
              <ShareButtons shareText="喂！原來我呢區利是公價係咁多... 快啲睇下你嗰區！👇" />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
