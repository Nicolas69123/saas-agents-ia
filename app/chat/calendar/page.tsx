'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import SocialPostPreview, { SocialPostContent } from '@/components/SocialMockups'

// ═══════════════════════════════════════════════════════════════
// UUID HELPER (compatible HTTP & HTTPS)
// ═══════════════════════════════════════════════════════════════
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

interface ScheduledPost {
  id: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
  content: {
    text: string
    hashtags?: string[]
    hook?: string
    cta?: string
  }
  imageUrl?: string
  videoUrl?: string
  scheduledDate: Date
  status: 'scheduled' | 'published' | 'failed' | 'draft'
  createdAt: Date
}

interface DraftPost {
  id: string
  platform: string
  content: {
    text: string
    hashtags?: string[]
  }
  imageUrl?: string
  videoUrl?: string
  createdAt: Date
}

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  type: 'image' | 'video'
  createdAt: string
}

// ═══════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  scheduledPosts: 'omnia_scheduled_posts',
  draftPosts: 'omnia_draft_posts'
}

const loadScheduledPosts = (): ScheduledPost[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.scheduledPosts)
  if (!stored) return []
  try {
    return JSON.parse(stored, (key, value) => {
      if ((key === 'scheduledDate' || key === 'createdAt') && typeof value === 'string') {
        return new Date(value)
      }
      return value
    })
  } catch {
    return []
  }
}

const saveScheduledPosts = (posts: ScheduledPost[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.scheduledPosts, JSON.stringify(posts))
}

// Fonction legacy - garder pour compatibilité
const loadDraftPostsFromStorage = (): DraftPost[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.draftPosts)
  if (!stored) return []
  try {
    return JSON.parse(stored, (key, value) => {
      if (key === 'createdAt' && typeof value === 'string') {
        return new Date(value)
      }
      return value
    })
  } catch {
    return []
  }
}

// ═══════════════════════════════════════════════════════════════
// PLATFORM CONFIG
// ═══════════════════════════════════════════════════════════════

const PLATFORMS = {
  twitter: {
    name: 'X (Twitter)',
    color: '#000000',
    bgLight: '#f5f5f5'
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgLight: '#e8f4fc'
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    bgLight: '#fce8ec'
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgLight: '#e7f0ff'
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    bgLight: '#f5f5f5'
  }
}

type PlatformKey = keyof typeof PLATFORMS

// ═══════════════════════════════════════════════════════════════
// CALENDAR UTILS
// ═══════════════════════════════════════════════════════════════

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
]

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [draftPosts, setDraftPosts] = useState<DraftPost[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey | 'all'>('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleStep, setScheduleStep] = useState<1 | 2 | 3 | 4>(1)
  const [newPost, setNewPost] = useState<Partial<ScheduledPost>>({})
  const [publishingId, setPublishingId] = useState<string | null>(null)

  // États pour la création directe
  const [createMode, setCreateMode] = useState<'draft' | 'direct'>('draft')
  const [publishMode, setPublishMode] = useState<'now' | 'later' | null>(null)
  const [availableMedias, setAvailableMedias] = useState<MediaFile[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [directPostText, setDirectPostText] = useState('')
  const [directHashtags, setDirectHashtags] = useState('')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [isPublishingDirect, setIsPublishingDirect] = useState(false)

  // États pour le wheel picker de date/heure
  const now = new Date()
  const [pickerDay, setPickerDay] = useState(now.getDate())
  const [pickerMonth, setPickerMonth] = useState(now.getMonth())
  const [pickerYear, setPickerYear] = useState(now.getFullYear())
  const [pickerHour, setPickerHour] = useState(now.getHours())
  const [pickerMinute, setPickerMinute] = useState(Math.ceil(now.getMinutes() / 5) * 5)

  // Charger les médias depuis l'API
  const loadMedias = async () => {
    try {
      const response = await fetch('/api/media')
      const data = await response.json()
      if (data.success) {
        setAvailableMedias(data.files || [])
      }
    } catch (error) {
      console.error('Erreur chargement médias:', error)
    }
  }

  // Charger les brouillons depuis l'API /api/posts
  const loadDraftsFromAPI = async () => {
    try {
      const response = await fetch('/api/posts?status=draft')
      const data = await response.json()
      if (data.success && data.posts) {
        // Convertir les posts de l'API au format DraftPost
        const drafts: DraftPost[] = data.posts.map((post: {
          id: string
          platform: string
          content: { text: string; hashtags?: string[] }
          mediaUrl?: string
          mediaType?: string
          createdAt: string
        }) => ({
          id: post.id,
          platform: post.platform,
          content: {
            text: post.content.text,
            hashtags: post.content.hashtags || []
          },
          imageUrl: post.mediaType === 'image' ? post.mediaUrl : undefined,
          videoUrl: post.mediaType === 'video' ? post.mediaUrl : undefined,
          createdAt: new Date(post.createdAt)
        }))
        setDraftPosts(drafts)
        console.log('📋 Brouillons chargés depuis API:', drafts.length)
      }
    } catch (error) {
      console.error('Erreur chargement brouillons:', error)
      // Fallback sur localStorage
      setDraftPosts(loadDraftPostsFromStorage())
    }
  }

  useEffect(() => {
    setMounted(true)
    setScheduledPosts(loadScheduledPosts())
    loadDraftsFromAPI()  // Charger depuis l'API maintenant
    loadMedias()
  }, [])

  const getPostsForDate = useCallback((date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate)
      return postDate.toDateString() === date.toDateString()
    })
  }, [scheduledPosts])

  const filteredPosts = selectedPlatform === 'all'
    ? scheduledPosts
    : scheduledPosts.filter(p => p.platform === selectedPlatform)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const startScheduling = (date?: Date) => {
    setNewPost({})
    setScheduleStep(1)
    setCreateMode('draft')
    setPublishMode(null)
    setSelectedMedia(null)
    setDirectPostText('')
    setDirectHashtags('')
    setShowMediaPicker(false)
    if (date) {
      setSelectedDate(date)
    }
    setShowScheduleModal(true)
  }

  const handleSelectPlatform = (platform: PlatformKey) => {
    setNewPost({ ...newPost, platform })
    // Ne pas passer directement à l'étape 2, attendre le choix du mode
  }

  const handleSelectCreateMode = (mode: 'draft' | 'direct') => {
    setCreateMode(mode)
    setScheduleStep(2)
  }

  // Publier directement le post créé
  const handlePublishDirect = async () => {
    if (!newPost.platform || !directPostText.trim()) {
      alert('Veuillez entrer du texte pour votre post')
      return
    }

    setIsPublishingDirect(true)

    try {
      // D'abord sauvegarder le post dans l'API posts
      const postData = {
        platform: newPost.platform,
        content: {
          text: directPostText,
          hashtags: directHashtags.split(/\s+/).filter(h => h.length > 0)
        },
        mediaUrl: selectedMedia?.url,
        mediaType: selectedMedia?.type,
        status: 'draft'
      }

      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      // Ensuite publier via l'API publish
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newPost.platform,
          content: {
            text: directPostText,
            hashtags: directHashtags.split(/\s+/).filter(h => h.length > 0)
          },
          imageUrl: selectedMedia?.type === 'image' ? selectedMedia.url : undefined,
          videoUrl: selectedMedia?.type === 'video' ? selectedMedia.url : undefined
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Post publié avec succès sur ${PLATFORMS[newPost.platform].name}!`)
        setShowScheduleModal(false)
        setNewPost({})
        setDirectPostText('')
        setDirectHashtags('')
        setSelectedMedia(null)
      } else {
        alert(`Erreur: ${result.error || 'Échec de la publication'}`)
      }
    } catch (error) {
      console.error('Erreur publication:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setIsPublishingDirect(false)
    }
  }

  // Programmer le post créé directement
  const handleScheduleDirect = () => {
    if (!directPostText.trim()) {
      alert('Veuillez entrer du texte pour votre post')
      return
    }

    setNewPost({
      ...newPost,
      content: {
        text: directPostText,
        hashtags: directHashtags.split(/\s+/).filter(h => h.length > 0)
      },
      imageUrl: selectedMedia?.type === 'image' ? selectedMedia.url : undefined,
      videoUrl: selectedMedia?.type === 'video' ? selectedMedia.url : undefined
    })
    setScheduleStep(3)
  }

  const handleSelectDraft = (draft: DraftPost) => {
    setNewPost({
      ...newPost,
      content: draft.content,
      imageUrl: draft.imageUrl,
      videoUrl: draft.videoUrl
    })
    setScheduleStep(3)
  }

  const handleSelectDateTime = (date: Date) => {
    setNewPost({ ...newPost, scheduledDate: date })
    setScheduleStep(4)
  }

  const handleConfirmSchedule = () => {
    if (!newPost.platform || !newPost.content || !newPost.scheduledDate) return

    const post: ScheduledPost = {
      id: generateUUID(),
      platform: newPost.platform,
      content: newPost.content as ScheduledPost['content'],
      imageUrl: newPost.imageUrl,
      videoUrl: newPost.videoUrl,
      scheduledDate: newPost.scheduledDate,
      status: 'scheduled',
      createdAt: new Date()
    }

    const updatedPosts = [...scheduledPosts, post]
    setScheduledPosts(updatedPosts)
    saveScheduledPosts(updatedPosts)
    setShowScheduleModal(false)
    setNewPost({})
    setScheduleStep(1)
  }

  const handleDeletePost = (postId: string) => {
    const updatedPosts = scheduledPosts.filter(p => p.id !== postId)
    setScheduledPosts(updatedPosts)
    saveScheduledPosts(updatedPosts)
  }

  const handlePublish = async (post: ScheduledPost) => {
    if (publishingId) return // Already publishing

    setPublishingId(post.id)

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: post.platform,
          content: post.content,
          imageUrl: post.imageUrl,
          videoUrl: post.videoUrl
        })
      })

      const result = await response.json()

      if (result.success) {
        // Update post status to published
        const updatedPosts = scheduledPosts.map(p =>
          p.id === post.id ? { ...p, status: 'published' as const } : p
        )
        setScheduledPosts(updatedPosts)
        saveScheduledPosts(updatedPosts)
        alert(`Post publie avec succes sur ${PLATFORMS[post.platform].name}!`)
      } else {
        // Update post status to failed
        const updatedPosts = scheduledPosts.map(p =>
          p.id === post.id ? { ...p, status: 'failed' as const } : p
        )
        setScheduledPosts(updatedPosts)
        saveScheduledPosts(updatedPosts)
        alert(`Erreur: ${result.error || 'Echec de la publication'}`)
      }
    } catch (error) {
      console.error('Publish error:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setPublishingId(null)
    }
  }

  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loader {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="calendar-page">
        <div className="content-wrapper">
          {/* Page Header */}
          <header className="page-header">
            <div className="header-left">
              <Link href="/chat" className="back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Retour au chat
              </Link>
              <h1 className="page-title">Calendrier de Publication</h1>
              <p className="page-subtitle">Planifiez et gerez vos publications sur tous vos reseaux</p>
            </div>
            <button className="schedule-btn" onClick={() => startScheduling()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Programmer un post
            </button>
          </header>


          {/* Main Grid */}
          <div className="main-grid">
            {/* Calendar Section */}
            <section className="calendar-section">
              <div className="calendar-card">
                <div className="calendar-header">
                  <button className="nav-btn" onClick={prevMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <h2 className="month-title">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button className="nav-btn" onClick={nextMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                <div className="calendar-grid">
                  {DAYS.map(day => (
                    <div key={day} className="day-header">{day}</div>
                  ))}

                  {generateCalendarDays().map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="calendar-day empty" />
                    }

                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate?.toDateString() === date.toDateString()
                    const dayPosts = getPostsForDate(date)
                    const hasPosts = dayPosts.length > 0

                    return (
                      <button
                        key={day}
                        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasPosts ? 'has-posts' : ''}`}
                        onClick={() => {
                          setSelectedDate(date)
                          if (!hasPosts) startScheduling(date)
                        }}
                      >
                        <span className="day-number">{day}</span>
                        {hasPosts && (
                          <div className="day-indicators">
                            {dayPosts.slice(0, 3).map((post, i) => (
                              <span
                                key={i}
                                className="indicator-dot"
                                style={{ background: PLATFORMS[post.platform].color }}
                              />
                            ))}
                            {dayPosts.length > 3 && (
                              <span className="indicator-more">+{dayPosts.length - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="calendar-legend">
                  {(Object.keys(PLATFORMS) as PlatformKey[]).map(key => (
                    <div key={key} className="legend-item">
                      <span className="legend-dot" style={{ background: PLATFORMS[key].color }} />
                      <span className="legend-label">{PLATFORMS[key].name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Scheduled Posts Section */}
            <section className="posts-section">
              <div className="posts-header">
                <h2>
                  {selectedDate
                    ? `Posts du ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                    : 'Tous les posts programmes'
                  }
                </h2>
                <span className="posts-count">{filteredPosts.length} post{filteredPosts.length > 1 ? 's' : ''}</span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h3>Aucun post programme</h3>
                  <p>Commencez par creer du contenu dans le chat, puis programmez-le ici.</p>
                  <button className="empty-cta" onClick={() => startScheduling()}>
                    Programmer un post
                  </button>
                </div>
              ) : (
                <div className="posts-list">
                  {filteredPosts
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .map((post, index) => {
                      const platform = PLATFORMS[post.platform]
                      const postDate = new Date(post.scheduledDate)
                      const isPast = postDate < new Date()

                      return (
                        <div
                          key={post.id}
                          className={`post-card ${isPast ? 'past' : ''}`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="post-platform" style={{ background: platform.color }}>
                            {platform.name.charAt(0)}
                          </div>

                          <div className="post-content">
                            <div className="post-meta">
                              <span className="post-platform-name">{platform.name}</span>
                              <span className="post-date">
                                {postDate.toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className={`post-status ${post.status}`}>
                                {post.status === 'scheduled' && 'Programme'}
                                {post.status === 'published' && 'Publie'}
                                {post.status === 'failed' && 'Echec'}
                                {post.status === 'draft' && 'Brouillon'}
                              </span>
                            </div>

                            <p className="post-text">{post.content.text}</p>

                            {post.content.hashtags && post.content.hashtags.length > 0 && (
                              <div className="post-hashtags">
                                {post.content.hashtags.map((tag, i) => (
                                  <span key={i} className="hashtag">{tag}</span>
                                ))}
                              </div>
                            )}

                            {(post.imageUrl || post.videoUrl) && (
                              <div className="post-media">
                                {post.imageUrl && (
                                  <img src={post.imageUrl} alt="Post media" className="media-preview" />
                                )}
                                {post.videoUrl && (
                                  <div className="video-indicator">Video attachee</div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="post-actions">
                            {post.status !== 'published' && (
                              <button
                                className={`action-btn publish ${publishingId === post.id ? 'loading' : ''}`}
                                title="Publier maintenant"
                                onClick={() => handlePublish(post)}
                                disabled={publishingId === post.id}
                              >
                                {publishingId === post.id ? (
                                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                  </svg>
                                )}
                              </button>
                            )}
                            <button className="action-btn edit" title="Modifier">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="action-btn delete"
                              title="Supprimer"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="modal-steps">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`step ${scheduleStep >= step ? 'active' : ''} ${scheduleStep === step ? 'current' : ''}`}
                  >
                    <div className="step-number">{step}</div>
                    <span className="step-label">
                      {step === 1 && 'Reseau'}
                      {step === 2 && 'Contenu'}
                      {step === 3 && 'Date'}
                      {step === 4 && 'Confirmation'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Select Platform */}
              {scheduleStep === 1 && (
                <div className="step-content">
                  {!newPost.platform ? (
                    <>
                      <h2>Choisissez un réseau social</h2>
                      <p className="step-description">Où souhaitez-vous publier ce contenu ?</p>

                      <div className="platform-grid">
                        {(Object.keys(PLATFORMS) as PlatformKey[]).map(key => {
                          const platform = PLATFORMS[key]
                          return (
                            <button
                              key={key}
                              className="platform-option"
                              onClick={() => handleSelectPlatform(key)}
                            >
                              <div className="platform-icon-large" style={{ background: platform.color }}>
                                {platform.name.charAt(0)}
                              </div>
                              <span className="platform-name">{platform.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Comment créer votre post ?</h2>
                      <p className="step-description">
                        Publication sur <strong style={{ color: PLATFORMS[newPost.platform].color }}>{PLATFORMS[newPost.platform].name}</strong>
                      </p>

                      <div className="create-mode-grid three-cols">
                        {/* Section 1: Création directe */}
                        <div className="create-mode-card">
                          <div className="card-icon direct">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                          <h3>Créer le post directement</h3>
                          <p>Rédigez votre texte et sélectionnez une image de votre bibliothèque média</p>
                          <button
                            className="card-btn primary"
                            onClick={() => handleSelectCreateMode('direct')}
                          >
                            Commencer
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Section 2: Sélectionner un brouillon */}
                        <div className="create-mode-card">
                          <div className="card-icon drafts">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                            </svg>
                          </div>
                          <h3>Sélectionner un brouillon</h3>
                          <p>
                            {draftPosts.filter(d => d.platform === newPost.platform).length > 0
                              ? `${draftPosts.filter(d => d.platform === newPost.platform).length} brouillon(s) ${PLATFORMS[newPost.platform].name} disponible(s)`
                              : 'Aucun brouillon disponible pour cette plateforme'
                            }
                          </p>
                          <button
                            className="card-btn primary"
                            onClick={() => {
                              setCreateMode('draft')
                              setScheduleStep(2)
                            }}
                            disabled={draftPosts.filter(d => d.platform === newPost.platform).length === 0}
                          >
                            {draftPosts.filter(d => d.platform === newPost.platform).length > 0 ? 'Voir les brouillons' : 'Aucun brouillon'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Section 3: Génération IA */}
                        <div className="create-mode-card">
                          <div className="card-icon ai">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                          </div>
                          <h3>Générer avec l&apos;IA</h3>
                          <p>L&apos;agent Réseaux Sociaux crée le contenu optimisé pour vous</p>
                          <button
                            className="card-btn primary"
                            onClick={() => {
                              setShowScheduleModal(false)
                              window.location.href = '/chat?agent=4'
                            }}
                          >
                            Aller au chat
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <button className="back-step-btn" onClick={() => setNewPost({})}>
                        ← Changer de réseau
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Select Content */}
              {scheduleStep === 2 && (
                <div className="step-content">
                  {createMode === 'direct' && newPost.platform ? (
                    <>
                      <h2>Créez votre post {PLATFORMS[newPost.platform].name}</h2>
                      <p className="step-description">Rédigez votre texte et ajoutez un média (optionnel)</p>

                      {/* Media Picker */}
                      {showMediaPicker ? (
                        <div className="media-picker">
                          <div className="media-picker-header">
                            <h3>Sélectionnez un média</h3>
                            <button className="close-picker" onClick={() => setShowMediaPicker(false)}>✕</button>
                          </div>
                          <div className="media-grid">
                            {availableMedias.length === 0 ? (
                              <div className="no-media">
                                <p>Aucun média disponible</p>
                                <Link href="/chat/medias" className="go-to-medias">
                                  Voir la bibliothèque
                                </Link>
                              </div>
                            ) : (
                              availableMedias.map(media => (
                                <button
                                  key={media.id}
                                  className={`media-thumb ${selectedMedia?.id === media.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    setSelectedMedia(media)
                                    setShowMediaPicker(false)
                                  }}
                                >
                                  {media.type === 'video' ? (
                                    <div className="video-thumb">
                                      <video src={media.url} muted preload="metadata" />
                                      <span className="video-badge">▶</span>
                                    </div>
                                  ) : (
                                    <img src={media.url} alt={media.name} />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="direct-create-form">
                          {/* Selected Media Preview */}
                          <div className="media-section">
                            {selectedMedia ? (
                              <div className="selected-media-preview">
                                {selectedMedia.type === 'video' ? (
                                  <video src={selectedMedia.url} controls />
                                ) : (
                                  <img src={selectedMedia.url} alt="Média sélectionné" />
                                )}
                                <button className="change-media" onClick={() => setShowMediaPicker(true)}>
                                  Changer
                                </button>
                                <button className="remove-media" onClick={() => setSelectedMedia(null)}>
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button className="add-media-btn" onClick={() => setShowMediaPicker(true)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                <span>Ajouter une image ou vidéo</span>
                                <small>(optionnel)</small>
                              </button>
                            )}
                          </div>

                          {/* Mockup Preview */}
                          {newPost.platform && (
                            <div className="mockup-preview">
                              <SocialPostPreview
                                content={{
                                  type_contenu: 'social_post',
                                  platform: newPost.platform,
                                  post_content: { text: directPostText || 'Votre texte apparaîtra ici...' },
                                  hashtags: directHashtags.split(/\s+/).filter(h => h.length > 0)
                                }}
                                imageUrl={selectedMedia?.type === 'image' ? selectedMedia.url : undefined}
                                videoUrl={selectedMedia?.type === 'video' ? selectedMedia.url : undefined}
                              />
                            </div>
                          )}

                          {/* Text Input */}
                          <div className="text-input-section">
                            <label>Texte du post</label>
                            <textarea
                              value={directPostText}
                              onChange={(e) => setDirectPostText(e.target.value)}
                              placeholder="Écrivez votre post ici..."
                              rows={4}
                            />
                          </div>

                          {/* Hashtags Input */}
                          <div className="hashtags-input-section">
                            <label>Hashtags (séparés par des espaces)</label>
                            <input
                              type="text"
                              value={directHashtags}
                              onChange={(e) => setDirectHashtags(e.target.value)}
                              placeholder="#marketing #business #socialmedia"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="direct-actions">
                            <button
                              className="publish-now-btn"
                              onClick={handlePublishDirect}
                              disabled={!directPostText.trim() || isPublishingDirect}
                            >
                              {isPublishingDirect ? (
                                <>
                                  <span className="spinner-small" />
                                  Publication...
                                </>
                              ) : (
                                <>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                  </svg>
                                  Publier maintenant
                                </>
                              )}
                            </button>
                            <button
                              className="schedule-later-btn"
                              onClick={handleScheduleDirect}
                              disabled={!directPostText.trim()}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Programmer pour plus tard
                            </button>
                          </div>
                        </div>
                      )}

                      <button className="back-step-btn" onClick={() => {
                        setScheduleStep(1)
                        setCreateMode('draft')
                      }}>
                        ← Retour
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>Sélectionnez le contenu</h2>
                      <p className="step-description">Choisissez parmi vos brouillons</p>

                      {draftPosts.length === 0 ? (
                        <div className="no-drafts">
                          <div className="no-drafts-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                          </div>
                          <h3>Aucun brouillon disponible</h3>
                          <p>Créez du contenu dans le chat avec l&apos;agent Réseaux Sociaux pour le retrouver ici.</p>
                          <Link href="/chat?agent=4" className="go-to-chat-btn">
                            Aller au chat
                          </Link>
                        </div>
                      ) : (
                        <div className="drafts-list">
                          {draftPosts.map(draft => (
                            <button
                              key={draft.id}
                              className="draft-option"
                              onClick={() => handleSelectDraft(draft)}
                            >
                              <div className="draft-preview">
                                {draft.imageUrl && (
                                  <img src={draft.imageUrl} alt="" className="draft-image" />
                                )}
                                <p className="draft-text">{draft.content.text.slice(0, 100)}...</p>
                              </div>
                              <span className="draft-date">
                                {new Date(draft.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      <button className="back-step-btn" onClick={() => setScheduleStep(1)}>
                        ← Retour
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Select Date/Time with Wheel Picker */}
              {scheduleStep === 3 && (
                <div className="step-content">
                  <h2>Quand souhaitez-vous publier ?</h2>
                  <p className="step-description">Choisissez le moment de publication</p>

                  {/* Choix du mode de publication */}
                  {publishMode === null && (
                    <>
                      <div className="publish-mode-grid">
                        <div className="publish-mode-card" onClick={() => setPublishMode('now')}>
                          <div className="mode-icon now">🚀</div>
                          <h3>Publier maintenant</h3>
                          <p>Le post sera publié immédiatement</p>
                        </div>
                        <div className="publish-mode-card" onClick={() => setPublishMode('later')}>
                          <div className="mode-icon later">📅</div>
                          <h3>Programmer pour plus tard</h3>
                          <p>Choisissez une date et une heure</p>
                        </div>
                      </div>
                      <div className="step-actions">
                        <button className="back-step-btn" onClick={() => setScheduleStep(2)}>
                          ← Retour
                        </button>
                      </div>
                    </>
                  )}

                  {/* Publication immédiate - Confirmation */}
                  {publishMode === 'now' && (
                    <>
                      <div className="publish-now-confirm">
                        <div className="now-icon">🚀</div>
                        <h3>Prêt à publier ?</h3>
                        <p>Votre post {PLATFORMS[newPost.platform!]?.name} sera publié immédiatement.</p>
                        {newPost.content?.text && (
                          <div className="preview-text">&quot;{newPost.content.text.slice(0, 100)}...&quot;</div>
                        )}
                      </div>
                      <div className="step-actions">
                        <button className="back-step-btn" onClick={() => setPublishMode(null)}>
                          ← Retour
                        </button>
                        <button
                          className="confirm-btn publish-now-btn"
                          onClick={async () => {
                            if (!newPost.platform || !newPost.content) return
                            setIsPublishingDirect(true)
                            try {
                              const response = await fetch('/api/publish', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  platform: newPost.platform,
                                  content: newPost.content,
                                  imageUrl: newPost.imageUrl,
                                  videoUrl: newPost.videoUrl
                                })
                              })
                              const result = await response.json()
                              if (result.success) {
                                alert(`✅ Publié sur ${PLATFORMS[newPost.platform].name} !`)
                                setShowScheduleModal(false)
                                setNewPost({})
                                setScheduleStep(1)
                                setPublishMode(null)
                              } else {
                                alert(`❌ Erreur: ${result.error || 'Échec de la publication'}`)
                              }
                            } catch (error) {
                              alert(`❌ Erreur: ${error}`)
                            } finally {
                              setIsPublishingDirect(false)
                            }
                          }}
                          disabled={isPublishingDirect}
                        >
                          {isPublishingDirect ? 'Publication...' : 'Publier maintenant 🚀'}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Programmation différée - Wheel Picker */}
                  {publishMode === 'later' && (
                    <>
                  <div className="wheel-picker-container">
                    {/* Date Section */}
                    <div className="picker-section">
                      <span className="picker-label">Date</span>
                      <div className="wheel-group">
                        {/* Day */}
                        <div className="wheel-column">
                          <button className="wheel-arrow" onClick={() => setPickerDay(d => Math.max(1, d - 1))}>▲</button>
                          <div className="wheel-value">{String(pickerDay).padStart(2, '0')}</div>
                          <button className="wheel-arrow" onClick={() => setPickerDay(d => Math.min(31, d + 1))}>▼</button>
                          <span className="wheel-unit">jour</span>
                        </div>

                        {/* Month */}
                        <div className="wheel-column">
                          <button className="wheel-arrow" onClick={() => setPickerMonth(m => Math.max(0, m - 1))}>▲</button>
                          <div className="wheel-value">{MONTHS[pickerMonth]?.slice(0, 3)}</div>
                          <button className="wheel-arrow" onClick={() => setPickerMonth(m => Math.min(11, m + 1))}>▼</button>
                          <span className="wheel-unit">mois</span>
                        </div>

                        {/* Year */}
                        <div className="wheel-column">
                          <button className="wheel-arrow" onClick={() => setPickerYear(y => Math.max(2025, y - 1))}>▲</button>
                          <div className="wheel-value">{pickerYear}</div>
                          <button className="wheel-arrow" onClick={() => setPickerYear(y => y + 1)}>▼</button>
                          <span className="wheel-unit">année</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Section */}
                    <div className="picker-section">
                      <span className="picker-label">Heure</span>
                      <div className="wheel-group">
                        {/* Hour */}
                        <div className="wheel-column">
                          <button className="wheel-arrow" onClick={() => setPickerHour(h => (h - 1 + 24) % 24)}>▲</button>
                          <div className="wheel-value">{String(pickerHour).padStart(2, '0')}</div>
                          <button className="wheel-arrow" onClick={() => setPickerHour(h => (h + 1) % 24)}>▼</button>
                          <span className="wheel-unit">h</span>
                        </div>

                        <span className="time-separator">:</span>

                        {/* Minute */}
                        <div className="wheel-column">
                          <button className="wheel-arrow" onClick={() => setPickerMinute(m => (m - 5 + 60) % 60)}>▲</button>
                          <div className="wheel-value">{String(pickerMinute).padStart(2, '0')}</div>
                          <button className="wheel-arrow" onClick={() => setPickerMinute(m => (m + 5) % 60)}>▼</button>
                          <span className="wheel-unit">min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="quick-presets">
                    {[
                      { label: 'Dans 1h', action: () => { const d = new Date(); d.setHours(d.getHours() + 1); setPickerDay(d.getDate()); setPickerMonth(d.getMonth()); setPickerYear(d.getFullYear()); setPickerHour(d.getHours()); setPickerMinute(Math.ceil(d.getMinutes() / 5) * 5); }},
                      { label: 'Demain 9h', action: () => { const d = new Date(); d.setDate(d.getDate() + 1); setPickerDay(d.getDate()); setPickerMonth(d.getMonth()); setPickerYear(d.getFullYear()); setPickerHour(9); setPickerMinute(0); }},
                      { label: 'Demain 18h', action: () => { const d = new Date(); d.setDate(d.getDate() + 1); setPickerDay(d.getDate()); setPickerMonth(d.getMonth()); setPickerYear(d.getFullYear()); setPickerHour(18); setPickerMinute(0); }},
                    ].map((preset, i) => (
                      <button key={i} className="preset-btn" onClick={preset.action}>
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="step-actions">
                    <button className="back-step-btn" onClick={() => setPublishMode(null)}>
                      ← Retour
                    </button>
                    <button
                      className="confirm-datetime-btn"
                      onClick={() => {
                        const selectedDate = new Date(pickerYear, pickerMonth, pickerDay, pickerHour, pickerMinute)
                        handleSelectDateTime(selectedDate)
                      }}
                    >
                      Confirmer →
                    </button>
                  </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Confirmation */}
              {scheduleStep === 4 && newPost.platform && newPost.scheduledDate && (
                <div className="step-content">
                  <h2>Verification finale</h2>
                  <p className="step-description">Confirmez les details de votre publication</p>

                  <div className="confirmation-card">
                    <div className="confirm-header" style={{ background: PLATFORMS[newPost.platform].color }}>
                      <span className="confirm-platform">{PLATFORMS[newPost.platform].name}</span>
                    </div>

                    <div className="confirm-body">
                      <div className="confirm-row">
                        <span className="confirm-label">Date</span>
                        <span className="confirm-value">
                          {newPost.scheduledDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {newPost.content && (
                        <div className="confirm-row">
                          <span className="confirm-label">Contenu</span>
                          <p className="confirm-text">{newPost.content.text?.slice(0, 150)}...</p>
                        </div>
                      )}

                      {newPost.imageUrl && (
                        <div className="confirm-row">
                          <span className="confirm-label">Image</span>
                          <img src={newPost.imageUrl} alt="" className="confirm-image" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="confirm-actions">
                    <button className="back-step-btn" onClick={() => setScheduleStep(3)}>
                      Modifier
                    </button>
                    <button className="confirm-btn" onClick={handleConfirmSchedule}>
                      Programmer la publication
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .calendar-page {
            min-height: 100vh;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding-top: 72px;
          }

          .content-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            padding: 48px 32px;
          }

          /* ═══════════════════════════════════════════════════════════════
             PAGE HEADER
             ═══════════════════════════════════════════════════════════════ */
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 48px;
          }

          .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--text-tertiary);
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 16px;
            transition: color 0.2s;
          }

          .back-link:hover {
            color: var(--text-primary);
          }

          .page-title {
            font-family: 'Sora', sans-serif;
            font-size: 2rem;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.02em;
            color: var(--text-primary);
          }

          .page-subtitle {
            color: var(--text-tertiary);
            font-size: 0.95rem;
            margin-top: 8px;
          }

          .schedule-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            background: var(--text-primary);
            border: none;
            border-radius: 12px;
            color: var(--bg-primary);
            font-family: 'Sora', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .schedule-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          /* ═══════════════════════════════════════════════════════════════
             PLATFORM TABS
             ═══════════════════════════════════════════════════════════════ */
          .platform-tabs {
            display: flex;
            gap: 8px;
            padding: 6px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            margin-bottom: 32px;
            overflow-x: auto;
          }

          .tab-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: transparent;
            border: none;
            border-radius: 10px;
            color: var(--text-secondary);
            font-family: 'Sora', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .tab-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          .tab-btn.active {
            background: var(--bg-card);
            color: var(--text-primary);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }

          .tab-count {
            background: var(--bg-tertiary);
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .tab-btn.active .tab-count {
            background: var(--bg-secondary);
          }

          /* ═══════════════════════════════════════════════════════════════
             MAIN GRID
             ═══════════════════════════════════════════════════════════════ */
          .main-grid {
            display: grid;
            grid-template-columns: 400px 1fr;
            gap: 40px;
          }

          @media (max-width: 1100px) {
            .main-grid {
              grid-template-columns: 1fr;
            }
          }

          /* ═══════════════════════════════════════════════════════════════
             CALENDAR SECTION
             ═══════════════════════════════════════════════════════════════ */
          .calendar-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px;
          }

          .calendar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
          }

          .nav-btn {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg-primary);
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .nav-btn:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .month-title {
            font-family: 'Sora', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
            color: var(--text-primary);
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }

          .day-header {
            text-align: center;
            font-size: 0.7rem;
            font-weight: 600;
            color: var(--text-tertiary);
            padding: 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .calendar-day {
            aspect-ratio: 1;
            border: none;
            border-radius: 10px;
            background: transparent;
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            transition: all 0.2s;
            position: relative;
          }

          .calendar-day:hover:not(.empty) {
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .calendar-day.empty {
            cursor: default;
          }

          .calendar-day.today .day-number {
            background: var(--text-primary);
            color: var(--bg-primary);
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .calendar-day.selected {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
          }

          .calendar-day.has-posts {
            background: var(--bg-secondary);
          }

          .day-indicators {
            display: flex;
            gap: 2px;
            position: absolute;
            bottom: 4px;
          }

          .indicator-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
          }

          .indicator-more {
            font-size: 0.55rem;
            color: var(--text-tertiary);
          }

          .calendar-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .legend-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .legend-label {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          /* ═══════════════════════════════════════════════════════════════
             POSTS SECTION
             ═══════════════════════════════════════════════════════════════ */
          .posts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .posts-header h2 {
            font-family: 'Sora', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
            color: var(--text-primary);
          }

          .posts-count {
            font-size: 0.85rem;
            color: var(--text-tertiary);
          }

          .empty-state {
            background: var(--bg-card);
            border: 1px dashed var(--border);
            border-radius: 16px;
            padding: 60px 40px;
            text-align: center;
          }

          .empty-icon {
            color: var(--text-tertiary);
            margin-bottom: 16px;
          }

          .empty-state h3 {
            font-size: 1.1rem;
            margin: 0 0 8px;
            color: var(--text-primary);
          }

          .empty-state p {
            color: var(--text-tertiary);
            margin: 0 0 24px;
            font-size: 0.9rem;
          }

          .empty-cta {
            padding: 10px 20px;
            background: var(--text-primary);
            border: none;
            border-radius: 10px;
            color: var(--bg-primary);
            font-family: 'Sora', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .empty-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .posts-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .post-card {
            display: flex;
            gap: 16px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px;
            transition: all 0.2s;
          }

          .post-card:hover {
            border-color: var(--text-tertiary);
          }

          .post-card.past {
            opacity: 0.6;
          }

          .post-platform {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
            flex-shrink: 0;
          }

          .post-content {
            flex: 1;
            min-width: 0;
          }

          .post-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
          }

          .post-platform-name {
            font-weight: 600;
            font-size: 0.85rem;
            color: var(--text-primary);
          }

          .post-date {
            font-size: 0.8rem;
            color: var(--text-tertiary);
          }

          .post-status {
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 6px;
            background: var(--bg-secondary);
            color: var(--text-secondary);
          }

          .post-status.published {
            background: #dcfce7;
            color: #166534;
          }

          .post-status.failed {
            background: #fee2e2;
            color: #991b1b;
          }

          .post-text {
            font-size: 0.85rem;
            line-height: 1.5;
            color: var(--text-secondary);
            margin: 0 0 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .post-hashtags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
          }

          .hashtag {
            font-size: 0.7rem;
            color: var(--accent);
            background: var(--bg-secondary);
            padding: 3px 8px;
            border-radius: 6px;
          }

          .post-media {
            margin-top: 10px;
          }

          .media-preview {
            max-width: 100px;
            border-radius: 8px;
          }

          .video-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: var(--text-tertiary);
            background: var(--bg-secondary);
            padding: 4px 10px;
            border-radius: 6px;
          }

          .post-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .action-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--bg-primary);
            color: var(--text-tertiary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .action-btn:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .action-btn.delete:hover {
            background: #fee2e2;
            border-color: #fecaca;
            color: #991b1b;
          }

          .action-btn.publish {
            background: #000;
            border-color: #000;
            color: white;
          }

          .action-btn.publish:hover {
            background: #333;
            transform: scale(1.05);
          }

          .action-btn.publish:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .action-btn.publish .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* ═══════════════════════════════════════════════════════════════
             MODAL
             ═══════════════════════════════════════════════════════════════ */
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 32px;
            position: relative;
            overflow-y: auto;
          }

          .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg-primary);
            color: var(--text-tertiary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .modal-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .modal-steps {
            display: flex;
            justify-content: center;
            gap: 32px;
            margin-bottom: 40px;
          }

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            opacity: 0.3;
            transition: opacity 0.2s;
          }

          .step.active {
            opacity: 1;
          }

          .step-number {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.85rem;
            color: var(--text-secondary);
            transition: all 0.2s;
          }

          .step.current .step-number {
            background: var(--text-primary);
            border-color: var(--text-primary);
            color: var(--bg-primary);
          }

          .step-label {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          .step-content h2 {
            font-family: 'Sora', sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
            text-align: center;
            margin: 0 0 8px;
            color: var(--text-primary);
          }

          .step-description {
            text-align: center;
            color: var(--text-tertiary);
            margin: 0 0 32px;
            font-size: 0.9rem;
          }

          .platform-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .platform-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 20px 16px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .platform-option:hover {
            border-color: var(--text-tertiary);
            transform: translateY(-2px);
          }

          .platform-icon-large {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            font-weight: 600;
            color: white;
          }

          .platform-name {
            font-weight: 500;
            font-size: 0.85rem;
            color: var(--text-primary);
          }

          .no-drafts {
            text-align: center;
            padding: 40px 20px;
          }

          .no-drafts-icon {
            color: var(--text-tertiary);
            margin-bottom: 16px;
          }

          .no-drafts h3 {
            font-size: 1rem;
            margin: 0 0 8px;
            color: var(--text-primary);
          }

          .no-drafts p {
            color: var(--text-tertiary);
            margin: 0 0 24px;
            font-size: 0.85rem;
          }

          .go-to-chat-btn {
            display: inline-block;
            padding: 10px 20px;
            background: var(--text-primary);
            border-radius: 10px;
            color: var(--bg-primary);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.2s;
          }

          .go-to-chat-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .drafts-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 280px;
            overflow-y: auto;
          }

          .draft-option {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 14px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
          }

          .draft-option:hover {
            border-color: var(--text-tertiary);
          }

          .draft-preview {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .draft-image {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            object-fit: cover;
          }

          .draft-text {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin: 0;
          }

          .draft-date {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          /* ═══════════════════════════════════════════════════════════════
             WHEEL PICKER
             ═══════════════════════════════════════════════════════════════ */
          .wheel-picker-container {
            display: flex;
            gap: 32px;
            justify-content: center;
            margin: 32px 0;
          }

          .picker-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .picker-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .wheel-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-primary);
            padding: 16px 20px;
            border-radius: 16px;
            border: 1px solid var(--border);
          }

          .wheel-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .wheel-arrow {
            width: 36px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 0.8rem;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
          }

          .wheel-arrow:hover {
            background: var(--bg-secondary);
            color: var(--accent);
          }

          .wheel-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            min-width: 50px;
            text-align: center;
            padding: 8px 4px;
            background: var(--bg-secondary);
            border-radius: 10px;
          }

          .wheel-unit {
            font-size: 0.7rem;
            color: var(--text-muted);
            text-transform: uppercase;
          }

          .time-separator {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            padding: 0 4px;
          }

          .quick-presets {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 24px;
          }

          .preset-btn {
            padding: 10px 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 24px;
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .preset-btn:hover {
            border-color: var(--accent);
            color: var(--accent);
            background: rgba(99, 102, 241, 0.05);
          }

          .step-actions {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 24px;
          }

          .back-step-btn {
            padding: 12px 24px;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-secondary);
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .back-step-btn:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .confirm-datetime-btn {
            padding: 12px 32px;
            background: var(--accent);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .confirm-datetime-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }

          .confirmation-card {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 24px;
          }

          .confirm-header {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            color: white;
          }

          .confirm-platform {
            font-weight: 600;
            font-size: 1rem;
          }

          .confirm-body {
            padding: 20px;
          }

          .confirm-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 16px;
          }

          .confirm-row:last-child {
            margin-bottom: 0;
          }

          .confirm-label {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .confirm-value {
            font-weight: 500;
            color: var(--text-primary);
          }

          .confirm-text {
            font-size: 0.85rem;
            line-height: 1.5;
            color: var(--text-secondary);
            margin: 0;
          }

          .confirm-image {
            max-width: 120px;
            border-radius: 10px;
          }

          .confirm-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .confirm-btn {
            padding: 12px 28px;
            background: var(--text-primary);
            border: none;
            border-radius: 12px;
            color: var(--bg-primary);
            font-family: 'Sora', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .confirm-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          /* ═══════════════════════════════════════════════════════════════
             CREATE MODE CARDS (Step 1)
             ═══════════════════════════════════════════════════════════════ */
          .create-mode-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 28px;
          }

          .create-mode-grid.three-cols {
            grid-template-columns: repeat(3, 1fr);
          }

          .create-mode-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 28px 24px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 20px;
            transition: all 0.2s;
          }

          .create-mode-card:hover {
            border-color: var(--accent);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          .card-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }

          .card-icon.direct {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .card-icon.ai {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
          }

          .card-icon.drafts {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
          }

          .create-mode-card h3 {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
          }

          .create-mode-card p {
            font-size: 0.85rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 20px;
            flex: 1;
          }

          .card-btn,
          button.card-btn,
          a.card-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            width: 100%;
            background: var(--text-primary) !important;
            color: var(--bg-primary) !important;
            border: none !important;
          }

          .card-btn:hover,
          button.card-btn:hover,
          a.card-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            opacity: 0.9;
          }

          .card-btn:disabled,
          button.card-btn:disabled {
            background: var(--bg-secondary) !important;
            color: var(--text-muted) !important;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .card-btn:disabled:hover,
          button.card-btn:disabled:hover {
            transform: none;
            box-shadow: none;
          }

          /* ═══════════════════════════════════════════════════════════════
             PUBLISH MODE SELECTION (Now vs Later)
             ═══════════════════════════════════════════════════════════════ */
          .publish-mode-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 28px;
          }

          .publish-mode-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 32px 24px;
            background: var(--bg-primary);
            border: 2px solid var(--border);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .publish-mode-card:hover {
            border-color: var(--accent);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          .publish-mode-card h3 {
            margin: 16px 0 8px;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .publish-mode-card p {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin: 0;
          }

          .mode-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }

          .mode-icon.now {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }

          .mode-icon.later {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          }

          .publish-now-confirm {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 32px;
            background: var(--bg-primary);
            border: 2px solid var(--accent);
            border-radius: 20px;
            margin-top: 24px;
          }

          .publish-now-confirm .now-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 16px;
          }

          .publish-now-confirm h3 {
            margin: 0 0 8px;
            font-size: 1.3rem;
            font-weight: 600;
          }

          .publish-now-confirm p {
            color: var(--text-muted);
            margin: 0;
          }

          .publish-now-confirm .preview-text {
            margin-top: 16px;
            padding: 12px 16px;
            background: var(--bg-secondary);
            border-radius: 12px;
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-style: italic;
            max-width: 400px;
          }

          .publish-now-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          }

          .back-step-btn {
            margin-top: 20px;
            padding: 12px 20px;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 10px;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
          }

          .back-step-btn:hover {
            border-color: var(--text-primary);
            color: var(--text-primary);
          }

          /* ═══════════════════════════════════════════════════════════════
             DIRECT CREATE FORM (Step 2)
             ═══════════════════════════════════════════════════════════════ */
          .direct-create-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-top: 20px;
          }

          .media-section {
            display: flex;
            justify-content: center;
          }

          .add-media-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 32px 48px;
            background: var(--bg-primary);
            border: 2px dashed var(--border);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.2s;
            color: var(--text-muted);
          }

          .add-media-btn:hover {
            border-color: var(--accent);
            color: var(--accent);
            background: rgba(99, 102, 241, 0.05);
          }

          .add-media-btn span {
            font-weight: 500;
          }

          .add-media-btn small {
            font-size: 0.8rem;
            opacity: 0.7;
          }

          .selected-media-preview {
            position: relative;
            max-width: 300px;
            border-radius: 12px;
            overflow: hidden;
          }

          .selected-media-preview img,
          .selected-media-preview video {
            width: 100%;
            height: auto;
            display: block;
          }

          .selected-media-preview .change-media,
          .selected-media-preview .remove-media {
            position: absolute;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s;
          }

          .selected-media-preview .change-media {
            bottom: 8px;
            left: 8px;
          }

          .selected-media-preview .remove-media {
            top: 8px;
            right: 8px;
            padding: 4px 8px;
          }

          .selected-media-preview .change-media:hover,
          .selected-media-preview .remove-media:hover {
            background: rgba(0, 0, 0, 0.9);
          }

          /* ═══════════════════════════════════════════════════════════════
             MEDIA PICKER
             ═══════════════════════════════════════════════════════════════ */
          .media-picker {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 20px;
            margin-top: 16px;
          }

          .media-picker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .media-picker-header h3 {
            font-size: 1rem;
            font-weight: 600;
          }

          .close-picker {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--bg-secondary);
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
          }

          .close-picker:hover {
            background: var(--border);
          }

          .media-picker .media-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            max-height: 300px;
            overflow-y: auto;
          }

          .media-thumb {
            aspect-ratio: 1;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
            padding: 0;
            background: var(--bg-secondary);
          }

          .media-thumb:hover {
            border-color: var(--accent);
            transform: scale(1.02);
          }

          .media-thumb.selected {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }

          .media-thumb img,
          .media-thumb video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
          }

          .video-thumb {
            position: relative;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .video-thumb video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
          }

          .video-badge {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.6);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
          }

          .no-media {
            grid-column: 1 / -1;
            text-align: center;
            padding: 32px;
            color: var(--text-muted);
          }

          .go-to-medias {
            display: inline-block;
            margin-top: 12px;
            padding: 8px 16px;
            background: var(--accent);
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
          }

          /* ═══════════════════════════════════════════════════════════════
             MOCKUP PREVIEW
             ═══════════════════════════════════════════════════════════════ */
          .mockup-preview {
            display: flex;
            justify-content: center;
            padding: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 16px;
          }

          /* ═══════════════════════════════════════════════════════════════
             TEXT & HASHTAG INPUTS
             ═══════════════════════════════════════════════════════════════ */
          .text-input-section,
          .hashtags-input-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .text-input-section label,
          .hashtags-input-section label {
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .text-input-section textarea,
          .hashtags-input-section input {
            padding: 16px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 12px;
            font-family: inherit;
            font-size: 1rem;
            color: var(--text-primary);
            resize: vertical;
            transition: all 0.2s;
          }

          .text-input-section textarea:focus,
          .hashtags-input-section input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }

          .text-input-section textarea::placeholder,
          .hashtags-input-section input::placeholder {
            color: var(--text-muted);
          }

          /* ═══════════════════════════════════════════════════════════════
             DIRECT ACTIONS
             ═══════════════════════════════════════════════════════════════ */
          .direct-actions {
            display: flex;
            gap: 12px;
            margin-top: 8px;
          }

          .publish-now-btn,
          .schedule-later-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .publish-now-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .publish-now-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
          }

          .publish-now-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .schedule-later-btn {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
          }

          .schedule-later-btn:hover:not(:disabled) {
            border-color: var(--accent);
            color: var(--accent);
          }

          .schedule-later-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .spinner-small {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          /* ═══════════════════════════════════════════════════════════════
             RESPONSIVE
             ═══════════════════════════════════════════════════════════════ */
          @media (max-width: 768px) {
            .content-wrapper {
              padding: 24px 16px;
            }

            .page-header {
              flex-direction: column;
              gap: 20px;
            }

            .page-title {
              font-size: 1.5rem;
            }

            .schedule-btn {
              width: 100%;
              justify-content: center;
            }

            .platform-tabs {
              padding: 4px;
              gap: 4px;
            }

            .tab-btn {
              padding: 8px 12px;
              font-size: 0.8rem;
            }

            .platform-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .modal-content {
              padding: 24px 20px;
            }

            .modal-steps {
              gap: 16px;
            }

            .step-label {
              display: none;
            }

            .create-mode-option {
              padding: 16px;
              gap: 12px;
            }

            .mode-icon {
              width: 44px;
              height: 44px;
            }

            .create-mode-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .create-mode-card {
              padding: 24px 20px;
            }

            .card-icon {
              width: 56px;
              height: 56px;
            }

            .media-picker .media-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
            }

            .direct-actions {
              flex-direction: column;
            }

            .publish-now-btn,
            .schedule-later-btn {
              width: 100%;
            }

            .wheel-picker-container {
              flex-direction: column;
              gap: 24px;
            }

            .wheel-group {
              padding: 12px 16px;
            }

            .wheel-value {
              font-size: 1.25rem;
              min-width: 44px;
            }

            .quick-presets {
              flex-wrap: wrap;
            }

            .step-actions {
              flex-direction: column-reverse;
            }

            .confirm-datetime-btn,
            .back-step-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </>
  )
}
