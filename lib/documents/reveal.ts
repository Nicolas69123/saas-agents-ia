import type { DocumentRequest, SlideContent } from "./types"

interface RevealTheme {
  name: string
  bgGradient: string
  bgAccent: string
  accent: string
  accentLight: string
  textPrimary: string
  textSecondary: string
  textOnAccent: string
  fontTitle: string
  fontBody: string
  cardBg: string
  cardBorder: string
}

const THEMES: Record<string, RevealTheme> = {
  business: {
    name: "business",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)",
    bgAccent: "rgba(99, 102, 241, 0.15)",
    accent: "#6366F1",
    accentLight: "#A5B4FC",
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textOnAccent: "#FFFFFF",
    fontTitle: "'Inter', 'Helvetica Neue', sans-serif",
    fontBody: "'Inter', 'Helvetica Neue', sans-serif",
    cardBg: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.12)",
  },
  marketing: {
    name: "marketing",
    bgGradient: "linear-gradient(135deg, #4C1D95 0%, #831843 60%, #BE185D 100%)",
    bgAccent: "rgba(236, 72, 153, 0.2)",
    accent: "#F472B6",
    accentLight: "#FBCFE8",
    textPrimary: "#FFFFFF",
    textSecondary: "#FCE7F3",
    textOnAccent: "#FFFFFF",
    fontTitle: "'Inter', 'Helvetica Neue', sans-serif",
    fontBody: "'Inter', 'Helvetica Neue', sans-serif",
    cardBg: "rgba(255, 255, 255, 0.08)",
    cardBorder: "rgba(255, 255, 255, 0.15)",
  },
  finance: {
    name: "finance",
    bgGradient: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #10B981 100%)",
    bgAccent: "rgba(16, 185, 129, 0.2)",
    accent: "#34D399",
    accentLight: "#A7F3D0",
    textPrimary: "#FFFFFF",
    textSecondary: "#D1FAE5",
    textOnAccent: "#FFFFFF",
    fontTitle: "'Inter', 'Helvetica Neue', sans-serif",
    fontBody: "'Inter', 'Helvetica Neue', sans-serif",
    cardBg: "rgba(255, 255, 255, 0.07)",
    cardBorder: "rgba(255, 255, 255, 0.15)",
  },
  dark: {
    name: "dark",
    bgGradient: "linear-gradient(135deg, #000000 0%, #111111 60%, #1F1F1F 100%)",
    bgAccent: "rgba(96, 165, 250, 0.18)",
    accent: "#60A5FA",
    accentLight: "#BFDBFE",
    textPrimary: "#FFFFFF",
    textSecondary: "#9CA3AF",
    textOnAccent: "#FFFFFF",
    fontTitle: "'Inter', 'Helvetica Neue', sans-serif",
    fontBody: "'Inter', 'Helvetica Neue', sans-serif",
    cardBg: "rgba(255, 255, 255, 0.04)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
  },
}

function getTheme(name?: string): RevealTheme {
  if (name && THEMES[name]) return THEMES[name]
  return THEMES.business
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// SVG icon library (no external deps, inline)
const ICONS: Record<string, string> = {
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  chart: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  default: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
}

function pickIcon(text: string): string {
  const lower = text.toLowerCase()
  if (/probl[ée]me|risque|erreur|attention/.test(lower)) return ICONS.warning
  if (/solution|innovation|technologie|ia|automat/.test(lower)) return ICONS.zap
  if (/croissance|tendance|evolution|augmenta/.test(lower)) return ICONS.trending
  if (/chiffre|donn[ée]es|analyse|metrique|stat/.test(lower)) return ICONS.chart
  if (/objectif|cible|but|mission/.test(lower)) return ICONS.target
  if (/equipe|client|utilisateur|membre/.test(lower)) return ICONS.users
  if (/securit[ée]|protection|conformit[ée]/.test(lower)) return ICONS.shield
  if (/rapide|performance|gain/.test(lower)) return ICONS.rocket
  if (/avantage|benefice|reussite|succes/.test(lower)) return ICONS.check
  return ICONS.default
}

function renderIcon(svgPath: string, color: string, size = 48): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`
}

// Decorative SVG blobs / shapes for backgrounds
function decorativeBackground(theme: RevealTheme, variant: number): string {
  const accent = theme.accent
  const variants = [
    `<svg class="deco-bg" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1000" cy="100" r="280" fill="${accent}" opacity="0.08"/>
      <circle cx="100" cy="700" r="200" fill="${theme.accentLight}" opacity="0.06"/>
    </svg>`,
    `<svg class="deco-bg" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,400 Q300,200 600,400 T1200,400" stroke="${accent}" stroke-width="2" fill="none" opacity="0.2"/>
      <circle cx="900" cy="600" r="320" fill="${accent}" opacity="0.05"/>
    </svg>`,
    `<svg class="deco-bg" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <circle cx="300" cy="200" r="150" fill="${theme.accentLight}" opacity="0.1"/>
      <circle cx="900" cy="500" r="100" fill="${accent}" opacity="0.15"/>
      <rect x="700" y="100" width="200" height="200" rx="40" fill="${accent}" opacity="0.05" transform="rotate(15 800 200)"/>
    </svg>`,
    `<svg class="deco-bg" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <polygon points="1000,0 1200,0 1200,300" fill="${accent}" opacity="0.1"/>
      <polygon points="0,800 0,500 300,800" fill="${theme.accentLight}" opacity="0.08"/>
    </svg>`,
  ]
  return variants[variant % variants.length]
}

function renderTitleSlide(theme: RevealTheme, title: string, subtitle?: string, companyName?: string): string {
  return `
    <section class="slide-title" data-transition="zoom" data-background-gradient="${theme.bgGradient}">
      ${decorativeBackground(theme, 0)}
      <div class="title-content">
        <div class="title-badge">
          <span class="title-badge-dot"></span>
          ${escapeHtml(subtitle || new Date().toLocaleDateString("fr-FR"))}
        </div>
        <h1 class="title-main">${escapeHtml(title)}</h1>
        <div class="title-divider"></div>
        <p class="title-company">${escapeHtml(companyName || "OmnIA")}</p>
      </div>
    </section>
  `
}

function renderContentSlide(theme: RevealTheme, slide: SlideContent, index: number): string {
  const hasMultipleBullets = slide.bullets && slide.bullets.length >= 2
  const useCardsLayout = hasMultipleBullets && (slide.bullets!.length <= 6)

  const titleSection = `
    <div class="content-header">
      <div class="content-eyebrow">
        <span class="content-eyebrow-line"></span>
        <span class="content-eyebrow-text">${String(index).padStart(2, "0")}</span>
      </div>
      <h2 class="content-title">${escapeHtml(slide.title || "Slide")}</h2>
      ${slide.body ? `<p class="content-subtitle">${escapeHtml(slide.body)}</p>` : ""}
    </div>
  `

  let bulletsSection = ""
  if (useCardsLayout) {
    bulletsSection = `
      <div class="content-cards content-cards-${slide.bullets!.length}">
        ${slide.bullets!.map((b, i) => {
          const icon = renderIcon(pickIcon(b), theme.accent, 32)
          return `
            <div class="content-card" data-card-index="${i}">
              <div class="content-card-icon">${icon}</div>
              <div class="content-card-text">${escapeHtml(b)}</div>
            </div>
          `
        }).join("")}
      </div>
    `
  } else if (slide.bullets && slide.bullets.length > 0) {
    bulletsSection = `
      <ul class="content-bullets">
        ${slide.bullets.map((b, i) => `
          <li class="content-bullet" style="animation-delay: ${i * 80}ms;">
            <span class="content-bullet-marker"></span>
            <span class="content-bullet-text">${escapeHtml(b)}</span>
          </li>
        `).join("")}
      </ul>
    `
  }

  return `
    <section class="slide-content" data-transition="fade" data-background-gradient="${theme.bgGradient}">
      ${decorativeBackground(theme, index)}
      <div class="content-wrapper">
        ${titleSection}
        ${bulletsSection}
      </div>
    </section>
  `
}

function renderRecommendationsSlide(theme: RevealTheme, recommendations: string[]): string {
  return `
    <section class="slide-content" data-transition="fade" data-background-gradient="${theme.bgGradient}">
      ${decorativeBackground(theme, 2)}
      <div class="content-wrapper">
        <div class="content-header">
          <div class="content-eyebrow">
            <span class="content-eyebrow-line"></span>
            <span class="content-eyebrow-text">A retenir</span>
          </div>
          <h2 class="content-title">Recommandations</h2>
        </div>
        <div class="reco-list">
          ${recommendations.map((r, i) => `
            <div class="reco-item" style="animation-delay: ${i * 100}ms;">
              <div class="reco-number">${String(i + 1).padStart(2, "0")}</div>
              <div class="reco-text">${escapeHtml(r)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `
}

function renderClosingSlide(theme: RevealTheme, companyName?: string, contact?: string): string {
  return `
    <section class="slide-closing" data-transition="zoom" data-background-gradient="${theme.bgGradient}">
      ${decorativeBackground(theme, 3)}
      <div class="closing-content">
        <div class="closing-mark"></div>
        <h1 class="closing-title">Merci.</h1>
        <p class="closing-company">${escapeHtml(companyName || "OmnIA")}</p>
        ${contact ? `<p class="closing-contact">${escapeHtml(contact)}</p>` : ""}
      </div>
    </section>
  `
}

function renderStyles(theme: RevealTheme): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :root {
      --accent: ${theme.accent};
      --accent-light: ${theme.accentLight};
      --text-primary: ${theme.textPrimary};
      --text-secondary: ${theme.textSecondary};
      --card-bg: ${theme.cardBg};
      --card-border: ${theme.cardBorder};
    }

    .reveal { font-family: ${theme.fontBody}; }
    .reveal section { text-align: left; padding: 0 !important; }

    .reveal .slides section .deco-bg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }

    /* ===== TITLE SLIDE ===== */
    .slide-title { padding: 0 !important; }
    .title-content {
      position: relative; z-index: 2;
      padding: 5rem 6rem;
      display: flex; flex-direction: column;
      justify-content: center; height: 100%;
    }
    .title-badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px;
      font-size: 0.85rem; color: var(--text-secondary);
      align-self: flex-start;
      backdrop-filter: blur(10px);
    }
    .title-badge-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 16px var(--accent);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    .title-main {
      font-family: ${theme.fontTitle};
      font-size: 5.5rem !important;
      font-weight: 800;
      line-height: 1.05;
      color: var(--text-primary);
      margin: 1.8rem 0 1.5rem;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .title-divider {
      width: 80px; height: 4px;
      background: var(--accent);
      border-radius: 2px;
      margin-bottom: 2rem;
    }
    .title-company {
      font-size: 1.1rem; font-weight: 500;
      color: var(--accent-light);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* ===== CONTENT SLIDES ===== */
    .slide-content { padding: 0 !important; }
    .content-wrapper {
      position: relative; z-index: 2;
      padding: 4.5rem 6rem 4rem;
      display: flex; flex-direction: column;
      height: 100%;
    }

    .content-header { margin-bottom: 2.5rem; }
    .content-eyebrow {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 1.2rem;
    }
    .content-eyebrow-line {
      width: 32px; height: 2px; background: var(--accent);
    }
    .content-eyebrow-text {
      font-size: 0.85rem; font-weight: 600;
      color: var(--accent);
      letter-spacing: 0.15em; text-transform: uppercase;
    }

    .content-title {
      font-family: ${theme.fontTitle};
      font-size: 3.5rem !important;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .content-subtitle {
      font-size: 1.4rem;
      color: var(--text-secondary);
      font-weight: 400;
      line-height: 1.5;
      margin: 0;
      max-width: 75ch;
    }

    /* Cards layout (2-6 bullets become cards) */
    .content-cards {
      display: grid; gap: 1.5rem;
      flex: 1;
    }
    .content-cards-2 { grid-template-columns: 1fr 1fr; }
    .content-cards-3 { grid-template-columns: repeat(3, 1fr); }
    .content-cards-4 { grid-template-columns: repeat(2, 1fr); grid-template-rows: 1fr 1fr; }
    .content-cards-5, .content-cards-6 { grid-template-columns: repeat(3, 1fr); }

    .content-card {
      padding: 2rem;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      display: flex; flex-direction: column; gap: 1.2rem;
      transition: transform 0.3s ease, border-color 0.3s ease;
      animation: card-in 0.6s ease-out backwards;
    }
    .content-card[data-card-index="0"] { animation-delay: 0ms; }
    .content-card[data-card-index="1"] { animation-delay: 80ms; }
    .content-card[data-card-index="2"] { animation-delay: 160ms; }
    .content-card[data-card-index="3"] { animation-delay: 240ms; }
    .content-card[data-card-index="4"] { animation-delay: 320ms; }
    .content-card[data-card-index="5"] { animation-delay: 400ms; }
    @keyframes card-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .content-card-icon {
      width: 56px; height: 56px;
      background: ${theme.bgAccent};
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .content-card-text {
      font-size: 1.15rem;
      color: var(--text-primary);
      font-weight: 500;
      line-height: 1.4;
    }

    /* Bullets layout (text-heavy slides) */
    .content-bullets {
      list-style: none; padding: 0; margin: 0;
      flex: 1;
      display: flex; flex-direction: column; gap: 1rem;
    }
    .content-bullet {
      display: flex; align-items: flex-start; gap: 1.2rem;
      padding: 1.2rem 1.5rem;
      background: var(--card-bg);
      border-left: 3px solid var(--accent);
      border-radius: 0 12px 12px 0;
      animation: bullet-in 0.5s ease-out backwards;
    }
    @keyframes bullet-in {
      from { opacity: 0; transform: translateX(-12px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .content-bullet-marker {
      width: 8px; height: 8px;
      background: var(--accent);
      border-radius: 50%;
      margin-top: 0.6rem;
      flex-shrink: 0;
      box-shadow: 0 0 12px var(--accent);
    }
    .content-bullet-text {
      font-size: 1.3rem;
      color: var(--text-primary);
      line-height: 1.5;
      font-weight: 400;
    }

    /* Recommendations slide */
    .reco-list { display: flex; flex-direction: column; gap: 1.4rem; flex: 1; }
    .reco-item {
      display: flex; gap: 1.8rem; align-items: center;
      padding: 1.4rem 1.8rem;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      animation: bullet-in 0.5s ease-out backwards;
    }
    .reco-number {
      font-size: 2.2rem; font-weight: 800;
      color: var(--accent);
      min-width: 70px;
      line-height: 1;
    }
    .reco-text {
      font-size: 1.2rem; color: var(--text-primary);
      font-weight: 500; line-height: 1.4;
    }

    /* Closing slide */
    .slide-closing { padding: 0 !important; }
    .closing-content {
      position: relative; z-index: 2;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; height: 100%;
      padding: 4rem;
    }
    .closing-mark {
      width: 80px; height: 6px;
      background: var(--accent);
      border-radius: 3px;
      margin-bottom: 2.5rem;
      box-shadow: 0 0 32px var(--accent);
    }
    .closing-title {
      font-family: ${theme.fontTitle};
      font-size: 7rem !important;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 2rem;
      letter-spacing: -0.04em;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .closing-company {
      font-size: 1.3rem; font-weight: 600;
      color: var(--accent-light);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 0 0 0.5rem;
    }
    .closing-contact {
      font-size: 1rem; color: var(--text-secondary);
      margin: 0;
    }

    /* Page number indicator */
    .reveal .progress { color: var(--accent); height: 3px; }
    .reveal .controls { color: var(--accent); }
    .reveal .slide-number {
      background: ${theme.cardBg};
      border: 1px solid var(--card-border);
      padding: 4px 12px;
      border-radius: 12px;
      font-family: ${theme.fontBody};
      font-size: 0.85rem;
      backdrop-filter: blur(10px);
    }
  `
}

export function renderRevealHtml(req: DocumentRequest): string {
  const theme = getTheme(req.data?.theme)
  const slides: SlideContent[] = req.data?.slides || []
  const period = req.data?.period || new Date().toLocaleDateString("fr-FR")
  const companyName = req.data?.company_name || "OmnIA"
  const contact = req.data?.company_email || req.data?.company_phone || ""

  const titleSlide = renderTitleSlide(theme, req.title, period, companyName)
  const contentSlides = slides.map((s, i) => renderContentSlide(theme, s, i + 1)).join("\n")
  const recoSlide = req.recommendations && req.recommendations.length > 0
    ? renderRecommendationsSlide(theme, req.recommendations)
    : ""
  const closingSlide = renderClosingSlide(theme, companyName, contact || undefined)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(req.title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css">
<style>${renderStyles(theme)}</style>
</head>
<body>
<div class="reveal">
  <div class="slides">
    ${titleSlide}
    ${contentSlides}
    ${recoSlide}
    ${closingSlide}
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script>
  Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    slideNumber: 'c/t',
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    width: 1600,
    height: 900,
    margin: 0,
    minScale: 0.2,
    maxScale: 2.0,
  });
</script>
</body>
</html>`
}
