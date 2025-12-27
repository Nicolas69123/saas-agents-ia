'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const links = {
    product: [
      { label: 'Agents IA', href: '/agents' },
      { label: 'Tarification', href: '/pricing' },
      { label: 'Intégrations', href: '/integrations' },
      { label: 'API', href: '/api-docs' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Tutoriels', href: '/tutorials' },
      { label: 'FAQ', href: '/faq' },
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Carrières', href: '/careers' },
    ],
    legal: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'CGU', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
  }

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem',
    }}>
      <div className="container">
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(4, 1fr)',
          gap: '3rem',
          marginBottom: '4rem',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <Image
                src="/logos/omnia-logo-dark.png"
                alt="OmnIA"
                width={150}
                height={48}
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
                className="logo-light"
              />
              <Image
                src="/logos/omnia-logo-white.png"
                alt="OmnIA"
                width={150}
                height={48}
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'none',
                }}
                className="logo-dark"
              />
            </Link>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              maxWidth: '280px',
            }}>
              Automatisez votre business avec nos agents IA spécialisés.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['twitter', 'linkedin', 'github'].map(social => (
                <a
                  key={social}
                  href={`https://${social}.com/aiomnia`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-tertiary)'
                  }}
                >
                  {social === 'twitter' && '𝕏'}
                  {social === 'linkedin' && 'in'}
                  {social === 'github' && '◉'}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}>
                {category === 'product' && 'Produit'}
                {category === 'resources' && 'Ressources'}
                {category === 'company' && 'Entreprise'}
                {category === 'legal' && 'Légal'}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {items.map(link => (
                  <li key={link.href} style={{ marginBottom: '0.75rem' }}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)',
          }}>
            © {new Date().getFullYear()} OmnIA. Tous droits réservés.
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)',
          }}>
            Conçu avec soin à Paris
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .container > div:first-child {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .container > div:first-child > div:first-child {
            grid-column: span 3;
            margin-bottom: 1rem;
          }
        }
        @media (max-width: 640px) {
          .container > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .container > div:first-child > div:first-child {
            grid-column: span 2;
          }
        }

        /* Logo theme switching */
        :global(.logo-light) { display: block !important; }
        :global(.logo-dark) { display: none !important; }

        :global([data-theme="dark"]) :global(.logo-light) { display: none !important; }
        :global([data-theme="dark"]) :global(.logo-dark) { display: block !important; }
      `}</style>
    </footer>
  )
}
