'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <motion.div
            className="navbar-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/">
              <h2>SaaS Agents IA</h2>
            </Link>
          </motion.div>

          <motion.ul
            className="navbar-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <li><Link href="/#agents">Agents IA</Link></li>
            <li><Link href="/features">Fonctionnalités</Link></li>
            <li><Link href="/pricing">Tarification</Link></li>
            <li><Link href="/docs/integrations">Intégrations</Link></li>
            <li><Link href="/docs/faq">FAQ</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </motion.ul>

          <motion.div
            className="navbar-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/auth/login" className="login-link">Se connecter</Link>
            <Link href="/auth/signup" className="btn btn-secondary">S'inscrire</Link>
          </motion.div>
        </nav>
      </div>

      <style jsx>{`
        header {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          gap: 40px;
        }

        .navbar-brand h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #ffffff;
          font-weight: 700;
        }

        .navbar-brand a {
          text-decoration: none;
          color: inherit;
          transition: opacity 0.3s ease;
        }

        .navbar-brand a:hover {
          opacity: 0.8;
        }

        .navbar-menu {
          display: flex;
          list-style: none;
          gap: 48px;
          flex: 1;
          justify-content: center;
        }

        .navbar-menu a {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .navbar-menu a:after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .navbar-menu a:hover {
          color: #ffffff;
        }

        .navbar-menu a:hover:after {
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .login-link {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.3s ease;
          padding: 8px 16px;
        }

        .login-link:hover {
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-wrap: wrap;
            gap: 16px;
          }

          .navbar-menu {
            order: 3;
            width: 100%;
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }

          .navbar-menu a:after {
            display: none;
          }

          .navbar-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </header>
  )
}
