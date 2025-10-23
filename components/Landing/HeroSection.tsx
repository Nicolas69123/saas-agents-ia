'use client'

import { motion } from 'framer-motion'
import ParticlesBackground from '@/components/ParticlesBackground'

export default function HeroSection() {
  // Animation variants pour le titre word-by-word
  const titleWords = "Révolutionnez votre entreprise grâce à l'IA".split(' ')
  const subtitleWords = "Avec une équipe d'agents IA qui ne dort jamais ?".split(' ')

  return (
    <section className="hero-section">
      {/* Fond de particules animées */}
      <ParticlesBackground />

      {/* Gradient overlay */}
      <div className="gradient-overlay" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {/* Titre principal animé word-by-word */}
            <h1>
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                  }}
                  className="word"
                >
                  {word}{' '}
                </motion.span>
              ))}
            </h1>

            {/* Sous-titre animé */}
            <h2 className="subtitle">
              {subtitleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: (i + titleWords.length) * 0.08,
                    duration: 0.5,
                  }}
                  className="word subtitle-word"
                >
                  {word}{' '}
                </motion.span>
              ))}
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              Vos employés IA qui ne dorment jamais. Construisez, développez et scalez votre business avec une équipe d'agents IA.
            </motion.p>

            {/* Boutons CTA */}
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              <button className="btn btn-primary">
                Voir une Démo
              </button>
              <button className="btn btn-secondary">
                Essai gratuit 7 jours
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="social-proof"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <div className="avatars">
                <img src="https://i.pravatar.cc/40?img=1" alt="User 1" />
                <img src="https://i.pravatar.cc/40?img=2" alt="User 2" />
                <img src="https://i.pravatar.cc/40?img=3" alt="User 3" />
                <img src="https://i.pravatar.cc/40?img=4" alt="User 4" />
              </div>
              <div className="social-text">
                <span className="social-number">Déjà 1,250+</span> entrepreneurs utilisent SaaS Agents IA
              </div>
            </motion.div>

            {/* Cards flottantes (en-dessous) */}
            <div className="floating-cards-container">
              <motion.div
                className="floating-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-title">155 demandes traitées</div>
                  <div className="card-subtitle">Hello, j'ai géré 155 demandes clients aujourd'hui...</div>
                </div>
              </motion.div>

              <motion.div
                className="floating-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="card-icon">✉️</div>
                <div className="card-content">
                  <div className="card-title">10 emails en brouillon</div>
                  <div className="card-subtitle">Aujourd'hui, j'ai préparé 10 emails...</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          padding: 150px 20px 100px;
          background: #000000;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .container {
          position: relative;
          z-index: 2;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-text h1 {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 30px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .word {
          display: inline-block;
        }

        .subtitle {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 30px;
          color: #ffffff;
        }

        .subtitle-word {
          font-style: italic;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text > p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 50px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }

        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }

        .avatars {
          display: flex;
          align-items: center;
        }

        .avatars img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid #000;
          margin-left: -12px;
          transition: transform 0.3s ease;
        }

        .avatars img:first-child {
          margin-left: 0;
        }

        .avatars img:hover {
          transform: scale(1.15) translateY(-4px);
          z-index: 10;
        }

        .social-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .social-number {
          font-weight: 700;
          color: #ffffff;
        }

        /* Floating cards container (centrées en-dessous) */
        .floating-cards-container {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        /* Floating notification cards */
        .floating-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          max-width: 320px;
          flex: 1;
          min-width: 280px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .card-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .card-content {
          flex: 1;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .card-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .floating-card {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 20px 60px;
            min-height: auto;
          }

          .hero-content {
            text-align: center;
          }

          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }

          .hero-buttons button {
            width: 100%;
          }

          .social-proof {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  )
}
