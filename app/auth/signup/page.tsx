'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignupPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formState.password !== formState.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (formState.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caract\u00e8res')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          password: formState.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la cr\u00e9ation du compte')
        setIsLoading(false)
        return
      }

      // Auto-login after signup
      const result = await signIn('credentials', {
        email: formState.email,
        password: formState.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Compte cr\u00e9\u00e9 mais erreur de connexion. Essayez de vous connecter.')
        setIsLoading(false)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Erreur de connexion au serveur')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

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
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-visual-section">
            <div className="visual-content">
              <div className="visual-badge">Commencez gratuitement</div>
              <h2>Transformez votre entreprise en quelques clics</h2>
              <p>
                Cr&eacute;ez votre compte et acc&eacute;dez instantan&eacute;ment &agrave; nos 8 agents IA
                pour automatiser vos processus.
              </p>

              <div className="testimonial">
                <p className="testimonial-text">
                  &ldquo;OmnIA nous a permis de r&eacute;duire de 70% le temps consacr&eacute;
                  &agrave; notre comptabilit&eacute;. C&apos;est un game-changer !&rdquo;
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">ML</div>
                  <div>
                    <strong>Marie Laurent</strong>
                    <span>CEO, TechStart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <Link href="/" className="back-link">
              &larr; Retour &agrave; l&apos;accueil
            </Link>

            <div className="auth-header">
              <div className="logo">
                <img src="/logos/omnia-logo-dark.png" alt="OmnIA" className="logo-img" />
              </div>
              <h1>Cr&eacute;er un compte</h1>
              <p>Commencez votre essai gratuit de 14 jours</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email professionnel</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="jean@entreprise.fr"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                    placeholder="Min. 8 caract&#232;res"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkbox-custom" />
                  <span>
                    J&apos;accepte les{' '}
                    <a href="/legal/terms" target="_blank">conditions d&apos;utilisation</a>
                    {' '}et la{' '}
                    <a href="/legal/privacy" target="_blank">politique de confidentialit&eacute;</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Cr&eacute;ation...
                  </>
                ) : (
                  'Cr\u00e9er mon compte gratuit'
                )}
              </button>
            </form>

            <div className="divider">
              <span>ou s&apos;inscrire avec</span>
            </div>

            <div className="social-buttons">
              <button className="social-btn" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub (bientot)
              </button>
            </div>

            <p className="auth-footer-text">
              D&eacute;j&agrave; un compte ?{' '}
              <Link href="/auth/login">Se connecter</Link>
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .auth-page { min-height: 100vh; background: var(--bg-primary); padding-top: 80px; }
        .auth-container { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .auth-visual-section { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); display: flex; align-items: center; justify-content: center; padding: 60px; position: relative; overflow: hidden; }
        .auth-visual-section::before { content: ''; position: absolute; bottom: -50%; left: -30%; width: 100%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); }
        .visual-content { position: relative; z-index: 1; max-width: 480px; color: #FFFFFF !important; }
        .visual-badge { display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 100px; font-size: 0.85rem; margin-bottom: 24px; color: #FFFFFF !important; }
        .visual-content h2 { font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 16px; color: #FFFFFF !important; }
        .visual-content > p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 48px; color: rgba(255,255,255,0.9) !important; }
        .testimonial { padding: 28px; background: rgba(255,255,255,0.15); border-radius: 20px; backdrop-filter: blur(10px); }
        .testimonial-text { font-size: 1rem; font-style: italic; line-height: 1.6; margin-bottom: 20px; color: #FFFFFF !important; }
        .testimonial-author { display: flex; align-items: center; gap: 14px; }
        .author-avatar { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 600; color: #FFFFFF !important; }
        .testimonial-author strong { display: block; font-size: 0.95rem; color: #FFFFFF !important; }
        .testimonial-author span { font-size: 0.85rem; color: rgba(255,255,255,0.8) !important; }
        .auth-form-section { display: flex; align-items: center; justify-content: center; padding: 40px; }
        .auth-form-wrapper { width: 100%; max-width: 420px; }
        .back-link { display: inline-flex; align-items: center; font-size: 0.9rem; color: var(--text-secondary); text-decoration: none; margin-bottom: 40px; transition: color 0.3s ease; }
        .back-link:hover { color: var(--accent); }
        .auth-header { margin-bottom: 32px; }
        .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
        .logo-img { height: 48px; width: auto; object-fit: contain; }
        .auth-header h1 { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .auth-header p { font-size: 1rem; color: var(--text-secondary); }
        .error-message { padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626; font-size: 0.9rem; margin-bottom: 20px; }
        .auth-form { margin-bottom: 24px; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; opacity: 0.45; transition: opacity 0.3s ease; }
        .input-icon-wrapper:focus-within .input-icon { opacity: 0.85; color: var(--accent); }
        .form-group input[type="text"], .form-group input[type="email"], .form-group input[type="password"] { width: 100%; padding: 14px 18px 14px 48px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); font-size: 1rem; color: var(--text-primary); transition: all 0.3s ease; }
        .form-group input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }
        .checkbox-group { margin-bottom: 24px; }
        .checkbox-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
        .checkbox-label input { position: absolute; opacity: 0; width: 0; height: 0; }
        .checkbox-custom { flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px; border: 2px solid var(--border-color); border-radius: 6px; transition: all 0.3s ease; position: relative; }
        .checkbox-label input:checked + .checkbox-custom { background: var(--accent); border-color: var(--accent); }
        .checkbox-label input:checked + .checkbox-custom::after { content: ''; position: absolute; top: 4px; left: 7px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
        .checkbox-label a { color: var(--accent); text-decoration: none; }
        .checkbox-label a:hover { text-decoration: underline; }
        .btn-submit { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 24px; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
        .btn-submit:hover:not(:disabled) { background: var(--accent-hover); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { display: flex; align-items: center; margin: 24px 0; font-size: 0.85rem; color: var(--text-secondary); }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border-color); }
        .divider span { padding: 0 16px; }
        .social-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 20px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-primary); color: var(--text-primary); font-weight: 500; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; }
        .social-btn:hover { background: var(--bg-secondary); }
        .auth-footer-text { text-align: center; font-size: 0.95rem; color: var(--text-secondary); }
        .auth-footer-text a { color: var(--accent); font-weight: 500; text-decoration: none; }
        .auth-footer-text a:hover { text-decoration: underline; }
        @media (max-width: 1024px) { .auth-container { grid-template-columns: 1fr; } .auth-visual-section { display: none; } }
        @media (max-width: 480px) { .auth-form-section { padding: 24px; } .social-buttons { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
