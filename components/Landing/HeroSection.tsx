'use client'

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Image de fond pleine largeur */}
      <div className="hero-background">
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80&fit=crop"
          alt="Intelligence Artificielle"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
      </div>

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
          padding: 140px 20px 100px;
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        /* Image de fond pleine largeur */
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

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-text h1 {
          margin-bottom: 20px;
          line-height: 1.3;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          font-size: clamp(2.5rem, 5vw, 4rem);
        }

        .hero-text > p {
          font-size: 1.1rem;
          color: #ffffff;
          opacity: 0.95;
          margin-bottom: 30px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        .hero-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .stars {
          font-size: 1.2rem;
          color: #fbbf24;
        }

        .rating-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
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
