'use client'

import ReactMarkdown from 'react-markdown'

interface LinkedInMockupProps {
  content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  imageUrl?: string
  authorName?: string
  authorRole?: string
}

export default function LinkedInMockup({
  content,
  hashtags = [],
  imageUrl,
  authorName = 'Thomas',
  authorRole = 'Expert Marketing Digital'
}: LinkedInMockupProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        {/* Avatar */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          fontSize: '18px',
          flexShrink: 0,
        }}>
          {authorName.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 600,
            fontSize: '14px',
            color: '#000000E6',
          }}>
            {authorName}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#00000099',
            marginTop: '2px',
          }}>
            {authorRole}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#00000099',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            Maintenant • 🌐
          </div>
        </div>
        {/* LinkedIn Logo */}
        <div style={{
          color: '#0077B5',
          fontSize: '20px',
          fontWeight: 'bold',
        }}>
          in
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '0 16px 12px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#000000E6',
      }}>
        <div className="linkedin-content" style={{
          whiteSpace: 'pre-wrap',
        }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '8px 0' }}>{children}</h3>,
              h2: ({ children }) => <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '8px 0' }}>{children}</h4>,
              h3: ({ children }) => <h5 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0' }}>{children}</h5>,
              p: ({ children }) => <p style={{ margin: '8px 0' }}>{children}</p>,
              ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
              li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
              strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
            }}
          >
            {content.text}
          </ReactMarkdown>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div style={{
            marginTop: '12px',
            color: '#0077B5',
            fontSize: '14px',
          }}>
            {hashtags.map((tag, i) => (
              <span key={i} style={{ marginRight: '4px' }}>
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div style={{
          width: '100%',
          background: '#f3f2ef',
        }}>
          <img
            src={imageUrl}
            alt="Post image"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '12px',
        color: '#00000099',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '14px' }}>👍❤️</span> 42
        </span>
        <span style={{ marginLeft: 'auto' }}>12 commentaires • 5 partages</span>
      </div>

      {/* Actions */}
      <div style={{
        padding: '4px 16px 8px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        {['👍 J\'aime', '💬 Commenter', '🔄 Partager', '📤 Envoyer'].map((action, i) => (
          <button
            key={i}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#00000099',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
