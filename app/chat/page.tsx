'use client'

import { useState, useRef, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

const agents = [
  { id: 1, name: 'Lucas', role: 'Comptable', category: 'Finance', avatar: '/avatars/agent-1.png', color: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', agentId: 'comptable' },
  { id: 2, name: 'Marc', role: 'Trésorier', category: 'Finance', avatar: '/avatars/agent-2.png', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', agentId: 'tresorier' },
  { id: 3, name: 'Julie', role: 'Investissements', category: 'Finance', avatar: '/avatars/agent-3.png', color: '#0891B2', gradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)', agentId: 'investissements' },
  { id: 4, name: 'Thomas', role: 'Réseaux Sociaux', category: 'Marketing', avatar: '/avatars/agent-4.png', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', agentId: 'reseaux-sociaux' },
  { id: 5, name: 'Sophie', role: 'Email Marketing', category: 'Marketing', avatar: '/avatars/agent-5.png', color: '#DB2777', gradient: 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)', agentId: 'email-marketing' },
  { id: 6, name: 'Claire', role: 'RH', category: 'RH', avatar: '/avatars/agent-6.png', color: '#EA580C', gradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)', agentId: 'ressources-humaines' },
  { id: 7, name: 'Emma', role: 'Support Client', category: 'Support', avatar: '/avatars/agent-7.png', color: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', agentId: 'support-client' },
  { id: 8, name: 'Léa', role: 'Téléphonique', category: 'Support', avatar: '/avatars/agent-8.png', color: '#16A34A', gradient: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)', agentId: 'telephonique' },
]

// ═══════════════════════════════════════════════════════════════
// LOCALSTORAGE KEYS & HELPERS
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  conversations: (agentId: number) => `omnia_conversations_agent_${agentId}`,
  currentConvId: (agentId: number) => `omnia_current_conv_agent_${agentId}`,
  sharedMedias: 'omnia_shared_medias',
  lastAgent: 'omnia_last_agent',
}

// Helper to safely parse JSON from localStorage
const safeJsonParse = <T,>(json: string | null, fallback: T): T => {
  if (!json) return fallback
  try {
    return JSON.parse(json, (key, value) => {
      // Convert timestamp strings back to Date objects
      if (key === 'timestamp' && typeof value === 'string') {
        return new Date(value)
      }
      return value
    })
  } catch {
    return fallback
  }
}

// Load conversations for a specific agent from localStorage
const loadAgentConversations = (agentId: number): Conversation[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.conversations(agentId))
  return safeJsonParse<Conversation[]>(stored, [])
}

// Save conversations for a specific agent to localStorage
const saveAgentConversations = (agentId: number, conversations: Conversation[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.conversations(agentId), JSON.stringify(conversations))
}

// Load current conversation ID for a specific agent
const loadCurrentConvId = (agentId: number): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.currentConvId(agentId))
}

// Save current conversation ID for a specific agent
const saveCurrentConvId = (agentId: number, convId: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.currentConvId(agentId), convId)
}

// Load last used agent ID
const loadLastAgent = (): number | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEYS.lastAgent)
  return stored ? parseInt(stored, 10) : null
}

// Save last used agent ID
const saveLastAgent = (agentId: number) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.lastAgent, agentId.toString())
}

// Shared medias storage (shared across all agents)
export interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  agentIdOrigin: number // Which agent it was uploaded from (for reference)
}

const loadSharedMedias = (): MediaFile[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.sharedMedias)
  return safeJsonParse<MediaFile[]>(stored, [])
}

const saveSharedMedias = (medias: MediaFile[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.sharedMedias, JSON.stringify(medias))
}

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  imageData?: {
    base64: string
    mimeType: string
  }
}

interface Conversation {
  id: string
  agentId: number
  title: string
  preview: string
  date: string
  messages: Message[]
}

function ChatPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const [sharedMedias, setSharedMedias] = useState<MediaFile[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create welcome conversation for an agent
  const createWelcomeConversation = useCallback((agent: typeof agents[0]): Conversation => {
    return {
      id: `welcome-${agent.id}-${Date.now()}`,
      agentId: agent.id,
      title: 'Nouvelle conversation',
      preview: '',
      date: "Aujourd'hui",
      messages: [{
        id: '1',
        role: 'assistant',
        content: `Bonjour ! Je suis ${agent.name}, votre agent ${agent.role}. Comment puis-je vous aider aujourd'hui ?`,
        timestamp: new Date()
      }]
    }
  }, [])

  // Initialize on mount - load agent and conversations from localStorage
  useEffect(() => {
    setMounted(true)

    // Load shared medias
    setSharedMedias(loadSharedMedias())

    // Determine initial agent: URL param > localStorage > default
    const agentParam = searchParams.get('agent')
    let initialAgent = agents[0]

    if (agentParam) {
      // URL parameter takes priority
      const agentId = parseInt(agentParam, 10)
      const foundAgent = agents.find(a => a.id === agentId)
      if (foundAgent) {
        initialAgent = foundAgent
      }
    } else {
      // Check localStorage for last used agent
      const lastAgentId = loadLastAgent()
      if (lastAgentId) {
        const foundAgent = agents.find(a => a.id === lastAgentId)
        if (foundAgent) {
          initialAgent = foundAgent
        }
      }
    }

    setSelectedAgent(initialAgent)
    saveLastAgent(initialAgent.id)

    // Load conversations for this agent from localStorage
    const storedConversations = loadAgentConversations(initialAgent.id)

    if (storedConversations.length > 0) {
      setConversations(storedConversations)

      // Try to restore last active conversation
      const lastConvId = loadCurrentConvId(initialAgent.id)
      const lastConv = storedConversations.find(c => c.id === lastConvId)

      if (lastConv) {
        setCurrentConversation(lastConv)
      } else {
        // Use most recent conversation
        setCurrentConversation(storedConversations[0])
      }
    } else {
      // No stored conversations - create welcome conversation
      const welcomeConv = createWelcomeConversation(initialAgent)
      setConversations([welcomeConv])
      setCurrentConversation(welcomeConv)
      saveAgentConversations(initialAgent.id, [welcomeConv])
      saveCurrentConvId(initialAgent.id, welcomeConv.id)
    }
  }, [searchParams, createWelcomeConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages])

  const handleAgentChange = (agent: typeof agents[0]) => {
    // Save current agent's conversations before switching
    if (selectedAgent.id !== agent.id) {
      saveAgentConversations(selectedAgent.id, conversations)
      if (currentConversation) {
        saveCurrentConvId(selectedAgent.id, currentConversation.id)
      }
    }

    setSelectedAgent(agent)
    setShowAgentPicker(false)
    saveLastAgent(agent.id)

    // Update URL to reflect agent change
    router.push(`/chat?agent=${agent.id}`, { scroll: false })

    // Load conversations for the new agent
    const storedConversations = loadAgentConversations(agent.id)

    if (storedConversations.length > 0) {
      setConversations(storedConversations)

      // Restore last active conversation for this agent
      const lastConvId = loadCurrentConvId(agent.id)
      const lastConv = storedConversations.find(c => c.id === lastConvId)

      if (lastConv) {
        setCurrentConversation(lastConv)
      } else {
        setCurrentConversation(storedConversations[0])
      }
    } else {
      // No stored conversations - create welcome conversation
      const welcomeConv = createWelcomeConversation(agent)
      setConversations([welcomeConv])
      setCurrentConversation(welcomeConv)
      saveAgentConversations(agent.id, [welcomeConv])
      saveCurrentConvId(agent.id, welcomeConv.id)
    }
  }

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      agentId: selectedAgent.id,
      title: 'Nouvelle conversation',
      preview: '',
      date: "Aujourd'hui",
      messages: [{
        id: '1',
        role: 'assistant',
        content: `Bonjour ! Je suis ${selectedAgent.name}, votre agent ${selectedAgent.role}. Comment puis-je vous aider aujourd'hui ?`,
        timestamp: new Date()
      }]
    }
    const updatedConversations = [newConv, ...conversations]
    setConversations(updatedConversations)
    setCurrentConversation(newConv)

    // Save to localStorage
    saveAgentConversations(selectedAgent.id, updatedConversations)
    saveCurrentConvId(selectedAgent.id, newConv.id)
  }

  // Save current conversation when switching between conversations
  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversation(conv)
    saveCurrentConvId(selectedAgent.id, conv.id)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    const updatedConv = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      title: currentConversation.messages.length <= 1 ? inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : '') : currentConversation.title,
      preview: inputValue.slice(0, 40)
    }

    setCurrentConversation(updatedConv)
    const updatedConversations = conversations.map(c => c.id === updatedConv.id ? updatedConv : c)
    setConversations(updatedConversations)
    setInputValue('')
    setIsLoading(true)

    // Save to localStorage immediately after user message
    saveAgentConversations(selectedAgent.id, updatedConversations)

    // Resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Call n8n API via backend
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.agentId,
          message: inputValue,
          sessionId: `session-${selectedAgent.agentId}-${Date.now()}`,
        }),
      })

      const data = await response.json()

      // Extraire le texte de la réponse (peut être un objet structuré ou une string)
      let responseText: string
      let imageData: { base64: string; mimeType: string } | undefined
      const rawResponse = data.response

      if (typeof rawResponse === 'object' && rawResponse !== null) {
        // Réponse structurée de n8n (type_contenu, description, hashtags, etc.)
        responseText = rawResponse.description || rawResponse.prompt_ameliore || 'Contenu généré !'

        // Ajouter les hashtags si présents
        if (rawResponse.hashtags && Array.isArray(rawResponse.hashtags)) {
          responseText += '\n\n' + rawResponse.hashtags.join(' ')
        }

        // Extraire l'image si présente
        if (rawResponse.image_base64) {
          imageData = {
            base64: rawResponse.image_base64,
            mimeType: rawResponse.mimeType || 'image/png'
          }
        }
      } else {
        responseText = rawResponse || `Je suis ${selectedAgent.name}. Je traite votre demande...`
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        imageData
      }

      const finalConv = {
        ...updatedConv,
        messages: [...updatedConv.messages, aiMessage]
      }

      setCurrentConversation(finalConv)
      const finalConversations = updatedConversations.map(c => c.id === finalConv.id ? finalConv : c)
      setConversations(finalConversations)

      // Save to localStorage after AI response
      saveAgentConversations(selectedAgent.id, finalConversations)
    } catch (error) {
      console.error('Erreur chat:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Désolé, une erreur s'est produite. Réessayez plus tard.`,
        timestamp: new Date()
      }

      const finalConv = {
        ...updatedConv,
        messages: [...updatedConv.messages, errorMessage]
      }

      setCurrentConversation(finalConv)
      const finalConversations = updatedConversations.map(c => c.id === finalConv.id ? finalConv : c)
      setConversations(finalConversations)

      // Save to localStorage after error
      saveAgentConversations(selectedAgent.id, finalConversations)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file upload - saves to shared medias
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newMedias: MediaFile[] = []

    Array.from(files).forEach(file => {
      // Create a blob URL for the file (in production, you'd upload to a server)
      const url = URL.createObjectURL(file)

      const media: MediaFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: url,
        uploadedAt: new Date(),
        agentIdOrigin: selectedAgent.id
      }

      newMedias.push(media)
    })

    const updatedMedias = [...sharedMedias, ...newMedias]
    setSharedMedias(updatedMedias)
    saveSharedMedias(updatedMedias)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const getAgentById = (id: number) => agents.find(a => a.id === id) || agents[0]

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div
        className={`chat-app ${mounted ? 'mounted' : ''}`}
        style={{ '--agent-color': selectedAgent.color, '--agent-gradient': selectedAgent.gradient } as React.CSSProperties}
      >
      {/* Sidebar - 30% */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={handleNewConversation}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouvelle conversation
        </button>

        <div className="conversations-section">
          <span className="section-label">Historique</span>
          <div className="conversations-list">
            {conversations.map((conv, index) => {
              const convAgent = getAgentById(conv.agentId)
              return (
                <button
                  key={conv.id}
                  className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <div className="conv-avatar" style={{ background: convAgent.gradient }}>
                    {convAgent.name[0]}
                  </div>
                  <div className="conv-info">
                    <span className="conv-title">{conv.title}</span>
                    <span className="conv-preview">{conv.preview || 'Nouvelle conversation'}</span>
                  </div>
                  <span className="conv-date">{conv.date}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <Link href="/chat/medias" className="sidebar-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Medias
          </Link>
          <Link href="/dashboard/settings" className="sidebar-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Parametres
          </Link>
        </div>
      </aside>

      {/* Main Chat - 70% */}
      <main className="chat-main">
        {/* Header with Agent Selector */}
        <header className="chat-header">
          <button className="agent-selector" onClick={() => setShowAgentPicker(!showAgentPicker)}>
            <div className="current-agent">
              <Image
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                width={40}
                height={40}
                className="agent-avatar"
              />
              <div className="agent-details">
                <span className="agent-name">{selectedAgent.name}</span>
                <span className="agent-role">{selectedAgent.role}</span>
              </div>
            </div>
            <svg className={`chevron ${showAgentPicker ? 'open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Agent Picker Dropdown */}
          {showAgentPicker && (
            <div className="agent-picker">
              <div className="picker-header">Choisir un agent</div>
              <div className="agents-grid">
                {agents.map((agent, index) => (
                  <button
                    key={agent.id}
                    className={`agent-option ${selectedAgent.id === agent.id ? 'selected' : ''}`}
                    onClick={() => handleAgentChange(agent)}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="option-avatar"
                    />
                    <span className="option-name">{agent.name}</span>
                    <span className="option-role">{agent.role}</span>
                    {selectedAgent.id === agent.id && (
                      <div className="check-badge" style={{ background: agent.color }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="header-actions">
            <button className="action-btn" title="Rechercher">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-area">
          <div className="messages-wrapper">
            {currentConversation?.messages.map((message, index) => (
              <div
                key={message.id}
                className={`message ${message.role}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="msg-avatar" style={{ background: selectedAgent.gradient }}>
                    <Image
                      src={selectedAgent.avatar}
                      alt={selectedAgent.name}
                      width={36}
                      height={36}
                    />
                  </div>
                )}
                <div className="msg-content">
                  <div className="msg-bubble">
                    {message.content}
                    {message.imageData && (
                      <div className="msg-image" style={{ marginTop: '12px' }}>
                        <img
                          src={`data:${message.imageData.mimeType};base64,${message.imageData.base64}`}
                          alt="Image générée"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <span className="msg-time">
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="msg-avatar" style={{ background: selectedAgent.gradient }}>
                  <Image
                    src={selectedAgent.avatar}
                    alt={selectedAgent.name}
                    width={36}
                    height={36}
                  />
                </div>
                <div className="msg-content">
                  <div className="msg-bubble typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className="input-btn attach"
              onClick={() => fileInputRef.current?.click()}
              title="Joindre un fichier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message à ${selectedAgent.name}...`}
              rows={1}
            />

            <button
              className="input-btn send"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="input-hint">
            {selectedAgent.name} peut commettre des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </main>

      <style jsx>{`
        .chat-app {
          display: flex;
          height: calc(100vh - 72px);
          margin-top: 72px;
          background: var(--bg-primary);
          overflow: hidden;
          opacity: 0;
        }

        .chat-app.mounted {
          animation: appLoad 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes appLoad {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ═══════════════════════════════════════════════════════════════
           SIDEBAR (30%)
           ═══════════════════════════════════════════════════════════════ */
        .sidebar {
          width: 30%;
          min-width: 280px;
          max-width: 340px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .new-chat-btn {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 16px;
          padding: 14px;
          background: var(--agent-gradient);
          color: white;
          border: none;
          border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--agent-color) 30%, transparent);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .conversations-section {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .section-label {
          display: block;
          padding: 12px 20px 8px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px 12px;
        }

        .conversation-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 4px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .conversation-item:hover {
          background: var(--bg-tertiary);
        }

        .conversation-item.active {
          background: var(--bg-card);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .conv-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .conv-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .conv-title {
          font-weight: 500;
          font-size: 0.85rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-preview {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-date {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer :global(a.sidebar-link) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: var(--text-secondary);
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          line-height: 1;
        }

        .sidebar-footer :global(a.sidebar-link svg) {
          flex-shrink: 0;
          opacity: 0.7;
          width: 18px;
          height: 18px;
        }

        .sidebar-footer :global(a.sidebar-link:hover) {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .sidebar-footer :global(a.sidebar-link:hover svg) {
          opacity: 1;
        }

        /* ═══════════════════════════════════════════════════════════════
           MAIN CHAT (70%)
           ═══════════════════════════════════════════════════════════════ */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-primary);
          position: relative;
          z-index: 20;
        }

        .agent-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px 8px 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .agent-selector:hover {
          border-color: var(--agent-color);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--agent-color) 10%, transparent);
        }

        .current-agent {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
        }

        .agent-details {
          display: flex;
          flex-direction: column;
        }

        .agent-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .agent-role {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .chevron {
          color: var(--text-tertiary);
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        /* Agent Picker */
        .agent-picker {
          position: absolute;
          top: calc(100% + 8px);
          left: 24px;
          width: 380px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          padding: 16px;
          z-index: 100;
          animation: dropIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .picker-header {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          padding: 0 4px 12px;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .agent-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .agent-option:hover {
          background: var(--bg-secondary);
        }

        .agent-option.selected {
          background: color-mix(in srgb, var(--agent-color) 8%, transparent);
          border-color: var(--agent-color);
        }

        .option-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          object-fit: cover;
        }

        .option-name {
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .option-role {
          font-size: 0.6rem;
          color: var(--text-tertiary);
        }

        .check-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        /* Messages Area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .messages-wrapper {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message {
          display: flex;
          gap: 12px;
          animation: messageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .msg-avatar :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .msg-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 70%;
        }

        .message.user .msg-content {
          align-items: flex-end;
        }

        .msg-bubble {
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.assistant .msg-bubble {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-bottom-left-radius: 6px;
        }

        .message.user .msg-bubble {
          background: var(--agent-gradient);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .msg-time {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          padding: 0 6px;
        }

        /* Typing Indicator */
        .msg-bubble.typing {
          display: flex;
          gap: 5px;
          padding: 18px 22px;
        }

        .msg-bubble.typing .dot {
          width: 8px;
          height: 8px;
          background: var(--text-tertiary);
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite;
        }

        .msg-bubble.typing .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .msg-bubble.typing .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* Input Area */
        .input-area {
          padding: 16px 24px 24px;
          background: var(--bg-primary);
        }

        .input-wrapper {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: var(--agent-color);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--agent-color) 10%, transparent);
        }

        .input-wrapper textarea {
          flex: 1;
          padding: 6px 4px;
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-primary);
          resize: none;
          min-height: 24px;
          max-height: 150px;
          line-height: 1.5;
          outline: none;
        }

        .input-wrapper textarea::placeholder {
          color: var(--text-tertiary);
        }

        .input-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .input-btn.attach {
          background: transparent;
          color: var(--text-tertiary);
        }

        .input-btn.attach:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .input-btn.send {
          background: var(--agent-gradient);
          color: white;
        }

        .input-btn.send:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--agent-color) 30%, transparent);
        }

        .input-btn.send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-hint {
          max-width: 800px;
          margin: 10px auto 0;
          font-size: 0.7rem;
          color: var(--text-tertiary);
          text-align: center;
        }

        /* Scrollbar */
        .conversations-list::-webkit-scrollbar,
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }

        .conversations-list::-webkit-scrollbar-track,
        .messages-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .conversations-list::-webkit-scrollbar-thumb,
        .messages-area::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 72px;
            bottom: 0;
            width: 280px;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .agent-picker {
            width: calc(100vw - 48px);
            left: 16px;
            right: 16px;
          }

          .messages-area {
            padding: 16px;
          }

          .input-area {
            padding: 12px 16px 20px;
          }
        }
      `}</style>
      </div>
    </>
  )
}

function ChatLoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#4F46E5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoadingFallback />}>
      <ChatPageContent />
    </Suspense>
  )
}
