'use client'

import { useState, useEffect } from 'react'

const allAgents = [
  {
    id: 1,
    name: 'Lucas',
    role: 'Agent Comptable',
    category: 'Finance',
    initial: 'L',
    color: '#4F46E5',
    status: 'active',
    requests: 847,
    description: 'Automatise votre comptabilité : factures, notes de frais, rapports.',
  },
  {
    id: 2,
    name: 'Marc',
    role: 'Agent Trésorier',
    category: 'Finance',
    initial: 'M',
    color: '#059669',
    status: 'inactive',
    requests: 0,
    description: 'Gère votre trésorerie avec des prévisions précises.',
  },
  {
    id: 3,
    name: 'Julie',
    role: 'Agent Investissements',
    category: 'Finance',
    initial: 'J',
    color: '#0891B2',
    status: 'inactive',
    requests: 0,
    description: 'Analyse vos opportunités d\'investissement.',
  },
  {
    id: 4,
    name: 'Thomas',
    role: 'Agent Réseaux Sociaux',
    category: 'Marketing',
    initial: 'T',
    color: '#7C3AED',
    status: 'active',
    requests: 523,
    description: 'Crée et planifie vos contenus sur tous les réseaux.',
  },
  {
    id: 5,
    name: 'Sophie',
    role: 'Agent Email Marketing',
    category: 'Marketing',
    initial: 'S',
    color: '#DB2777',
    status: 'active',
    requests: 234,
    description: 'Conçoit des campagnes email performantes.',
  },
  {
    id: 6,
    name: 'Claire',
    role: 'Agent RH',
    category: 'RH',
    initial: 'C',
    color: '#EA580C',
    status: 'paused',
    requests: 156,
    description: 'Simplifie vos processus RH : recrutement, onboarding.',
  },
  {
    id: 7,
    name: 'Emma',
    role: 'Agent Support Client',
    category: 'Support',
    initial: 'E',
    color: '#2563EB',
    status: 'active',
    requests: 612,
    description: 'Répond à vos clients 24/7 avec intelligence.',
  },
  {
    id: 8,
    name: 'Léa',
    role: 'Agent Téléphonique',
    category: 'Support',
    initial: 'L',
    color: '#16A34A',
    status: 'inactive',
    requests: 0,
    description: 'Gère vos appels entrants et sortants.',
  },
]

export default function DashboardAgentsPage() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredAgents = allAgents.filter(agent => {
    const matchesFilter = filter === 'all' || agent.status === filter
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeCount = allAgents.filter(a => a.status === 'active').length
  const pausedCount = allAgents.filter(a => a.status === 'paused').length

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
    <div className="agents-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Mes Agents</h1>
          <p>Gérez et configurez vos agents IA actifs.</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Actifs</span>
          </div>
          <div className="header-stat">
            <span className="stat-number">{pausedCount}</span>
            <span className="stat-label">En pause</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input
            type="text"
            placeholder="Rechercher un agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {['all', 'active', 'paused', 'inactive'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' && 'Tous'}
              {f === 'active' && 'Actifs'}
              {f === 'paused' && 'En pause'}
              {f === 'inactive' && 'Non activés'}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className={`agent-card ${agent.status}`}>
            {/* Card Header - Avatar + Status */}
            <div className="agent-header">
              <div className="agent-avatar" style={{ backgroundColor: `${agent.color}15`, color: agent.color }}>
                {agent.initial}
              </div>
              <div className="agent-status-badge" data-status={agent.status}>
                {agent.status === 'active' && 'Actif'}
                {agent.status === 'paused' && 'Pause'}
                {agent.status === 'inactive' && 'Non actif'}
              </div>
            </div>

            {/* Card Content - Name, Role, Description */}
            <div className="agent-content">
              <h3>{agent.name}</h3>
              <p className="agent-role">{agent.role}</p>
              <p className="agent-desc">{agent.description}</p>
            </div>

            {/* Card Footer - Stats + Actions */}
            <div className="agent-footer">
              {/* Stats - Always visible */}
              <div className="agent-stats">
                <span className="stat-value">{agent.requests}</span>
                <span className="stat-label">requetes</span>
              </div>

              {/* Actions - Same structure for all */}
              <div className="agent-actions">
                {agent.status === 'active' && (
                  <button className="btn-primary" style={{ backgroundColor: agent.color }}>
                    Discuter
                  </button>
                )}
                {agent.status === 'paused' && (
                  <button className="btn-primary" style={{ backgroundColor: agent.color }}>
                    Reprendre
                  </button>
                )}
                {agent.status === 'inactive' && (
                  <button className="btn-primary" style={{ backgroundColor: agent.color }}>
                    Activer
                  </button>
                )}
                <button className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="empty-state">
          <span><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <p>Aucun agent trouvé</p>
        </div>
      )}

      <style jsx>{`
        .agents-page {
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

        .header-stats {
          display: flex;
          gap: 24px;
        }

        .header-stat {
          text-align: center;
        }

        .header-stat .stat-number {
          display: block;
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent);
        }

        .header-stat .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Filters */
        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          flex: 1;
          max-width: 320px;
        }

        .search-icon {
          font-size: 1rem;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 18px;
          border: 1px solid var(--border-color);
          border-radius: 100px;
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        /* Agents Grid */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        /* Card Structure */
        .agent-card {
          display: flex;
          flex-direction: column;
          height: 280px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .agent-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .agent-card.inactive {
          opacity: 0.75;
        }

        /* Card Header */
        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .agent-status-badge {
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .agent-status-badge[data-status="active"] {
          background: rgba(5, 150, 105, 0.1);
          color: #059669;
        }

        .agent-status-badge[data-status="paused"] {
          background: rgba(234, 179, 8, 0.1);
          color: #CA8A04;
        }

        .agent-status-badge[data-status="inactive"] {
          background: var(--bg-secondary);
          color: var(--text-muted);
        }

        /* Card Content */
        .agent-content {
          flex: 1;
          min-height: 0;
        }

        .agent-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .agent-role {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .agent-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Card Footer */
        .agent-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
        }

        .agent-stats {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .agent-stats .stat-value {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .agent-stats .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Actions */
        .agent-actions {
          display: flex;
          gap: 8px;
        }

        .btn-primary {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .empty-state span {
          font-size: 3rem;
          display: block;
          margin-bottom: 16px;
        }

        .empty-state p {
          font-size: 1rem;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: none;
          }

          .filter-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
