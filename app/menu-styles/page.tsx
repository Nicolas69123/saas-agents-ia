'use client'

import Link from 'next/link'

export default function MenuStylesPage() {
  return (
    <div className="menu-styles-page">
      <div className="container">
        <h1>🎨 Styles de Menu - Choisis ton préféré</h1>
        <p>Différentes variantes de navigation pour le Header</p>

        {/* Style 1: Menu avec boutons Secondary */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">1</span>
            <h2>Menu Boutons Secondary (Actuel)</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-1">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <button className="btn-secondary">Fonctionnalités</button>
                <button className="btn-secondary">Tarification</button>
                <button className="btn-secondary">Blog</button>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 2: Menu Liens Simple */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">2</span>
            <h2>Menu Liens Simples</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-2">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <a href="#" className="nav-link">Fonctionnalités</a>
                <a href="#" className="nav-link">Tarification</a>
                <a href="#" className="nav-link">Blog</a>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 3: Menu avec underline - MÊME CODE QUE HEADER */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">3</span>
            <h2>Menu avec Underline au hover (CODE DU HEADER)</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-3-real">
              <div className="logo">Omnia</div>
              <div className="menu">
                <a href="#" className="menu-item">Fonctionnalités</a>
                <a href="#" className="menu-item">Tarification</a>
                <a href="#" className="menu-item">Blog</a>
              </div>
              <div className="actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 4: Menu Ghost buttons */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">4</span>
            <h2>Menu Boutons Ghost</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-4">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <button className="btn-ghost">Fonctionnalités</button>
                <button className="btn-ghost">Tarification</button>
                <button className="btn-ghost">Blog</button>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 5: Menu Pills */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">5</span>
            <h2>Menu Pills (Badges arrondis)</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-5">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <button className="btn-pill">Fonctionnalités</button>
                <button className="btn-pill">Tarification</button>
                <button className="btn-pill">Blog</button>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 6: Menu avec icônes */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">6</span>
            <h2>Menu avec Icônes</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-6">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <button className="btn-icon-menu">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Fonctionnalités
                </button>
                <button className="btn-icon-menu">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Tarification
                </button>
                <button className="btn-icon-menu">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Blog
                </button>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 7: Menu Minimal */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">7</span>
            <h2>Menu Ultra Minimal</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-7">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <a href="#" className="nav-minimal">Fonctionnalités</a>
                <a href="#" className="nav-minimal">Tarification</a>
                <a href="#" className="nav-minimal">Blog</a>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        {/* Style 8: Menu avec badges */}
        <section className="style-section">
          <div className="style-header">
            <span className="style-number">8</span>
            <h2>Menu avec Badges "New"</h2>
          </div>
          <div className="menu-demo">
            <nav className="demo-nav style-8">
              <div className="nav-brand">Omnia</div>
              <div className="nav-menu">
                <button className="btn-secondary">
                  Fonctionnalités
                  <span className="badge-new">New</span>
                </button>
                <button className="btn-secondary">Tarification</button>
                <button className="btn-secondary">Blog</button>
              </div>
              <div className="nav-actions">
                <button className="btn-ghost">Se connecter</button>
                <button className="btn-primary">S'inscrire</button>
              </div>
            </nav>
          </div>
        </section>

        <div className="instructions">
          <h3>📝 Choisis ton style de menu</h3>
          <p>Dis-moi : "Style 1", "Style 3", ou "Je veux le menu minimal"</p>
          <p>Je l'appliquerai au Header du site !</p>
        </div>
      </div>

      <style jsx>{`
        .menu-styles-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 60px 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #111;
        }

        .menu-styles-page > .container > p {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 60px;
        }

        .style-section {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .style-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .style-number {
          width: 48px;
          height: 48px;
          background: #111;
          color: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .style-header h2 {
          margin: 0;
          color: #111;
          font-size: 1.25rem;
        }

        .menu-demo {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
        }

        /* Demo Nav */
        .demo-nav {
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 16px 24px;
          background: #fff;
          border-radius: 10px;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-menu {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        /* Boutons */
        .btn-primary,
        .btn-secondary,
        .btn-ghost,
        .btn-pill,
        .btn-icon-menu {
          padding: 10px 18px;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          background: transparent;
        }

        .btn-primary {
          background: #0f172a;
          color: #fff;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.15);
        }

        .btn-primary:hover {
          background: #020617;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .btn-secondary {
          background: #fff;
          color: #0f172a;
          border: 1.5px solid #e2e8f0;
        }

        .btn-secondary:hover {
          border-color: #cbd5e1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .btn-ghost {
          color: #64748b;
        }

        .btn-ghost:hover {
          background: #f8fafc;
          color: #334155;
        }

        .btn-pill {
          background: #f1f5f9;
          color: #0f172a;
          border-radius: 20px;
        }

        .btn-pill:hover {
          background: #e2e8f0;
        }

        .btn-icon-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .btn-icon-menu:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        /* Style 2: Liens simples */
        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          font-size: 0.9375rem;
          padding: 10px 16px;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #0f172a;
        }

        /* Style 3: MÊME CODE QUE HEADER */
        .style-3-real .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        .style-3-real .menu {
          display: flex;
          gap: 40px;
          flex: 1;
        }

        .style-3-real .menu-item {
          position: relative;
          display: inline-block;
          color: #0f172a;
          font-weight: 500;
          font-size: 0.9375rem;
          padding: 8px 0;
        }

        .style-3-real .menu-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #0f172a;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .style-3-real .menu-item:hover::after {
          transform: scaleX(1);
        }

        .style-3-real .actions {
          display: flex;
          gap: 12px;
        }

        /* Style 7: Minimal */
        .nav-minimal {
          text-decoration: none;
          color: #334155;
          font-weight: 400;
          font-size: 0.9375rem;
          padding: 8px 12px;
          transition: all 0.2s ease;
        }

        .nav-minimal:hover {
          color: #0f172a;
          font-weight: 500;
        }

        /* Badge New */
        .badge-new {
          display: inline-block;
          margin-left: 6px;
          padding: 2px 6px;
          background: #6366f1;
          color: #fff;
          border-radius: 6px;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .instructions {
          background: #111;
          color: #fff;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          margin-top: 40px;
        }

        .instructions h3 {
          margin-bottom: 16px;
          color: #fff;
        }

        .instructions p {
          margin-bottom: 12px;
          color: #ccc;
          font-size: 1rem;
        }

        .instructions strong {
          color: #fff;
        }

        @media (max-width: 768px) {
          .demo-nav {
            flex-direction: column;
            gap: 16px;
          }

          .nav-menu {
            width: 100%;
            flex-direction: column;
          }

          .nav-actions {
            width: 100%;
          }

          .btn-primary,
          .btn-secondary,
          .btn-ghost {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
