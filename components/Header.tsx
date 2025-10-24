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

    </header>
  )
}
