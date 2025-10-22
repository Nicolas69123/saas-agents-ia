'use client'

export default function PropositionValue() {
  const benefits = [
    {
      title: '5x plus productif',
      description: 'Automatisez vos processus et gagnez du temps sur les tâches répétitives'
    },
    {
      title: '10x moins cher',
      description: 'Réduisez vos coûts opérationnels avec une solution cloud scalable'
    },
    {
      title: '24/7 disponible',
      description: 'Vos agents IA travaillent sans interruption, même en dehors des heures'
    },
    {
      title: 'Facile à intégrer',
      description: 'Connectez-vous à vos outils existants en quelques clics'
    }
  ]

  return (
    <section id="features" className="proposition-section">
      <div className="container">
        <div className="section-header">
          <h2>Pourquoi choisir nos agents IA?</h2>
          <p>Des avantages tangibles pour votre business</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-number">{index + 1}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="onboarding-section">
          <h3>Onboarding rapide</h3>
          <p>Démarrez en moins de 24 heures grâce à notre processus d'intégration optimisé</p>
          <div className="onboarding-steps">
            <div className="step">
              <span className="step-number">1</span>
              <span>Configuration</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span>Connexion données</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span>Tests</span>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <span>En production</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .proposition-section {
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

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .benefit-card {
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: #000;
        }

        .benefit-number {
          position: absolute;
          top: -16px;
          left: 30px;
          width: 32px;
          height: 32px;
          background: #fff;
          border: 2px solid #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .benefit-card h3 {
          margin-top: 20px;
          margin-bottom: 12px;
        }

        .benefit-card p {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .onboarding-section {
          background: #f5f5f5;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .onboarding-section:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .onboarding-section h3 {
          margin-bottom: 16px;
        }

        .onboarding-section > p {
          opacity: 0.7;
          margin-bottom: 30px;
        }

        .onboarding-steps {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .proposition-section {
            padding: 40px 20px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .onboarding-steps {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  )
}
