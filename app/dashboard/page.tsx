'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { agents } from '@/data/agents'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('omnia_user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const stats = [
    {
      label: 'Agents Actifs',
      value: '8',
      subtext: 'sur 8 agents',
      trend: '+2',
      icon: 'robot'
    },
    {
      label: 'Workflows',
      value: '1,247',
      subtext: 'ce mois',
      trend: '+18%',
      icon: 'workflow'
    },
    {
      label: 'Temps Économisé',
      value: '156h',
      subtext: 'ce mois',
      trend: '+42h',
      icon: 'clock'
    },
    {
      label: 'Plan Actuel',
      value: 'Pro',
      subtext: '119€/mois',
      trend: null,
      icon: 'plan'
    }
  ]

  const activities = [
    { agent: 'Lucas', action: 'a généré la facture #1247', time: '5 min', avatar: agents[0].avatar },
    { agent: 'Thomas', action: 'a publié un post LinkedIn', time: '12 min', avatar: agents[3].avatar },
    { agent: 'Marc', action: 'a créé un rapport de trésorerie', time: '1h', avatar: agents[1].avatar },
    { agent: 'Sophie', action: 'a envoyé une newsletter', time: '2h', avatar: agents[4].avatar },
    { agent: 'Claire', action: 'a analysé 5 CV', time: '3h', avatar: agents[5].avatar },
  ]

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'robot':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        )
      case 'workflow':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        )
      case 'clock':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        )
      case 'plan':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1>Vue d'ensemble</h1>
          <p>Bonjour {user?.email?.split('@')[0] || 'Nicolas'}, voici votre activité du jour</p>
        </div>
        <div className="header-actions">
          <button className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <Link href="/pricing">
            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Upgrade Pro
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-section">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">{renderIcon(stat.icon)}</div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
              <span className="stat-subtext">{stat.subtext}</span>
              {stat.trend && (
                <span className="stat-trend">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Agents Card */}
        <section className="content-card">
          <div className="card-header">
            <h2>Mes Agents IA</h2>
            <Link href="/dashboard/agents" className="card-link">
              Voir tout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          <div className="agents-list">
            {agents.slice(0, 6).map((agent) => (
              <div key={agent.id} className="agent-item">
                <div className="agent-avatar-wrapper">
                  <img src={agent.avatar} alt={agent.firstName} className="agent-avatar" />
                  <span className="agent-status"></span>
                </div>
                <div className="agent-info">
                  <span className="agent-name">{agent.firstName}</span>
                  <span className="agent-role">{agent.name}</span>
                </div>
                <span className="agent-category">{agent.domain}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Card */}
        <section className="content-card">
          <div className="card-header">
            <h2>Activité Récente</h2>
            <button className="card-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Aujourd'hui
            </button>
          </div>
          <div className="activity-list">
            {activities.map((activity, i) => (
              <div key={i} className="activity-item">
                <img src={activity.avatar} alt={activity.agent} className="activity-avatar" />
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.agent}</strong> {activity.action}
                  </div>
                  <span className="activity-time">{activity.time} ago</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        /* Base */
        .dashboard-page {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .page-header p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn-icon {
          position: relative;
          width: 44px;
          height: 44px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .btn-primary {
          padding: 12px 20px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #020617;
          transform: translateY(-1px);
        }

        /* Stats Section */
        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 0;
        }

        .stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .stat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-subtext {
          font-size: 0.8125rem;
          color: #94a3b8;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #10b981;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-top: 0;
        }

        .content-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .card-link:hover {
          color: #0f172a;
        }

        .card-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-action:hover {
          background: #f1f5f9;
        }

        /* Agents List */
        .agents-list {
          padding: 0;
        }

        .agent-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.2s ease;
        }

        .agent-item:hover {
          background: #fafbfc;
        }

        .agent-item:last-child {
          border-bottom: none;
        }

        .agent-avatar-wrapper {
          position: relative;
        }

        .agent-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
        }

        .agent-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid #fff;
          border-radius: 50%;
        }

        .agent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .agent-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.9375rem;
        }

        .agent-role {
          font-size: 0.8125rem;
          color: #64748b;
        }

        .agent-category {
          font-size: 0.75rem;
          color: #94a3b8;
          padding: 4px 10px;
          background: #f8fafc;
          border-radius: 6px;
          font-weight: 500;
        }

        /* Activity List */
        .activity-list {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-text {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
        }

        .activity-text strong {
          color: #0f172a;
          font-weight: 600;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 20px;
            gap: 24px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }

          .page-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
