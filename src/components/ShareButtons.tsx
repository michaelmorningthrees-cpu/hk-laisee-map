'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Check } from 'lucide-react'

const SITE_URL = 'https://hk-laisee-map.vercel.app/'

interface ShareButtonsProps {
  shareText?: string
  shareUrl?: string
}

export default function ShareButtons({ 
  shareText = '喂！我啱啱填咗香港利是行情地圖 🧧 睇下你嗰區公價係幾多？ 👇',
  shareUrl
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = shareUrl || SITE_URL

  // 分享（優先使用 Native Share API）
  const handleShare = async () => {
    const fullText = `${shareText}\n${url}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '香港利是行情地圖 2026',
          text: shareText,
          url: url,
        })
        return
      } catch (err) {
        console.log('Native share cancelled or failed:', err)
      }
    }

    // Fallback: WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank')
  }

  // 複製連結
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* WhatsApp 分享按鈕 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        分享到 WhatsApp
      </motion.button>

      {/* 複製連結按鈕 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyLink}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        {copied ? (
          <>
            <Check size={24} />
            已複製
          </>
        ) : (
          <>
            <Share2 size={24} />
            複製連結
          </>
        )}
      </motion.button>
    </div>
  )
}
