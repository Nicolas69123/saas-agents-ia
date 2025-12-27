'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    email: 'demo@aiomnia.fr',
    password: 'demo1234',
    remember: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Save user to localStorage directly for demo
    const userData = { email: formState.email, name: 'Jean Dupont' }
    localStorage.setItem('aiomnia-user', JSON.stringify(userData))

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)

    // Force page reload to update auth state
    window.location.href = '/dashboard'
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
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <Link href="/" className="back-link">
              ← Retour à l'accueil
            </Link>

            <div className="auth-header">
              <div className="logo">
                <img src="/logos/omnia-logo-dark.png" alt="OmnIA" className="logo-img" />
              </div>
              <h1>Bon retour !</h1>
              <p>Connectez-vous pour accéder à votre tableau de bord</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Mot de passe
                  <Link href="/auth/forgot-password" className="forgot-link">
                    Oublié ?
                  </Link>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formState.remember}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom" />
                  <span>Se souvenir de moi</span>
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
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="divider">
              <span>ou continuer avec</span>
            </div>

            <div className="social-buttons">
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="auth-footer">
              Pas encore de compte ?{' '}
              <Link href="/auth/signup">Créer un compte</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="auth-visual-section">
          <div className="visual-content">
            <div className="visual-badge">+500 entreprises nous font confiance</div>
            <h2>Automatisez votre business avec l'IA</h2>
            <p>
              Rejoignez les entreprises qui ont transformé leur productivité
              grâce à nos agents IA spécialisés.
            </p>
            <div className="visual-features">
              <div className="visual-feature">
                <span>Configuration en 5 minutes</span>
              </div>
              <div className="visual-feature">
                <span>Données 100% sécurisées</span>
              </div>
              <div className="visual-feature">
                <span>8 agents spécialisés</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding-top: 80px;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        /* Form Section */
        .auth-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 420px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 40px;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: var(--accent);
        }

        .auth-header {
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .auth-header h1 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .auth-header p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .auth-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .forgot-link {
          font-size: 0.85rem;
          color: var(--accent);
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .form-group input[type="email"],
        .form-group input[type="password"] {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-secondary);
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .checkbox-group {
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .checkbox-label input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
        }

        .checkbox-label input:checked + .checkbox-custom {
          background: var(--accent);
          border-color: var(--accent);
        }

        .checkbox-label input:checked + .checkbox-custom::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 7px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .btn-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }

        .divider span {
          padding: 0 16px;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: var(--border-hover);
          background: var(--bg-secondary);
        }

        .auth-footer {
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .auth-footer a {
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        /* Visual Section */
        .auth-visual-section {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }

        .auth-visual-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -30%;
          width: 100%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        }

        .visual-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
          color: #FFFFFF !important;
        }

        .visual-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(255,255,255,0.2);
          border-radius: 100px;
          font-size: 0.85rem;
          margin-bottom: 24px;
          color: #FFFFFF !important;
        }

        .visual-content h2 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 16px;
          color: #FFFFFF !important;
        }

        .visual-content > p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 40px;
          color: rgba(255,255,255,0.9) !important;
        }

        .visual-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .visual-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1rem;
          color: #FFFFFF !important;
        }

        
        /* Responsive */
        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }

          .auth-visual-section {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .auth-form-section {
            padding: 24px;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
