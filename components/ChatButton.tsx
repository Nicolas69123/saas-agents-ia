'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ChatModal from './ChatModal'

const HIDDEN_ON_PATHS = ['/chat', '/auth/login', '/auth/signup']

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname && HIDDEN_ON_PATHS.some(p => pathname.startsWith(p))) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le chat"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(79, 70, 229, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 90,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 70, 229, 0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(79, 70, 229, 0.4)'
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
