import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '香港利是行情地圖 2026'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          {/* 頂部裝飾 - 兩個吉祥物 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            {/* 燒賣大俠 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '100px',
                  padding: '20px',
                  borderRadius: '50%',
                  border: '8px solid #FFD700',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                }}
              >
                🥟
              </div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFD700' }}>
                燒賣大俠
              </span>
            </div>

            <span style={{ fontSize: '60px' }}>🧧</span>

            {/* 魚蛋仙子 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '100px',
                  padding: '20px',
                  borderRadius: '50%',
                  border: '8px solid #FF69B4',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                }}
              >
                🍡
              </div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#FF69B4' }}>
                魚蛋仙子
              </span>
            </div>
          </div>

          {/* 標題 */}
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              background: 'linear-gradient(to bottom, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              marginBottom: '20px',
              textShadow: '0 0 40px rgba(255, 215, 0, 0.8)',
              lineHeight: 1.2,
            }}
          >
            香港利是行情地圖
          </h1>

          {/* 年份 */}
          <div
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#FFD700',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <span style={{ fontSize: '50px' }}>🐎</span>
            <span>2026</span>
            <span style={{ fontSize: '50px' }}>🐎</span>
          </div>

          {/* 副標題 */}
          <p
            style={{
              fontSize: '45px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            喂！今年你逗幾錢？
          </p>

          {/* 底部裝飾 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            <span style={{ fontSize: '60px' }}>💰</span>
            <span style={{ fontSize: '60px' }}>🎊</span>
            <span style={{ fontSize: '60px' }}>✨</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
