'use client'

import { agents } from '@/data/agents'
import Link from 'next/link'
import { useState } from 'react'

export default function AgentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredAgents = selectedCategory === 'all'
    ? agents
    : agents.filter(agent => agent.category === selectedCategory)

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1>Mes Agents IA</h1>
          <p>Gérez et configurez vos {agents.length} agents spécialisés</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">🔍 Rechercher</button>
          <Link href="/pricing">
            <button className="btn-primary">➕ Ajouter un agent</button>
          </Link>
        </div>
      </header>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tous les agents ({agents.length})
          </button>
          <button
            className={`filter-tab ${selectedCategory === 'finance' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('finance')}
          >
            💰 Finance ({agents.filter(a => a.category === 'finance').length})
          </button>
          <button
            className={`filter-tab ${selectedCategory === 'management' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('management')}
          >
            📊 Gestion ({agents.filter(a => a.category === 'management').length})
          </button>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="agents-grid">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <div className="agent-avatar-large">
                <img src={agent.avatar} alt={agent.firstName} />
                <span className="agent-emoji">{agent.icon}</span>
              </div>
              <div className="agent-badge">
                <span className="status-dot"></span>
                Actif
              </div>
            </div>

            <div className="agent-card-body">
              <h3>{agent.firstName}</h3>
              <p className="agent-title">{agent.name}</p>
              <p className="agent-description">{agent.description}</p>
              <div className="agent-tags">
                <span className="tag">{agent.domain}</span>
                <span className="tag">{agent.category === 'finance' ? 'Finance' : 'Gestion'}</span>
              </div>
            </div>

            <div className="agent-card-stats">
              <div className="stat-item">
                <span className="stat-label">Workflows</span>
                <span className="stat-value">{Math.floor(Math.random() * 50) + 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Dernier activité</span>
                <span className="stat-value">{Math.floor(Math.random() * 60)} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Taux succès</span>
                <span className="stat-value">98%</span>
              </div>
            </div>

            <div className="agent-card-footer">
              <button className="btn-config">⚙️ Configurer</button>
              <button className="btn-chat">💬 Tester</button>
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        /* Variables CSS */
        :global(:root) {
          --dashboard-padding: 40px;
          --section-gap: 32px;
          --card-gap: 24px;
          --item-gap: 16px;
          --border-radius-lg: 16px;
          --border-radius-md: 12px;
          --border-radius-sm: 10px;
          --color-primary: #0f172a;
          --color-border: #e2e8f0;
          --color-text-primary: #0f172a;
          --color-text-secondary: #64748b;
          --color-text-tertiary: #94a3b8;
          --color-success: #10b981;
        }

        /* Base */
        .dashboard-page {
          padding: var(--dashboard-padding);
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--section-gap);
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
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }

        .page-header p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 20px;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-primary {
          background: var(--color-primary);
          color: #fff;
        }

        .btn-primary:hover {
          background: #020617;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #fff;
          color: var(--color-text-primary);
          border: 1.5px solid var(--color-border);
        }

        .btn-secondary:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        /* Filter Section */
        .filter-section {
          background: #fff;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          padding: 24px;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
        }

        .filter-tab {
          padding: 10px 18px;
          background: transparent;
          border: 1.5px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .filter-tab:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .filter-tab.active {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }

        /* Agents Grid */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--card-gap);
        }

        .agent-card {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .agent-card-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .agent-avatar-large {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .agent-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: var(--border-radius-md);
          object-fit: cover;
        }

        .agent-emoji {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 32px;
          height: 32px;
          background: #fff;
          border: 2px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .agent-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--color-success);
          border-radius: 50%;
        }

        .agent-card-body {
          padding: 0 24px 20px 24px;
          flex: 1;
        }

        .agent-card-body h3 {
          margin: 0 0 4px 0;
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .agent-title {
          margin: 0 0 8px 0;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .agent-description {
          margin: 0 0 16px 0;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .agent-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 4px 10px;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-tertiary);
        }

        .agent-card-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.6875rem;
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .agent-card-footer {
          padding: 20px 24px;
          display: flex;
          gap: 12px;
        }

        .btn-config, .btn-chat {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-config {
          background: var(--color-primary);
          color: #fff;
        }

        .btn-config:hover {
          background: #020617;
        }

        .btn-chat {
          background: #f8fafc;
          color: var(--color-text-primary);
          border: 1.5px solid var(--color-border);
        }

        .btn-chat:hover {
          background: #f1f5f9;
        }

        /* Responsive */
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

          .filter-tabs {
            flex-direction: column;
          }

          .filter-tab {
            width: 100%;
          }

          .agents-grid {
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
