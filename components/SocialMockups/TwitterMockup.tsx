'use client'

import ReactMarkdown from 'react-markdown'
import { SocialIcon } from 'react-social-icons'

interface TwitterMockupProps {
  content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  imageUrl?: string
  authorName?: string
  authorHandle?: string
}

export default function TwitterMockup({
  content,
  hashtags = [],
  imageUrl,
  authorName = 'OmniA Agency',
  authorHandle = '@omnia_agency'
}: TwitterMockupProps) {
  // Truncate text to 280 chars for Twitter
  const displayText = content.text.length > 280 ? content.text.slice(0, 277) + '...' : content.text

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #eff3f4',
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
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '16px',
          flexShrink: 0,
        }}>
          {authorName.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          {/* Author info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontWeight: 700,
              fontSize: '15px',
              color: '#0f1419',
            }}>
              {authorName}
            </span>
            <span style={{
              color: '#1d9bf0',
              fontSize: '14px',
            }}>✓</span>
            <span style={{
              color: '#536471',
              fontSize: '15px',
            }}>
              {authorHandle}
            </span>
            <span style={{
              color: '#536471',
              fontSize: '15px',
            }}>·</span>
            <span style={{
              color: '#536471',
              fontSize: '15px',
            }}>2h</span>
          </div>

          {/* Content */}
          <div style={{
            marginTop: '4px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: '#0f1419',
          }}>
            <div className="twitter-content">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                  h1: ({ children }) => <p style={{ fontWeight: 700, margin: '4px 0' }}>{children}</p>,
                  h2: ({ children }) => <p style={{ fontWeight: 700, margin: '4px 0' }}>{children}</p>,
                  h3: ({ children }) => <p style={{ fontWeight: 700, margin: '4px 0' }}>{children}</p>,
                  ul: ({ children }) => <div style={{ margin: '4px 0' }}>{children}</div>,
                  li: ({ children }) => <div>• {children}</div>,
                }}
              >
                {displayText}
              </ReactMarkdown>
            </div>

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                {hashtags.slice(0, 3).map((tag, i) => (
                  <span key={i} style={{ color: '#1d9bf0', marginRight: '4px' }}>
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image - INSIDE the tweet */}
          {imageUrl && (
            <div style={{
              marginTop: '12px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #eff3f4',
            }}>
              <img
                src={imageUrl}
                alt="Tweet image"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '300px',
          }}>
            {[
              { icon: '💬', count: '24' },
              { icon: '🔄', count: '156' },
              { icon: '❤️', count: '892' },
              { icon: '📊', count: '12K' },
              { icon: '📤', count: '' },
            ].map((action, i) => (
              <button
                key={i}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#536471',
                  fontSize: '13px',
                }}
              >
                <span>{action.icon}</span>
                {action.count && <span>{action.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* X Logo */}
        <SocialIcon
          network="x"
          style={{ width: 24, height: 24 }}
          bgColor="transparent"
          fgColor="#000"
        />
      </div>
    </div>
  )
}
