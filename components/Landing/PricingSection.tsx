'use client'

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
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
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
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>Tom IA Téléphonique: facturé séparément selon utilisation (0,50€/min)</p>
          <p>Charly+ Premium: +29,90€/mois pour accès exclusif</p>
        </div>
      </div>

      <style jsx>{`
        .pricing-section {
          padding: 80px 20px;
          background: #fff;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .pricing-card {
          padding: 40px 30px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .pricing-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        .pricing-card.featured {
          border: 2px solid #000;
          transform: scale(1.05);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .pricing-card.featured:hover {
          transform: scale(1.08) translateY(-10px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        }

        .pricing-card h3 {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .plan-description {
          font-size: 0.95rem;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .price-container {
          margin: 30px 0;
        }

        .price {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
        }

        .period {
          font-size: 0.95rem;
          opacity: 0.7;
        }

        .pricing-card button {
          width: 100%;
          margin: 20px 0;
          padding: 14px 24px;
        }

        .features-list {
          list-style: none;
          text-align: left;
          margin: 30px 0 0 0;
          padding: 0;
        }

        .features-list li {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.95rem;
          position: relative;
          padding-left: 24px;
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .features-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #000;
        }

        .pricing-note {
          text-align: center;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .pricing-note p {
          margin: 8px 0;
        }

        @media (max-width: 768px) {
          .pricing-section {
            padding: 40px 20px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.featured {
            transform: none;
          }

          .price {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
