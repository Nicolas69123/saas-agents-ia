'use client'

import { motion } from 'framer-motion'

export default function CallToAction() {
  return (
    <section className="cta-section">
      <div className="gradient-bg" />

      <div className="container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Prêt à transformer votre entreprise?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Démarrez gratuitement. Aucune carte bancaire requise.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="btn btn-secondary">Essayer gratuitement</button>
            <button className="btn btn-primary">Réserver une démo</button>
          </motion.div>

          <motion.p
            className="cta-subtext"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Rejoignez les centaines de PME et startups qui font confiance à nos agents IA
          </motion.p>
        </motion.div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 120px 20px;
          background: #000000;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2), transparent 70%);
          pointer-events: none;
        }

        .container {
          position: relative;
          z-index: 1;
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-content h2 {
          margin-bottom: 20px;
          font-size: clamp(2rem, 4vw, 3.5rem);
          color: #ffffff;
          font-weight: 800;
        }

        .cta-content > p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 40px;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .cta-buttons button {
          min-width: 220px;
        }

        .cta-subtext {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 80px 20px;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .cta-buttons button {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </section>
  )
}
