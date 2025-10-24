'use client'

import { features } from '@/data/features'
import Image from 'next/image'

const featureImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Analytics
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Charts
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop', // Team
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop', // Tech
]

export default function FeaturesPage() {
  return (
    <div className="features-page">
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
              <div className="feature-image glass-card">
                <Image
                  src={featureImages[index] || featureImages[0]}
                  alt={feature.title}
                  width={800}
                  height={600}
                  className="feature-img"
                />
              </div>
              <div className="feature-content">
                <span className="feature-icon">{feature.icon}</span>
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
        .features-page {
          background: #000000;
          min-height: 100vh;
        }

        .page-hero {
          background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15), transparent 70%);
          padding: 120px 20px 100px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 24px;
          color: #ffffff;
          font-weight: 800;
        }

        .page-hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .features-full {
          padding: 100px 20px;
        }

        .feature-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-bottom: 120px;
        }

        .feature-block.reverse {
          direction: rtl;
        }

        .feature-block.reverse > * {
          direction: ltr;
        }

        .feature-image {
          overflow: hidden;
          padding: 0;
        }

        .feature-img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          transition: transform 0.4s ease;
        }

        .feature-image:hover .feature-img {
          transform: scale(1.05);
        }

        .feature-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5));
        }

        .feature-content h2 {
          font-size: 2.2rem;
          margin-bottom: 20px;
          color: #ffffff;
          font-weight: 700;
        }

        .feature-content > p {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
          line-height: 1.7;
        }

        .feature-list {
          list-style: none;
        }

        .feature-list li {
          padding: 14px 0;
          padding-left: 36px;
          position: relative;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.05rem;
        }

        .feature-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #3b82f6;
          font-size: 1.2rem;
        }

        .integrations-preview {
          background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1), transparent 70%);
          padding: 100px 20px;
          text-align: center;
        }

        .integrations-preview h2 {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #ffffff;
        }

        .integrations-preview > p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 60px;
          font-size: 1.15rem;
        }

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .integration-card {
          padding: 30px 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .integration-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        }

        .integration-icon {
          font-size: 2.5rem;
        }

        .integration-card span:last-child {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 80px 20px 60px;
          }

          .page-hero h1 {
            font-size: 2rem;
          }

          .features-full {
            padding: 60px 20px;
          }

          .feature-block {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 80px;
          }

          .feature-block.reverse {
            direction: ltr;
          }

          .integrations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
