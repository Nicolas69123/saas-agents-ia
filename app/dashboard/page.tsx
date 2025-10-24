'use client'

import DashboardHeader from '@/components/Dashboard/Header'
import StatsCard from '@/components/Dashboard/StatsCard'
import AgentsList from '@/components/Dashboard/AgentsList'

export default function DashboardPage() {
  const stats = [
    { label: 'Agents Actifs', value: '8', icon: '🤖', change: '+2 ce mois' },
    { label: 'Workflows', value: '24', icon: '⚙️', change: '+5 ce mois' },
    { label: 'Automatisations', value: '156', icon: '⚡', change: '+42 ce mois' },
    { label: 'Économies', value: '12,540€', icon: '💰', change: '+28% vs mois dernier' }
  ]

  return (
    <div className="dashboard-content">
      <DashboardHeader />

      <div className="container-dashboard">
        <section className="stats-section">
          <h2>Aperçu</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </section>

        <section className="recent-activity">
          <div className="recent-left">
            <h2>Agents Récents</h2>
            <AgentsList />
          </div>

          <div className="recent-right">
            <div className="quick-actions">
              <h3>Actions Rapides</h3>
              <button className="action-btn">➕ Ajouter un agent</button>
              <button className="action-btn">📝 Créer un workflow</button>
              <button className="action-btn">🔧 Configurer</button>
            </div>

            <div className="upcoming-events">
              <h3>Événements à venir</h3>
              <div className="event-item">
                <span className="event-time">Aujourd'hui</span>
                <span>Maintenance serveur</span>
              </div>
              <div className="event-item">
                <span className="event-time">Demain</span>
                <span>Webinaire: Intégration n8n</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard-content {
          padding: 40px;
          background: #000000;
          min-height: 100vh;
        }

        .container-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-section {
          margin-bottom: 60px;
        }

        .stats-section h2 {
          margin-bottom: 30px;
          font-size: 2rem;
          color: #ffffff;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .recent-activity {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .recent-left h2,
        .recent-right h3 {
          margin-bottom: 24px;
          color: #ffffff;
          font-weight: 700;
        }

        .recent-left h2 {
          font-size: 1.8rem;
        }

        .recent-right h3 {
          font-size: 1.3rem;
        }

        .quick-actions,
        .upcoming-events {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 20px;
          margin-bottom: 24px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .quick-actions:hover,
        .upcoming-events:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.2);
        }

        .action-btn {
          width: 100%;
          padding: 16px 18px;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .action-btn:hover {
          border-color: rgba(59, 130, 246, 0.6);
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .event-item {
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .event-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .event-item span {
          color: rgba(255, 255, 255, 0.85);
        }

        .event-time {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1024px) {
          .recent-activity {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
