import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '香港利是行情地圖 2026 - 填寫問卷'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: {
  params: any
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 從 URL 參數獲取角色資訊
  const role = (searchParams.role as string) || 'giver'
  
  // 根據角色選擇吉祥物
  const isGiver = role === 'giver'
  const mascotName = isGiver ? '燒賣大俠' : '魚蛋仙子'
  const mascotEmoji = isGiver ? '🥟' : '🍡'
  const borderColor = isGiver ? '#FFD700' : '#FF69B4'
  const roleText = isGiver ? '派利是' : '收利是'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%)',
          position: 'relative',
        }}
      >
        {/* 背景裝飾圓圈 */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.15)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 105, 180, 0.15)',
            filter: 'blur(80px)',
          }}
        />

        {/* 主要內容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* 吉祥物 Emoji */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '140px',
                padding: '30px',
                borderRadius: '50%',
                border: `10px solid ${borderColor}`,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              {mascotEmoji}
            </div>
          </div>

          {/* 吉祥物名稱 */}
          <h2
            style={{
              fontSize: '55px',
              fontWeight: 900,
              color: borderColor,
              textAlign: 'center',
              marginBottom: '20px',
              textShadow: `0 0 40px ${borderColor === '#FFD700' ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 105, 180, 0.8)'}`,
            }}
          >
            {mascotName}
          </h2>

          {/* 角色說明 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '35px',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px 40px',
              borderRadius: '20px',
              border: `3px solid ${borderColor}`,
            }}
          >
            <p
              style={{
                fontSize: '40px',
                fontWeight: 900,
                color: 'white',
                margin: 0,
              }}
            >
              我要{roleText}
            </p>
          </div>

          {/* 標題 */}
          <h1
            style={{
              fontSize: '65px',
              fontWeight: 900,
              background: 'linear-gradient(to bottom, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              marginBottom: '15px',
              lineHeight: 1.2,
            }}
          >
            香港利是行情地圖
          </h1>

          {/* 年份 */}
          <div
            style={{
              fontSize: '45px',
              fontWeight: 900,
              color: '#FFD700',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '38px' }}>🐎</span>
            <span>2026</span>
            <span style={{ fontSize: '38px' }}>🐎</span>
          </div>

          {/* 行動呼籲 */}
          <p
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              marginTop: '10px',
            }}
          >
            一齊記錄香港利是行情！🧧
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
