'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  type: 'image' | 'video'
  createdAt: string
  platform?: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
}

interface MediaStats {
  total: number
  images: number
  videos: number
}

interface SocialPost {
  id: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
  content: { text: string; hashtags?: string[] }
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  createdAt: string
}

interface PostStats {
  total: number
  byPlatform: Record<string, number>
}

type FilterType = 'all' | 'images' | 'videos' | 'posts'
type PlatformFilter = 'all' | 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'

export default function MediasPage() {
  const [medias, setMedias] = useState<MediaFile[]>([])
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [stats, setStats] = useState<MediaStats>({ total: 0, images: 0, videos: 0 })
  const [postStats, setPostStats] = useState<PostStats>({ total: 0, byPlatform: {} })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [viewMedia, setViewMedia] = useState<MediaFile | null>(null)
  const [viewPost, setViewPost] = useState<SocialPost | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')

  // Charger les medias
  const loadMedias = async () => {
    try {
      const response = await fetch('/api/media')
      const data = await response.json()
      if (data.success) {
        setMedias(data.files)
        setStats(data.stats || { total: data.files.length, images: 0, videos: 0 })
      }
    } catch (error) {
      console.error('Erreur chargement medias:', error)
    }
  }

  // Charger les posts sociaux
  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
        setPostStats({ total: data.stats?.total || 0, byPlatform: data.stats?.byPlatform || {} })
      }
    } catch (error) {
      console.error('Erreur chargement posts:', error)
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true)
      await Promise.all([loadMedias(), loadPosts()])
      setIsLoading(false)
    }
    loadAll()
  }, [])

  // Filter medias based on selected filter
  const filteredMedias = medias.filter(m => {
    if (filter === 'posts') return false // Show posts separately
    if (filter === 'all') return true
    if (filter === 'images') return m.type === 'image'
    if (filter === 'videos') return m.type === 'video'
    return true
  })

  // Filter posts based on platform
  const filteredPosts = posts.filter(p => {
    if (platformFilter === 'all') return true
    return p.platform === platformFilter
  })

  // Platform icons
  const platformIcons: Record<string, string> = {
    twitter: '𝕏',
    linkedin: 'in',
    instagram: '📷',
    facebook: 'f',
    tiktok: '♪'
  }

  const platformColors: Record<string, string> = {
    twitter: '#000',
    linkedin: '#0A66C2',
    instagram: '#E4405F',
    facebook: '#1877F2',
    tiktok: '#000'
  }

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Toggle select mode
  const toggleSelectMode = () => {
    if (isSelectMode) {
      // Quitter le mode sélection
      setIsSelectMode(false)
      setSelectedIds(new Set())
    } else {
      // Activer le mode sélection
      setIsSelectMode(true)
    }
  }

  // Select all
  const selectAll = () => {
    if (selectedIds.size === filteredMedias.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMedias.map(m => m.id)))
    }
  }

  // Handle media click - soit agrandir, soit sélectionner selon le mode
  const handleMediaClick = (media: MediaFile) => {
    if (isSelectMode) {
      toggleSelection(media.id)
    } else {
      setViewMedia(media)
    }
  }

  // Delete selected
  const deleteSelected = async () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(`Supprimer ${selectedIds.size} image(s) ?`)
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const deletePromises = Array.from(selectedIds).map(id => {
        const media = medias.find(m => m.id === id)
        if (media) {
          return fetch(`/api/media?file=${encodeURIComponent(media.name)}`, {
            method: 'DELETE'
          })
        }
        return Promise.resolve()
      })

      await Promise.all(deletePromises)
      setSelectedIds(new Set())
      await loadMedias()
    } catch (error) {
      console.error('Erreur suppression:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Header />
      <div className="medias-page">
        {/* Sidebar */}
        <aside className="sidebar">
          <Link href="/chat" className="back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour au chat
          </Link>

          <div className="sidebar-stats-row">
            <div className="stat-mini">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-lbl">médias</span>
            </div>
            <div className="stat-mini">
              <span className="stat-num">{stats.images}</span>
              <span className="stat-lbl">images</span>
            </div>
            <div className="stat-mini">
              <span className="stat-num">{stats.videos}</span>
              <span className="stat-lbl">vidéos</span>
            </div>
            <div className="stat-mini">
              <span className="stat-num">{postStats.total}</span>
              <span className="stat-lbl">posts</span>
            </div>
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            <button
              className={`filter-tab ${filter === 'images' ? 'active' : ''}`}
              onClick={() => setFilter('images')}
            >
              Images
            </button>
            <button
              className={`filter-tab ${filter === 'videos' ? 'active' : ''}`}
              onClick={() => setFilter('videos')}
            >
              Videos
            </button>
            <button
              className={`filter-tab ${filter === 'posts' ? 'active' : ''}`}
              onClick={() => setFilter('posts')}
            >
              Posts
            </button>
          </div>

          {filter === 'posts' && (
            <div className="platform-filters">
              <button
                className={`platform-btn ${platformFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPlatformFilter('all')}
              >
                Tous
              </button>
              {(['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok'] as const).map(platform => (
                <button
                  key={platform}
                  className={`platform-btn ${platformFilter === platform ? 'active' : ''}`}
                  onClick={() => setPlatformFilter(platform)}
                  style={{ '--platform-color': platformColors[platform] } as React.CSSProperties}
                >
                  <span className="platform-icon">{platformIcons[platform]}</span>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  {postStats.byPlatform[platform] > 0 && (
                    <span className="platform-count">{postStats.byPlatform[platform]}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="sidebar-actions">
            <button
              className={`action-btn select-mode ${isSelectMode ? 'active' : ''}`}
              onClick={toggleSelectMode}
            >
              {isSelectMode ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Annuler
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Sélectionner
                </>
              )}
            </button>

            {isSelectMode && (
              <>
                <button className="action-btn select-all" onClick={selectAll}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    {selectedIds.size === filteredMedias.length && filteredMedias.length > 0 && (
                      <path d="M9 12l2 2 4-4" />
                    )}
                  </svg>
                  {selectedIds.size === filteredMedias.length && filteredMedias.length > 0 ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>

                <button
                  className="action-btn delete"
                  onClick={deleteSelected}
                  disabled={selectedIds.size === 0 || isDeleting}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  {isDeleting ? 'Suppression...' : `Supprimer (${selectedIds.size})`}
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="medias-main">
          <header className="page-header">
            <h1>Bibliotheque de Medias</h1>
            <p>Toutes vos images generees par les agents IA</p>
          </header>

          {isLoading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Chargement des medias...</p>
            </div>
          ) : filter === 'posts' ? (
            /* Posts Grid */
            filteredPosts.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <h3>Aucun post</h3>
                <p>Les posts créés apparaîtront ici</p>
              </div>
            ) : (
              <div className="posts-grid">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`post-card ${post.platform}`}
                    onClick={() => setViewPost(post)}
                  >
                    <div className="post-header">
                      <span
                        className="post-platform-badge"
                        style={{ background: platformColors[post.platform] }}
                      >
                        {platformIcons[post.platform]}
                      </span>
                      <span className="post-date">{formatDate(post.createdAt)}</span>
                    </div>

                    {post.mediaUrl && (
                      <div className="post-media">
                        {post.mediaType === 'video' ? (
                          <video src={post.mediaUrl} muted preload="metadata" />
                        ) : (
                          <img src={post.mediaUrl} alt="Post media" loading="lazy" />
                        )}
                      </div>
                    )}

                    <div className="post-content">
                      <p className="post-text">{post.content.text}</p>
                      {post.content.hashtags && post.content.hashtags.length > 0 && (
                        <div className="post-hashtags">
                          {post.content.hashtags.map((tag, i) => (
                            <span key={i} className="hashtag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="post-footer">
                      <span className={`post-status ${post.status}`}>
                        {post.status === 'published' ? '✓ Publié' :
                         post.status === 'scheduled' ? '⏰ Programmé' :
                         post.status === 'failed' ? '✗ Échoué' : '📝 Brouillon'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredMedias.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <h3>Aucun média</h3>
              <p>Les images et vidéos générées par les agents apparaîtront ici</p>
              <Link href="/chat" className="cta-btn">
                Commencer une conversation
              </Link>
            </div>
          ) : (
            /* Medias Grid */
            <div className="medias-grid">
              {filteredMedias.map((media) => (
                <div
                  key={media.id}
                  className={`media-card ${selectedIds.has(media.id) ? 'selected' : ''} ${media.type} ${isSelectMode ? 'select-mode' : ''}`}
                  onClick={() => handleMediaClick(media)}
                >
                  {isSelectMode && (
                    <div className="media-checkbox">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )}

                  <div className="media-preview">
                    {media.type === 'video' ? (
                      <>
                        <video src={media.url} muted preload="metadata" />
                        <div className="video-play-overlay">
                          <div className="play-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                              <polygon points="8 5 19 12 8 19 8 5" />
                            </svg>
                          </div>
                        </div>
                        <div className="video-badge">VIDEO</div>
                      </>
                    ) : (
                      <img src={media.url} alt={media.name} loading="lazy" />
                    )}
                  </div>

                  <div className="media-info">
                    <span className="media-name">{media.name}</span>
                    <div className="media-meta">
                      <span>{formatSize(media.size)}</span>
                      <span>•</span>
                      <span>{formatDate(media.createdAt)}</span>
                    </div>
                  </div>

                  {!isSelectMode && (
                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewMedia(media)
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Post viewer modal */}
        {viewPost && (
          <div className="modal-overlay" onClick={() => setViewPost(null)}>
            <div className="modal-content post-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewPost(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="post-modal-header">
                <span
                  className="post-platform-badge large"
                  style={{ background: platformColors[viewPost.platform] }}
                >
                  {platformIcons[viewPost.platform]}
                </span>
                <div>
                  <h3>{viewPost.platform.charAt(0).toUpperCase() + viewPost.platform.slice(1)}</h3>
                  <span className="post-date">{formatDate(viewPost.createdAt)}</span>
                </div>
              </div>

              {viewPost.mediaUrl && (
                <div className="post-modal-media">
                  {viewPost.mediaType === 'video' ? (
                    <video src={viewPost.mediaUrl} controls autoPlay loop />
                  ) : (
                    <img src={viewPost.mediaUrl} alt="Post media" />
                  )}
                </div>
              )}

              <div className="post-modal-content">
                <p>{viewPost.content.text}</p>
                {viewPost.content.hashtags && viewPost.content.hashtags.length > 0 && (
                  <div className="post-hashtags">
                    {viewPost.content.hashtags.map((tag, i) => (
                      <span key={i} className="hashtag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="post-modal-footer">
                <span className={`post-status ${viewPost.status}`}>
                  {viewPost.status === 'published' ? '✓ Publié' :
                   viewPost.status === 'scheduled' ? '⏰ Programmé' :
                   viewPost.status === 'failed' ? '✗ Échoué' : '📝 Brouillon'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Media viewer modal */}
        {viewMedia && (
          <div className="modal-overlay" onClick={() => setViewMedia(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewMedia(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              {viewMedia.type === 'video' ? (
                <video src={viewMedia.url} controls autoPlay loop className="modal-video" />
              ) : (
                <img src={viewMedia.url} alt={viewMedia.name} />
              )}
              <div className="modal-info">
                <span>{viewMedia.name}</span>
                <span>{viewMedia.type === 'video' ? 'Video' : 'Image'} - {formatSize(viewMedia.size)} - {formatDate(viewMedia.createdAt)}</span>
              </div>
              <a href={viewMedia.url} download={viewMedia.name} className="download-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Telecharger
              </a>
            </div>
          </div>
        )}

        <style jsx>{`
          .medias-page {
            display: flex;
            min-height: 100vh;
            padding-top: 72px;
            background: var(--bg-primary);
          }

          .sidebar {
            width: 280px;
            min-width: 280px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .back-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .back-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          .sidebar-stats-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .stat-mini {
            flex: 1;
            min-width: calc(50% - 4px);
            padding: 8px 10px;
            background: var(--bg-card);
            border-radius: 8px;
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .stat-num {
            font-size: 1rem;
            font-weight: 700;
            color: #7C3AED;
          }

          .stat-lbl {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          .filter-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 6px;
            background: var(--bg-card);
            border-radius: 14px;
            border: 1px solid var(--border);
          }

          .filter-tab {
            flex: 1;
            min-width: calc(50% - 6px);
            padding: 10px 12px;
            background: transparent;
            border: none;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-tertiary);
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .filter-tab:hover {
            color: var(--text-primary);
            background: var(--bg-tertiary);
            transform: translateY(-1px);
          }

          .filter-tab.active {
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            transform: translateY(-1px);
          }

          .sidebar-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .action-btn.select-mode {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border);
          }

          .action-btn.select-mode.active {
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
            color: white;
            border-color: transparent;
          }

          .action-btn.select-all {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border);
          }

          .action-btn.delete {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
          }

          .action-btn.delete:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .medias-main {
            flex: 1;
            padding: 32px;
            overflow-y: auto;
          }

          .page-header {
            margin-bottom: 32px;
          }

          .page-header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 8px;
          }

          .page-header p {
            color: var(--text-tertiary);
            margin: 0;
          }

          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 80px 0;
            color: var(--text-tertiary);
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: #7C3AED;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 80px 0;
            text-align: center;
            color: var(--text-tertiary);
          }

          .empty-state svg { opacity: 0.3; }

          .empty-state h3 {
            font-size: 1.2rem;
            color: var(--text-primary);
            margin: 0;
          }

          .cta-btn {
            margin-top: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
          }

          .medias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
          }

          .media-card {
            position: relative;
            background: var(--bg-card);
            border: 2px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .media-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
            border-color: rgba(124, 58, 237, 0.3);
          }

          .media-card.selected {
            border-color: #7C3AED;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2), 0 12px 32px rgba(124, 58, 237, 0.15);
          }

          .media-checkbox {
            position: absolute;
            top: 12px;
            left: 12px;
            width: 24px;
            height: 24px;
            background: white;
            border: 2px solid var(--border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4;
            transition: all 0.2s ease;
          }

          .media-card.selected .media-checkbox {
            background: #7C3AED;
            border-color: #7C3AED;
            color: white;
          }

          .media-checkbox svg { opacity: 0; }
          .media-card.selected .media-checkbox svg { opacity: 1; }

          .media-card.select-mode {
            cursor: pointer;
          }

          .media-card.select-mode:hover .media-checkbox {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
          }

          .media-preview {
            aspect-ratio: 1;
            overflow: hidden;
            position: relative;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          }

          .media-preview img,
          .media-preview video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .video-play-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%);
            transition: all 0.3s ease;
          }

          .media-card:hover .video-play-overlay {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, rgba(168, 85, 247, 0.4) 100%);
          }

          .play-button {
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .play-button svg {
            margin-left: 4px;
          }

          .play-button svg polygon {
            fill: #7C3AED;
          }

          .media-card:hover .play-button {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
          }

          .video-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 5px 10px;
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
            border-radius: 6px;
            color: white;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
          }

          .media-image {
            aspect-ratio: 1;
            overflow: hidden;
          }

          .media-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .media-info {
            padding: 12px 14px;
          }

          .media-name {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .media-meta {
            display: flex;
            gap: 8px;
            margin-top: 4px;
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          .media-type-label {
            padding: 2px 8px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            font-weight: 500;
          }

          .media-card.video .media-type-label {
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
            color: white;
          }

          .view-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            z-index: 2;
          }

          .media-card:hover .view-btn { opacity: 1; }

          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 40px;
          }

          .modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }

          .modal-content img,
          .modal-video {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 12px;
          }

          .modal-video {
            background: #000;
          }

          .modal-close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
          }

          .modal-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
          }

          .download-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: white;
            color: #111;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 500;
          }

          /* Platform Filters */
          .platform-filters {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .platform-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .platform-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          .platform-btn.active {
            background: var(--platform-color, #7C3AED);
            border-color: var(--platform-color, #7C3AED);
            color: white;
          }

          .platform-icon {
            font-size: 1rem;
            font-weight: 700;
          }

          .platform-count {
            margin-left: auto;
            padding: 2px 8px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            font-size: 0.75rem;
          }

          /* Posts Grid */
          .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }

          .post-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .post-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          }

          .post-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
          }

          .post-platform-badge {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 0.9rem;
          }

          .post-platform-badge.large {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
            border-radius: 12px;
          }

          .post-date {
            font-size: 0.8rem;
            color: var(--text-tertiary);
          }

          .post-media {
            aspect-ratio: 16/9;
            overflow: hidden;
            background: var(--bg-tertiary);
          }

          .post-media img,
          .post-media video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .post-content {
            padding: 16px;
          }

          .post-text {
            font-size: 0.9rem;
            color: var(--text-primary);
            margin: 0 0 12px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .post-hashtags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .hashtag {
            padding: 4px 10px;
            background: var(--bg-tertiary);
            border-radius: 12px;
            font-size: 0.75rem;
            color: #7C3AED;
            font-weight: 500;
          }

          .post-footer {
            padding: 12px 16px;
            border-top: 1px solid var(--border);
          }

          .post-status {
            font-size: 0.8rem;
            font-weight: 500;
            padding: 4px 10px;
            border-radius: 12px;
          }

          .post-status.published {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
          }

          .post-status.scheduled {
            background: rgba(234, 179, 8, 0.1);
            color: #EAB308;
          }

          .post-status.failed {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
          }

          .post-status.draft {
            background: var(--bg-tertiary);
            color: var(--text-tertiary);
          }

          /* Post Modal */
          .post-modal {
            background: var(--bg-card);
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            padding: 24px;
          }

          .post-modal-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
          }

          .post-modal-header h3 {
            margin: 0;
            color: var(--text-primary);
          }

          .post-modal-media {
            margin: 0 -24px;
            aspect-ratio: 16/9;
            overflow: hidden;
            background: var(--bg-tertiary);
          }

          .post-modal-media img,
          .post-modal-media video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .post-modal-content {
            padding: 20px 0;
          }

          .post-modal-content p {
            margin: 0 0 16px;
            color: var(--text-primary);
            line-height: 1.6;
          }

          .post-modal-footer {
            padding-top: 16px;
            border-top: 1px solid var(--border);
          }

          @media (max-width: 768px) {
            .medias-page { flex-direction: column; }
            .sidebar {
              width: 100%;
              flex-direction: row;
              flex-wrap: wrap;
              padding: 16px;
              gap: 12px;
            }
            .sidebar-stats { flex: 1; }
            .sidebar-actions { width: 100%; flex-direction: row; }
            .action-btn { flex: 1; }
            .medias-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          }
        `}</style>
      </div>
    </>
  )
}
