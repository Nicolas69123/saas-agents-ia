'use client'

import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <Link href="/" className="auth-logo">
            <h2>SaaS Agents IA</h2>
          </Link>

          <h1>Créer un compte</h1>
          <p>Démarrez votre essai gratuit de 14 jours</p>

          <form>
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Entreprise</label>
              <input
                type="text"
                id="company"
                placeholder="Votre entreprise"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password-confirm">Confirmer le mot de passe</label>
              <input
                type="password"
                id="password-confirm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                J'accepte les <Link href="#terms">conditions d'utilisation</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-secondary">
              Créer un compte
            </button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <div className="auth-providers">
            <button className="provider-btn">
              <span>🔵</span> Google
            </button>
            <button className="provider-btn">
              <span>🐙</span> GitHub
            </button>
          </div>

          <p className="auth-footer">
            Vous avez déjà un compte? <Link href="/auth/login">Se connecter</Link>
          </p>
        </div>

        <div className="auth-visual">
          <div className="visual-placeholder">
            <h3>Démarrez maintenant</h3>
            <ul>
              <li>✓ 14 jours gratuits</li>
              <li>✓ Aucune carte requise</li>
              <li>✓ Support complet</li>
              <li>✓ Annulez à tout moment</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f9f9f9;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          width: 100%;
          max-width: 1000px;
          align-items: center;
        }

        .auth-form {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .auth-logo {
          text-decoration: none;
          color: inherit;
          margin-bottom: 30px;
          display: block;
        }

        .auth-logo h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .auth-form h1 {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .auth-form > p {
          opacity: 0.6;
          margin-bottom: 30px;
        }

        form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #000;
        }

        .form-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }

        .form-checkbox input {
          margin-top: 4px;
          width: auto;
        }

        .form-checkbox label {
          margin: 0;
        }

        .form-checkbox a {
          text-decoration: none;
          color: #000;
          font-weight: 600;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 30px 0;
          color: #ccc;
        }

        .auth-divider:before,
        .auth-divider:after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .auth-providers {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .provider-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
        }

        .provider-btn:hover {
          border-color: #000;
          background: #f9f9f9;
        }

        .auth-footer {
          text-align: center;
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .auth-footer a {
          text-decoration: none;
          color: #000;
          font-weight: 600;
        }

        .auth-visual {
          display: none;
        }

        .visual-placeholder {
          background: #f5f5f5;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
        }

        .visual-placeholder h3 {
          margin-bottom: 24px;
        }

        .visual-placeholder ul {
          list-style: none;
          text-align: left;
        }

        .visual-placeholder li {
          padding: 12px 0;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .auth-visual {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .auth-form {
            padding: 30px 20px;
          }

          .auth-container {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  )
}
