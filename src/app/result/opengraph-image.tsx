import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '香港利是行情地圖 2026 - 結果'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: {
  params: any
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 從 URL 參數獲取資訊
  const identity = (searchParams.identity as string) || 'professional'
  const district = (searchParams.district as string) || ''
  const amount = (searchParams.amount as string) || ''

  // 根據身份選擇文字和顏色
  let mascotName = '燒賣大俠'
  let mascotEmoji = '🥟'
  let borderColor = '#FFD700'
  
  if (identity === 'service') {
    mascotName = '魚蛋仙子'
    mascotEmoji = '🍡'
    borderColor = '#FF69B4'
  }

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
              marginBottom: '30px',
              textShadow: `0 0 40px ${borderColor === '#FFD700' ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 105, 180, 0.8)'}`,
            }}
          >
            {mascotName}
          </h2>

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
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            香港利是行情地圖
          </h1>

          {/* 年份 */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#FFD700',
              marginBottom: '35px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <span style={{ fontSize: '40px' }}>🐎</span>
            <span>2026</span>
            <span style={{ fontSize: '40px' }}>🐎</span>
          </div>

          {/* 動態內容：地區和金額 */}
          {district && amount && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '35px 60px',
                borderRadius: '25px',
                border: '4px solid rgba(255, 215, 0, 0.6)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <p
                style={{
                  fontSize: '38px',
                  fontWeight: 700,
                  color: 'white',
                  margin: 0,
                }}
              >
                📍 {district}
              </p>
              <p
                style={{
                  fontSize: '52px',
                  fontWeight: 900,
                  color: '#FFD700',
                  margin: 0,
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                }}
              >
                💰 ${amount}
              </p>
            </div>
          )}

          {/* 副標題（如果沒有具體資料） */}
          {!district && (
            <p
              style={{
                fontSize: '42px',
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              多謝你嘅參與！🎊
            </p>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
