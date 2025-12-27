'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import { useAuth } from './AuthProvider'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/agents', label: 'Agents' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem 0',
        background: scrolled ? 'var(--bg-primary)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container header-container">
        {/* Logo - Extreme Left */}
        <Link href="/" className="header-logo">
          <Image
            src="/logos/omnia-logo-dark.png"
            alt="OmnIA"
            width={150}
            height={48}
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
            }}
            className="logo-light"
          />
          <Image
            src="/logos/omnia-logo-white.png"
            alt="OmnIA"
            width={150}
            height={48}
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              display: 'none',
            }}
            className="logo-dark"
          />
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className="desktop-nav header-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions - Extreme Right */}
        <div className="header-actions">
          <ThemeToggle />

          {!isLoading && (
            <>
              {user ? (
                /* Profile Button when logged in */
                <div className="profile-wrapper">
                  <button
                    className="profile-btn-with-name"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Profile menu"
                  >
                    <span className="profile-avatar">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="profile-name-btn">{user.name.split(' ')[0]}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-info">
                        <span className="profile-name">{user.name}</span>
                        <span className="profile-email">{user.email}</span>
                      </div>
                      <div className="profile-divider" />
                      <Link href="/dashboard" className="profile-item" onClick={() => setProfileOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <line x1="3" y1="9" x2="21" y2="9"/>
                          <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                        Dashboard
                      </Link>
                      <Link href="/chat" className="profile-item" onClick={() => setProfileOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Chat
                      </Link>
                      <button className="profile-item logout" onClick={() => { logout(); setProfileOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Deconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Signup buttons when not logged in */
                <>
                  <Link
                    href="/auth/login"
                    className="btn btn-ghost desktop-nav"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Connexion
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="btn btn-primary desktop-nav"
                  >
                    Essai gratuit
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Menu"
          >
            <span style={{
              width: 22,
              height: 2,
              background: 'var(--text-primary)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <span style={{
              width: 22,
              height: 2,
              background: 'var(--text-primary)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              opacity: mobileOpen ? 0 : 1,
            }} />
            <span style={{
              width: 22,
              height: 2,
              background: 'var(--text-primary)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          animation: 'slideDown 0.3s ease',
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider" style={{ margin: '0.5rem 0' }} />
            {user ? (
              <>
                <Link href="/dashboard" style={{ color: 'var(--text-secondary)' }}>
                  Dashboard
                </Link>
                <button onClick={logout} style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: 0,
                }}>
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ color: 'var(--text-secondary)' }}>
                  Connexion
                </Link>
                <Link href="/auth/signup" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  Essai gratuit
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <style jsx>{`
        /* Header 3-column layout */
        .header-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
          max-width: 100%;
          padding: 0 24px !important;
        }

        :global(.header-logo) {
          display: flex;
          align-items: center;
          justify-self: start;
        }

        :global(.header-nav) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
        }

        :global(.header-nav a) {
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.2s ease;
          text-decoration: none;
        }

        :global(.header-nav a:hover) {
          color: var(--accent);
        }

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-btn-with-name {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          border-radius: 100px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
        }

        .profile-btn-with-name:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .profile-name-btn {
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          padding: 6px;
          animation: fadeIn 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-info {
          padding: 12px;
        }

        .profile-name {
          display: block;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .profile-email {
          display: block;
          font-size: 0.85rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        .profile-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 0;
        }

        .profile-dropdown :global(a.profile-item),
        .profile-dropdown button.profile-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: var(--text-secondary);
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          line-height: 1;
          box-sizing: border-box;
        }

        .profile-dropdown :global(a.profile-item) svg,
        .profile-dropdown button.profile-item svg {
          flex-shrink: 0;
          opacity: 0.7;
          width: 18px;
          height: 18px;
        }

        .profile-dropdown :global(a.profile-item:hover),
        .profile-dropdown button.profile-item:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .profile-dropdown :global(a.profile-item:hover) svg,
        .profile-dropdown button.profile-item:hover svg {
          opacity: 1;
        }

        .profile-dropdown button.profile-item.logout {
          color: #EF4444;
        }

        .profile-dropdown button.profile-item.logout svg {
          opacity: 0.8;
        }

        .profile-dropdown button.profile-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .profile-dropdown button.profile-item.logout:hover svg {
          opacity: 1;
        }

        @media (max-width: 768px) {
          :global(.desktop-nav) { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .profile-wrapper { display: none; }
          .profile-name-btn { display: none; }
        }

        /* Logo theme switching */
        :global(.logo-light) { display: block !important; }
        :global(.logo-dark) { display: none !important; }

        :global([data-theme="dark"]) :global(.logo-light) { display: none !important; }
        :global([data-theme="dark"]) :global(.logo-dark) { display: block !important; }
      `}</style>
    </header>
  )
}
