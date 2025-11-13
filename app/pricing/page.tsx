'use client'

import PricingSection from '@/components/Landing/PricingSection'

export default function PricingPage() {
  return (
    <div>
      <section className="page-hero">
        {/* Image de fond */}
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80&fit=crop"
            alt="Business et Finance"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>

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
        .page-hero {
          padding: 120px 20px;
          text-align: center;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
        }

        /* Image de fond */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
        }

        .container {
          position: relative;
          z-index: 1;
        }

        .page-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .page-hero p {
          font-size: 1.1rem;
          color: #ffffff;
          opacity: 0.95;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        .faq-preview {
          padding: 80px 20px;
        }

        .faq-preview h2 {
          text-align: center;
          margin-bottom: 50px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .faq-item {
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .faq-item h3 {
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .faq-item p {
          margin: 0;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  )
}
