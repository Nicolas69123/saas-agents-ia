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
          padding: 30px;
        }

        .container-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-section {
          margin-bottom: 50px;
        }

        .stats-section h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .recent-activity {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .recent-left h2,
        .recent-right h3 {
          margin-bottom: 20px;
        }

        .quick-actions,
        .upcoming-events {
          background: #fff;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-weight: 500;
        }

        .action-btn:hover {
          border-color: #000;
          background: #f5f5f5;
        }

        .event-item {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-time {
          font-size: 0.85rem;
          opacity: 0.6;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .recent-activity {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
