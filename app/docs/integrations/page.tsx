'use client'

export default function IntegrationsPage() {
  const integrations = [
    { name: 'n8n', icon: '⚡', category: 'Automation' },
    { name: 'Zapier', icon: '🔗', category: 'Automation' },
    { name: 'Slack', icon: '💬', category: 'Communication' },
    { name: 'Gmail', icon: '✉️', category: 'Email' },
    { name: 'Google Sheets', icon: '📊', category: 'Data' },
    { name: 'Notion', icon: '📝', category: 'Productivity' },
    { name: 'Stripe', icon: '💳', category: 'Payment' },
    { name: 'HubSpot', icon: '📈', category: 'CRM' }
  ]

  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Intégrations</h1>
          <p>Connectez SaaS Agents IA avec vos outils préférés</p>

          <div className="integrations-grid">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-card">
                <div className="integration-icon">{integration.icon}</div>
                <h3>{integration.name}</h3>
                <span className="category">{integration.category}</span>
                <p>Configuration disponible...</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .integration-card {
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          text-align: center;
          background: #fff;
          transition: all 0.3s ease;
        }

        .integration-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          border-color: #000;
        }

        .integration-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .integration-card h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }

        .category {
          display: inline-block;
          padding: 4px 12px;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-bottom: 12px;
        }

        .integration-card p {
          margin: 12px 0 0 0;
          opacity: 0.6;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}
