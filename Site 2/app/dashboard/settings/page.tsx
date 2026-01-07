'use client'

import { useState, useEffect } from 'react'

export default function DashboardSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <h1>Paramètres</h1>
        <p>Gérez votre compte et vos préférences.</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Profil
        </button>
        <button
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Securite
        </button>
        <button
          className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Facturation
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Notifications
        </button>
      </div>

      {/* Content */}
      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Informations du profil</h2>
              <p>Mettez à jour vos informations personnelles.</p>
            </div>

            <form className="settings-form">
              <div className="avatar-section">
                <div className="current-avatar">JD</div>
                <div className="avatar-actions">
                  <button type="button" className="btn-secondary">Changer la photo</button>
                  <span className="avatar-hint">JPG ou PNG. Max 2MB.</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" defaultValue="Jean" />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" defaultValue="Dupont" />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="jean.dupont@entreprise.fr" />
              </div>

              <div className="form-group">
                <label>Entreprise</label>
                <input type="text" defaultValue="Mon Entreprise SAS" />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" defaultValue="+33 6 12 34 56 78" />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Securite</h2>
              <p>Protegez votre compte avec ces options de securite.</p>
            </div>

            <div className="security-card">
              <div className="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <div className="security-info">
                <h3>Mot de passe</h3>
                <p>Derniere modification il y a 3 mois</p>
              </div>
              <button className="btn-secondary">Modifier</button>
            </div>

            <div className="security-card">
              <div className="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <div className="security-info">
                <h3>Authentification a deux facteurs</h3>
                <p>Ajoutez une couche de securite supplementaire</p>
              </div>
              <button className="btn-primary">Activer</button>
            </div>

            <div className="security-card">
              <div className="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="security-info">
                <h3>Sessions actives</h3>
                <p>2 appareils connectes</p>
              </div>
              <button className="btn-secondary">Voir</button>
            </div>

            <div className="danger-zone">
              <div className="danger-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h3>Zone de danger</h3>
              </div>
              <p>Ces actions sont irreversibles.</p>
              <button className="btn-danger">Supprimer mon compte</button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Facturation</h2>
              <p>Gérez votre abonnement et vos moyens de paiement.</p>
            </div>

            <div className="plan-card">
              <div className="plan-info">
                <span className="plan-badge">Plan actuel</span>
                <h3>Business</h3>
                <p className="plan-price">119.90€ <span>/mois</span></p>
              </div>
              <div className="plan-features">
                <div className="feature">✓ 8 agents IA</div>
                <div className="feature">✓ 10 000 requêtes/mois</div>
                <div className="feature">✓ Support prioritaire</div>
              </div>
              <div className="plan-actions">
                <button className="btn-secondary">Changer de plan</button>
                <button className="btn-link">Annuler l'abonnement</button>
              </div>
            </div>

            <div className="billing-section">
              <h3>Moyen de paiement</h3>
              <div className="payment-card">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div className="card-info">
                  <span className="card-number">•••• •••• •••• 4242</span>
                  <span className="card-expiry">Expire 12/25</span>
                </div>
                <button className="btn-link">Modifier</button>
              </div>
            </div>

            <div className="billing-section">
              <h3>Historique des factures</h3>
              <div className="invoices-list">
                <div className="invoice-item">
                  <span className="invoice-date">1 Nov 2024</span>
                  <span className="invoice-amount">119.90€</span>
                  <span className="invoice-status paid">Payée</span>
                  <button className="btn-link">Télécharger</button>
                </div>
                <div className="invoice-item">
                  <span className="invoice-date">1 Oct 2024</span>
                  <span className="invoice-amount">119.90€</span>
                  <span className="invoice-status paid">Payée</span>
                  <button className="btn-link">Télécharger</button>
                </div>
                <div className="invoice-item">
                  <span className="invoice-date">1 Sep 2024</span>
                  <span className="invoice-amount">119.90€</span>
                  <span className="invoice-status paid">Payée</span>
                  <button className="btn-link">Télécharger</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Notifications</h2>
              <p>Choisissez comment vous souhaitez être notifié.</p>
            </div>

            <div className="notifications-group">
              <h3>Email</h3>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Rapports hebdomadaires</span>
                  <span className="notification-desc">Recevez un résumé de l'activité de vos agents</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Alertes de sécurité</span>
                  <span className="notification-desc">Soyez informé des connexions inhabituelles</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Mises à jour produit</span>
                  <span className="notification-desc">Nouveautés et améliorations</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div className="notifications-group">
              <h3>Push</h3>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Activité des agents</span>
                  <span className="notification-desc">Notifications en temps réel</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Messages clients</span>
                  <span className="notification-desc">Quand un client écrit au support</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .settings-page {
          width: 100%;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .page-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          overflow-x: auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border: none;
          background: none;
          color: var(--text-secondary);
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
          white-space: nowrap;
          line-height: 1;
        }

        .tab svg {
          flex-shrink: 0;
          opacity: 0.7;
          width: 18px;
          height: 18px;
        }

        .tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .tab:hover svg {
          opacity: 1;
        }

        .tab.active {
          background: var(--accent-light);
          color: var(--accent);
        }

        .tab.active svg {
          opacity: 1;
        }

        /* Content */
        .settings-content {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
        }

        .section-header {
          margin-bottom: 28px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .section-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        /* Form */
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .current-avatar {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .avatar-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .avatar-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-secondary);
          font-size: 0.95rem;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .form-actions {
          padding-top: 12px;
        }

        /* Buttons */
        .btn-primary {
          padding: 12px 24px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .btn-danger {
          padding: 12px 24px;
          background: #DC2626;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
        }

        /* Security */
        .security-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .security-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .security-icon svg {
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .security-info {
          flex: 1;
        }

        .security-info h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .security-info p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .danger-zone {
          margin-top: 32px;
          padding: 20px;
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 12px;
        }

        .danger-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .danger-header svg {
          color: #DC2626;
          flex-shrink: 0;
        }

        .danger-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #DC2626;
          margin: 0;
        }

        .danger-zone > p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        /* Billing */
        .plan-card {
          padding: 24px;
          background: var(--bg-secondary);
          border: 2px solid var(--accent);
          border-radius: 16px;
          margin-bottom: 28px;
        }

        .plan-badge {
          display: inline-block;
          padding: 4px 12px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .plan-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .plan-price {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent);
        }

        .plan-price span {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        .plan-features {
          display: flex;
          gap: 20px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .plan-features .feature {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .plan-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .billing-section {
          margin-bottom: 28px;
        }

        .billing-section h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .payment-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .card-icon svg {
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .card-info {
          flex: 1;
        }

        .card-number {
          display: block;
          font-weight: 500;
          color: var(--text-primary);
        }

        .card-expiry {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .invoices-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .invoice-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 16px;
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .invoice-date {
          flex: 1;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .invoice-amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .invoice-status {
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .invoice-status.paid {
          background: rgba(5, 150, 105, 0.1);
          color: #059669;
        }

        /* Notifications */
        .notifications-group {
          margin-bottom: 28px;
        }

        .notifications-group h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .notification-title {
          display: block;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .notification-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Toggle */
        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 28px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-tertiary);
          border-radius: 28px;
          transition: 0.3s;
        }

        .toggle-slider::before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .toggle-slider {
          background: var(--accent);
        }

        .toggle input:checked + .toggle-slider::before {
          transform: translateX(20px);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .tabs {
            gap: 4px;
          }

          .tab {
            padding: 8px 12px;
            font-size: 0.85rem;
          }

          .settings-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}
