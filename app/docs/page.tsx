'use client'

export default function DocsPage() {
  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Documentation</h1>
          <p>Bienvenue dans la documentation de SaaS Agents IA</p>

          <div className="docs-grid">
            <div className="doc-card">
              <h3>🚀 Guide de démarrage rapide</h3>
              <p>Commencez avec nos agents IA en moins de 5 minutes...</p>
            </div>

            <div className="doc-card">
              <h3>🔗 Intégrations</h3>
              <p>Connectez vos outils favoris (n8n, Zapier, etc.)...</p>
            </div>

            <div className="doc-card">
              <h3>⚙️ Configuration</h3>
              <p>Personnalisez vos agents selon vos besoins...</p>
            </div>

            <div className="doc-card">
              <h3>📊 API Reference</h3>
              <p>Documentation complète de notre API REST...</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .doc-card {
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .doc-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .doc-card h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
        }

        .doc-card p {
          opacity: 0.7;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
