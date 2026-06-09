'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const articles = [
  {
    id: 1,
    slug: 'automatiser-comptabilite-ia',
    title: 'Comment automatiser sa comptabilité avec l\'IA en 2024',
    excerpt: 'Découvrez comment les agents IA révolutionnent la gestion comptable des PME et permettent de gagner jusqu\'à 70% de temps.',
    category: 'Comptabilité',
    color: '#4F46E5',
    date: '15 Nov 2024',
    readTime: '5 min',
    image: '/blog/automatiser-comptabilite-ia.svg',
  },
  {
    id: 2,
    slug: 'reseaux-sociaux-ia',
    title: 'Réseaux sociaux : les meilleures pratiques avec l\'IA',
    excerpt: 'Comment utiliser l\'intelligence artificielle pour créer du contenu engageant et gérer efficacement vos réseaux sociaux.',
    category: 'Marketing',
    color: '#7C3AED',
    date: '12 Nov 2024',
    readTime: '7 min',
    image: '/blog/reseaux-sociaux-ia.svg',
  },
  {
    id: 3,
    slug: 'support-client-24-7',
    title: 'Support client 24/7 : l\'avantage concurrentiel ultime',
    excerpt: 'Pourquoi un support client disponible en permanence grâce à l\'IA peut transformer votre relation client.',
    category: 'Support',
    color: '#2563EB',
    date: '8 Nov 2024',
    readTime: '4 min',
    image: '/blog/support-client-24-7.svg',
  },
  {
    id: 4,
    slug: 'recrutement-ia-rh',
    title: 'IA et RH : révolutionner le recrutement',
    excerpt: 'Les agents IA changent la donne dans le recrutement. Tri de CV, présélection et onboarding automatisé.',
    category: 'RH',
    color: '#EA580C',
    date: '5 Nov 2024',
    readTime: '6 min',
    image: '/blog/recrutement-ia-rh.svg',
  },
  {
    id: 5,
    slug: 'tresorerie-previsions-ia',
    title: 'Prévisions de trésorerie : l\'IA au service du DAF',
    excerpt: 'Comment les algorithmes prédictifs permettent d\'anticiper les flux de trésorerie avec une précision inédite.',
    category: 'Finance',
    color: '#059669',
    date: '1 Nov 2024',
    readTime: '8 min',
    image: '/blog/tresorerie-previsions-ia.svg',
  },
  {
    id: 6,
    slug: 'email-marketing-conversions',
    title: 'Email marketing : boostez vos conversions avec l\'IA',
    excerpt: 'Segmentation intelligente, personnalisation avancée : les secrets d\'une stratégie email performante.',
    category: 'Marketing',
    color: '#DB2777',
    date: '28 Oct 2024',
    readTime: '5 min',
    image: '/blog/email-marketing-conversions.svg',
  },
]

const categories = ['Tous', 'Comptabilité', 'Finance', 'Marketing', 'RH', 'Support']

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

export default function BlogPage() {
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tous')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredArticles = activeCategory === 'Tous'
    ? articles
    : articles.filter(article => article.category === activeCategory)

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
              <span className="hero-badge">Ressources & Actualités</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1>Le Blog OmnIA</h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>Conseils, tutoriels et insights sur l'automatisation IA pour votre entreprise.</p>
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

        {/* Articles Grid */}
        <section className="articles-section">
          <div className="container">
            <div className="articles-grid">
              {filteredArticles.map((article, index) => (
                <ScrollReveal key={article.id} delay={index * 100}>
                  <a href={`/blog/${article.slug}`} className="article-card">
                    <div className="article-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="article-content">
                      <div className="article-meta">
                        <span className="article-category" style={{ color: article.color }}>
                          {article.category}
                        </span>
                        <span className="article-date">{article.date}</span>
                      </div>
                      <h2>{article.title}</h2>
                      <p>{article.excerpt}</p>
                      <div className="article-footer">
                        <span className="read-time">⏱ {article.readTime} de lecture</span>
                        <span className="read-more" style={{ color: article.color }}>Lire →</span>
                      </div>
                    </div>
                    <div className="article-hover" style={{ backgroundColor: article.color }} />
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter-section">
          <div className="container">
            <ScrollReveal>
              <div className="newsletter-card">
                <div className="newsletter-content">
                  <span className="newsletter-badge">📬 Newsletter</span>
                  <h2>Restez informé</h2>
                  <p>Recevez nos derniers articles et conseils directement dans votre boîte mail.</p>
                </div>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                  <button type="submit">S'abonner</button>
                </form>
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
          max-width: 500px;
          margin: 0 auto;
        }

        /* Filters */
        .filters-section {
          padding: 40px 24px;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 72px;
          z-index: 10;
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

        /* Articles */
        .articles-section {
          padding: 60px 24px 100px;
          background: var(--bg-primary);
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 28px;
        }

        .article-card {
          display: block;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }

        .article-hover {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .article-card:hover .article-hover {
          transform: scaleX(1);
        }

        .article-image {
          height: 200px;
          overflow: hidden;
          border-radius: 24px 24px 0 0;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .article-card:hover .article-image img {
          transform: scale(1.05);
        }

        .article-content {
          padding: 28px;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .article-category {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .article-date {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .article-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .article-content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .read-time {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .read-more {
          font-weight: 600;
          font-size: 0.9rem;
          transition: transform 0.3s ease;
        }

        .article-card:hover .read-more {
          transform: translateX(4px);
        }

        /* Newsletter */
        .newsletter-section {
          padding: 80px 24px;
          background: var(--bg-secondary);
        }

        .newsletter-card {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 40px;
          padding: 48px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
        }

        .newsletter-content {
          flex: 1;
          min-width: 280px;
        }

        .newsletter-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .newsletter-content h2 {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .newsletter-content p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          flex: 1;
          min-width: 280px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 16px 20px;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          background: var(--bg-secondary);
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .newsletter-form input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .newsletter-form button {
          padding: 16px 28px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .newsletter-form button:hover {
          background: var(--accent-hover);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .articles-grid {
            grid-template-columns: 1fr;
          }

          .newsletter-card {
            padding: 32px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form button {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
