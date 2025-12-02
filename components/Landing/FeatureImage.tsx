'use client'

export default function FeatureImage() {
  return (
    <section className="feature-image-section">
      {/* Grande image pleine largeur */}
      <div className="feature-image-container">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80&fit=crop"
          alt="Équipe travaillant avec des technologies IA"
          className="feature-image"
        />
        <div className="feature-overlay"></div>

        {/* Texte overlay optionnel */}
        <div className="feature-content">
          <h2>L'IA au service de votre productivité</h2>
          <p>Des solutions intelligentes pour automatiser votre quotidien</p>
        </div>
      </div>

      <style jsx>{`
        .feature-image-section {
          width: 100%;
          position: relative;
        }

        .feature-image-container {
          width: 100%;
          height: 500px;
          position: relative;
          overflow: hidden;
        }

        .feature-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feature-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%);
        }

        .feature-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #ffffff;
          z-index: 1;
          max-width: 800px;
          padding: 0 20px;
        }

        .feature-content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .feature-content p {
          font-size: 1.25rem;
          opacity: 0.95;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .feature-image-container {
            height: 350px;
          }

          .feature-content h2 {
            font-size: 1.75rem;
          }

          .feature-content p {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
