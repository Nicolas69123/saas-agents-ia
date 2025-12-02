'use client'

import { useState, useRef, useEffect } from 'react'
import { agents } from '@/data/agents'

export default function HeroSection() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Dupliquer les agents pour le scroll infini
  const infiniteAgents = [...agents, ...agents, ...agents]

  const startScroll = (direction: 'left' | 'right') => {
    if (scrollIntervalRef.current) return
    setIsHovering(true)

    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === 'left' ? -3 : 3
        scrollContainerRef.current.scrollLeft += scrollAmount
      }
    }, 20)
  }

  const stopScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
    setIsHovering(false)
  }

  // Gérer le scroll infini
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth
      const currentScroll = container.scrollLeft

      // Si on arrive à la fin, revenir au début du deuxième set
      if (currentScroll >= maxScroll - 10) {
        container.scrollLeft = maxScroll / 3
      }

      // Si on arrive au début, aller à la fin du deuxième set
      if (currentScroll <= 10) {
        container.scrollLeft = (maxScroll / 3) * 2
      }
    }

    container.addEventListener('scroll', handleScroll)

    // Positionner au milieu au départ
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 3

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero-section">
      {/* Vidéo de fond pleine largeur */}
      <div className="hero-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-logo">
              <img src="/logos/ai-omnia-logo.svg" alt="AI OmniA" />
            </div>
            <p>Automatisez vos processus métier avec nos agents IA spécialisés et performants</p>

            <div className="hero-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">Excellent 4.9 sur 5</span>
            </div>

            <div className="hero-buttons">
              <button className="btn btn-secondary">Commencer gratuitement</button>
              <button className="btn btn-primary">Réserver une démo</button>
            </div>
          </div>

          <div className="hero-visual">
            {/* Carrousel avec agent sélectionné */}
            <div className="agent-carousel">
              <div className="agent-display">
                <img
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  className="agent-main-image"
                />
                <div className="agent-info-overlay">
                  <span className="agent-icon">{selectedAgent.icon}</span>
                  <h3>{selectedAgent.name}</h3>
                  <p>{selectedAgent.description}</p>
                </div>
              </div>

              {/* Galerie de sélection d'avatars */}
              <div className="agent-selector-wrapper">
                {/* Zone de scroll gauche */}
                <div
                  className="scroll-trigger scroll-left"
                  onMouseEnter={() => startScroll('left')}
                  onMouseLeave={stopScroll}
                />

                {/* Container scrollable */}
                <div className="agent-selector" ref={scrollContainerRef}>
                  {infiniteAgents.map((agent, index) => (
                    <button
                      key={`${agent.id}-${index}`}
                      onClick={() => setSelectedAgent(agent)}
                      className={`agent-thumb ${selectedAgent.id === agent.id ? 'active' : ''}`}
                      title={agent.name}
                    >
                      <img src={agent.avatar} alt={agent.name} />
                    </button>
                  ))}
                </div>

                {/* Zone de scroll droite */}
                <div
                  className="scroll-trigger scroll-right"
                  onMouseEnter={() => startScroll('right')}
                  onMouseLeave={stopScroll}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 140px 20px 100px;
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        /* Vidéo de fond pleine largeur */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .hero-bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
        }

        .container {
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-logo {
          margin-bottom: 30px;
        }

        .hero-logo img {
          max-width: 450px;
          width: 100%;
          height: auto;
          filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
        }

        .hero-text > p {
          font-size: 1.1rem;
          color: #ffffff;
          opacity: 0.95;
          margin-bottom: 30px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        .hero-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .stars {
          font-size: 1.2rem;
          color: #fbbf24;
        }

        .rating-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Carrousel Agent */
        .agent-carousel {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .agent-display {
          position: relative;
          width: 100%;
          max-width: 300px;
          aspect-ratio: 1 / 1;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin: 0 auto;
        }

        .agent-display:hover {
          transform: translateY(-5px);
        }

        .agent-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
        }

        .agent-display:hover .agent-main-image {
          transform: scale(1.05);
        }

        .agent-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
          color: white;
          transform: translateY(0);
          transition: transform 0.3s ease;
        }

        .agent-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 6px;
        }

        .agent-info-overlay h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .agent-info-overlay p {
          font-size: 0.85rem;
          opacity: 0.9;
          margin: 0;
        }

        /* Galerie de sélection - Wrapper */
        .agent-selector-wrapper {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          overflow: hidden;
        }

        /* Container scrollable horizontal */
        .agent-selector {
          display: flex;
          gap: 16px;
          padding: 10px 15px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          justify-content: flex-start;

          /* Mask gradient pour fade progressif sur les icônes */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 100px,
            black calc(100% - 100px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 100px,
            black calc(100% - 100px),
            transparent 100%
          );
        }

        /* Hide scrollbar for Chrome/Safari */
        .agent-selector::-webkit-scrollbar {
          display: none;
        }

        /* Zones de trigger pour le scroll */
        .scroll-trigger {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          z-index: 10;
          pointer-events: all;
        }

        .scroll-left {
          left: 0;
          cursor: w-resize;
        }

        .scroll-right {
          right: 0;
          cursor: e-resize;
        }

        /* Thumbnails */
        .agent-thumb {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 18px;
          overflow: hidden;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: white;
          padding: 0;
          flex-shrink: 0;
        }

        .agent-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .agent-thumb:hover {
          transform: translateY(-5px) scale(1.1);
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .agent-thumb:hover img {
          transform: scale(1.1);
        }

        .agent-thumb.active {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2),
                      0 8px 20px rgba(102, 126, 234, 0.4);
          transform: scale(1.15);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-logo {
            margin-bottom: 20px;
          }

          .hero-logo img {
            max-width: 300px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          button {
            width: 100%;
          }

          .agent-display {
            max-width: 250px;
            aspect-ratio: 1 / 1;
          }

          .agent-info-overlay {
            padding: 15px;
          }

          .agent-icon {
            font-size: 1.5rem;
            margin-bottom: 4px;
          }

          .agent-info-overlay h3 {
            font-size: 0.95rem;
            margin-bottom: 3px;
          }

          .agent-info-overlay p {
            font-size: 0.75rem;
          }

          .agent-selector-wrapper {
            max-width: 350px;
          }

          .agent-selector {
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
          }

          .agent-thumb {
            width: 70px;
            height: 70px;
          }

          .scroll-trigger {
            width: 60px;
          }

          .agent-selector {
            gap: 12px;
            padding: 15px 10px;
          }
        }
      `}</style>
    </section>
  )
}
