'use client'

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Révolutionnez votre entreprise grâce à l'IA</h1>
            <p>Automatisez vos processus métier avec nos agents IA spécialisés et performants</p>

            <div className="hero-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">Excellent 4.9 sur 5</span>
            </div>

            <div className="hero-buttons">
              <button className="btn btn-secondary">Commencer gratuitement</button>
              <button className="btn btn-primary">Réserver une démo</button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="carousel-placeholder">
              <p>[ Carrousel d'images agents IA ]</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 100px 20px;
          background: #f5f5f5;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-text h1 {
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .hero-text > p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 30px;
        }

        .hero-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .stars {
          font-size: 1.2rem;
        }

        .rating-text {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .carousel-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          border: 2px dashed #ccc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          min-height: 300px;
        }

        .carousel-placeholder p {
          text-align: center;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-text h1 {
            font-size: 2rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
