/**
 * Configuration tsParticles - Style Agentova
 * Fond animé avec particules/étoiles
 */

import type { ISourceOptions } from '@tsparticles/engine';

/**
 * Configuration pour le fond de particules style Agentova
 * Étoiles blanches animées sur fond noir
 */
export const particlesConfig: ISourceOptions = {
  fullScreen: {
    enable: false, // On ne veut pas fullscreen, juste en background
    zIndex: 0,
  },

  background: {
    color: {
      value: '#000000', // Fond noir
    },
  },

  fpsLimit: 60,

  particles: {
    number: {
      value: 80, // Nombre de particules
      density: {
        enable: true,
        width: 1920,
        height: 1080,
      },
    },

    color: {
      value: '#ffffff', // Particules blanches
    },

    shape: {
      type: 'circle', // Points circulaires
    },

    opacity: {
      value: { min: 0.1, max: 0.5 }, // Opacité variable
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },

    size: {
      value: { min: 1, max: 3 }, // Taille variable
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },

    links: {
      enable: false, // Pas de liens entre particules (style Agentova)
    },

    move: {
      enable: true,
      speed: 0.5, // Vitesse lente et fluide
      direction: 'none',
      random: true,
      straight: false,
      outModes: {
        default: 'out',
      },
    },
  },

  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: {
        enable: true,
        mode: 'grab', // Effet au survol
      },
      onClick: {
        enable: false,
      },
      resize: {
        enable: true,
        delay: 0.5,
      },
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.3,
          color: '#ffffff',
        },
      },
    },
  },

  detectRetina: true,
};

/**
 * Configuration alternative : particules avec connections
 * (Plus d'effet réseau)
 */
export const particlesConfigNetwork: ISourceOptions = {
  fullScreen: {
    enable: false,
    zIndex: 0,
  },

  background: {
    color: {
      value: '#000000',
    },
  },

  fpsLimit: 60,

  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        width: 1920,
        height: 1080,
      },
    },

    color: {
      value: '#ffffff',
    },

    shape: {
      type: 'circle',
    },

    opacity: {
      value: 0.3,
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },

    size: {
      value: { min: 1, max: 2 },
    },

    links: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.1,
      width: 1,
    },

    move: {
      enable: true,
      speed: 0.3,
      direction: 'none',
      random: true,
      straight: false,
      outModes: {
        default: 'bounce',
      },
    },
  },

  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },

  detectRetina: true,
};

/**
 * Configuration minimaliste : moins de particules
 * (Pour performance optimale)
 */
export const particlesConfigMinimal: ISourceOptions = {
  fullScreen: {
    enable: false,
    zIndex: 0,
  },

  background: {
    color: {
      value: 'transparent', // Transparent pour overlay
    },
  },

  fpsLimit: 60,

  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
      },
    },

    color: {
      value: '#ffffff',
    },

    shape: {
      type: 'circle',
    },

    opacity: {
      value: { min: 0.1, max: 0.3 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },

    size: {
      value: { min: 1, max: 2 },
    },

    move: {
      enable: true,
      speed: 0.3,
      direction: 'none',
      random: true,
      straight: false,
    },
  },

  detectRetina: true,
};
