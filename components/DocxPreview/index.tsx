'use client'

import { useEffect, useRef, useState } from 'react'

interface DocxPreviewProps {
  url: string
  filename?: string
  className?: string
}

export default function DocxPreview({ url, filename, className }: DocxPreviewProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [blobCache, setBlobCache] = useState<Blob | null>(null)

  // Render in the inline container
  useEffect(() => {
    let cancelled = false

    const render = async () => {
      if (!inlineContainerRef.current) return

      try {
        setLoading(true)
        setError(null)

        const [{ renderAsync }, response] = await Promise.all([
          import('docx-preview'),
          fetch(url),
        ])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const blob = await response.blob()
        if (cancelled || !inlineContainerRef.current) return

        setBlobCache(blob)
        inlineContainerRef.current.innerHTML = ''

        await renderAsync(blob, inlineContainerRef.current, undefined, {
          className: 'docx-rendered',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: false,
          trimXmlDeclaration: true,
          useBase64URL: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          debug: false,
        })

        if (!cancelled) {
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[DocxPreview] Erreur:', err)
          setError(err instanceof Error ? err.message : 'Erreur de chargement')
          setLoading(false)
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [url])

  // Render in fullscreen modal when opened
  useEffect(() => {
    if (!fullscreen || !blobCache || !fullscreenContainerRef.current) return

    let cancelled = false
    const render = async () => {
      try {
        const { renderAsync } = await import('docx-preview')
        if (cancelled || !fullscreenContainerRef.current) return

        fullscreenContainerRef.current.innerHTML = ''
        await renderAsync(blobCache, fullscreenContainerRef.current, undefined, {
          className: 'docx-rendered',
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
        })
      } catch (err) {
        console.error('[DocxPreview] Erreur fullscreen:', err)
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [fullscreen, blobCache])

  // Lock body scroll when fullscreen open
  useEffect(() => {
    if (fullscreen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setFullscreen(false)
      }
      window.addEventListener('keydown', onKey)

      return () => {
        document.body.style.overflow = previousOverflow
        window.removeEventListener('keydown', onKey)
      }
    }
  }, [fullscreen])

  return (
    <>
      <div className={`docx-preview-card ${className || ''}`}>
        <div className="docx-toolbar">
          <div className="docx-toolbar-left">
            <div className="docx-icon">DOCX</div>
            <div className="docx-meta">
              <div className="docx-filename">{filename || 'Document'}</div>
              <div className="docx-subtitle">Document Word</div>
            </div>
          </div>
          <div className="docx-toolbar-right">
            <button
              type="button"
              className="docx-btn"
              onClick={() => setFullscreen(true)}
              aria-label="Plein ecran"
            >
              Plein ecran
            </button>
            <a
              href={url}
              download={filename}
              className="docx-btn docx-btn-primary"
            >
              Telecharger
            </a>
          </div>
        </div>

        <div className="docx-preview-wrapper">
          {loading && (
            <div className="docx-loading">
              <div className="docx-spinner" />
              <span>Chargement du document...</span>
            </div>
          )}
          {error && (
            <div className="docx-error">
              <p>Impossible de charger l&apos;apercu</p>
              <span>{error}</span>
              <a href={url} download={filename} className="docx-btn docx-btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
                Telecharger directement
              </a>
            </div>
          )}
          <div
            ref={inlineContainerRef}
            className={`docx-container ${loading || error ? 'hidden' : ''}`}
          />
        </div>
      </div>

      {fullscreen && (
        <div className="docx-fullscreen-overlay" onClick={() => setFullscreen(false)}>
          <div className="docx-fullscreen-panel" onClick={(e) => e.stopPropagation()}>
            <div className="docx-fs-toolbar">
              <div className="docx-toolbar-left">
                <div className="docx-icon">DOCX</div>
                <div className="docx-meta">
                  <div className="docx-filename">{filename || 'Document'}</div>
                  <div className="docx-subtitle">Apercu plein ecran</div>
                </div>
              </div>
              <div className="docx-toolbar-right">
                <a
                  href={url}
                  download={filename}
                  className="docx-btn docx-btn-primary"
                >
                  Telecharger
                </a>
                <button
                  type="button"
                  className="docx-btn"
                  onClick={() => setFullscreen(false)}
                  aria-label="Fermer"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="docx-fs-content">
              <div ref={fullscreenContainerRef} className="docx-container" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .docx-preview-card {
          margin-top: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-secondary, #f9fafb);
          max-width: 100%;
        }

        .docx-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-secondary, #f9fafb);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          gap: 12px;
        }

        .docx-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .docx-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.65rem;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .docx-meta {
          min-width: 0;
          flex: 1;
        }

        .docx-filename {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary, #111827);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .docx-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
          margin-top: 2px;
        }

        .docx-toolbar-right {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .docx-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: var(--bg-primary, white);
          color: var(--text-primary, #111827);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }

        .docx-btn:hover {
          background: var(--bg-tertiary, #f3f4f6);
        }

        .docx-btn-primary {
          background: var(--accent, #4F46E5);
          color: white;
          border-color: var(--accent, #4F46E5);
        }

        .docx-btn-primary:hover {
          background: var(--accent-hover, #4338CA);
        }

        .docx-preview-wrapper {
          position: relative;
          max-height: 600px;
          overflow: auto;
          background: #525659;
          padding: 24px;
        }

        .docx-loading,
        .docx-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: #d1d5db;
          text-align: center;
        }

        .docx-error span {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .docx-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: docx-spin 0.8s linear infinite;
        }

        @keyframes docx-spin {
          to { transform: rotate(360deg); }
        }

        .docx-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .docx-container.hidden {
          display: none;
        }

        :global(.docx-rendered) {
          background: white;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
          max-width: 100%;
        }

        :global(.docx-rendered section.docx) {
          background: white !important;
          padding: 48px 60px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
          margin-bottom: 16px !important;
          max-width: 100% !important;
        }

        :global(.docx-rendered table) {
          border-collapse: collapse;
        }

        :global(.docx-rendered table td),
        :global(.docx-rendered table th) {
          padding: 6px 10px;
        }

        /* Fullscreen overlay */
        .docx-fullscreen-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          backdrop-filter: blur(4px);
          animation: docx-fade-in 0.2s ease;
        }

        @keyframes docx-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .docx-fullscreen-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #525659;
          margin: 24px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .docx-fs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #2d2d2d;
          border-bottom: 1px solid #444;
          gap: 12px;
        }

        .docx-fs-toolbar .docx-filename {
          color: white;
        }

        .docx-fs-toolbar .docx-subtitle {
          color: #aaa;
        }

        .docx-fs-content {
          flex: 1;
          overflow: auto;
          padding: 32px 16px;
        }

        @media (max-width: 768px) {
          .docx-fullscreen-panel {
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  )
}
