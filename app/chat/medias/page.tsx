'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  createdAt: string
}

export default function MediasPage() {
  const [medias, setMedias] = useState<MediaFile[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewImage, setViewImage] = useState<MediaFile | null>(null)

  // Charger les medias
  const loadMedias = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/media')
      const data = await response.json()
      if (data.success) {
        setMedias(data.files)
      }
    } catch (error) {
      console.error('Erreur chargement medias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMedias()
  }, [])

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

  // Select all
  const selectAll = () => {
    if (selectedIds.size === medias.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(medias.map(m => m.id)))
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

          <div className="sidebar-stats">
            <div className="stat">
              <span className="stat-value">{medias.length}</span>
              <span className="stat-label">Images</span>
            </div>
            <div className="stat">
              <span className="stat-value">{selectedIds.size}</span>
              <span className="stat-label">Selectionnees</span>
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="action-btn select-all" onClick={selectAll}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                {selectedIds.size === medias.length && medias.length > 0 && (
                  <path d="M9 12l2 2 4-4" />
                )}
              </svg>
              {selectedIds.size === medias.length && medias.length > 0 ? 'Tout deselectionner' : 'Tout selectionner'}
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
          ) : medias.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <h3>Aucune image</h3>
              <p>Les images generees par les agents apparaitront ici</p>
              <Link href="/chat" className="cta-btn">
                Commencer une conversation
              </Link>
            </div>
          ) : (
            <div className="medias-grid">
              {medias.map((media) => (
                <div
                  key={media.id}
                  className={`media-card ${selectedIds.has(media.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(media.id)}
                >
                  <div className="media-checkbox">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>

                  <div className="media-image">
                    <img src={media.url} alt={media.name} loading="lazy" />
                  </div>

                  <div className="media-info">
                    <span className="media-name">{media.name}</span>
                    <div className="media-meta">
                      <span>{formatSize(media.size)}</span>
                      <span>{formatDate(media.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewImage(media)
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Image viewer modal */}
        {viewImage && (
          <div className="modal-overlay" onClick={() => setViewImage(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewImage(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <img src={viewImage.url} alt={viewImage.name} />
              <div className="modal-info">
                <span>{viewImage.name}</span>
                <span>{formatSize(viewImage.size)} - {formatDate(viewImage.createdAt)}</span>
              </div>
              <a href={viewImage.url} download={viewImage.name} className="download-btn">
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

          .sidebar-stats {
            display: flex;
            gap: 12px;
          }

          .stat {
            flex: 1;
            padding: 16px;
            background: var(--bg-card);
            border-radius: 12px;
            text-align: center;
          }

          .stat-value {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .stat-label {
            font-size: 0.7rem;
            color: var(--text-tertiary);
            text-transform: uppercase;
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
            border: 2px solid transparent;
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .media-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          }

          .media-card.selected {
            border-color: #7C3AED;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
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
            z-index: 2;
            opacity: 0;
          }

          .media-card:hover .media-checkbox,
          .media-card.selected .media-checkbox {
            opacity: 1;
          }

          .media-card.selected .media-checkbox {
            background: #7C3AED;
            border-color: #7C3AED;
            color: white;
          }

          .media-checkbox svg { opacity: 0; }
          .media-card.selected .media-checkbox svg { opacity: 1; }

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

          .modal-content img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 12px;
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
