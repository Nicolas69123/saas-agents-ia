'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyChat, setNotifyChat] = useState(true)
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system')
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedMsg('Preferences enregistrees.')
    setTimeout(() => setSavedMsg(null), 2500)
  }

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Connexion requise</h1>
          <p>Connecte-toi pour acceder a tes parametres.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="profile-main">
        <header className="profile-head">
          <h1>Parametres</h1>
          <p>Gere ton compte et tes preferences.</p>
        </header>

        <form onSubmit={handleSave} className="settings">
          <section className="card">
            <h2>Compte</h2>
            <div className="row">
              <label>
                <span>Nom</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton nom" />
              </label>
              <label>
                <span>Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@exemple.com" />
              </label>
            </div>
          </section>

          <section className="card">
            <h2>Notifications</h2>
            <label className="toggle">
              <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
              <span>Notifications par email</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={notifyChat} onChange={(e) => setNotifyChat(e.target.checked)} />
              <span>Notifications dans le chat</span>
            </label>
          </section>

          <section className="card">
            <h2>Apparence</h2>
            <div className="themes">
              {(['system', 'light', 'dark'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`theme ${theme === t ? 'active' : ''}`}
                  onClick={() => setTheme(t)}
                >
                  {t === 'system' ? 'Auto' : t === 'light' ? 'Clair' : 'Sombre'}
                </button>
              ))}
            </div>
          </section>

          <section className="card danger">
            <h2>Zone sensible</h2>
            <p>Suppression du compte irreversible. Toutes les conversations et documents seront perdus.</p>
            <button type="button" className="btn-danger">Supprimer mon compte</button>
          </section>

          <div className="footer-actions">
            {savedMsg && <span className="saved">{savedMsg}</span>}
            <button type="submit" className="btn-primary">Enregistrer</button>
          </div>
        </form>
      </main>

      <style jsx>{`
        .profile-main { max-width: 720px; margin: 0 auto; padding: 110px 24px 64px; }
        .profile-head { margin-bottom: 28px; }
        .profile-head h1 { margin: 0; font-size: 1.85rem; }
        .profile-head p { margin: 6px 0 0; color: #6b7280; }
        .settings { display: flex; flex-direction: column; gap: 18px; }
        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 22px; }
        .card h2 { margin: 0 0 16px; font-size: 1.05rem; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
        label { display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; color: #374151; }
        input[type="text"], input[type="email"], input:not([type]) {
          padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px;
          font-size: 0.9rem; background: #fff;
        }
        input:focus { outline: none; border-color: #4F46E5; }
        .toggle { flex-direction: row; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; }
        .toggle input { width: 16px; height: 16px; accent-color: #4F46E5; cursor: pointer; }
        .themes { display: flex; gap: 8px; flex-wrap: wrap; }
        .theme {
          padding: 10px 18px; border: 1px solid #e5e7eb; background: #fff;
          border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 0.88rem;
          color: #6b7280; transition: all 0.2s;
        }
        .theme:hover { border-color: #4F46E5; color: #4F46E5; }
        .theme.active { background: #EEF2FF; border-color: #c7d2fe; color: #4F46E5; }
        .card.danger { border-color: #fecaca; background: #fef2f2; }
        .card.danger h2 { color: #991b1b; }
        .card.danger p { color: #7f1d1d; font-size: 0.88rem; margin: 0 0 14px; }
        .btn-danger {
          padding: 10px 18px; background: #fff; color: #dc2626;
          border: 1px solid #fecaca; border-radius: 10px;
          font-weight: 600; cursor: pointer;
        }
        .btn-danger:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
        .footer-actions { display: flex; justify-content: flex-end; align-items: center; gap: 14px; }
        .saved { color: #10b981; font-size: 0.88rem; font-weight: 500; }
        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff; border: none; border-radius: 12px;
          font-weight: 600; cursor: pointer; font-size: 0.92rem;
          transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
      `}</style>
    </>
  )
}
