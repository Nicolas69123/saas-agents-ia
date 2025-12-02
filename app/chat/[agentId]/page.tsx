'use client'

import { useParams } from 'next/navigation'
import ChatInterface from '@/components/Chat/ChatInterface'
import { agents } from '@/data/agents'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.agentId as string
  const { isAuthenticated, isLoading } = useAuth()

  // Trouver l'agent correspondant
  const agent = agents.find(a => a.id === agentId)

  // Protection : rediriger vers /pricing si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/pricing')
    }
  }, [isAuthenticated, isLoading, router])

  // Rediriger si l'agent n'existe pas
  useEffect(() => {
    if (!agent && !isLoading) {
      router.push('/')
    }
  }, [agent, isLoading, router])

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666'
      }}>
        Chargement...
      </div>
    )
  }

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  if (!agent) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666'
      }}>
        Agent non trouvé...
      </div>
    )
  }

  return <ChatInterface agent={agent} />
}
