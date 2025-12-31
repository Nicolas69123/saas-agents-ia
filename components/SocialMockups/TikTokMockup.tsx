'use client'

interface TikTokMockupProps {
  content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  videoUrl?: string
}

export default function TikTokMockup({ content, hashtags, videoUrl }: TikTokMockupProps) {
  return (
    <div style={{
      background: '#000',
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '320px',
      position: 'relative',
      aspectRatio: '9/16',
      minHeight: '480px',
    }}>
      {/* Video container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      }}>
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '20px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Vidéo en chargement...</div>
          </div>
        )}
      </div>

      {/* TikTok UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      }}>
        {/* Username */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            O
          </div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>@omnia_agency</span>
          <button style={{
            background: '#fe2c55',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Suivre
          </button>
        </div>

        {/* Caption */}
        <div style={{
          color: 'white',
          fontSize: '13px',
          lineHeight: 1.4,
          marginBottom: '8px',
          maxHeight: '60px',
          overflow: 'hidden',
        }}>
          {content.text.slice(0, 150)}...
        </div>

        {/* Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <div style={{
            color: '#00f2ea',
            fontSize: '12px',
            marginBottom: '8px',
          }}>
            {hashtags.slice(0, 4).join(' ')}
          </div>
        )}

        {/* Music */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontSize: '12px',
        }}>
          <span>🎵</span>
          <span style={{ opacity: 0.8 }}>Son original - OmniA Agency</span>
        </div>
      </div>

      {/* Right side actions */}
      <div style={{
        position: 'absolute',
        right: '12px',
        bottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
      }}>
        {/* Like */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>❤️</div>
          <div style={{ color: 'white', fontSize: '11px' }}>12.4K</div>
        </div>
        {/* Comment */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>💬</div>
          <div style={{ color: 'white', fontSize: '11px' }}>892</div>
        </div>
        {/* Share */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>📤</div>
          <div style={{ color: 'white', fontSize: '11px' }}>2.1K</div>
        </div>
        {/* Save */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>🔖</div>
          <div style={{ color: 'white', fontSize: '11px' }}>456</div>
        </div>
      </div>
    </div>
  )
}
