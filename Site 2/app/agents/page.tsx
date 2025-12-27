'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const agents = [
  {
    id: 1,
    name: 'Lucas',
    role: 'Agent Comptable',
    category: 'Finance',
    color: '#4F46E5',
    avatar: '/avatars/agent-1.png',
    description: 'Automatise votre comptabilité : factures, notes de frais, rapports financiers et déclarations TVA.',
    features: ['Génération de factures', 'Suivi des dépenses', 'Rapports mensuels', 'Calcul TVA automatique'],
  },
  {
    id: 2,
    name: 'Marc',
    role: 'Agent Trésorier',
    category: 'Finance',
    color: '#059669',
    avatar: '/avatars/agent-2.png',
    description: 'Gère votre trésorerie avec des prévisions précises et des alertes personnalisées.',
    features: ['Prévisions cash-flow', 'Alertes seuils', 'Optimisation BFR', 'Tableaux de bord'],
  },
  {
    id: 3,
    name: 'Julie',
    role: 'Agent Investissements',
    category: 'Finance',
    color: '#0891B2',
    avatar: '/avatars/agent-3.png',
    description: 'Analyse vos opportunités d\'investissement et optimise votre portefeuille.',
    features: ['Analyse de marché', 'Recommandations', 'Suivi portefeuille', 'Alertes opportunités'],
  },
  {
    id: 4,
    name: 'Thomas',
    role: 'Agent Réseaux Sociaux',
    category: 'Marketing',
    color: '#7C3AED',
    avatar: '/avatars/agent-4.png',
    description: 'Crée et planifie vos contenus sur tous les réseaux sociaux.',
    features: ['Création de posts', 'Planning éditorial', 'Analytics', 'Multi-plateformes'],
  },
  {
    id: 5,
    name: 'Sophie',
    role: 'Agent Email Marketing',
    category: 'Marketing',
    color: '#DB2777',
    avatar: '/avatars/agent-5.png',
    description: 'Conçoit des campagnes email performantes avec segmentation avancée.',
    features: ['Newsletters auto', 'Segmentation', 'A/B Testing', 'Rapports détaillés'],
  },
  {
    id: 6,
    name: 'Claire',
    role: 'Agent RH',
    category: 'RH',
    color: '#EA580C',
    avatar: '/avatars/agent-6.png',
    description: 'Simplifie vos processus RH : recrutement, onboarding et gestion administrative.',
    features: ['Tri de CV', 'Onboarding', 'Gestion congés', 'Fiches de paie'],
  },
  {
    id: 7,
    name: 'Emma',
    role: 'Agent Support Client',
    category: 'Support',
    color: '#2563EB',
    avatar: '/avatars/agent-7.png',
    description: 'Répond à vos clients 24/7 avec intelligence et empathie.',
    features: ['Réponses 24/7', 'Multi-canal', 'Escalade auto', 'Base de connaissances'],
  },
  {
    id: 8,
    name: 'Léa',
    role: 'Agent Téléphonique',
    category: 'Support',
    color: '#16A34A',
    avatar: '/avatars/agent-8.png',
    description: 'Gère vos appels entrants et sortants avec des scripts intelligents.',
    features: ['Prise de RDV', 'Qualification leads', 'Scripts personnalisés', 'Transcriptions'],
  },
]

const categories = ['Tous', 'Finance', 'Marketing', 'RH', 'Support']

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}

export default function AgentsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tous')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredAgents = activeCategory === 'Tous'
    ? agents
    : agents.filter(agent => agent.category === activeCategory)

  const goToAgentChat = (agentId: number) => {
    window.scrollTo(0, 0)
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
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <ScrollReveal>
              <span className="hero-badge">8 experts à votre service</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1>Nos Agents IA</h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>Une équipe complète d'agents spécialisés pour automatiser tous les aspects de votre entreprise.</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="container">
            <ScrollReveal>
              <div className="filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="agents-section">
          <div className="container">
            <div className="agents-grid">
              {filteredAgents.map((agent, index) => (
                <ScrollReveal key={agent.id} delay={index * 100}>
                  <div className="agent-card">
                    <div className="agent-header">
                      <div className="agent-avatar">
                        <img src={agent.avatar} alt={agent.name} />
                      </div>
                      <div className="agent-title">
                        <h3>{agent.name}</h3>
                        <p className="agent-role">{agent.role}</p>
                      </div>
                      <span className="agent-category" style={{ color: agent.color, backgroundColor: `${agent.color}10` }}>
                        {agent.category}
                      </span>
                    </div>

                    <p className="agent-description">{agent.description}</p>

                    <div className="agent-features">
                      {agent.features.map((feature, i) => (
                        <span key={i} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="agent-actions">
                      <button
                        className="btn-try"
                        style={{ backgroundColor: agent.color }}
                        onClick={() => goToAgentChat(agent.id)}
                      >
                        Essayer {agent.name}
                      </button>
                      <button className="btn-demo">Voir démo</button>
                    </div>

                    <div className="agent-accent" style={{ backgroundColor: agent.color }} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <ScrollReveal>
              <div className="cta-content">
                <h2>Besoin d'un agent personnalisé ?</h2>
                <p>Nous créons des agents sur mesure pour répondre à vos besoins spécifiques.</p>
                <a href="/contact" className="btn-primary">
                  Nous contacter →
                </a>
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
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero */
        .hero {
          padding: 140px 24px 60px;
          background: var(--bg-secondary);
          text-align: center;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .hero p {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Filters */
        .filters-section {
          padding: 40px 24px;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 72px;
          z-index: 50;
        }

        .filters {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 24px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .filter-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        /* Agents Grid */
        .agents-section {
          padding: 60px 24px 100px;
          background: var(--bg-primary);
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: 380px;
          gap: 24px;
        }

        .agents-grid > div {
          height: 100%;
          width: 100%;
          min-width: 0;
        }

        .agent-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .agent-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }

        .agent-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .agent-card:hover .agent-accent {
          transform: scaleX(1);
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-shrink: 0;
          height: 48px;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-secondary);
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-title {
          flex: 1;
          min-width: 0;
        }

        .agent-title h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .agent-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .agent-category {
          padding: 4px 8px;
          border-radius: 100px;
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .agent-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 14px;
          flex-shrink: 0;
          height: 63px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .agent-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
          align-content: flex-start;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .feature-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: var(--bg-secondary);
          border-radius: 6px;
          font-size: 0.7rem;
          color: var(--text-secondary);
          height: 26px;
          flex-shrink: 0;
        }

        .agent-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .btn-try {
          flex: 1;
          padding: 10px 12px;
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-try:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .btn-demo {
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-demo:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }

        /* CTA */
        .cta-section {
          padding: 80px 24px;
          background: var(--bg-secondary);
        }

        .cta-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .cta-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 28px;
        }

        .btn-primary {
          display: inline-flex;
          padding: 16px 32px;
          background: var(--accent);
          color: white;
          font-weight: 600;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .agents-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .agents-grid {
            grid-template-columns: 1fr;
          }

          .agent-header {
            flex-wrap: wrap;
          }

          .agent-category {
            margin-left: auto;
          }

          .agent-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}
