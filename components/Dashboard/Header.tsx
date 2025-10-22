'use client'

import Link from 'next/link'

interface DashboardHeaderProps {
  pageTitle?: string
}

export default function DashboardHeader({ pageTitle = 'Dashboard' }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <h1>{pageTitle}</h1>
        <div className="header-actions">
          <button className="notification-btn">🔔</button>
          <div className="user-menu">
            <button className="user-avatar">👤</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 30px;
          margin-bottom: 30px;
        }

        .dashboard-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 1.8rem;
        }

        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .notification-btn,
        .user-avatar {
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover,
        .user-avatar:hover {
          border-color: #000;
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 0 20px;
          }

          .dashboard-header h1 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </header>
  )
}
