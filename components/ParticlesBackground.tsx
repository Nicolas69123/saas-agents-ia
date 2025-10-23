'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import { particlesConfig } from '@/config/particles';

/**
 * Composant de fond animé avec particules - Style Agentova
 * Utilise tsParticles pour créer un fond d'étoiles animé
 */

interface ParticlesBackgroundProps {
  variant?: 'default' | 'network' | 'minimal';
  className?: string;
}

export default function ParticlesBackground({
  variant = 'default',
  className = '',
}: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);

  // Initialize particles engine une seule fois
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      // Charger seulement les fonctionnalités nécessaires (slim)
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Si pas encore initialisé, ne rien afficher
  if (!init) {
    return null;
  }

  return (
    <div className={`particles-wrapper ${className}`}>
      <Particles
        id="tsparticles-background"
        options={particlesConfig}
      />

      <style jsx>{`
        .particles-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .particles-wrapper :global(#tsparticles-background) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

/**
 * Version simplified pour sections spécifiques
 */
export function ParticlesSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="particles-section">
      <ParticlesBackground variant="minimal" />
      <div className="particles-content">{children}</div>

      <style jsx>{`
        .particles-section {
          position: relative;
          overflow: hidden;
        }

        .particles-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
