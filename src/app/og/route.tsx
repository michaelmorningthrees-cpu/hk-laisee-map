import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const identity = searchParams.get('identity') || 'default'
  const district = searchParams.get('district') || ''
  const amount = searchParams.get('amount') || ''

  try {
    // 根據身份選擇文字和顏色
    let mascotName = '🥟🍡'
    let mascotEmoji = '🧧'
    let borderColor = '#FFD700'
    
    if (identity === 'professional') {
      mascotName = '燒賣大俠'
      mascotEmoji = '🥟'
      borderColor = '#FFD700'
    } else if (identity === 'service') {
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
                  fontSize: '120px',
                  padding: '20px',
                  borderRadius: '50%',
                  border: `8px solid ${borderColor}`,
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
              >
                {mascotEmoji}
              </div>
            </div>

            {/* 吉祥物名稱 */}
            <h2
              style={{
                fontSize: '50px',
                fontWeight: 900,
                color: borderColor,
                textAlign: 'center',
                marginBottom: '30px',
                textShadow: '0 0 40px rgba(255, 215, 0, 0.8)',
              }}
            >
              {mascotName}
            </h2>

            {/* 標題 */}
            <h1
              style={{
                fontSize: '70px',
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
                fontSize: '50px',
                fontWeight: 900,
                color: '#FFD700',
                marginBottom: '30px',
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
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '30px 50px',
                  borderRadius: '20px',
                  border: '3px solid rgba(255, 215, 0, 0.5)',
                }}
              >
                <p
                  style={{
                    fontSize: '35px',
                    fontWeight: 700,
                    color: 'white',
                    margin: 0,
                  }}
                >
                  📍 {district}
                </p>
                <p
                  style={{
                    fontSize: '45px',
                    fontWeight: 900,
                    color: '#FFD700',
                    margin: 0,
                  }}
                >
                  💰 ${amount}
                </p>
              </div>
            )}

            {/* 副標題 */}
            {!district && (
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                  marginTop: '20px',
                }}
              >
                喂！今年你逗幾錢？
              </p>
            )}

            {/* 底部裝飾 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '30px',
              }}
            >
              <span style={{ fontSize: '50px' }}>🧧</span>
              <span style={{ fontSize: '50px' }}>💰</span>
              <span style={{ fontSize: '50px' }}>🎊</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
