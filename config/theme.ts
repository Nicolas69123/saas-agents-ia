/**
 * Configuration du Thème Dark - Style Agentova
 * Palette de couleurs et styles pour le redesign complet
 */

// ============================================================================
// COULEURS
// ============================================================================

export const colors = {
  // Backgrounds
  background: {
    primary: '#000000',       // Fond noir principal
    secondary: '#0a0a0a',     // Fond noir légèrement plus clair
    tertiary: '#1a1a1a',      // Fond pour cards/sections
  },

  // Texte
  text: {
    primary: '#ffffff',       // Texte principal blanc
    secondary: 'rgba(255, 255, 255, 0.7)',  // Texte secondaire
    tertiary: 'rgba(255, 255, 255, 0.5)',   // Texte tertiaire
    muted: 'rgba(255, 255, 255, 0.3)',      // Texte désactivé
  },

  // Brand colors (gradients)
  brand: {
    blue: '#3b82f6',          // Bleu primaire
    blueLight: '#60a5fa',     // Bleu clair
    violet: '#8b5cf6',        // Violet
    violetLight: '#a78bfa',   // Violet clair
    pink: '#ec4899',          // Rose
    cyan: '#06b6d4',          // Cyan
  },

  // Agents colors (conservés du système actuel)
  agents: {
    comptable: '#3b82f6',
    tresorier: '#10b981',
    investissements: '#8b5cf6',
    reseauxSociaux: '#ec4899',
    emailMarketing: '#f59e0b',
    rh: '#06b6d4',
    support: '#60a5fa',
    telephonique: '#6366f1',
  },

  // UI Elements
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    hover: 'rgba(255, 255, 255, 0.2)',
  },

  // Glass effect
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  hero: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 50%)',
  section: 'radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.15), transparent 50%)',
} as const;

// ============================================================================
// TYPOGRAPHIE
// ============================================================================

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: '0.5rem',     // 8px
  sm: '0.75rem',    // 12px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
  '6xl': '12rem',   // 192px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(59, 130, 246, 0.5)',
  glowViolet: '0 0 20px rgba(139, 92, 246, 0.5)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },

  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ============================================================================
// BREAKPOINTS (Responsive)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Génère un style glassmorphism
 */
export function getGlassmorphStyle(options?: {
  background?: string;
  blur?: number;
  border?: string;
}) {
  return {
    background: options?.background || colors.glass.background,
    backdropFilter: `blur(${options?.blur || 16}px)`,
    WebkitBackdropFilter: `blur(${options?.blur || 16}px)`,
    border: `1px solid ${options?.border || colors.glass.border}`,
  };
}

/**
 * Génère un gradient text
 */
export function getGradientTextStyle(gradient: string) {
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
}
