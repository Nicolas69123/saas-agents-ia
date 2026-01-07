'use client'

import { useState, useEffect } from 'react'

const stats = [
  { label: 'Requêtes ce mois', value: '2,847', change: '+12%', color: '#4F46E5' },
  { label: 'Agents actifs', value: '5', change: '+2', color: '#059669' },
  { label: 'Temps économisé', value: '47h', change: '+8h', color: '#7C3AED' },
  { label: 'Taux de réussite', value: '98.5%', change: '+0.3%', color: '#DB2777' },
]

const recentActivity = [
  { agent: 'Lucas', action: 'A généré 3 factures', time: 'Il y a 5 min', avatar: '/avatars/agent-1.png', color: '#4F46E5' },
  { agent: 'Thomas', action: 'A publié 2 posts LinkedIn', time: 'Il y a 15 min', avatar: '/avatars/agent-4.png', color: '#7C3AED' },
  { agent: 'Emma', action: 'A répondu à 12 tickets', time: 'Il y a 30 min', avatar: '/avatars/agent-7.png', color: '#2563EB' },
  { agent: 'Sophie', action: 'A envoyé la newsletter', time: 'Il y a 1h', avatar: '/avatars/agent-5.png', color: '#DB2777' },
  { agent: 'Claire', action: 'A trié 25 CV', time: 'Il y a 2h', avatar: '/avatars/agent-6.png', color: '#EA580C' },
]

const activeAgents = [
  { name: 'Lucas', role: 'Comptable', status: 'active', requests: 847, avatar: '/avatars/agent-1.png', color: '#4F46E5' },
  { name: 'Thomas', role: 'Réseaux Sociaux', status: 'active', requests: 523, avatar: '/avatars/agent-4.png', color: '#7C3AED' },
  { name: 'Emma', role: 'Support Client', status: 'active', requests: 612, avatar: '/avatars/agent-7.png', color: '#2563EB' },
  { name: 'Sophie', role: 'Email Marketing', status: 'active', requests: 234, avatar: '/avatars/agent-5.png', color: '#DB2777' },
  { name: 'Claire', role: 'RH', status: 'paused', requests: 156, avatar: '/avatars/agent-6.png', color: '#EA580C' },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Vue d'ensemble</h1>
          <p>Bienvenue, Jean ! Voici un résumé de votre activité.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            Exporter
          </button>
          <button className="btn-primary">
            + Activer un agent
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {index === 0 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
              {index === 1 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/></svg>}
              {index === 2 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              {index === 3 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <span className="stat-change" style={{ color: stat.color }}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="card activity-card">
          <div className="card-header">
            <h2>Activité récente</h2>
            <button className="btn-link">Voir tout</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">
                  <img src={item.avatar} alt={item.agent} />
                </div>
                <div className="activity-content">
                  <span className="activity-agent">{item.agent}</span>
                  <span className="activity-action">{item.action}</span>
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents */}
        <div className="card agents-card">
          <div className="card-header">
            <h2>Agents actifs</h2>
            <button className="btn-link">Gérer</button>
          </div>
          <div className="agents-list">
            {activeAgents.map((agent) => (
              <div key={agent.name} className="agent-item">
                <div className="agent-info">
                  <div className="agent-avatar">
                    <img src={agent.avatar} alt={agent.name} />
                  </div>
                  <div>
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-role">{agent.role}</span>
                  </div>
                </div>
                <div className="agent-stats">
                  <span className="agent-requests">{agent.requests} req.</span>
                  <span className={`agent-status ${agent.status}`}>
                    {agent.status === 'active' ? 'Actif' : 'Pause'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
            <span className="action-label">Générer une facture</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
            <span className="action-label">Créer un post</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
            <span className="action-label">Envoyer newsletter</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
            <span className="action-label">Parler à un agent</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .page-header h1 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .page-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          padding: 12px 20px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
        }

        .btn-secondary {
          padding: 12px 20px;
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          display: block;
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .stat-change {
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        /* Activity */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .activity-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .activity-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .activity-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .activity-agent {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .activity-action {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .activity-time {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Agents */
        .agents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-name {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .agent-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .agent-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .agent-requests {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .agent-status {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .agent-status.active {
          color: #059669;
        }

        .agent-status.paused {
          color: var(--text-muted);
        }

        /* Quick Actions */
        .quick-actions h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          border-color: var(--accent);
          background: var(--accent-light);
        }

        .action-icon {
          font-size: 1.25rem;
        }

        .action-label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .page-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .btn-primary,
          .btn-secondary {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}
