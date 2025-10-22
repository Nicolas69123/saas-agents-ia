'use client'

import { agents } from '@/data/agents'

export default function AgentsList() {
  return (
    <div className="agents-list">
      {agents.slice(0, 5).map((agent) => (
        <div key={agent.id} className="agent-item">
          <div className="agent-header">
            <span className="agent-icon">{agent.icon}</span>
            <div className="agent-details">
              <h4>{agent.name}</h4>
              <p>{agent.domain}</p>
            </div>
          </div>
          <div className="agent-status">
            <span className="status-badge">✓ Actif</span>
            <button className="agent-action">→</button>
          </div>
        </div>
      ))}

      <a href="/dashboard/agents" className="view-all">
        Voir tous les agents →
      </a>

      <style jsx>{`
        .agents-list {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .agent-item {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .agent-item:hover {
          background: #f5f5f5;
        }

        .agent-item:last-of-type {
          border-bottom: none;
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .agent-icon {
          font-size: 1.5rem;
        }

        .agent-details h4 {
          margin: 0 0 4px 0;
          font-size: 0.95rem;
        }

        .agent-details p {
          margin: 0;
          font-size: 0.85rem;
          opacity: 0.6;
        }

        .agent-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badge {
          font-size: 0.8rem;
          padding: 4px 8px;
          background: #f0f9f0;
          color: #065f46;
          border-radius: 4px;
          font-weight: 600;
        }

        .agent-action {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .agent-action:hover {
          opacity: 1;
        }

        .view-all {
          display: block;
          text-align: center;
          padding: 12px;
          text-decoration: none;
          color: inherit;
          border-top: 1px solid #e5e7eb;
          font-weight: 600;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .view-all:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
