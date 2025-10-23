'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
        {/* Newsletter Section */}
        <motion.div
          className="newsletter-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Soyez les premiers informés</h3>
          <p>Abonnez-vous pour accéder en avant-première à ce qu'on prépare. L'innovation n'attend pas.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Votre adresse e-mail" />
            <button className="btn btn-secondary">M'inscrire</button>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="footer-content">
          <div className="footer-section">
            <h4>Produit</h4>
            <ul>
              <li><a href="/#agents">Agents IA</a></li>
              <li><a href="/features">Fonctionnalités</a></li>
              <li><a href="/pricing">Tarification</a></li>
              <li><a href="/docs/integrations">Intégrations</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ressources</h4>
            <ul>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/docs/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><a href="/legal/privacy">Confidentialité</a></li>
              <li><a href="/legal/terms">Conditions d'utilisation</a></li>
              <li><a href="/legal/cookies">Cookies</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contactez-nous</h4>
            <ul>
              <li><a href="mailto:contact@saas-agents-ia.fr">contact@saas-agents-ia.fr</a></li>
              <li><a href="tel:+33123456789">+33 (0)1 23 45 67 89</a></li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SaaS Agents IA. Tous droits réservés.</p>
          <p>Made with ❤️</p>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: #000000;
          padding: 150px 20px 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 0;
        }

        .newsletter-section {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding-bottom: 150px;
          margin-bottom: 300px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .newsletter-section h3 {
          font-size: 2rem;
          margin-bottom: 16px;
          color: #ffffff;
          font-weight: 700;
        }

        .newsletter-section p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-form input {
          flex: 1;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .newsletter-form input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .newsletter-form input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .newsletter-form button {
          padding: 16px 32px;
          white-space: nowrap;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 60px;
          margin-bottom: 50px;
        }

        .footer-section h4 {
          font-size: 1.1rem;
          margin-bottom: 24px;
          color: #ffffff;
          font-weight: 700;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: 14px;
        }

        .footer-section a {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease;
          font-size: 0.95rem;
        }

        .footer-section a:hover {
          color: #ffffff;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          footer {
            padding: 60px 20px 30px;
          }

          .newsletter-section {
            margin-bottom: 60px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form button {
            width: 100%;
          }

          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}
