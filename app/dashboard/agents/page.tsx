'use client'

import DashboardHeader from '@/components/Dashboard/Header'
import { agents } from '@/data/agents'

export default function AgentsPage() {
  return (
    <div className="dashboard-content">
      <DashboardHeader pageTitle="Mes Agents" />

      <div className="container-dashboard">
        <div className="page-controls">
          <button className="btn btn-secondary">➕ Ajouter un agent</button>
          <input type="text" placeholder="Rechercher un agent..." className="search-input" />
        </div>

        <div className="agents-table-wrapper">
          <table className="agents-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Domaine</th>
                <th>Statut</th>
                <th>Workflows</th>
                <th>Dernière exécution</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td>
                    <div className="agent-cell">
                      <span className="agent-icon">{agent.icon}</span>
                      <span className="agent-name">{agent.name}</span>
                    </div>
                  </td>
                  <td>{agent.domain}</td>
                  <td>
                    <span className="status-badge active">✓ Actif</span>
                  </td>
                  <td>
                    <span className="workflow-count">5</span>
                  </td>
                  <td>Il y a 2h</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-icon">⚙️</button>
                      <button className="action-icon">📊</button>
                      <button className="action-icon">⋯</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content {
          padding: 30px;
        }

        .container-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-controls {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #000;
        }

        .agents-table-wrapper {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .agents-table {
          width: 100%;
          border-collapse: collapse;
        }

        .agents-table th {
          background: #f5f5f5;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .agents-table td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .agents-table tbody tr:hover {
          background: #fafafa;
        }

        .agents-table tbody tr:last-child td {
          border-bottom: none;
        }

        .agent-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-icon {
          font-size: 1.5rem;
        }

        .agent-name {
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #f0f9f0;
          color: #065f46;
        }

        .workflow-count {
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-icon {
          width: 32px;
          height: 32px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .action-icon:hover {
          border-color: #000;
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .page-controls {
            flex-direction: column;
          }

          .agents-table {
            font-size: 0.9rem;
          }

          .agents-table th,
          .agents-table td {
            padding: 12px 8px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
