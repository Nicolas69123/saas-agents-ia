'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Link href="/">
              <h2>SaaS Agents IA</h2>
            </Link>
          </div>

          <ul className="navbar-menu">
            <li><Link href="/features">Fonctionnalités</Link></li>
            <li><Link href="/pricing">Tarification</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>

          <div className="navbar-actions">
            <Link href="/auth/login" className="btn btn-primary">Se connecter</Link>
            <Link href="/auth/signup" className="btn btn-secondary">S'inscrire</Link>
          </div>
        </nav>
      </div>

      <style jsx>{`
        header {
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(10px);
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          gap: 40px;
        }

        .navbar-brand h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .navbar-brand a {
          text-decoration: none;
          color: inherit;
        }

        .navbar-menu {
          display: flex;
          list-style: none;
          gap: 30px;
          flex: 1;
        }

        .navbar-menu a {
          text-decoration: none;
          color: inherit;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .navbar-menu a:hover {
          opacity: 0.6;
        }

        .navbar-actions {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-wrap: wrap;
            gap: 16px;
          }

          .navbar-menu {
            order: 3;
            width: 100%;
            flex-direction: column;
            gap: 12px;
          }

          .navbar-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </header>
  )
}
