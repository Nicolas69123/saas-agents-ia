/**
 * Configuration centralisée des images du site
 * Style : Tech Moderne 🤖
 * - Avatars : DiceBear bottts-neutral (robots minimalistes)
 * - Images : Unsplash (thème tech/business moderne)
 * - Palette : Bleus, violets, gris clairs
 */

// ============================================================================
// AVATARS AGENTS (DiceBear API)
// ============================================================================

export const DICEBEAR_BASE_URL = 'https://api.dicebear.com/7.x/bottts-neutral/svg';

/**
 * Configuration des avatars pour chaque agent
 * Utilise DiceBear bottts-neutral avec des couleurs cohérentes
 */
export const agentAvatars = {
  comptable: {
    url: `${DICEBEAR_BASE_URL}?seed=comptable&backgroundColor=3b82f6&scale=85`,
    color: '#3b82f6', // Bleu - Finance
    alt: 'Avatar Agent Comptable',
  },
  tresorier: {
    url: `${DICEBEAR_BASE_URL}?seed=tresorier&backgroundColor=10b981&scale=85`,
    color: '#10b981', // Vert - Argent
    alt: 'Avatar Agent Trésorier',
  },
  investissements: {
    url: `${DICEBEAR_BASE_URL}?seed=investissements&backgroundColor=8b5cf6&scale=85`,
    color: '#8b5cf6', // Violet - Stratégie
    alt: 'Avatar Agent Investissements',
  },
  'reseaux-sociaux': {
    url: `${DICEBEAR_BASE_URL}?seed=social&backgroundColor=ec4899&scale=85`,
    color: '#ec4899', // Rose - Social
    alt: 'Avatar Agent Réseaux Sociaux',
  },
  'email-marketing': {
    url: `${DICEBEAR_BASE_URL}?seed=email&backgroundColor=f59e0b&scale=85`,
    color: '#f59e0b', // Orange - Communication
    alt: 'Avatar Agent Email Marketing',
  },
  'ressources-humaines': {
    url: `${DICEBEAR_BASE_URL}?seed=rh&backgroundColor=06b6d4&scale=85`,
    color: '#06b6d4', // Cyan - Humain
    alt: 'Avatar Agent Ressources Humaines',
  },
  'support-client': {
    url: `${DICEBEAR_BASE_URL}?seed=support&backgroundColor=60a5fa&scale=85`,
    color: '#60a5fa', // Bleu clair - Service
    alt: 'Avatar Agent Support Client',
  },
  telephonique: {
    url: `${DICEBEAR_BASE_URL}?seed=phone&backgroundColor=6366f1&scale=85`,
    color: '#6366f1', // Indigo - Communication
    alt: 'Avatar Agent Téléphonique',
  },
} as const;

// ============================================================================
// IMAGES UNSPLASH (Thème Tech Moderne)
// ============================================================================

/**
 * Images pour les sections principales du site
 * Thème : Technologie moderne, gradients bleus/violets, workspaces épurés
 */
export const siteImages = {
  // Hero Section - Image principale d'accueil
  hero: {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    alt: 'Technologie moderne - Vue de la Terre depuis l\'espace',
    credit: 'NASA (Unsplash)',
  },

  // Features - Fonctionnalités du produit
  features: {
    automation: {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      alt: 'Automatisation IA - Robot moderne',
      credit: 'Rock\'n Roll Monkey (Unsplash)',
    },
    analytics: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      alt: 'Analytics & Rapports - Dashboard moderne',
      credit: 'Carlos Muza (Unsplash)',
    },
    integration: {
      url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
      alt: 'Intégrations - Code et technologie',
      credit: 'Shahadat Rahman (Unsplash)',
    },
    security: {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      alt: 'Sécurité - Cadenas digital',
      credit: 'FLY:D (Unsplash)',
    },
  },

  // Blog - Articles
  blog: {
    aiTrends: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      alt: 'Intelligence Artificielle - Concept futuriste',
      credit: 'Igor Omilaev (Unsplash)',
    },
    productivity: {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
      alt: 'Productivité - Workspace moderne',
      credit: 'Nick Morrison (Unsplash)',
    },
    business: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      alt: 'Business Analytics - Graphiques',
      credit: 'Carlos Muza (Unsplash)',
    },
    teamwork: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      alt: 'Collaboration en équipe - Meeting moderne',
      credit: 'Annie Spratt (Unsplash)',
    },
  },

  // Pricing - Page tarification
  pricing: {
    background: {
      url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80',
      alt: 'Gradient bleu abstrait',
      credit: 'Milad Fakurian (Unsplash)',
    },
  },

  // Dashboard - Interface utilisateur
  dashboard: {
    placeholder: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      alt: 'Dashboard Analytics',
      credit: 'Carlos Muza (Unsplash)',
    },
  },

  // Backgrounds - Fonds abstraits
  backgrounds: {
    gradient1: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
      alt: 'Gradient bleu abstrait',
      credit: 'Pawel Czerwinski (Unsplash)',
    },
    gradient2: {
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1920&q=80',
      alt: 'Gradient violet abstrait',
      credit: 'Pawel Czerwinski (Unsplash)',
    },
    tech: {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80',
      alt: 'Circuit board - Technologie',
      credit: 'Alexandre Debiève (Unsplash)',
    },
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Génère l'URL d'un avatar agent avec options personnalisées
 */
export function getAgentAvatarUrl(
  agentId: keyof typeof agentAvatars,
  options?: {
    size?: number;
    backgroundColor?: string;
    scale?: number;
  }
): string {
  const baseAvatar = agentAvatars[agentId];
  if (!baseAvatar) return agentAvatars.comptable.url; // Fallback

  const params = new URLSearchParams({
    seed: agentId,
    backgroundColor: options?.backgroundColor || baseAvatar.color.replace('#', ''),
    scale: String(options?.scale || 85),
    ...(options?.size && { size: String(options.size) }),
  });

  return `${DICEBEAR_BASE_URL}?${params.toString()}`;
}

/**
 * Récupère les infos complètes d'un avatar agent
 */
export function getAgentAvatar(agentId: keyof typeof agentAvatars) {
  return agentAvatars[agentId] || agentAvatars.comptable;
}

/**
 * Récupère une image Unsplash avec options de redimensionnement
 */
export function getUnsplashImage(
  url: string,
  options?: {
    width?: number;
    quality?: number;
    format?: 'jpg' | 'webp' | 'auto';
  }
): string {
  const urlObj = new URL(url);

  if (options?.width) {
    urlObj.searchParams.set('w', String(options.width));
  }
  if (options?.quality) {
    urlObj.searchParams.set('q', String(options.quality));
  }
  if (options?.format) {
    urlObj.searchParams.set('fm', options.format);
  }

  return urlObj.toString();
}

/**
 * Génère un placeholder blur pour Next.js Image
 */
export function getImagePlaceholder(color: string = '#1e293b'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='${encodeURIComponent(color)}' width='400' height='300'/%3E%3C/svg%3E`;
}

/**
 * Liste de tous les agents disponibles
 */
export const AGENT_IDS = Object.keys(agentAvatars) as Array<keyof typeof agentAvatars>;

/**
 * Palette de couleurs du thème Tech Moderne
 */
export const themeColors = {
  primary: '#3b82f6',      // Bleu
  secondary: '#8b5cf6',    // Violet
  accent: '#06b6d4',       // Cyan
  success: '#10b981',      // Vert
  warning: '#f59e0b',      // Orange
  error: '#ef4444',        // Rouge
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const;
