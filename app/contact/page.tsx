'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const contactMethods = [
  {
    icon: '✉️',
    title: 'Email',
    description: 'Envoyez-nous un email, nous répondons sous 24h',
    value: 'contact@ai-omnia.fr',
    link: 'mailto:contact@ai-omnia.fr',
    color: '#4F46E5',
  },
  {
    icon: '📞',
    title: 'Téléphone',
    description: 'Disponible du lundi au vendredi, 9h-18h',
    value: '+33 (0)1 23 45 67 89',
    link: 'tel:+33123456789',
    color: '#059669',
  },
  {
    icon: '💬',
    title: 'Chat',
    description: 'Discutez avec notre équipe en temps réel',
    value: 'Ouvrir le chat',
    action: 'chat',
    color: '#7C3AED',
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

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
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
              <span className="hero-badge">💬 Parlons de votre projet</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1>Contactez-nous</h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>Notre équipe est là pour répondre à toutes vos questions et vous accompagner.</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="methods-section">
          <div className="container">
            <div className="methods-grid">
              {contactMethods.map((method, index) => (
                <ScrollReveal key={method.title} delay={index * 100}>
                  <div className="method-card">
                    <div className="method-icon" style={{ backgroundColor: `${method.color}10` }}>
                      <span>{method.icon}</span>
                    </div>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                    {method.link ? (
                      <a href={method.link} className="method-link" style={{ color: method.color }}>
                        {method.value}
                      </a>
                    ) : (
                      <button className="method-link" style={{ color: method.color }}>
                        {method.value}
                      </button>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="form-section">
          <div className="container">
            <div className="form-wrapper">
              <ScrollReveal>
                <div className="form-header">
                  <span className="form-badge">📝 Formulaire</span>
                  <h2>Envoyez-nous un message</h2>
                  <p>Décrivez votre projet et nous vous répondrons dans les plus brefs délais.</p>
                </div>
              </ScrollReveal>

              {isSubmitted ? (
                <ScrollReveal>
                  <div className="success-message">
                    <span className="success-icon">✓</span>
                    <h3>Message envoyé !</h3>
                    <p>Merci pour votre message. Nous vous répondrons sous 24h.</p>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormState({ name: '', email: '', company: '', subject: '', message: '' })
                      }}
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal delay={100}>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Nom complet *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="jean@entreprise.fr"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="company">Entreprise</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formState.company}
                          onChange={handleChange}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Sujet *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choisir un sujet</option>
                          <option value="demo">Demande de démonstration</option>
                          <option value="pricing">Question sur les tarifs</option>
                          <option value="support">Support technique</option>
                          <option value="partnership">Partenariat</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre projet ou posez vos questions..."
                        rows={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le message →'
                      )}
                    </button>
                  </form>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        {/* Map / Location */}
        <section className="location-section">
          <div className="container">
            <ScrollReveal>
              <div className="location-card">
                <div className="location-info">
                  <span className="location-badge">Notre adresse</span>
                  <h3>OmnIA</h3>
                  <p>
                    123 Avenue de l'Innovation<br />
                    75008 Paris, France
                  </p>
                  <div className="location-hours">
                    <strong>Horaires d'ouverture</strong>
                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                    <p>Weekend : Fermé</p>
                  </div>
                </div>
                <div className="location-map">
                  <div className="map-placeholder">
                    <span>🗺️</span>
                    <p>Paris, France</p>
                  </div>
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

        /* Contact Methods */
        .methods-section {
          padding: 60px 24px 40px;
          background: var(--bg-primary);
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .method-card {
          padding: 32px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .method-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
        }

        .method-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin: 0 auto 16px;
        }

        .method-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .method-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .method-link {
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .method-link:hover {
          opacity: 0.8;
        }

        /* Form Section */
        .form-section {
          padding: 60px 24px 100px;
          background: var(--bg-primary);
        }

        .form-wrapper {
          max-width: 700px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .form-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .form-header h2 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .form-header p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .contact-form {
          padding: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-primary);
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 140px;
        }

        .btn-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 18px 32px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 60px 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
        }

        .success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #059669;
          color: white;
          border-radius: 50%;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .success-message h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .success-message p {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .btn-secondary {
          padding: 14px 28px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
        }

        /* Location */
        .location-section {
          padding: 0 24px 100px;
          background: var(--bg-primary);
        }

        .location-card {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          overflow: hidden;
        }

        .location-info {
          padding: 40px;
        }

        .location-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .location-info h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .location-info > p {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .location-hours strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .location-hours p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 4px 0;
        }

        .location-map {
          background: var(--bg-tertiary);
        }

        .map-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .map-placeholder span {
          font-size: 4rem;
        }

        .map-placeholder p {
          font-size: 1rem;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .contact-form {
            padding: 24px;
          }

          .location-card {
            grid-template-columns: 1fr;
          }

          .location-map {
            height: 200px;
          }
        }
      `}</style>
    </>
  )
}
