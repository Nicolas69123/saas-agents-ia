'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Chatbot de support de la vitrine (IA via /api/support, claude -p).
// Cache sur le chat agent, le dashboard et les pages auth pour eviter le doublon.
const HIDDEN_ON_PATHS = ['/chat', '/dashboard', '/auth']

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Quels agents proposez-vous ?',
  'Combien ça coûte ?',
  'Comment ça marche ?',
]

export default function SupportChat() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant OmnIA. Une question sur nos agents, les tarifs ou le fonctionnement ?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  if (pathname && HIDDEN_ON_PATHS.some((p) => pathname.startsWith(p))) return null

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMsg: Msg = { role: 'user', content: trimmed }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: messages.slice(1) }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || "Desole, je n'ai pas pu repondre." }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Une erreur reseau est survenue. Reessaie ou contacte-nous via la page Contact." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="support-fab" aria-label="Assistance OmnIA" onClick={() => setOpen((o) => !o)}>
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="support-panel" role="dialog" aria-label="Assistance OmnIA">
          <div className="support-header">
            <span className="support-dot" />
            <div>
              <strong>Assistant OmnIA</strong>
              <span className="support-sub">Réponses en direct</span>
            </div>
          </div>

          <div className="support-body">
            {messages.map((m, i) => (
              <div key={i} className={`support-msg ${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="support-msg assistant support-typing">
                <span /><span /><span />
              </div>
            )}
            {messages.length <= 1 && !loading && (
              <div className="support-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="support-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="support-input-row" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input
              className="support-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              aria-label="Votre question"
              disabled={loading}
            />
            <button type="submit" className="support-send" aria-label="Envoyer" disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .support-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(79, 70, 229, 0.4);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 95;
        }
        .support-fab:hover { transform: scale(1.08); }

        .support-panel {
          position: fixed;
          bottom: 6rem;
          right: 2rem;
          width: 380px;
          max-width: calc(100vw - 2rem);
          height: 520px;
          max-height: calc(100vh - 8rem);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 95;
          animation: support-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes support-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .support-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .support-header strong {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .support-sub { display: block; font-size: 0.78rem; color: var(--text-tertiary); }
        .support-dot { width: 10px; height: 10px; border-radius: 50%; background: #16A34A; flex-shrink: 0; }

        .support-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .support-msg {
          max-width: 85%;
          padding: 0.7rem 0.95rem;
          border-radius: 14px;
          font-size: 0.9rem;
          line-height: 1.55;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .support-msg.user { align-self: flex-end; background: var(--accent); color: #fff; }
        .support-msg.assistant { align-self: flex-start; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); }

        .support-typing { display: flex; gap: 4px; align-items: center; }
        .support-typing span {
          width: 7px; height: 7px; border-radius: 50%; background: var(--text-tertiary);
          animation: support-blink 1.2s infinite both;
        }
        .support-typing span:nth-child(2) { animation-delay: 0.2s; }
        .support-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes support-blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

        .support-suggestions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem; }
        .support-chip {
          text-align: left;
          padding: 0.6rem 0.85rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .support-chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

        .support-input-row {
          display: flex;
          gap: 0.5rem;
          padding: 0.875rem;
          border-top: 1px solid var(--border);
        }
        .support-input {
          flex: 1;
          padding: 0.7rem 0.9rem;
          font-family: inherit;
          font-size: 0.9rem;
          color: var(--text-primary);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .support-input:focus { outline: none; border-color: var(--accent); }
        .support-send {
          width: 42px;
          flex-shrink: 0;
          background: var(--accent);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .support-send:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </>
  )
}
