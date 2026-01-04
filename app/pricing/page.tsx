'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const plans = [
  {
    name: 'Starter',
    price: '69.90',
    period: '/mois',
    description: 'Idéal pour les indépendants et petites équipes',
    color: '#059669',
    features: [
      '3 agents IA au choix',
      '1 000 requêtes / mois',
      'Support email',
      'Tableaux de bord basiques',
      'Export CSV',
    ],
    notIncluded: [
      'Agents personnalisés',
      'API access',
      'Support prioritaire',
    ],
    cta: 'Commencer',
    popular: false,
  },
  {
    name: 'Business',
    price: '119.90',
    period: '/mois',
    description: 'Pour les PME en croissance',
    color: '#4F46E5',
    features: [
      '8 agents IA inclus',
      '10 000 requêtes / mois',
      'Support prioritaire',
      'Tableaux de bord avancés',
      'API access complet',
      'Intégrations (Slack, Teams)',
      'Export multi-formats',
    ],
    notIncluded: [
      'Agents sur mesure',
    ],
    cta: 'Essai gratuit 14 jours',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    period: '',
    description: 'Solution sur mesure pour grandes entreprises',
    color: '#7C3AED',
    features: [
      'Agents illimités',
      'Requêtes illimitées',
      'Support dédié 24/7',
      'Agents personnalisés',
      'On-premise possible',
      'SLA garanti',
      'Formation équipe',
      'Account manager',
    ],
    notIncluded: [],
    cta: 'Nous contacter',
    popular: false,
  },
]

const faqs = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Le changement prend effet immédiatement et vous serez facturé au prorata.',
  },
  {
    question: 'Que se passe-t-il si je dépasse ma limite de requêtes ?',
    answer: 'Nous vous préviendrons avant d\'atteindre la limite. Vous pourrez alors passer au plan supérieur ou acheter des requêtes supplémentaires.',
  },
  {
    question: 'Y a-t-il un engagement de durée ?',
    answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment depuis votre espace client.',
  },
  {
    question: 'Proposez-vous une période d\'essai ?',
    answer: 'Oui ! Le plan Business inclut un essai gratuit de 14 jours. Aucune carte bancaire n\'est requise pour commencer.',
  },
]

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
      }}
    >
      {children}
    </div>
  )
}

export default function PricingPage() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <ScrollReveal>
              <span className="hero-badge">Tarification simple</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1>Des prix clairs, sans surprise</h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>Choisissez le plan adapté à vos besoins. Évoluez quand vous voulez.</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Plans */}
        <section className="plans-section">
          <div className="container">
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <ScrollReveal key={plan.name} delay={index * 150}>
                  <div className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                    {plan.popular && <span className="popular-badge">Le plus populaire</span>}

                    <div className="plan-header">
                      <h3 style={{ color: plan.color }}>{plan.name}</h3>
                      <div className="plan-price">
                        <span className="price">{plan.price !== 'Sur devis' ? `${plan.price}€` : plan.price}</span>
                        <span className="period">{plan.period}</span>
                      </div>
                      <p className="plan-description">{plan.description}</p>
                    </div>

                    <div className="plan-features">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="feature">
                          <span className="check" style={{ color: plan.color }}></span>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="feature not-included">
                          <span className="cross">✕</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="plan-cta"
                      style={{
                        backgroundColor: plan.popular ? plan.color : 'transparent',
                        color: plan.popular ? 'white' : plan.color,
                        borderColor: plan.color,
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <div className="container">
            <ScrollReveal>
              <div className="section-header">
                <span className="section-badge">FAQ</span>
                <h2>Questions fréquentes</h2>
              </div>
            </ScrollReveal>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
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
                <h2>Des questions sur nos tarifs ?</h2>
                <p>Notre équipe est là pour vous aider à choisir le meilleur plan.</p>
                <div className="cta-buttons">
                  <a href="/contact" className="btn-primary">Parler à un conseiller</a>
                  <a href="/auth/signup" className="btn-secondary">Démarrer gratuitement</a>
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

        /* Hero */
        .hero {
          padding: 140px 24px 80px;
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
          max-width: 500px;
          margin: 0 auto;
        }

        /* Plans */
        .plans-section {
          padding: 80px 24px 100px;
          background: var(--bg-primary);
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          align-items: start;
        }

        .plan-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 36px;
          position: relative;
          transition: all 0.3s ease;
        }

        .plan-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-lg);
        }

        .plan-card.popular {
          border: 2px solid var(--accent);
          transform: scale(1.02);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          background: var(--accent);
          color: white;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .plan-header {
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--border-color);
        }

        .plan-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .price {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .period {
          font-size: 1rem;
          color: var(--text-muted);
        }

        .plan-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .plan-features {
          margin-bottom: 28px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .feature.not-included {
          color: var(--text-muted);
        }

        .check {
          display: inline-block;
          width: 16px;
          height: 16px;
          position: relative;
        }

        .check::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid currentColor;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .cross {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .plan-cta {
          width: 100%;
          padding: 16px 24px;
          border: 2px solid;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .plan-cta:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }

        /* FAQ */
        .faq-section {
          padding: 80px 24px;
          background: var(--bg-secondary);
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
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
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .faq-list {
          max-width: 700px;
          margin: 0 auto;
        }

        .faq-item {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item.open {
          border-color: var(--accent);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          text-align: left;
        }

        .faq-icon {
          font-size: 1.5rem;
          color: var(--accent);
          font-weight: 300;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
        }

        .faq-answer p {
          padding: 0 24px 20px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* CTA */
        .cta-section {
          padding: 80px 24px;
          background: var(--bg-primary);
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

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
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
        }

        .btn-secondary {
          padding: 16px 32px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 600;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr;
          }

          .plan-card.popular {
            transform: none;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
            text-align: center;
          }
        }
      `}</style>
    </>
  )
}
