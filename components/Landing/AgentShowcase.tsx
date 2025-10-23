'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { agents } from '@/data/agents'
import ChatModal from '@/components/Chat/ChatModal'

export default function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null)

  // Couleurs par agent ID (sans le #)
  const getAgentColor = (agentId: string): string => {
    const colors: Record<string, string> = {
      'comptable': '3b82f6',
      'tresorier': '10b981',
      'investissements': '8b5cf6',
      'reseaux-sociaux': 'ec4899',
      'email-marketing': 'f59e0b',
      'ressources-humaines': '06b6d4',
      'support-client': '60a5fa',
      'telephonique': '6366f1',
    }
    return colors[agentId] || '3b82f6'
  }

  return (
    <section id="agents" className="agents-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Nos Agents IA Spécialisés</h2>
          <p>8 assistants autonomes conçus pour automatiser vos processus métier</p>
        </motion.div>

        <div className="agents-grid">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="agent-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                y: -12,
                transition: { duration: 0.3 },
              }}
              onClick={() => setSelectedAgent(agent)}
            >
              {/* Avatar avec UI Avatars (initiales + couleur) */}
              <div className="agent-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=120&background=${getAgentColor(agent.id)}&color=fff&bold=true&rounded=true&font-size=0.35`}
                  alt={agent.name}
                />
              </div>

              <h3>{agent.name}</h3>
              <p className="agent-description">{agent.description}</p>
              <p className="agent-domain">
                <span className="domain-badge">{agent.domain}</span>
              </p>

              <button className="agent-link">
                Discuter avec l'agent →
              </button>
            </motion.div>
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
          padding: 120px 20px;
          background: #000000;
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-header h2 {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin-bottom: 20px;
          color: #ffffff;
          font-weight: 800;
        }

        .section-header p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .agent-card {
          padding: 40px 30px;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .agent-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .agent-card:hover::before {
          opacity: 1;
        }

        .agent-avatar {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 20px;
        }

        .agent-card h3 {
          font-size: 1.5rem;
          margin-bottom: 14px;
          color: #ffffff;
          font-weight: 700;
        }

        .agent-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 16px;
        }

        .agent-domain {
          margin-bottom: 24px;
        }

        .domain-badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          font-size: 0.85rem;
          color: #60a5fa;
          font-weight: 600;
        }

        .agent-link {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          font-size: 0.95rem;
        }

        .agent-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .agents-section {
            padding: 80px 20px;
          }

          .agents-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </section>
  )
}
