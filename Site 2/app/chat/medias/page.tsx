'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

// ═══════════════════════════════════════════════════════════════
// SHARED MEDIA STORAGE (same as in chat page)
// ═══════════════════════════════════════════════════════════════
interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  agentIdOrigin: number
}

const agents = [
  { id: 1, name: 'Lucas', role: 'Comptable', color: '#4F46E5' },
  { id: 2, name: 'Marc', role: 'Trésorier', color: '#059669' },
  { id: 3, name: 'Julie', role: 'Investissements', color: '#0891B2' },
  { id: 4, name: 'Thomas', role: 'Réseaux Sociaux', color: '#7C3AED' },
  { id: 5, name: 'Sophie', role: 'Email Marketing', color: '#DB2777' },
  { id: 6, name: 'Claire', role: 'RH', color: '#EA580C' },
  { id: 7, name: 'Emma', role: 'Support Client', color: '#2563EB' },
  { id: 8, name: 'Léa', role: 'Téléphonique', color: '#16A34A' },
]

const STORAGE_KEY = 'omnia_shared_medias'

const loadSharedMedias = (): MediaFile[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored, (key, value) => {
      if (key === 'uploadedAt' && typeof value === 'string') {
        return new Date(value)
      }
      return value
    })
  } catch {
    return []
  }
}

const saveSharedMedias = (medias: MediaFile[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medias))
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    )
  }
  if (type === 'application/pdf') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  )
}

export default function MediasPage() {
  const [mounted, setMounted] = useState(false)
  const [medias, setMedias] = useState<MediaFile[]>([])
  const [filter, setFilter] = useState<'all' | 'images' | 'documents'>('all')

  useEffect(() => {
    setMounted(true)
    setMedias(loadSharedMedias())
  }, [])

  const handleDelete = (mediaId: string) => {
    const updatedMedias = medias.filter(m => m.id !== mediaId)
    setMedias(updatedMedias)
    saveSharedMedias(updatedMedias)
  }

  const getAgentById = (id: number) => agents.find(a => a.id === id)

  const filteredMedias = medias.filter(m => {
    if (filter === 'images') return m.type.startsWith('image/')
    if (filter === 'documents') return !m.type.startsWith('image/')
    return true
  })

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="medias-page">
        <div className="container">
          <div className="page-header">
            <div className="header-left">
              <Link href="/chat" className="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour au chat
              </Link>
              <h1>Medias partagés</h1>
              <p className="subtitle">Fichiers accessibles depuis tous vos agents</p>
            </div>
          </div>

          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous ({medias.length})
            </button>
            <button
              className={`filter-btn ${filter === 'images' ? 'active' : ''}`}
              onClick={() => setFilter('images')}
            >
              Images ({medias.filter(m => m.type.startsWith('image/')).length})
            </button>
            <button
              className={`filter-btn ${filter === 'documents' ? 'active' : ''}`}
              onClick={() => setFilter('documents')}
            >
              Documents ({medias.filter(m => !m.type.startsWith('image/')).length})
            </button>
          </div>

          {filteredMedias.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <h3>Aucun média</h3>
              <p>Les fichiers que vous uploadez dans le chat seront affichés ici et partagés entre tous vos agents.</p>
              <Link href="/chat" className="primary-btn">
                Aller au chat
              </Link>
            </div>
          ) : (
            <div className="medias-grid">
              {filteredMedias.map(media => {
                const agent = getAgentById(media.agentIdOrigin)
                const isImage = media.type.startsWith('image/')

                return (
                  <div key={media.id} className="media-card">
                    <div className="media-preview">
                      {isImage ? (
                        <img src={media.url} alt={media.name} />
                      ) : (
                        <div className="file-icon">
                          {getFileIcon(media.type)}
                        </div>
                      )}
                    </div>
                    <div className="media-info">
                      <span className="media-name" title={media.name}>{media.name}</span>
                      <div className="media-meta">
                        <span className="media-size">{formatFileSize(media.size)}</span>
                        {agent && (
                          <span className="media-agent" style={{ color: agent.color }}>
                            {agent.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="media-actions">
                      <a
                        href={media.url}
                        download={media.name}
                        className="action-btn download"
                        title="Télécharger"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(media.id)}
                        title="Supprimer"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <style jsx>{`
          .medias-page {
            min-height: calc(100vh - 72px);
            margin-top: 72px;
            background: var(--bg-secondary);
            padding: 32px;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .page-header {
            margin-bottom: 32px;
          }

          .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 10px;
            color: var(--text-secondary);
            text-decoration: none;
            font-family: 'Sora', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-bottom: 20px;
          }

          .back-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          h1 {
            font-family: 'Sora', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
          }

          .subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
          }

          .filters {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
          }

          .filter-btn {
            padding: 10px 18px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 10px;
            color: var(--text-secondary);
            font-family: 'Sora', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .filter-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          .filter-btn.active {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 24px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 20px;
            text-align: center;
          }

          .empty-icon {
            width: 80px;
            height: 80px;
            background: var(--bg-secondary);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-tertiary);
            margin-bottom: 24px;
          }

          .empty-state h3 {
            font-family: 'Sora', sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
          }

          .empty-state p {
            color: var(--text-secondary);
            max-width: 400px;
            margin-bottom: 24px;
          }

          .primary-btn {
            padding: 12px 24px;
            background: var(--accent);
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-family: 'Sora', sans-serif;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .primary-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }

          .medias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }

          .media-card {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.2s ease;
          }

          .media-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            transform: translateY(-2px);
          }

          .media-preview {
            width: 100%;
            height: 160px;
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .media-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .file-icon {
            width: 60px;
            height: 60px;
            background: var(--bg-tertiary);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-tertiary);
          }

          .media-info {
            padding: 16px;
            border-bottom: 1px solid var(--border);
          }

          .media-name {
            display: block;
            font-weight: 500;
            color: var(--text-primary);
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 6px;
          }

          .media-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.75rem;
          }

          .media-size {
            color: var(--text-tertiary);
          }

          .media-agent {
            font-weight: 500;
          }

          .media-actions {
            display: flex;
            gap: 8px;
            padding: 12px 16px;
          }

          .action-btn {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .action-btn.download:hover {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
          }

          .action-btn.delete:hover {
            background: #EF4444;
            border-color: #EF4444;
            color: white;
          }

          @media (max-width: 768px) {
            .medias-page {
              padding: 20px 16px;
            }

            h1 {
              font-size: 1.5rem;
            }

            .medias-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  )
}
