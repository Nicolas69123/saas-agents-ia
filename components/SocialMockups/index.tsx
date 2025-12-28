'use client'

import LinkedInMockup from './LinkedInMockup'
import InstagramMockup from './InstagramMockup'
import TwitterMockup from './TwitterMockup'
import FacebookMockup from './FacebookMockup'

export interface SocialPostContent {
  type_contenu: 'social_post'
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook'
  post_content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  image_prompt?: string
  generate_image?: boolean
}

interface SocialPostPreviewProps {
  content: SocialPostContent
  imageUrl?: string
}

export default function SocialPostPreview({ content, imageUrl }: SocialPostPreviewProps) {
  const platform = content.platform?.toLowerCase() || 'linkedin'

  const platformLabel = {
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
  }[platform] || 'Social Media'

  const platformColor = {
    linkedin: '#0077B5',
    instagram: '#E1306C',
    twitter: '#000000',
    facebook: '#1877F2',
  }[platform] || '#6366f1'

  return (
    <div style={{ marginTop: '8px' }}>
      {/* Platform badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '12px',
        background: platformColor,
        color: 'white',
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '12px',
      }}>
        {platform === 'linkedin' && '💼'}
        {platform === 'instagram' && '📸'}
        {platform === 'twitter' && '𝕏'}
        {platform === 'facebook' && '👥'}
        <span>Aperçu {platformLabel}</span>
      </div>

      {/* Render the appropriate mockup */}
      {platform === 'linkedin' && (
        <LinkedInMockup
          content={content.post_content}
          hashtags={content.hashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'instagram' && (
        <InstagramMockup
          content={content.post_content}
          hashtags={content.hashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'twitter' && (
        <TwitterMockup
          content={content.post_content}
          hashtags={content.hashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'facebook' && (
        <FacebookMockup
          content={content.post_content}
          hashtags={content.hashtags}
          imageUrl={imageUrl}
        />
      )}

      {/* Image generation indicator */}
      {content.generate_image && !imageUrl && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '13px',
          textAlign: 'center',
        }}>
          🎨 Image en cours de génération...
          <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.8 }}>
            {content.image_prompt?.slice(0, 100)}...
          </p>
        </div>
      )}
    </div>
  )
}

export { LinkedInMockup, InstagramMockup, TwitterMockup, FacebookMockup }
