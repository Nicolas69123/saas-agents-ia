'use client'

import PricingSection from '@/components/Landing/PricingSection'

export default function PricingPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Tarification Simple et Transparente</h1>
          <p>Trouvez le plan qui correspond à vos besoins</p>
        </div>
      </section>

      <PricingSection />

      <section className="faq-preview">
        <div className="container">
          <h2>Questions Fréquentes sur la Tarification</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Puis-je changer de plan?</h3>
              <p>Oui, changez de plan à tout moment. Les changements prennent effet immédiatement.</p>
            </div>
            <div className="faq-item">
              <h3>Y a-t-il une période d'essai?</h3>
              <p>Oui, 14 jours gratuits sans carte bancaire pour tous les plans.</p>
            </div>
            <div className="faq-item">
              <h3>Acceptez-vous les paiements annuels?</h3>
              <p>Oui, avec une réduction de 20% si vous payez annuellement.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        div {
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

        .faq-preview {
          padding: 100px 20px;
          background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1), transparent 70%);
        }

        .faq-preview h2 {
          text-align: center;
          margin-bottom: 60px;
          font-size: 2.5rem;
          color: #ffffff;
          font-weight: 700;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .faq-item {
          padding: 40px 35px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .faq-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        }

        .faq-item h3 {
          margin-bottom: 16px;
          font-size: 1.3rem;
          color: #ffffff;
          font-weight: 700;
        }

        .faq-item p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-size: 1.05rem;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 80px 20px 60px;
          }

          .page-hero h1 {
            font-size: 2rem;
          }

          .faq-preview {
            padding: 60px 20px;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
