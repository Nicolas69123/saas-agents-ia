'use client'

import { features } from '@/data/features'

export default function FeaturesPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Fonctionnalités Puissantes</h1>
          <p>Tout ce dont vous avez besoin pour automatiser votre entreprise</p>
        </div>
      </section>

      <section className="features-full">
        <div className="container">
          {features.map((feature, index) => (
            <div key={index} className={`feature-block ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="feature-image">
                <div className="placeholder">[ {feature.icon} ]</div>
              </div>
              <div className="feature-content">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                <ul className="feature-list">
                  {feature.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="integrations-preview">
        <div className="container">
          <h2>Intégrations Supportées</h2>
          <p>Connectez-vous à vos outils favoris</p>
          <div className="integrations-grid">
            {[
              { name: 'Slack', icon: '💬' },
              { name: 'Gmail', icon: '✉️' },
              { name: 'Zapier', icon: '⚡' },
              { name: 'Stripe', icon: '💳' },
              { name: 'HubSpot', icon: '📊' },
              { name: 'Google Sheets', icon: '📈' },
              { name: 'Notion', icon: '📝' },
              { name: 'Discord', icon: '🎮' }
            ].map((integration, index) => (
              <div key={index} className="integration-card">
                <span className="integration-icon">{integration.icon}</span>
                <span>{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          background: #f5f5f5;
          padding: 80px 20px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .page-hero p {
          font-size: 1.1rem;
          opacity: 0.7;
        }

        .features-full {
          padding: 80px 20px;
        }

        .feature-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 100px;
        }

        .feature-block.reverse {
          direction: rtl;
        }

        .feature-block.reverse > * {
          direction: ltr;
        }

        .feature-image {
          min-height: 400px;
          background: #f5f5f5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder {
          font-size: 4rem;
        }

        .feature-content h2 {
          margin-bottom: 16px;
        }

        .feature-content > p {
          font-size: 1.1rem;
          opacity: 0.7;
          margin-bottom: 24px;
        }

        .feature-list {
          list-style: none;
        }

        .feature-list li {
          padding: 12px 0;
          padding-left: 32px;
          position: relative;
          font-weight: 500;
        }

        .feature-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #000;
        }

        .integrations-preview {
          background: #f5f5f5;
          padding: 80px 20px;
          text-align: center;
        }

        .integrations-preview h2 {
          margin-bottom: 8px;
        }

        .integrations-preview > p {
          opacity: 0.7;
          margin-bottom: 40px;
        }

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
        }

        .integration-card {
          padding: 20px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .integration-card:hover {
          border-color: #000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .integration-icon {
          font-size: 2rem;
        }

        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 1.8rem;
          }

          .feature-block {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .feature-block.reverse {
            direction: ltr;
          }

          .feature-image {
            min-height: 250px;
          }

          .integrations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
