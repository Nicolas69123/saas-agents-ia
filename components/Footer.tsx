'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
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
          background: #f9f9f9;
          padding: 60px 20px 40px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 40px;
        }

        .footer-section h4 {
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: 12px;
        }

        .footer-section a {
          text-decoration: none;
          color: inherit;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .footer-section a:hover {
          opacity: 1;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }

        .footer-bottom p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </footer>
  )
}
