import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #DC143C 0%, #B22222 50%, #8B0000 100%)',
          position: 'relative',
        }}
      >
        {/* 背景裝飾光暈 */}
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.2)',
            filter: 'blur(30px)',
          }}
        />
        
        {/* 馬 Emoji */}
        <div
          style={{
            fontSize: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        >
          🐎
        </div>
        
        {/* 裝飾元素 */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🧧</span>
          <span style={{ fontSize: '20px' }}>✨</span>
          <span style={{ fontSize: '20px' }}>🧧</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
