'use client'

import { useState } from 'react'
import { agents } from '@/data/agents'

export default function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const openAgentInfo = (agent: typeof agents[0]) => {
    setSelectedAgent(agent)
    setShowModal(true)
  }

  return (
    <section id="agents" className="agents-section">
      <div className="container">
        <div className="section-header">
          <h2>Nos Agents IA Spécialisés</h2>
          <p>8 assistants autonomes conçus pour automatiser vos processus métier</p>
        </div>

        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-avatar">
                <img src={agent.avatar} alt={agent.firstName} className="avatar-image" />
              </div>
              <div className="agent-info">
                <h3 className="agent-firstname">{agent.firstName}</h3>
                <p className="agent-role">{agent.name}</p>
                <span className="agent-domain-badge">{agent.domain}</span>
              </div>
              <p className="agent-description">Expert en {agent.domain.toLowerCase()}</p>
              <div className="agent-actions">
                <button
                  className="agent-link-chat"
                  onClick={() => window.location.href = `/chat/${agent.id}`}
                >
                  💬 Discuter
                </button>
                <button
                  className="agent-link-info"
                  onClick={() => openAgentInfo(agent)}
                >
                  ℹ️ En savoir +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Détails Agent */}
      {showModal && selectedAgent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-avatar">
                <img src={selectedAgent.avatar} alt={selectedAgent.firstName} />
              </div>
              <div className="modal-header-text">
                <h2>{selectedAgent.firstName}</h2>
                <p className="modal-role">{selectedAgent.name}</p>
                <span className="modal-badge">{selectedAgent.domain}</span>
              </div>
            </div>

            <div className="modal-body">
              <h3>Description complète</h3>
              <p className="modal-description">{selectedAgent.description}</p>

              <h3>Compétences</h3>
              <ul className="modal-skills">
                {selectedAgent.suggestions.map((sug, i) => (
                  <li key={i}>
                    <span className="skill-icon">{sug.icon}</span>
                    <div>
                      <strong>{sug.title}</strong>
                      <p>{sug.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-footer">
              <button className="btn-primary-modal" onClick={() => {
                setShowModal(false)
                window.location.href = `/chat/${selectedAgent.id}`
              }}>
                Discuter avec {selectedAgent.firstName}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .agents-section {
          padding: 80px 20px;
          background: #fff;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          margin-bottom: 16px;
        }

        .section-header p {
          font-size: 1.1rem;
          opacity: 0.7;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .agent-card {
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .agent-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          border-color: #000;
          transform: translateY(-8px) scale(1.02);
        }

        .agent-avatar {
          width: 180px;
          height: 180px;
          margin: 0 auto 24px;
          border-radius: 20px;
          overflow: hidden;
          background: #f5f5f5;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-info {
          text-align: center;
          margin-bottom: 16px;
        }

        .agent-firstname {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111;
          margin: 0 0 6px 0;
        }

        .agent-role {
          font-size: 0.9375rem;
          color: #666;
          font-weight: 500;
          margin: 0 0 12px 0;
        }

        .agent-domain-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #333;
          font-weight: 600;
        }

        .agent-description {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.8;
          margin-bottom: 20px;
        }

        .agent-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .agent-link-chat,
        .agent-link-info {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: inherit;
        }

        .agent-link-chat {
          background: #0f172a;
          color: #fff;
        }

        .agent-link-chat:hover {
          background: #020617;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.3);
        }

        .agent-link-info {
          background: #fff;
          color: #0f172a;
          border: 1.5px solid #e5e7eb;
        }

        .agent-link-info:hover {
          background: #f9fafb;
          border-color: #000;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .agent-domain {
          font-size: 0.85rem;
          opacity: 0.6;
          margin-bottom: 20px;
        }

        .agent-link {
          background: none;
          border: none;
          text-decoration: none;
          color: inherit;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          padding: 0;
          font: inherit;
          display: inline-block;
          position: relative;
        }

        .agent-link:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #000;
          transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .agent-link:hover {
          transform: translateX(4px);
        }

        .agent-link:hover:after {
          width: 100%;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-content {
          background: #fff;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          background: #f5f5f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: #e5e7eb;
          transform: rotate(90deg);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 40px 40px 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-avatar {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .modal-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-header-text h2 {
          margin: 0 0 6px 0;
          font-size: 1.75rem;
          color: #111;
        }

        .modal-role {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 1rem;
        }

        .modal-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #333;
        }

        .modal-body {
          padding: 30px 40px;
        }

        .modal-body h3 {
          margin: 0 0 16px 0;
          font-size: 1.125rem;
          color: #111;
        }

        .modal-description {
          margin: 0 0 30px 0;
          color: #666;
          line-height: 1.6;
        }

        .modal-skills {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 16px;
        }

        .modal-skills li {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .skill-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .modal-skills strong {
          display: block;
          margin-bottom: 4px;
          color: #111;
        }

        .modal-skills p {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .modal-footer {
          padding: 20px 40px 40px;
        }

        .btn-primary-modal {
          width: 100%;
          padding: 14px 24px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary-modal:hover {
          background: #020617;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .agents-section {
            padding: 40px 20px;
          }

          .agents-grid {
            grid-template-columns: 1fr;
          }

          .modal-header {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-footer {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  )
}
