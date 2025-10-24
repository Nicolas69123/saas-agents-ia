'use client'

import { motion } from 'framer-motion'

export default function PropositionValue() {
  const benefits = [
    {
      icon: '⚡',
      title: '5x plus productif',
      description: 'Automatisez vos processus et gagnez du temps sur les tâches répétitives'
    },
    {
      icon: '💰',
      title: '10x moins cher',
      description: 'Réduisez vos coûts opérationnels avec une solution cloud scalable'
    },
    {
      icon: '🌙',
      title: '24/7 disponible',
      description: 'Vos agents IA travaillent sans interruption, même en dehors des heures'
    },
    {
      icon: '🔌',
      title: 'Facile à intégrer',
      description: 'Connectez-vous à vos outils existants en quelques clics'
    }
  ]

  return (
    <section id="features" className="proposition-section gradient-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Pourquoi choisir nos agents IA?</h2>
          <p>Des avantages tangibles pour votre business</p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="onboarding-section glass-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3>Onboarding rapide</h3>
          <p>Démarrez en moins de 24 heures grâce à notre processus d'intégration optimisé</p>
          <div className="onboarding-steps">
            {[
              { num: 1, label: 'Configuration' },
              { num: 2, label: 'Connexion données' },
              { num: 3, label: 'Tests' },
              { num: 4, label: 'En production' },
            ].map((step, index) => (
              <motion.div
                key={step.num}
                className="step"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <span className="step-number">{step.num}</span>
                <span>{step.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .proposition-section {
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

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .benefit-card {
          padding: 40px 30px;
          text-align: center;
        }

        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          margin-bottom: 14px;
          color: #ffffff;
          font-weight: 700;
        }

        .benefit-card p {
          margin: 0;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .onboarding-section {
          padding: 60px 50px;
          text-align: center;
          margin-top: 40px;
        }

        .onboarding-section h3 {
          font-size: 2rem;
          margin-bottom: 16px;
          color: #ffffff;
          font-weight: 700;
        }

        .onboarding-section > p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 50px;
          font-size: 1.1rem;
        }

        .onboarding-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 60px;
          margin: 0 auto;
          max-width: 900px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .step-number {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.75rem;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .step:hover .step-number {
          transform: scale(1.15);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.6);
        }

        .step span:last-child {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
          line-height: 1.4;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .proposition-section {
            padding: 80px 20px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .onboarding-section {
            padding: 40px 30px;
          }

          .onboarding-steps {
            flex-direction: column;
            gap: 30px;
          }
        }
      `}</style>
    </section>
  )
}
