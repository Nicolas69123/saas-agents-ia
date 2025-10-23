'use client'

import OptimizedImage from '@/components/OptimizedImage'
import { siteImages } from '@/config/images'

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
            <div className="hero-image-wrapper">
              <OptimizedImage
                src={siteImages.hero.url}
                alt={siteImages.hero.alt}
                className="hero-image"
                priority
                quality={90}
              />
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

        .hero-image-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero-image-wrapper:hover {
          transform: scale(1.02) translateY(-5px);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
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
