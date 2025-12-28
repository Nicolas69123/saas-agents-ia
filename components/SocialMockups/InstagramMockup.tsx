'use client'

import ReactMarkdown from 'react-markdown'
import { SocialIcon } from 'react-social-icons'

interface InstagramMockupProps {
  content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  imageUrl?: string
  authorName?: string
}

export default function InstagramMockup({
  content,
  hashtags = [],
  imageUrl,
  authorName = 'omnia.agency'
}: InstagramMockupProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #dbdbdb',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #efefef',
      }}>
        {/* Avatar with gradient border */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '12px',
            }}>
              {authorName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 600,
            fontSize: '14px',
            color: '#262626',
          }}>
            {authorName}
          </div>
        </div>
        {/* Instagram Logo */}
        <SocialIcon
          network="instagram"
          style={{ width: 24, height: 24 }}
          bgColor="transparent"
          fgColor="#E1306C"
        />
      </div>

      {/* Image - MAIN CONTENT for Instagram */}
      {imageUrl ? (
        <div style={{
          width: '100%',
          aspectRatio: '1',
          background: '#fafafa',
          overflow: 'hidden',
        }}>
          <img
            src={imageUrl}
            alt="Post image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '1',
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '64px' }}>📸</span>
        </div>
      )}

      {/* Actions */}
      <div style={{
        padding: '12px 16px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{ fontSize: '24px', cursor: 'pointer' }}>❤️</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }}>💬</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }}>📤</span>
        <span style={{ fontSize: '24px', cursor: 'pointer', marginLeft: 'auto' }}>🔖</span>
      </div>

      {/* Likes */}
      <div style={{
        padding: '0 16px 8px',
        fontWeight: 600,
        fontSize: '14px',
        color: '#262626',
      }}>
        1,247 J&apos;aime
      </div>

      {/* Caption */}
      <div style={{
        padding: '0 16px 12px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#262626',
      }}>
        <span style={{ fontWeight: 600, marginRight: '4px' }}>{authorName}</span>
        <span className="instagram-content">
          <ReactMarkdown
            components={{
              p: ({ children }) => <span>{children} </span>,
              strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
              em: ({ children }) => <em>{children}</em>,
              h1: ({ children }) => <span style={{ fontWeight: 600 }}>{children} </span>,
              h2: ({ children }) => <span style={{ fontWeight: 600 }}>{children} </span>,
              h3: ({ children }) => <span style={{ fontWeight: 600 }}>{children} </span>,
              ul: ({ children }) => <span>{children}</span>,
              li: ({ children }) => <span>• {children} </span>,
            }}
          >
            {content.text.slice(0, 200)}
          </ReactMarkdown>
          {content.text.length > 200 && (
            <span style={{ color: '#8e8e8e', cursor: 'pointer' }}> ...plus</span>
          )}
        </span>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div style={{
            marginTop: '4px',
            color: '#00376b',
          }}>
            {hashtags.map((tag, i) => (
              <span key={i} style={{ marginRight: '4px' }}>
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments */}
      <div style={{
        padding: '0 16px 8px',
        fontSize: '14px',
        color: '#8e8e8e',
        cursor: 'pointer',
      }}>
        Voir les 48 commentaires
      </div>

      {/* Time */}
      <div style={{
        padding: '0 16px 12px',
        fontSize: '10px',
        color: '#8e8e8e',
        textTransform: 'uppercase',
        letterSpacing: '0.2px',
      }}>
        Il y a 2 heures
      </div>
    </div>
  )
}
