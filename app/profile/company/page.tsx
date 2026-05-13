'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CompanyFile {
  name: string
  size: number
  uploadedAt: string
}

const AGENT_TARGETS = [
  { id: '', label: 'Tous les agents (partage)', icon: '/' },
  { id: 'compta', label: 'Agent Comptable (Lucas)', icon: 'C' },
  { id: 'rh', label: 'Agent RH (Claire)', icon: 'R' },
  { id: 'social', label: 'Agent Reseaux Sociaux (Thomas)', icon: 'S' },
  { id: 'marketing', label: 'Agent Email Marketing (Sophie)', icon: 'M' },
  { id: 'tresorerie', label: 'Agent Tresorier (Marc)', icon: 'T' },
  { id: 'invest', label: 'Agent Investissements (Julie)', icon: 'I' },
  { id: 'support', label: 'Agent Support (Emma)', icon: 'P' },
  { id: 'tel', label: 'Agent Telephonique (Lea)', icon: 'L' },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf': return 'PDF'
    case 'csv': case 'xlsx': case 'xls': return 'XLS'
    case 'json': return 'JSON'
    case 'txt': return 'TXT'
    case 'doc': case 'docx': return 'DOC'
    case 'png': case 'jpg': case 'jpeg': return 'IMG'
    default: return 'FILE'
  }
}

export default function CompanyPage() {
  const [files, setFiles] = useState<CompanyFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/company')
      const data = await res.json()
      setFiles(data.files || [])
    } catch {
      setFiles([])
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setMessage(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (selectedAgent) {
        formData.append('agentId', selectedAgent)
      }

      const res = await fetch('/api/company', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: `${file.name} uploade avec succes` })
        fetchFiles()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur upload' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    }
    setIsUploading(false)
  }

  const deleteFile = async (filename: string) => {
    try {
      const res = await fetch('/api/company', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: `${filename} supprime` })
        fetchFiles()
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de suppression' })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <>
      <Header />
      <div className="company-page">
        <div className="company-container">
          <div className="page-header">
            <h1>Documents Entreprise</h1>
            <p>Uploadez les documents de votre entreprise pour donner du contexte a vos agents IA.</p>
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
              <button onClick={() => setMessage(null)} className="close-msg">x</button>
            </div>
          )}

          <div className="upload-section">
            <div className="agent-selector">
              <label>Destinataire</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {AGENT_TARGETS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf,.csv,.xlsx,.xls,.json,.txt,.doc,.docx,.png,.jpg,.jpeg'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) uploadFile(file)
                }
                input.click()
              }}
            >
              {isUploading ? (
                <div className="upload-progress">
                  <div className="spinner" />
                  <span>Upload en cours...</span>
                </div>
              ) : (
                <>
                  <div className="drop-icon">+</div>
                  <p>Glissez un fichier ici ou cliquez pour parcourir</p>
                  <span className="drop-hint">PDF, CSV, Excel, JSON, TXT, DOC, Images - Max 10 Mo</span>
                </>
              )}
            </div>
          </div>

          <div className="files-section">
            <h2>Documents uploades ({files.length})</h2>
            {files.length === 0 ? (
              <div className="empty-state">
                <p>Aucun document pour le moment.</p>
                <p className="empty-hint">Uploadez vos bilans, factures, fiches de paie, K-bis, statuts, organigrammes...</p>
              </div>
            ) : (
              <div className="files-list">
                {files.map((file) => (
                  <div key={file.name} className="file-item">
                    <div className="file-icon">{getFileIcon(file.name)}</div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-meta">
                        {formatFileSize(file.size)} - {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <button className="file-delete" onClick={() => deleteFile(file.name)}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Comment ca fonctionne ?</h3>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-num">1</div>
                <h4>Uploadez</h4>
                <p>Deposez vos documents comptables, RH, ou tout fichier utile.</p>
              </div>
              <div className="info-card">
                <div className="info-num">2</div>
                <h4>Ciblez</h4>
                <p>Choisissez a quel agent envoyer le document, ou partagez-le avec tous.</p>
              </div>
              <div className="info-card">
                <div className="info-num">3</div>
                <h4>Discutez</h4>
                <p>Les agents s appuient sur vos documents pour des reponses precises et contextualisees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .company-page { min-height: 100vh; background: var(--bg-primary); padding-top: 100px; padding-bottom: 60px; }
        .company-container { max-width: 800px; margin: 0 auto; padding: 0 24px; }
        .page-header { margin-bottom: 32px; }
        .page-header h1 { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .page-header p { color: var(--text-secondary); font-size: 1rem; }
        .message { padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
        .message.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .message.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .close-msg { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: inherit; opacity: 0.6; }
        .upload-section { margin-bottom: 40px; }
        .agent-selector { margin-bottom: 16px; }
        .agent-selector label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text-primary); margin-bottom: 6px; }
        .agent-selector select { width: 100%; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.95rem; cursor: pointer; }
        .drop-zone { border: 2px dashed var(--border-color); border-radius: 16px; padding: 48px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: var(--bg-secondary); }
        .drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); background: rgba(79, 70, 229, 0.05); }
        .drop-zone.uploading { pointer-events: none; opacity: 0.7; }
        .drop-icon { font-size: 2.5rem; color: var(--accent); margin-bottom: 12px; font-weight: 300; }
        .drop-zone p { color: var(--text-primary); font-size: 1rem; margin-bottom: 4px; }
        .drop-hint { color: var(--text-secondary); font-size: 0.85rem; }
        .upload-progress { display: flex; align-items: center; gap: 12px; justify-content: center; }
        .spinner { width: 24px; height: 24px; border: 3px solid #e5e7eb; border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .files-section { margin-bottom: 40px; }
        .files-section h2 { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }
        .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); }
        .empty-hint { font-size: 0.85rem; margin-top: 4px; opacity: 0.7; }
        .files-list { display: flex; flex-direction: column; gap: 8px; }
        .file-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); }
        .file-icon { width: 40px; height: 40px; border-radius: 8px; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
        .file-info { flex: 1; min-width: 0; }
        .file-name { display: block; font-weight: 500; color: var(--text-primary); font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .file-meta { font-size: 0.8rem; color: var(--text-secondary); }
        .file-delete { background: none; border: 1px solid #fecaca; color: #dc2626; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .file-delete:hover { background: #fef2f2; }
        .info-section { margin-top: 48px; }
        .info-section h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .info-card { padding: 20px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); }
        .info-num { width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; }
        .info-card h4 { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .info-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
        @media (max-width: 640px) { .info-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
