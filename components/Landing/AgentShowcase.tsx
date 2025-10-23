'use client'

import { useState } from 'react'
import { agents } from '@/data/agents'
import ChatModal from '@/components/Chat/ChatModal'
import { AgentAvatar } from '@/components/OptimizedImage'

export default function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null)
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
              <div className="agent-icon">
                <AgentAvatar
                  src={agent.avatar.url}
                  alt={agent.avatar.alt}
                  size={80}
                  borderColor={agent.avatar.color}
                />
              </div>
              <h3>{agent.name}</h3>
              <p className="agent-description">{agent.description}</p>
              <p className="agent-domain">Domaine: {agent.domain}</p>
              <button
                className="agent-link"
                onClick={() => setSelectedAgent(agent)}
              >
                Discuter avec l'agent →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <ChatModal
          agentId={selectedAgent.id}
          agentName={selectedAgent.name}
          agentIcon={selectedAgent.icon}
          onClose={() => setSelectedAgent(null)}
        />
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

        .agent-icon {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-card h3 {
          font-size: 1.3rem;
          margin-bottom: 12px;
        }

        .agent-description {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.8;
          margin-bottom: 12px;
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

        @media (max-width: 768px) {
          .agents-section {
            padding: 40px 20px;
          }

          .agents-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
