'use client'

export default function SupportPage() {
  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Support & Assistance</h1>
          <p>Notre équipe est là pour vous aider 24/7</p>

          <div className="support-grid">
            <div className="support-card">
              <div className="support-icon">💬</div>
              <h3>Chat en direct</h3>
              <p>Discutez avec notre équipe support en temps réel...</p>
              <button className="btn btn-secondary">Démarrer le chat</button>
            </div>

            <div className="support-card">
              <div className="support-icon">📧</div>
              <h3>Email</h3>
              <p>Envoyez-nous un email à support@saas-agents-ia.fr...</p>
              <a href="mailto:support@saas-agents-ia.fr" className="btn btn-primary">Envoyer un email</a>
            </div>

            <div className="support-card">
              <div className="support-icon">📚</div>
              <h3>Documentation</h3>
              <p>Consultez nos guides complets et tutoriels...</p>
              <a href="/docs" className="btn btn-primary">Voir la doc</a>
            </div>
          </div>

          <div className="contact-info">
            <h2>Coordonnées</h2>
            <p>📞 Téléphone : +33 (0)1 23 45 67 89</p>
            <p>📧 Email : support@saas-agents-ia.fr</p>
            <p>📍 Adresse : Paris, France</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }

        .support-card {
          padding: 32px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          text-align: center;
          background: #fff;
          transition: all 0.3s ease;
        }

        .support-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .support-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .support-card h3 {
          margin-bottom: 12px;
        }

        .support-card p {
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .contact-info {
          margin-top: 60px;
          padding: 32px;
          background: #f9f9f9;
          border-radius: 16px;
          text-align: center;
        }

        .contact-info h2 {
          margin-bottom: 24px;
        }

        .contact-info p {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  )
}
