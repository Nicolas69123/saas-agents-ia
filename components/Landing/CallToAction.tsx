'use client'

export default function CallToAction() {
  return (
    <section className="cta-section">
      {/* Image de fond CTA */}
      <div className="cta-background">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&fit=crop"
          alt="Équipe collaborative"
          className="cta-bg-image"
        />
        <div className="cta-overlay"></div>
      </div>

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
          position: relative;
          text-align: center;
          min-height: 500px;
          display: flex;
          align-items: center;
        }

        /* Image de fond */
        .cta-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .cta-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.6) 100%);
        }

        .container {
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          margin-bottom: 16px;
          font-size: 2.5rem;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .cta-content > p {
          font-size: 1.2rem;
          color: #ffffff;
          opacity: 0.95;
          margin-bottom: 30px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
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
          color: #ffffff;
          opacity: 0.9;
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
