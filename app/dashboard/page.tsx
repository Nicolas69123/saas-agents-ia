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
    { label: 'Agents Actifs', value: '8', subtext: 'sur 8 agents', trend: '+2' },
    { label: 'Workflows', value: '1,247', subtext: 'ce mois', trend: '+18%' },
    { label: 'Temps Économisé', value: '156h', subtext: 'ce mois', trend: '+42h' },
    { label: 'Plan Actuel', value: 'Pro', subtext: '119€/mois', trend: null }
  ]

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1>Vue d'ensemble</h1>
          <p>Bonjour {user?.email?.split('@')[0] || 'Nicolas'}, voici votre activité</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            </svg>
            <span className="notif-badge">3</span>
          </button>
          <Link href="/pricing">
            <button className="btn-primary">Upgrade Plan</button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
              <span className="stat-subtext">{stat.subtext}</span>
              {stat.trend && <span className="stat-trend">↗ {stat.trend}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Agents Card */}
        <section className="content-card">
          <div className="card-header">
            <h2>Mes Agents</h2>
            <Link href="/dashboard/agents" className="card-link">Voir tout →</Link>
          </div>
          <div className="agents-list">
            {agents.slice(0, 6).map((agent) => (
              <div key={agent.id} className="agent-item">
                <img src={agent.avatar} alt={agent.firstName} className="agent-img" />
                <div className="agent-info">
                  <span className="agent-name">{agent.firstName}</span>
                  <span className="agent-role">{agent.name}</span>
                </div>
                <span className="status-active">●</span>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Card */}
        <section className="content-card">
          <div className="card-header">
            <h2>Activité Récente</h2>
          </div>
          <div className="activity-list">
            {[
              { agent: 'Lucas', action: 'a généré la facture #1247', time: '5 min' },
              { agent: 'Thomas', action: 'a publié un post LinkedIn', time: '12 min' },
              { agent: 'Marc', action: 'a créé un rapport de trésorerie', time: '1h' },
              { agent: 'Sophie', action: 'a envoyé une newsletter', time: '2h' },
            ].map((activity, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <strong>{activity.agent}</strong> {activity.action}
                </div>
                <span className="activity-time">{activity.time}</span>
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
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin: 0 0 6px 0;
          font-size: 2rem;
          color: #0f172a;
        }

        .page-header p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 10px 18px;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .btn-primary {
          background: #0f172a;
          color: #fff;
        }

        .btn-primary:hover {
          background: #020617;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #fff;
          color: #0f172a;
          border: 1.5px solid #e2e8f0;
        }

        .btn-secondary:hover {
          border-color: #cbd5e1;
        }

        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }

        .stat-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
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
          font-size: 0.8125rem;
          font-weight: 600;
          color: #10b981;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
        }

        .card-link {
          font-size: 0.875rem;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
        }

        .card-link:hover {
          color: #0f172a;
        }

        /* Agents List */
        .agents-list {
          padding: 0;
        }

        .agent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s ease;
        }

        .agent-item:hover {
          background: #f8fafc;
        }

        .agent-item:last-child {
          border-bottom: none;
        }

        .agent-img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
        }

        .agent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
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

        .status-active {
          color: #10b981;
          font-size: 1.25rem;
        }

        /* Activity */
        .activity-list {
          padding: 20px 24px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          background: #0f172a;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          font-size: 0.875rem;
          color: #64748b;
        }

        .activity-content strong {
          color: #0f172a;
          font-weight: 600;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 20px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
