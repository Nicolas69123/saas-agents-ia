'use client'

import ReactMarkdown from 'react-markdown'

interface FacebookMockupProps {
  content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  imageUrl?: string
  authorName?: string
}

export default function FacebookMockup({
  content,
  hashtags = [],
  imageUrl,
  authorName = 'OmniA Agency'
}: FacebookMockupProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        {/* Avatar */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #1877F2 0%, #1565C0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          fontSize: '16px',
          flexShrink: 0,
        }}>
          {authorName.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              fontWeight: 600,
              fontSize: '15px',
              color: '#050505',
            }}>
              {authorName}
            </span>
            <span style={{
              color: '#1877F2',
              fontSize: '14px',
            }}>✓</span>
          </div>
          <div style={{
            fontSize: '13px',
            color: '#65676B',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            Il y a 2h · 🌐
          </div>
        </div>
        {/* More button */}
        <div style={{
          fontSize: '16px',
          color: '#65676B',
          cursor: 'pointer',
          padding: '4px',
        }}>
          •••
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '0 16px 12px',
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#050505',
      }}>
        <div className="facebook-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '8px 0' }}>{children}</h3>,
              h2: ({ children }) => <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '8px 0' }}>{children}</h4>,
              h3: ({ children }) => <h5 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0' }}>{children}</h5>,
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
            marginTop: '8px',
            color: '#1877F2',
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
          background: '#f0f2f5',
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
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '15px',
        color: '#65676B',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              background: '#1877F2',
              borderRadius: '50%',
              padding: '2px',
              fontSize: '12px',
              marginRight: '-4px',
              zIndex: 2,
            }}>👍</span>
            <span style={{
              background: '#F33E58',
              borderRadius: '50%',
              padding: '2px',
              fontSize: '12px',
            }}>❤️</span>
          </span>
          <span style={{ marginLeft: '8px' }}>248</span>
        </div>
        <div style={{
          display: 'flex',
          gap: '16px',
        }}>
          <span>56 commentaires</span>
          <span>23 partages</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: '#CED0D4',
        margin: '0 16px',
      }} />

      {/* Actions */}
      <div style={{
        padding: '4px 16px',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        {[
          { icon: '👍', label: 'J\'aime' },
          { icon: '💬', label: 'Commenter' },
          { icon: '📤', label: 'Partager' },
        ].map((action, i) => (
          <button
            key={i}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#65676B',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '4px',
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
