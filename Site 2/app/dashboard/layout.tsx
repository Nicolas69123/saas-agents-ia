'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import Header from '@/components/Header'

const sidebarLinks = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: 'chart', exact: true },
  { href: '/dashboard/agents', label: 'Mes Agents', icon: 'robot', exact: false },
  { href: '/dashboard/settings', label: 'Paramètres', icon: 'settings', exact: false },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <>
    <Header />
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href, link.exact) ? 'active' : ''}`}
            >
              {link.icon === 'chart' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              )}
              {link.icon === 'robot' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <line x1="12" y1="7" x2="12" y2="11"/>
                  <circle cx="8" cy="16" r="1"/>
                  <circle cx="16" cy="16" r="1"/>
                </svg>
              )}
              {link.icon === 'settings' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
            {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          </button>

          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <span className="user-name">Jean Dupont</span>
              <span className="user-plan">Plan Business</span>
            </div>
          </div>

          <Link href="/" className="logout-link">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: calc(100vh - 72px);
          background: var(--bg-secondary);
          margin-top: 72px;
        }

        /* Sidebar */
        .sidebar {
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 72px;
          height: calc(100vh - 72px);
        }


        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-nav :global(a) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          line-height: 1;
        }

        .sidebar-nav :global(a svg) {
          flex-shrink: 0;
          opacity: 0.7;
          width: 18px;
          height: 18px;
        }

        .sidebar-nav :global(a:hover) {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .sidebar-nav :global(a:hover svg) {
          opacity: 1;
        }

        .sidebar-nav :global(a.active) {
          background: var(--accent-light);
          color: var(--accent);
        }

        .sidebar-nav :global(a.active svg) {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
        }

        .sidebar-footer :global(button.theme-toggle) {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
          line-height: 1;
        }

        .sidebar-footer :global(button.theme-toggle svg) {
          flex-shrink: 0;
          opacity: 0.7;
          width: 18px;
          height: 18px;
        }

        .sidebar-footer :global(button.theme-toggle:hover) {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .sidebar-footer :global(button.theme-toggle:hover svg) {
          opacity: 1;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .user-plan {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .logout-link {
          display: block;
          text-align: center;
          padding: 10px;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .logout-link:hover {
          color: var(--accent);
        }

        /* Main */
        .dashboard-main {
          padding: 32px;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
    </>
  )
}
