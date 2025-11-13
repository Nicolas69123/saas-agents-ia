'use client'

import { agents } from '@/data/agents'
import Link from 'next/link'

export default function AgentsPage() {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Mes Agents</h1>
          <p>Gérez vos 8 agents IA spécialisés</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Filtrer</button>
          <Link href="/pricing"><button className="btn-primary">Ajouter un agent</button></Link>
        </div>
      </header>

      <div className="agents-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <img src={agent.avatar} alt={agent.firstName} className="agent-avatar" />
              <span className="status-badge">● Actif</span>
            </div>
            <div className="agent-body">
              <h3>{agent.firstName}</h3>
              <p className="agent-role">{agent.name}</p>
              <p className="agent-domain">{agent.domain}</p>
            </div>
            <div className="agent-stats">
              <div className="stat-item">
                <span className="stat-label">Workflows</span>
                <span className="stat-value">12</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Activité</span>
                <span className="stat-value">5 min</span>
              </div>
            </div>
            <button className="btn-agent">Configurer</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

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

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .agent-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .agent-avatar {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
        }

        .status-badge {
          padding: 4px 10px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .agent-body h3 {
          margin: 0 0 4px 0;
          font-size: 1.25rem;
          color: #0f172a;
        }

        .agent-role {
          margin: 0 0 4px 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .agent-domain {
          margin: 0 0 16px 0;
          font-size: 0.8125rem;
          color: #94a3b8;
        }

        .agent-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .stat-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
        }

        .btn-agent {
          width: 100%;
          padding: 10px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-agent:hover {
          background: #020617;
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

          .agents-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
