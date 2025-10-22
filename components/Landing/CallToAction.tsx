'use client'

export default function CallToAction() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Prêt à transformer votre entreprise?</h2>
          <p>Démarrez gratuitement. Aucune carte bancaire requise.</p>

          <div className="cta-buttons">
            <button className="btn btn-secondary">Essayer gratuitement</button>
            <button className="btn btn-primary">Réserver une démo</button>
          </div>

          <p className="cta-subtext">
            Rejoignez les centaines de PME et startups qui font confiance à nos agents IA
          </p>
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 100px 20px;
          background: #f5f5f5;
          text-align: center;
        }

        .cta-content h2 {
          margin-bottom: 16px;
          font-size: 2.5rem;
        }

        .cta-content > p {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .cta-buttons button {
          min-width: 200px;
        }

        .cta-subtext {
          font-size: 0.95rem;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 60px 20px;
          }

          .cta-content h2 {
            font-size: 1.8rem;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
