'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-amber-900">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* 馬匹奔跑區域 */}
        <div className="relative w-full max-w-md h-32 mb-8 overflow-hidden">
          {/* 奔跑軌道 */}
          <motion.div
            animate={{ 
              scaleX: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
            }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
          />

          {/* 奔馳的馬 */}
          <motion.div
            animate={{ 
              x: ['-120%', '120%'],
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-4 flex flex-col items-center"
          >
            {/* 馬 emoji - 帶上下彈跳 */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, -5, 0, 5, 0],
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
              }}
            >
              🐎
            </motion.div>

            {/* 灰塵特效 */}
            <div className="relative -mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0.8, 0.4, 0],
                    x: [-10 + i * 5, -30 + i * 10],
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="absolute w-4 h-4 bg-yellow-500/40 rounded-full blur-sm"
                  style={{ left: `${i * 8}px` }}
                />
              ))}
            </div>
          </motion.div>

          {/* 額外的裝飾馬（較小，較慢） */}
          <motion.div
            animate={{ 
              x: ['-100%', '140%'],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              delay: 1,
            }}
            className="absolute bottom-8 opacity-40"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-5xl"
            >
              🐎
            </motion.div>
          </motion.div>
        </div>

        {/* Loading 文字 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-black text-yellow-300 mb-4"
              style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
            馬不停蹄為你計算行情...
          </h2>

          {/* Loading 點點動畫 */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-yellow-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* 底部裝飾 */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-8 flex gap-4 text-3xl"
        >
          <span>🧧</span>
          <span>💰</span>
          <span>🎊</span>
        </motion.div>

        {/* 進度條效果 */}
        <div className="mt-8 w-full max-w-xs h-2 bg-red-800/30 rounded-full overflow-hidden">
          <motion.div
            animate={{ 
              x: ['-100%', '100%'],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
