import { useState, useCallback } from 'react'

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  agentId: string
  agentName: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function useChat(agentId: string, agentName: string, welcomeMessage?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialMessage, setHasInitialMessage] = useState(false)

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  ) || null

  // Ajouter le message de bienvenue au premier rendu
  const createNewConversation = useCallback(() => {
    const newId = `conv-${Date.now()}`
    const welcomeMsg: Message = {
      id: `msg-welcome-${Date.now()}`,
      role: 'agent',
      content: welcomeMessage || `Bonjour ! Je suis ${agentName}. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
    }

    const newConversation: Conversation = {
      id: newId,
      agentId,
      agentName,
      title: 'Nouvelle conversation',
      messages: [welcomeMsg],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setHasInitialMessage(true)
  }, [agentId, agentName, welcomeMessage])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Si pas de conversation, créer une nouvelle avec message de bienvenue
      let targetConvId = currentConversationId
      if (!currentConversationId) {
        const newId = `conv-${Date.now()}`
        const welcomeMsg: Message = {
          id: `msg-welcome-${Date.now()}`,
          role: 'agent',
          content: welcomeMessage || `Bonjour ! Je suis ${agentName}. Comment puis-je vous aider aujourd'hui ?`,
          timestamp: new Date(),
        }

        const newConversation: Conversation = {
          id: newId,
          agentId,
          agentName,
          title: content.slice(0, 50),
          messages: [welcomeMsg],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setConversations((prev) => [newConversation, ...prev])
        setCurrentConversationId(newId)
        targetConvId = newId
      }

      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === targetConvId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                updatedAt: new Date(),
              }
            : conv
        )
      )

      setInputValue('')
      setIsLoading(true)

      // Appel réel à l'API /api/chat qui communique avec n8n
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentId,
            message: content,
            conversationId: null, // Géré côté frontend pour l'instant
          }),
        })

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`)
        }

        const data = await response.json()

        const agentMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'agent',
          content: data.agentMessage?.content || 'Désolé, je n\'ai pas pu traiter votre demande.',
          timestamp: new Date(),
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId
              ? {
                  ...conv,
                  messages: [...conv.messages, agentMessage],
                  updatedAt: new Date(),
                }
              : conv
          )
        )
      } catch (error) {
        console.error('Erreur lors de l\'appel API:', error)

        // Message d'erreur en cas d'échec
        const errorMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'agent',
          content: '❌ Désolé, une erreur s\'est produite. Veuillez réessayer.',
          timestamp: new Date(),
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId
              ? {
                  ...conv,
                  messages: [...conv.messages, errorMessage],
                  updatedAt: new Date(),
                }
              : conv
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversationId, agentId, agentName, welcomeMessage]
  )

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }, [currentConversationId])

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id)
  }, [])

  return {
    conversations,
    currentConversation,
    currentConversationId,
    inputValue,
    setInputValue,
    isLoading,
    sendMessage,
    createNewConversation,
    deleteConversation,
    selectConversation,
  }
}
