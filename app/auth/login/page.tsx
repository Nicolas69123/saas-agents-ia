'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('nicolas@omnia.ai')
  const [password, setPassword] = useState('demo123456')
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Stocker dans localStorage
    const userData = {
      email,
      loggedIn: true,
      loginDate: new Date().toISOString()
    }

    localStorage.setItem('omnia_user', JSON.stringify(userData))

    if (remember) {
      localStorage.setItem('omnia_remember', 'true')
    }

    // Rediriger vers homepage avec refresh
    window.location.href = '/'
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <Link href="/" className="auth-logo">
            Omnia
          </Link>

          <div className="auth-header">
            <h1>Bienvenue</h1>
            <p>Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-remember">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="#forgot" className="forgot-link">
                Mot de passe oublié?
              </Link>
            </div>

            <button type="submit" className="btn-submit">
              Se connecter
            </button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <div className="auth-providers">
            <button type="button" className="provider-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="provider-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="auth-footer">
            Pas encore de compte? <Link href="/auth/signup">Créer un compte</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
        }

        .auth-card {
          background: #fff;
          padding: 48px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .auth-logo {
          font-size: 1.75rem;
          font-weight: 700;
          text-decoration: none;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          margin-bottom: 32px;
          text-align: center;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-header h1 {
          font-size: 2rem;
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .auth-header p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 0.875rem;
          color: #334155;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0f172a;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
        }

        .form-remember {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          font-size: 0.875rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #334155;
        }

        .checkbox-label input {
          cursor: pointer;
        }

        .forgot-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
        }

        .forgot-link:hover {
          color: #0f172a;
        }

        .btn-submit {
          width: 100%;
          padding: 14px 24px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          margin-bottom: 24px;
        }

        .btn-submit:hover {
          background: #020617;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: #cbd5e1;
          font-size: 0.875rem;
        }

        .auth-divider:before,
        .auth-divider:after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .auth-providers {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .provider-btn {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          color: #334155;
          font-family: inherit;
        }

        .provider-btn:hover {
          border-color: #cbd5e1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .auth-footer {
          text-align: center;
          font-size: 0.9375rem;
          color: #64748b;
        }

        .auth-footer a {
          text-decoration: none;
          color: #0f172a;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .auth-card {
            padding: 32px 24px;
          }

          .auth-header h1 {
            font-size: 1.75rem;
          }

          .provider-btn {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  )
}
