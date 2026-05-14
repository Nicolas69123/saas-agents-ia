'use client'

import { useEffect, useRef, useState } from 'react'

export type DocumentFormat = 'docx' | 'xlsx' | 'pptx' | 'pdf'

interface DocumentPreviewProps {
  url: string
  filename?: string
  format?: DocumentFormat
  previewUrl?: string | null
}

const FORMAT_META: Record<DocumentFormat, { label: string; subtitle: string; gradient: string }> = {
  docx: { label: 'DOCX', subtitle: 'Document Word', gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' },
  xlsx: { label: 'XLSX', subtitle: 'Tableur Excel', gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)' },
  pptx: { label: 'PPTX', subtitle: 'Presentation PowerPoint', gradient: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)' },
  pdf: { label: 'PDF', subtitle: 'Document PDF', gradient: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)' },
}

function detectFormat(filename?: string, format?: DocumentFormat): DocumentFormat {
  if (format) return format
  const ext = filename?.split('.').pop()?.toLowerCase()
  if (ext === 'docx' || ext === 'xlsx' || ext === 'pptx' || ext === 'pdf') return ext
  return 'docx'
}

export default function DocumentPreview({ url, filename, format, previewUrl }: DocumentPreviewProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null)

  const resolvedFormat = detectFormat(filename, format)
  const meta = FORMAT_META[resolvedFormat]
  const effectivePreviewUrl = previewUrl || (resolvedFormat === 'pdf' ? url : null)

  // DOCX: render via docx-preview, no LibreOffice needed
  useEffect(() => {
    if (resolvedFormat !== 'docx' || !inlineContainerRef.current) return

    let cancelled = false

    const render = async () => {
      try {
        setLoading(true)
        setError(null)

        const [{ renderAsync }, response] = await Promise.all([
          import('docx-preview'),
          fetch(url),
        ])

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const blob = await response.blob()
        if (cancelled || !inlineContainerRef.current) return

        setDocxBlob(blob)
        inlineContainerRef.current.innerHTML = ''

        await renderAsync(blob, inlineContainerRef.current, undefined, {
          className: 'docx-rendered',
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
        })

        if (!cancelled) setLoading(false)
      } catch (err) {
        if (!cancelled) {
          console.error('[DocumentPreview] Erreur DOCX:', err)
          setError(err instanceof Error ? err.message : 'Erreur de chargement')
          setLoading(false)
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [url, resolvedFormat])

  // DOCX fullscreen re-render
  useEffect(() => {
    if (!fullscreen || resolvedFormat !== 'docx' || !docxBlob || !fullscreenContainerRef.current) return

    let cancelled = false
    const render = async () => {
      try {
        const { renderAsync } = await import('docx-preview')
        if (cancelled || !fullscreenContainerRef.current) return

        fullscreenContainerRef.current.innerHTML = ''
        await renderAsync(docxBlob, fullscreenContainerRef.current, undefined, {
          className: 'docx-rendered',
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
        })
      } catch (err) {
        console.error('[DocumentPreview] Erreur DOCX fullscreen:', err)
      }
    }
    render()
    return () => { cancelled = true }
  }, [fullscreen, resolvedFormat, docxBlob])

  // Non-DOCX formats: check preview availability
  useEffect(() => {
    if (resolvedFormat === 'docx') return

    if (effectivePreviewUrl) {
      setLoading(false)
    } else {
      setLoading(false)
      setError('Apercu non disponible')
    }
  }, [resolvedFormat, effectivePreviewUrl])

  // Lock body scroll in fullscreen + ESC handler
  useEffect(() => {
    if (!fullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [fullscreen])

  const renderInlinePreview = () => {
    if (resolvedFormat === 'docx') {
      return (
        <div
          ref={inlineContainerRef}
          className={`doc-container ${loading || error ? 'hidden' : ''}`}
        />
      )
    }

    if (effectivePreviewUrl && !error) {
      return (
        <iframe
          src={effectivePreviewUrl}
          className="doc-iframe"
          title={filename || 'Document'}
        />
      )
    }

    return null
  }

  const renderFullscreenContent = () => {
    if (resolvedFormat === 'docx') {
      return <div ref={fullscreenContainerRef} className="doc-container" />
    }
    if (effectivePreviewUrl) {
      return (
        <iframe
          src={effectivePreviewUrl}
          className="doc-iframe fs"
          title={filename || 'Document'}
        />
      )
    }
    return null
  }

  return (
    <>
      <div className="doc-preview-card">
        <div className="doc-toolbar">
          <div className="doc-toolbar-left">
            <div className="doc-icon" style={{ background: meta.gradient }}>{meta.label}</div>
            <div className="doc-meta">
              <div className="doc-filename">{filename || 'Document'}</div>
              <div className="doc-subtitle">{meta.subtitle}</div>
            </div>
          </div>
          <div className="doc-toolbar-right">
            {(effectivePreviewUrl || resolvedFormat === 'docx') && (
              <button
                type="button"
                className="doc-btn"
                onClick={() => setFullscreen(true)}
                aria-label="Plein ecran"
              >
                Plein ecran
              </button>
            )}
            <a href={url} download={filename} className="doc-btn doc-btn-primary">
              Telecharger
            </a>
          </div>
        </div>

        <div className={`doc-preview-wrapper ${resolvedFormat === 'pdf' ? 'pdf-bg' : ''}`}>
          {loading && (
            <div className="doc-loading">
              <div className="doc-spinner" />
              <span>Chargement du document...</span>
            </div>
          )}
          {error && !loading && (
            <div className="doc-error">
              <p>{error === 'Apercu non disponible' ? 'Apercu non disponible' : 'Impossible de charger l\'apercu'}</p>
              {error !== 'Apercu non disponible' && <span>{error}</span>}
              <a href={url} download={filename} className="doc-btn doc-btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
                Telecharger
              </a>
            </div>
          )}
          {!loading && !error && renderInlinePreview()}
        </div>
      </div>

      {fullscreen && (
        <div className="doc-fullscreen-overlay" onClick={() => setFullscreen(false)}>
          <div className="doc-fullscreen-panel" onClick={(e) => e.stopPropagation()}>
            <div className="doc-fs-toolbar">
              <div className="doc-toolbar-left">
                <div className="doc-icon" style={{ background: meta.gradient }}>{meta.label}</div>
                <div className="doc-meta">
                  <div className="doc-filename">{filename || 'Document'}</div>
                  <div className="doc-subtitle">Apercu plein ecran</div>
                </div>
              </div>
              <div className="doc-toolbar-right">
                <a href={url} download={filename} className="doc-btn doc-btn-primary">
                  Telecharger
                </a>
                <button type="button" className="doc-btn" onClick={() => setFullscreen(false)}>
                  Fermer
                </button>
              </div>
            </div>
            <div className="doc-fs-content">
              {renderFullscreenContent()}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .doc-preview-card {
          margin-top: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-secondary, #f9fafb);
          max-width: 100%;
        }

        .doc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-secondary, #f9fafb);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          gap: 12px;
        }

        .doc-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .doc-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.65rem;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .doc-meta { min-width: 0; flex: 1; }

        .doc-filename {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary, #111827);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .doc-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
          margin-top: 2px;
        }

        .doc-toolbar-right { display: flex; gap: 8px; flex-shrink: 0; }

        .doc-btn {
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

        .doc-btn:hover { background: var(--bg-tertiary, #f3f4f6); }

        .doc-btn-primary {
          background: var(--accent, #4F46E5);
          color: white;
          border-color: var(--accent, #4F46E5);
        }

        .doc-btn-primary:hover { background: var(--accent-hover, #4338CA); }

        .doc-preview-wrapper {
          position: relative;
          max-height: 600px;
          overflow: auto;
          background: #525659;
          padding: 24px;
          min-height: 200px;
        }

        .doc-preview-wrapper.pdf-bg { padding: 0; }

        .doc-loading, .doc-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: #d1d5db;
          text-align: center;
        }

        .doc-error span { font-size: 0.85rem; opacity: 0.7; }

        .doc-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: doc-spin 0.8s linear infinite;
        }

        @keyframes doc-spin { to { transform: rotate(360deg); } }

        .doc-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .doc-container.hidden { display: none; }

        .doc-iframe {
          width: 100%;
          height: 600px;
          border: none;
          background: white;
          display: block;
        }

        .doc-iframe.fs { height: 100%; }

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

        :global(.docx-rendered table) { border-collapse: collapse; }
        :global(.docx-rendered table td), :global(.docx-rendered table th) { padding: 6px 10px; }

        .doc-fullscreen-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          backdrop-filter: blur(4px);
          animation: doc-fade-in 0.2s ease;
        }

        @keyframes doc-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .doc-fullscreen-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #525659;
          margin: 24px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .doc-fs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #2d2d2d;
          border-bottom: 1px solid #444;
          gap: 12px;
        }

        .doc-fs-toolbar .doc-filename { color: white; }
        .doc-fs-toolbar .doc-subtitle { color: #aaa; }

        .doc-fs-content {
          flex: 1;
          overflow: auto;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
        }

        .doc-fs-content .doc-iframe {
          flex: 1;
          height: 100%;
        }

        @media (max-width: 768px) {
          .doc-fullscreen-panel { margin: 0; border-radius: 0; }
          .doc-iframe { height: 400px; }
        }
      `}</style>
    </>
  )
}
