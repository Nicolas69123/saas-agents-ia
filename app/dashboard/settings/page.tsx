'use client'

import DashboardHeader from '@/components/Dashboard/Header'

export default function SettingsPage() {
  return (
    <div className="dashboard-content">
      <DashboardHeader pageTitle="Paramètres" />

      <div className="container-dashboard">
        <div className="settings-grid">
          <aside className="settings-sidebar">
            <nav className="settings-nav">
              <a href="#account" className="settings-nav-item active">
                👤 Compte
              </a>
              <a href="#organization" className="settings-nav-item">
                🏢 Organisation
              </a>
              <a href="#billing" className="settings-nav-item">
                💳 Facturation
              </a>
              <a href="#security" className="settings-nav-item">
                🔒 Sécurité
              </a>
              <a href="#integrations" className="settings-nav-item">
                🔗 Intégrations
              </a>
              <a href="#notifications" className="settings-nav-item">
                🔔 Notifications
              </a>
            </nav>
          </aside>

          <main className="settings-main">
            <section id="account" className="settings-section">
              <h2>Compte</h2>
              <form className="settings-form">
                <div className="form-group">
                  <label>Nom complet</label>
                  <input type="text" defaultValue="Nicolas Dubois" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="nicolas@exemple.com" />
                </div>

                <div className="form-group">
                  <label>Avatar</label>
                  <div className="avatar-upload">
                    <div className="avatar-preview">👤</div>
                    <button type="button" className="btn-upload">
                      Changer
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-secondary">
                  Enregistrer
                </button>
              </form>
            </section>

            <section id="security" className="settings-section">
              <h2>Sécurité</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Mot de passe</h3>
                  <p>Changez votre mot de passe régulièrement</p>
                </div>
                <button className="btn btn-primary">Changer</button>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Authentification 2FA</h3>
                  <p>Activez la double authentification pour plus de sécurité</p>
                </div>
                <button className="btn btn-secondary">Activer</button>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Clés API</h3>
                  <p>Gérez vos clés d'API</p>
                </div>
                <button className="btn btn-primary">Gérer</button>
              </div>
            </section>

            <section id="danger-zone" className="settings-section danger">
              <h2>Zone de danger</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Supprimer le compte</h3>
                  <p>Cette action est irréversible. Tous vos données seront supprimées.</p>
                </div>
                <button className="btn btn-danger">Supprimer</button>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content {
          padding: 30px;
        }

        .container-dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 30px;
        }

        .settings-sidebar {
          position: sticky;
          top: 30px;
          height: fit-content;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .settings-nav-item {
          padding: 12px 16px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .settings-nav-item:hover,
        .settings-nav-item.active {
          background: #f5f5f5;
          border-left-color: #000;
        }

        .settings-main {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .settings-section {
          background: #fff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .settings-section.danger {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .settings-section h2 {
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-group input {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #000;
        }

        .avatar-upload {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar-preview {
          width: 80px;
          height: 80px;
          background: #f5f5f5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }

        .btn-upload {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-upload:hover {
          border-color: #000;
        }

        .settings-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .settings-item:last-child {
          border-bottom: none;
        }

        .settings-item-info h3 {
          margin: 0 0 4px 0;
          font-size: 1rem;
        }

        .settings-item-info p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .btn-danger {
          padding: 10px 20px;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .btn-danger:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            position: static;
          }

          .settings-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  )
}
