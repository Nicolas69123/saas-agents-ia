'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Mes Agents', icon: '🤖', href: '/dashboard/agents' },
    { label: 'Analytics', icon: '📈', href: '/dashboard/analytics' },
    { label: 'Paramètres', icon: '⚙️', href: '/dashboard/settings' },
  ]

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <h2>SaaS IA</h2>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? 'active'
                : ''
            }`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <p className="user-name">Nicolas</p>
            <p className="user-email">nicolas@ex.com</p>
          </div>
        </div>
        <button className="logout-btn">🚪</button>
      </div>

      <style jsx>{`
        .dashboard-sidebar {
          background: #fff;
          border-right: 1px solid #e5e7eb;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          margin-bottom: 30px;
        }

        .sidebar-logo {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .sidebar-logo h2 {
          margin: 0;
          font-size: 1.3rem;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .sidebar-nav-item:hover {
          background: #f5f5f5;
        }

        .sidebar-nav-item.active {
          background: #f5f5f5;
          border-left-color: #000;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          flex: 1;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .user-info {
          font-size: 0.85rem;
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          margin: 0;
        }

        .user-email {
          opacity: 0.6;
          margin: 0;
        }

        .logout-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .logout-btn:hover {
          border-color: #000;
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: fixed;
            left: -250px;
            top: 0;
            height: 100vh;
            width: 250px;
            z-index: 1000;
            transition: left 0.3s;
          }

          .dashboard-sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </aside>
  )
}
