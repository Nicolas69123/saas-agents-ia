'use client'

import { useState } from 'react'
import { SocialIcon } from 'react-social-icons'
import LinkedInMockup from './LinkedInMockup'
import InstagramMockup from './InstagramMockup'
import TwitterMockup from './TwitterMockup'
import FacebookMockup from './FacebookMockup'
import TikTokMockup from './TikTokMockup'

export interface SocialPostContent {
  type_contenu: 'social_post'
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok' | 'youtube'
  post_content: {
    text: string
    hook?: string
    cta?: string
  }
  hashtags?: string[]
  image_prompt?: string
  generate_image?: boolean
  video_prompt?: string
  generate_video?: boolean
  video_uri?: string
  video_ready?: boolean
}

interface SocialPostPreviewProps {
  content: SocialPostContent
  imageUrl?: string
  videoUrl?: string
  onContentChange?: (newContent: SocialPostContent) => void
}

export default function SocialPostPreview({ content, imageUrl, videoUrl, onContentChange }: SocialPostPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(content.post_content.text)
  const [editedHashtags, setEditedHashtags] = useState(content.hashtags?.join(' ') || '')

  const platform = content.platform?.toLowerCase() || 'linkedin'

  const platformLabel: Record<string, string> = {
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  }

  const platformColor: Record<string, string> = {
    linkedin: '#0077B5',
    instagram: '#E1306C',
    twitter: '#000000',
    facebook: '#1877F2',
    tiktok: '#000000',
    youtube: '#FF0000',
  }

  const networkName = platform === 'twitter' ? 'x' : platform

  const handleSave = () => {
    const newContent: SocialPostContent = {
      ...content,
      post_content: {
        ...content.post_content,
        text: editedText,
      },
      hashtags: editedHashtags.split(/\s+/).filter(h => h.length > 0),
    }
    onContentChange?.(newContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedText(content.post_content.text)
    setEditedHashtags(content.hashtags?.join(' ') || '')
    setIsEditing(false)
  }

  // Use edited content when in edit mode
  const displayContent = isEditing ? { ...content.post_content, text: editedText } : content.post_content
  const displayHashtags = isEditing ? editedHashtags.split(/\s+/).filter(h => h.length > 0) : content.hashtags

  return (
    <div style={{ marginTop: '8px' }}>
      {/* Header with platform badge and edit button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        {/* Platform badge with real icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '12px',
          background: platformColor[platform] || '#6366f1',
          color: 'white',
          fontSize: '12px',
          fontWeight: 600,
        }}>
          <SocialIcon
            network={networkName}
            style={{ width: 18, height: 18 }}
            bgColor="transparent"
            fgColor="white"
          />
          <span>Aperçu {platformLabel[platform] || 'Social Media'}</span>
        </div>

        {/* Edit button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              background: 'white',
              color: '#666',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div style={{
          marginBottom: '16px',
          padding: '16px',
          borderRadius: '12px',
          background: '#f8f9fa',
          border: '1px solid #e0e0e0',
        }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px', color: '#333' }}>
            Texte du post
          </label>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />

          <label style={{ display: 'block', marginTop: '12px', marginBottom: '8px', fontWeight: 600, fontSize: '13px', color: '#333' }}>
            Hashtags (séparés par des espaces)
          </label>
          <input
            type="text"
            value={editedHashtags}
            onChange={(e) => setEditedHashtags(e.target.value)}
            placeholder="#hashtag1 #hashtag2 #hashtag3"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                background: 'white',
                color: '#666',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: platformColor[platform] || '#6366f1',
                color: 'white',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ✓ Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Render the appropriate mockup */}
      {platform === 'linkedin' && (
        <LinkedInMockup
          content={displayContent}
          hashtags={displayHashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'instagram' && (
        <InstagramMockup
          content={displayContent}
          hashtags={displayHashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'twitter' && (
        <TwitterMockup
          content={displayContent}
          hashtags={displayHashtags}
          imageUrl={imageUrl}
        />
      )}

      {platform === 'facebook' && (
        <FacebookMockup
          content={displayContent}
          hashtags={displayHashtags}
          imageUrl={imageUrl}
        />
      )}

      {(platform === 'tiktok' || platform === 'youtube') && (
        <TikTokMockup
          content={displayContent}
          hashtags={displayHashtags}
          videoUrl={videoUrl || content.video_uri}
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

      {/* Video generation indicator */}
      {content.generate_video && !content.video_ready && !videoUrl && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%)',
          color: 'white',
          fontSize: '13px',
          textAlign: 'center',
        }}>
          🎬 Vidéo en cours de génération...
          <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.8 }}>
            {content.video_prompt?.slice(0, 100)}...
          </p>
        </div>
      )}
    </div>
  )
}

export { LinkedInMockup, InstagramMockup, TwitterMockup, FacebookMockup, TikTokMockup }
