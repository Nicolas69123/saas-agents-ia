'use client'

import { motion } from 'framer-motion'

export default function PricingSection() {
  const plans = [
    {
      name: 'Essentiel',
      price: '69,90',
      period: '/mois',
      description: 'Parfait pour débuter',
      features: [
        '3 agents IA activés',
        '1000 appels/mois',
        'Support email',
        'Dashboard basique',
        'Intégrations limitées'
      ],
      cta: 'Commencer'
    },
    {
      name: 'Pro',
      price: '119,90',
      period: '/mois',
      description: 'Le plus populaire',
      featured: true,
      features: [
        'Tous les agents IA',
        'Appels illimités',
        'Support prioritaire',
        'Dashboard complet',
        'Intégrations illimitées',
        'API custom'
      ],
      cta: 'Commencer maintenant'
    },
    {
      name: 'Business+',
      price: 'Devis',
      period: 'personnalisé',
      description: 'Pour les grandes organisations',
      features: [
        'Solutions custom',
        'SLA garanti 99.9%',
        'Support 24/7 dédié',
        'Formation d\'équipe',
        'Infrastructure privée',
        'SSO & sécurité avancée'
      ],
      cta: 'Nous contacter'
    }
  ]

  return (
    <section className="pricing-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Tarification Simple et Transparente</h2>
          <p>Choisissez le plan qui correspond à vos besoins</p>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{
                scale: plan.featured ? 1.08 : 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              {plan.featured && <div className="featured-badge">POPULAIRE</div>}

              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>

              <div className="price-container">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>

              <button className={`btn ${plan.featured ? 'btn-secondary' : 'btn-primary'}`}>
                {plan.cta}
              </button>

              <ul className="features-list">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pricing-note"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p>Tom IA Téléphonique: facturé séparément selon utilisation (0,50€/min)</p>
          <p>Charly+ Premium: +29,90€/mois pour accès exclusif</p>
        </motion.div>
      </div>

      <style jsx>{`
        .pricing-section {
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
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 50px 40px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .pricing-card.featured {
          border: 2px solid rgba(59, 130, 246, 0.5);
          background: rgba(59, 130, 246, 0.08);
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 20px;
          right: -30px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: #ffffff;
          padding: 6px 40px;
          font-size: 0.75rem;
          font-weight: 700;
          transform: rotate(45deg);
          letter-spacing: 0.05em;
        }

        .pricing-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .pricing-card h3 {
          font-size: 1.75rem;
          margin-bottom: 12px;
          color: #ffffff;
          font-weight: 700;
        }

        .plan-description {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 30px;
        }

        .price-container {
          margin: 30px 0;
        }

        .price {
          font-size: 3.5rem;
          font-weight: 800;
          display: block;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .period {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          margin-top: 8px;
        }

        .pricing-card button {
          width: 100%;
          margin: 20px 0 30px;
          padding: 16px 24px;
        }

        .features-list {
          list-style: none;
          text-align: left;
          margin: 0;
          padding: 0;
        }

        .features-list li {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
          position: relative;
          padding-left: 28px;
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .features-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #3b82f6;
          font-size: 1.1rem;
        }

        .pricing-note {
          text-align: center;
          padding: 30px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          font-size: 0.9rem;
        }

        .pricing-note p {
          margin: 8px 0;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .pricing-section {
            padding: 80px 20px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.featured {
            transform: none;
          }

          .featured-badge {
            top: 15px;
            right: -35px;
            padding: 4px 35px;
            font-size: 0.7rem;
          }

          .price {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  )
}
