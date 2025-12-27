'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const agents = [
  { id: 1, name: 'Lucas', role: 'Agent Comptable', category: 'Finance', avatar: '/avatars/agent-1.png', color: '#4F46E5' },
  { id: 2, name: 'Marc', role: 'Agent Trésorier', category: 'Finance', avatar: '/avatars/agent-2.png', color: '#059669' },
  { id: 3, name: 'Julie', role: 'Agent Investissements', category: 'Finance', avatar: '/avatars/agent-3.png', color: '#0891B2' },
  { id: 4, name: 'Thomas', role: 'Agent Réseaux Sociaux', category: 'Marketing', avatar: '/avatars/agent-4.png', color: '#7C3AED' },
  { id: 5, name: 'Sophie', role: 'Agent Email Marketing', category: 'Marketing', avatar: '/avatars/agent-5.png', color: '#DB2777' },
  { id: 6, name: 'Claire', role: 'Agent RH', category: 'RH', avatar: '/avatars/agent-6.png', color: '#EA580C' },
  { id: 7, name: 'Emma', role: 'Agent Support Client', category: 'Support', avatar: '/avatars/agent-7.png', color: '#2563EB' },
  { id: 8, name: 'Léa', role: 'Agent Téléphonique', category: 'Support', avatar: '/avatars/agent-8.png', color: '#16A34A' },
]

const features = [
  {
    title: 'Automatisation Intelligente',
    description: 'Nos agents IA travaillent 24/7 pour automatiser vos tâches répétitives et libérer votre temps.',
  },
  {
    title: 'Personnalisation Totale',
    description: 'Chaque agent s\'adapte à votre entreprise, vos processus et votre façon de travailler.',
  },
  {
    title: 'Sécurité Maximale',
    description: 'Vos données sont chiffrées et protégées. Conformité RGPD garantie.',
  },
  {
    title: 'Analytics Avancés',
    description: 'Tableaux de bord détaillés pour suivre les performances de vos agents en temps réel.',
  },
]

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const goToAgentChat = (agentId: number) => {
    router.push(`/chat?agent=${agentId}`)
  }

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
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <video
            className="hero-video"
            autoPlay
            muted
            playsInline
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="hero-content">
            <ScrollReveal>
              <span className="hero-badge">La nouvelle génération d'automatisation</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1>
                Vos agents IA,<br />
                <span className="gradient-text">votre équipe augmentée</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="hero-description">
                8 agents spécialisés pour automatiser votre comptabilité, marketing,
                RH et support client. Gagnez du temps, réduisez les coûts.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="hero-buttons">
                <a href="/auth/signup" className="btn-primary">
                  Commencer gratuitement
                  <span className="btn-arrow">→</span>
                </a>
                <a href="/agents" className="btn-secondary">
                  Découvrir les agents
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Agents IA</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Disponibles</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-number">-70%</span>
                  <span className="stat-label">De temps gagné</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Agents Preview */}
        <section className="agents-section">
          <div className="container">
            <ScrollReveal>
              <div className="section-header">
                <span className="section-badge">Notre équipe IA</span>
                <h2>8 agents spécialisés à votre service</h2>
                <p>Chaque agent maîtrise son domaine pour vous offrir une expertise inégalée.</p>
              </div>
            </ScrollReveal>

            <div className="agents-grid">
              {agents.map((agent, index) => (
                <ScrollReveal key={agent.id} delay={index * 80}>
                  <div className="agent-card" onClick={() => goToAgentChat(agent.id)}>
                    <div className="agent-avatar" style={{ backgroundColor: `${agent.color}15` }}>
                      <img src={agent.avatar} alt={agent.name} className="agent-img" />
                    </div>
                    <div className="agent-info">
                      <h3>{agent.name}</h3>
                      <p>{agent.role}</p>
                      <span className="agent-category" style={{ color: agent.color }}>
                        {agent.category}
                      </span>
                    </div>
                    <div className="agent-hover-indicator" style={{ backgroundColor: agent.color }} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={700}>
              <div className="section-cta">
                <a href="/agents" className="btn-outline">
                  Voir tous les agents en détail →
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <ScrollReveal>
              <div className="section-header">
                <span className="section-badge">Pourquoi nous choisir</span>
                <h2>Une solution complète pour votre entreprise</h2>
                <p>Tout ce dont vous avez besoin pour automatiser et optimiser vos processus.</p>
              </div>
            </ScrollReveal>

            <div className="features-grid">
              {features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="feature-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <ScrollReveal>
              <div className="cta-content">
                <h2>Prêt à transformer votre entreprise ?</h2>
                <p>
                  Rejoignez les entreprises qui ont déjà automatisé leurs processus
                  avec nos agents IA.
                </p>
                <div className="cta-buttons">
                  <a href="/auth/signup" className="btn-primary btn-large">
                    Démarrer maintenant — C'est gratuit
                  </a>
                  <a href="/pricing" className="btn-ghost">
                    Voir les tarifs
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        main {
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          display: inline-block;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 8px 2px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        [data-theme="dark"] .hero-content h1 {
          background: rgba(15, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .hero-content .hero-description {
          display: inline-block;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 12px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        [data-theme="dark"] .hero-content .hero-description {
          background: rgba(15, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        [data-theme="dark"] .hero-badge {
          background: rgba(15, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #000000;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: var(--accent);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
        }

        .btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.35);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1rem;
          border-radius: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.7);
          border-color: var(--border-hover);
        }

        [data-theme="dark"] .btn-secondary {
          background: rgba(15, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        [data-theme="dark"] .btn-secondary:hover {
          background: rgba(15, 17, 23, 0.7);
        }

        .hero-stats {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 20px 40px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        [data-theme="dark"] .hero-stats {
          background: rgba(15, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Section Styles */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .section-header p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
        }

        /* Agents Section */
        .agents-section {
          padding: 100px 24px;
          background: var(--bg-secondary);
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          grid-auto-rows: 1fr;
          gap: 20px;
          margin-bottom: 50px;
        }

        .agents-grid > div {
          height: 100%;
        }

        .agent-card {
          background: var(--bg-primary);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid var(--border-color);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .agent-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }

        .agent-hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .agent-card:hover .agent-hover-indicator {
          transform: scaleX(1);
        }

        .agent-avatar {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .agent-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
        }

        .agent-info {
          flex: 1;
        }

        .agent-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .agent-info p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .agent-category {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-cta {
          text-align: center;
        }

        .btn-outline {
          display: inline-flex;
          padding: 14px 28px;
          border: 2px solid var(--accent);
          color: var(--accent);
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          background: var(--accent);
          color: white;
        }

        /* Features Section */
        .features-section {
          padding: 100px 24px;
          background: var(--bg-primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          grid-auto-rows: 1fr;
          gap: 24px;
        }

        .features-grid > div {
          height: 100%;
        }

        .feature-card {
          padding: 32px;
          background: var(--bg-secondary);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .feature-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          flex: 1;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 24px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 18px 36px;
          font-size: 1.1rem;
        }

        .cta-section .btn-primary {
          background: white;
          color: var(--accent);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .cta-section .btn-primary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
        }

        .btn-ghost {
          display: inline-flex;
          padding: 18px 36px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 14px;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .btn-ghost:hover {
          border-color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero {
            padding: 100px 20px 60px;
          }

          .hero-stats {
            gap: 24px;
          }

          .stat-divider {
            display: none;
          }

          .agents-section,
          .features-section,
          .cta-section {
            padding: 60px 20px;
          }

          .hero-buttons,
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-secondary,
          .btn-ghost {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}
