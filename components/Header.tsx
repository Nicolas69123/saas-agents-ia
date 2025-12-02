'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('omnia_user')
    if (userData) {
      const user = JSON.parse(userData)
      setIsLoggedIn(user.loggedIn)
      setUserEmail(user.email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('omnia_user')
    localStorage.removeItem('omnia_remember')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <nav className="header-nav">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="/logos/ai-omnia-logo.svg" alt="AI OmniA" className="logo-image" />
          </Link>

          {/* Menu - UNE SEULE CLASSE */}
          <div className="menu">
            <Link href="/features" className="menu-item">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="menu-item">
              Tarification
            </Link>
            <Link href="/blog" className="menu-item">
              Blog
            </Link>
          </div>

          {/* Actions */}
          <div className="actions">
            {isLoggedIn ? (
              <div className="user-menu">
                <button className="user-profile-btn">
                  <div className="profile-avatar">{userEmail[0]?.toUpperCase() || 'N'}</div>
                  <span>{userEmail.split('@')[0]}</span>
                </button>
                <div className="dropdown-menu">
                  <Link href="/dashboard">Vue d'ensemble</Link>
                  <Link href="/dashboard/agents">Mes Agents</Link>
                  <Link href="/dashboard/analytics">Analytics</Link>
                  <Link href="/dashboard/settings">Paramètres</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout}>Déconnexion</button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="btn-ghost">Se connecter</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="btn-primary">S'inscrire</button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      <style jsx global>{`
        .site-header {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 10000;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header-nav {
          display: flex;
          align-items: center;
          height: 70px;
          gap: 60px;
        }

        /* Logo */
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
        }

        .logo-image {
          height: 45px;
          width: auto;
          transition: transform 0.3s ease;
        }

        .logo:hover .logo-image {
          transform: scale(1.05);
        }

        /* Menu - UNE SEULE CLASSE */
        .menu {
          display: flex;
          gap: 40px;
          flex: 1;
        }

        .menu-item {
          position: relative;
          display: inline-block;
          color: #0f172a;
          font-weight: 500;
          font-size: 0.9375rem;
          padding: 8px 0;
        }

        .menu-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #0f172a;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .menu-item:hover::after {
          transform: scaleX(1);
        }

        /* Actions */
        .actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary,
        .btn-ghost {
          padding: 10px 18px;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .btn-primary {
          background: #0f172a;
          color: #ffffff;
        }

        .btn-primary:hover {
          background: #020617;
          transform: translateY(-1px);
        }

        .btn-ghost {
          background: transparent;
          color: #64748b;
        }

        .btn-ghost:hover {
          background: #f8fafc;
          color: #334155;
        }

        /* User Menu */
        .user-menu {
          position: relative;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
        }

        .user-profile-btn:hover {
          border-color: #cbd5e1;
        }

        .profile-avatar {
          width: 28px;
          height: 28px;
          background: #0f172a;
          color: #fff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .user-menu:hover .dropdown-menu,
        .dropdown-menu:hover {
          display: block;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-width: 200px;
          padding: 8px;
          z-index: 1000;
        }

        .user-menu::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          height: 12px;
          background: transparent;
        }

        .dropdown-menu a,
        .dropdown-menu button {
          display: block;
          width: 100%;
          padding: 10px 12px;
          text-decoration: none;
          color: #0f172a;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.2s ease;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }

        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background: #f8fafc;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        @media (max-width: 768px) {
          .header-nav {
            flex-direction: column;
            height: auto;
            padding: 20px 0;
            gap: 20px;
          }

          .menu {
            flex-direction: column;
            gap: 12px;
          }

          .actions {
            width: 100%;
          }

          .btn-primary,
          .btn-ghost {
            width: 100%;
          }
        }
      `}</style>
    </header>
  )
}
