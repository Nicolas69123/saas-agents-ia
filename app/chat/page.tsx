'use client'

import { useState, useRef, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'
import SocialPostPreview, { SocialPostContent } from '@/components/SocialMockups'

const DocumentPreview = dynamic(() => import('@/components/DocumentPreview'), { ssr: false })

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

const AGENT_SUGGESTIONS: Record<string, string[]> = {
  'comptable': [
    'Génère-moi une facture template',
    'Analyse mes dépenses du mois',
    'Vérification de ma TVA',
    'Crée un bilan mensuel',
  ],
  'tresorier': [
    'Prévisions de trésorerie 3 mois',
    'Analyse de mon cashflow',
    'Calcul mon BFR',
    'Tableau de bord trésorerie',
  ],
  'investissements': [
    'Analyse de mon portefeuille',
    'Recommandations placements',
    'Comparer 2 produits financiers',
    'Stratégie d\'épargne entreprise',
  ],
  'reseaux-sociaux': [
    'Crée un post LinkedIn',
    'Planning éditorial du mois',
    'Idées de contenu Instagram',
    'Analyse de mes statistiques',
  ],
  'email-marketing': [
    'Rédige une newsletter',
    'Campagne emailing produit',
    'Email de relance client',
    'Optimiser mes taux d\'ouverture',
  ],
  'ressources-humaines': [
    'Fiche de poste développeur',
    'Plan d\'onboarding nouveau salarié',
    'Analyser un CV',
    'Politique de télétravail',
  ],
  'support-client': [
    'Réponse FAQ produit',
    'Template ticket support',
    'Analyse satisfaction client',
    'Procédure SAV',
  ],
  'telephonique': [
    'Script d\'appel commercial',
    'Message vocal professionnel',
    'Argumentaire de vente',
    'Procédure relance téléphonique',
  ],
}

// ═══════════════════════════════════════════════════════════════
// UUID HELPER (compatible HTTP & HTTPS)
// ═══════════════════════════════════════════════════════════════
const generateUUID = (): string => {
  // Use crypto.randomUUID if available (HTTPS), otherwise fallback
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for HTTP contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ═══════════════════════════════════════════════════════════════
// LOCALSTORAGE KEYS & HELPERS
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  conversations: (agentId: number) => `omnia_conversations_agent_${agentId}`,
  currentConvId: (agentId: number) => `omnia_current_conv_agent_${agentId}`,
  sharedMedias: 'omnia_shared_medias',
  lastAgent: 'omnia_last_agent',
  openAgents: 'omnia_open_agents',
}

// Onglets d'agents ouverts (liste d'IDs, ordre = ordre d'ouverture)
const loadOpenAgents = (): number[] => {
  if (typeof window === 'undefined') return []
  return safeJsonParse<number[]>(localStorage.getItem(STORAGE_KEYS.openAgents), [])
}
const saveOpenAgents = (ids: number[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.openAgents, JSON.stringify(ids))
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
  filename?: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  agentIdOrigin: number
  conversationId?: string
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
  imageUrl?: string
  videoUrl?: string
  documentUrl?: string
  documentFilename?: string
  documentFormat?: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'html'
  documentPreviewUrl?: string | null
  documentDownloadUrl?: string
  documentDownloadFilename?: string
  socialPost?: SocialPostContent
  status?: 'pending' | 'done' | 'error'
  serverMessageId?: string
  attachments?: MessageAttachment[]
  actions?: MessageAction[]
}

interface MessageAttachment {
  id: string
  name: string
  filename: string
  size: number
  type: string
  url: string
}

interface MessageAction {
  type: 'upload' | 'continue' | 'generate' | 'link'
  label: string
  payload?: string
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
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [openAgentIds, setOpenAgentIds] = useState<number[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const [sharedMedias, setSharedMedias] = useState<MediaFile[]>([])
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([])
  const [isUploading, setIsUploading] = useState(false)

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

    // Onglets d'agents ouverts : charger + garantir que l'agent courant y figure
    const storedOpen = loadOpenAgents().filter((id) => agents.some((a) => a.id === id))
    const openTabs = storedOpen.includes(initialAgent.id) ? storedOpen : [...storedOpen, initialAgent.id]
    setOpenAgentIds(openTabs)
    saveOpenAgents(openTabs)

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

  // Resume polling for pending messages on mount or conversation switch
  useEffect(() => {
    if (!currentConversation) return
    const pendingMessages = currentConversation.messages.filter((m) => m.status === 'pending' && m.serverMessageId)
    if (pendingMessages.length === 0) return

    const intervals: ReturnType<typeof setInterval>[] = []
    for (const pm of pendingMessages) {
      let attempts = 0
      const maxAttempts = 90
      const interval = setInterval(async () => {
        attempts++
        try {
          const res = await fetch(`/api/chat?messageId=${encodeURIComponent(pm.serverMessageId!)}`)
          if (!res.ok) return
          const data = await res.json()
          if (data.status === 'done' || data.status === 'error') {
            clearInterval(interval)
            const parsed: Message = data.status === 'error'
              ? { id: pm.id, role: 'assistant', content: data.response || `Erreur: ${data.error}`, timestamp: new Date(), status: 'error' }
              : parseAgentResponse(data.response, pm.id)
            parsed.serverMessageId = pm.serverMessageId

            setConversations((prev) => {
              const updated = prev.map((c) => {
                if (c.id !== currentConversation.id) return c
                return { ...c, messages: c.messages.map((m) => m.id === pm.id ? parsed : m) }
              })
              saveAgentConversations(selectedAgent.id, updated)
              return updated
            })
            setCurrentConversation((cur) => {
              if (!cur || cur.id !== currentConversation.id) return cur
              return { ...cur, messages: cur.messages.map((m) => m.id === pm.id ? parsed : m) }
            })
            setIsLoading(false)
          }
        } catch (err) {
          console.error('[RESUME POLL] error:', err)
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval)
          setIsLoading(false)
        }
      }, 2000)
      intervals.push(interval)
    }

    return () => {
      for (const i of intervals) clearInterval(i)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id])

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

    // Ajouter l'agent aux onglets ouverts (s'il n'y est pas deja)
    setOpenAgentIds((prev) => {
      const next = prev.includes(agent.id) ? prev : [...prev, agent.id]
      saveOpenAgents(next)
      return next
    })

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

  // Ferme un onglet d'agent. L'historique des conversations reste conserve en
  // localStorage (on retire juste l'onglet). Si on ferme l'agent actif, on bascule
  // sur un autre onglet ouvert.
  const closeAgentTab = (e: React.MouseEvent, agentId: number) => {
    e.stopPropagation()
    setOpenAgentIds((prev) => {
      const next = prev.filter((id) => id !== agentId)
      saveOpenAgents(next)
      // Si on ferme l'agent actuellement ouvert, basculer vers un voisin
      if (agentId === selectedAgent.id && next.length > 0) {
        const fallback = agents.find((a) => a.id === next[next.length - 1])
        if (fallback) handleAgentChange(fallback)
      }
      return next
    })
  }

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: generateUUID(),
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

  // Parse an agent response (raw text or structured JSON) into a Message
  const parseAgentResponse = (rawResponse: unknown, messageId: string): Message => {
    let responseText: string
    let imageUrl: string | undefined
    let videoUrl: string | undefined
    let socialPost: SocialPostContent | undefined

    if (typeof rawResponse === 'object' && rawResponse !== null) {
      const r = rawResponse as Record<string, unknown> & { type_contenu?: string; response?: string; post_content?: { text?: string } }
      if (r.type_contenu === 'conversation' && r.response) {
        responseText = r.response
      } else if (r.type_contenu === 'social_post' && r.post_content) {
        socialPost = rawResponse as SocialPostContent
        responseText = (r.post_content?.text as string) || 'Post social genere !'
      } else {
        const hasDocument = !!r.document_url

        if (hasDocument && r.title) {
          responseText = `Voici **${r.title}** :`
          if (Array.isArray(r.recommendations) && r.recommendations.length > 0) {
            responseText += '\n\n**Recommandations :**\n' + (r.recommendations as string[]).map((rc: string) => `- ${rc}`).join('\n')
          }
          if (Array.isArray(r.alerts) && r.alerts.length > 0) {
            responseText += '\n\n**Alertes :**\n' + (r.alerts as { level: string; message: string }[]).map((a) => `- [${a.level}] ${a.message}`).join('\n')
          }
        } else {
          responseText = (r.response as string) || (r.content as string) || (r.description as string) || (r.prompt_ameliore as string) || ''
          if (r.title && responseText) {
            responseText = `**${r.title}**\n\n${responseText}`
          }
        }

        if (!responseText) responseText = 'Contenu genere !'
        if (Array.isArray(r.hashtags)) {
          responseText += '\n\n' + (r.hashtags as string[]).join(' ')
        }
      }

      if (r.image_url) imageUrl = r.image_url as string
      else if (r.image_base64) imageUrl = `data:${(r.mimeType as string) || 'image/png'};base64,${r.image_base64}`

      if (r.video_local_url) videoUrl = r.video_local_url as string

      const rawActions = Array.isArray(r.actions) ? (r.actions as unknown[]) : null
      const actions: MessageAction[] | undefined = rawActions
        ? rawActions
            .map((a) => a as { type?: string; label?: string; payload?: string })
            .filter((a) => a && a.type && a.label && ['upload', 'continue', 'generate', 'link'].includes(a.type))
            .map((a) => ({ type: a.type as MessageAction['type'], label: a.label!, payload: a.payload }))
        : undefined

      return {
        id: messageId,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        imageUrl,
        videoUrl,
        documentUrl: r.document_url as string | undefined,
        documentFilename: r.document_filename as string | undefined,
        documentFormat: r.document_format as Message['documentFormat'],
        documentPreviewUrl: r.document_preview_url as string | null | undefined,
        documentDownloadUrl: r.document_download_url as string | undefined,
        documentDownloadFilename: r.document_download_filename as string | undefined,
        socialPost: socialPost,
        status: 'done',
        actions: actions && actions.length > 0 ? actions : undefined,
      }
    }

    return {
      id: messageId,
      role: 'assistant',
      content: typeof rawResponse === 'string' ? rawResponse : 'Reponse vide',
      timestamp: new Date(),
      status: 'done',
    }
  }

  // Poll a pending message until it's done
  const pollMessageStatus = (serverMessageId: string, localMessageId: string, convId: string) => {
    let attempts = 0
    const maxAttempts = 90 // 90 * 2s = 3min max
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/chat?messageId=${encodeURIComponent(serverMessageId)}`)
        if (!res.ok) return

        const data = await res.json()
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(interval)
          const parsed: Message = data.status === 'error'
            ? { id: localMessageId, role: 'assistant', content: data.response || `Erreur: ${data.error}`, timestamp: new Date(), status: 'error' }
            : parseAgentResponse(data.response, localMessageId)
          parsed.serverMessageId = serverMessageId

          setConversations((prev) => {
            const updated = prev.map((c) => {
              if (c.id !== convId) return c
              return {
                ...c,
                messages: c.messages.map((m) => m.id === localMessageId ? parsed : m),
              }
            })
            saveAgentConversations(selectedAgent.id, updated)
            return updated
          })
          setCurrentConversation((cur) => {
            if (!cur || cur.id !== convId) return cur
            return { ...cur, messages: cur.messages.map((m) => m.id === localMessageId ? parsed : m) }
          })
          setIsLoading(false)
        }
      } catch (err) {
        console.error('[POLL] error:', err)
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval)
        setIsLoading(false)
      }
    }, 2000)
  }

  const getAttachmentIcon = (type: string, name: string): string => {
    const lower = (name || '').toLowerCase()
    if (type?.startsWith('image/')) return '🖼️'
    if (type === 'application/pdf' || lower.endsWith('.pdf')) return '📕'
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) return '📊'
    if (lower.endsWith('.docx') || lower.endsWith('.doc')) return '📄'
    if (lower.endsWith('.json')) return '🗂️'
    if (lower.endsWith('.md') || lower.endsWith('.txt')) return '📝'
    return '📎'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  }

  const handleMessageAction = (action: MessageAction) => {
    switch (action.type) {
      case 'upload':
        fileInputRef.current?.click()
        break
      case 'continue':
      case 'generate':
        if (action.payload) {
          setInputValue(action.payload)
          setTimeout(() => textareaRef.current?.focus(), 0)
        }
        break
      case 'link':
        if (action.payload) window.open(action.payload, '_blank', 'noopener,noreferrer')
        break
    }
  }

  const handleSendMessage = async () => {
    const hasText = inputValue.trim().length > 0
    const hasAttachments = pendingAttachments.length > 0
    if ((!hasText && !hasAttachments) || !currentConversation) return

    const messageText = hasText
      ? inputValue
      : `J'ai joint ${pendingAttachments.length} fichier${pendingAttachments.length > 1 ? 's' : ''}.`

    const attachmentsSnapshot = [...pendingAttachments]

    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      attachments: attachmentsSnapshot.length > 0 ? attachmentsSnapshot : undefined,
    }

    const pendingId = generateUUID()
    const pendingMessage: Message = {
      id: pendingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'pending',
    }

    const updatedConv = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage, pendingMessage],
      title: currentConversation.messages.length <= 1 ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '') : currentConversation.title,
      preview: messageText.slice(0, 40)
    }

    setCurrentConversation(updatedConv)
    const updatedConversations = conversations.map(c => c.id === updatedConv.id ? updatedConv : c)
    setConversations(updatedConversations)
    const currentInput = messageText
    setInputValue('')
    setPendingAttachments([])
    setIsLoading(true)

    saveAgentConversations(selectedAgent.id, updatedConversations)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.agentId,
          message: currentInput,
          conversationId: currentConversation.id,
          userId: (user as Record<string, unknown>)?.id || 'anonymous',
          attachments: attachmentsSnapshot.map((a) => ({
            id: a.id,
            filename: a.filename,
            name: a.name,
            type: a.type,
            size: a.size,
          })),
        }),
      })

      const data = await response.json()

      // New async flow: start polling
      if (data.status === 'pending' && data.messageId) {
        // Save serverMessageId on the pending message for refresh-recovery
        const enrichedPending = { ...pendingMessage, serverMessageId: data.messageId }
        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c.id !== updatedConv.id) return c
            return { ...c, messages: c.messages.map((m) => m.id === pendingId ? enrichedPending : m) }
          })
          saveAgentConversations(selectedAgent.id, updated)
          return updated
        })
        setCurrentConversation((cur) => {
          if (!cur || cur.id !== updatedConv.id) return cur
          return { ...cur, messages: cur.messages.map((m) => m.id === pendingId ? enrichedPending : m) }
        })
        pollMessageStatus(data.messageId, pendingId, updatedConv.id)
        return
      }

      // Legacy sync flow (fallback - kept for compatibility)

      // Extraire le texte de la réponse (peut être un objet structuré ou une string)
      let responseText: string
      let imageUrl: string | undefined  // Stocker URL au lieu de base64 pour éviter quota localStorage
      let videoUrl: string | undefined  // URL de la vidéo générée par Veo
      let socialPost: SocialPostContent | undefined  // Pour les mockups réseaux sociaux
      const rawResponse = data.response

      if (typeof rawResponse === 'object' && rawResponse !== null) {
        // Vérifier si c'est une conversation
        if (rawResponse.type_contenu === 'conversation' && rawResponse.response) {
          responseText = rawResponse.response
        }
        // Vérifier si c'est un post social
        else if (rawResponse.type_contenu === 'social_post' && rawResponse.post_content) {
          socialPost = rawResponse as SocialPostContent
          responseText = rawResponse.post_content.text || 'Post social généré !'
        } else {
          // Reponse structuree (agent comptable, n8n, etc.)
          const hasDocument = !!rawResponse.document_url

          if (hasDocument && rawResponse.title) {
            // Document Word genere : message court, le contenu est dans la preview DOCX
            responseText = `Voici **${rawResponse.title}** :`

            if (rawResponse.recommendations && Array.isArray(rawResponse.recommendations) && rawResponse.recommendations.length > 0) {
              responseText += '\n\n**Recommandations :**\n' + rawResponse.recommendations.map((r: string) => `- ${r}`).join('\n')
            }

            if (rawResponse.alerts && Array.isArray(rawResponse.alerts) && rawResponse.alerts.length > 0) {
              responseText += '\n\n**Alertes :**\n' + rawResponse.alerts.map((a: { level: string; message: string }) => `- [${a.level}] ${a.message}`).join('\n')
            }
          } else {
            // Pas de document : fallback vers texte plein
            responseText = rawResponse.response || rawResponse.content || rawResponse.description || rawResponse.prompt_ameliore || ''

            if (rawResponse.title && responseText) {
              responseText = `**${rawResponse.title}**\n\n${responseText}`
            }
          }

          if (!responseText) responseText = 'Contenu genere !'

          // Ajouter les hashtags si presents
          if (rawResponse.hashtags && Array.isArray(rawResponse.hashtags)) {
            responseText += '\n\n' + rawResponse.hashtags.join(' ')
          }
        }

        // Extraire l'image si présente (sauvegardée par le backend ou base64)
        if (rawResponse.image_url) {
          // Image déjà sauvegardée par le backend - utiliser directement l'URL
          imageUrl = rawResponse.image_url
          console.log('✅ Image déjà sauvegardée par le backend:', imageUrl)

          // Si c'est un post social, sauvegarder vers /api/posts pour la bibliothèque
          if (socialPost && socialPost.platform) {
            try {
              const postResponse = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  platform: socialPost.platform,
                  content: {
                    text: socialPost.post_content?.text || '',
                    hashtags: socialPost.hashtags || []
                  },
                  mediaUrl: rawResponse.image_url,
                  mediaType: 'image',
                  status: 'draft'
                })
              })
              const postData = await postResponse.json()
              if (postData.success) {
                console.log('📱 Post social sauvegardé:', postData.post?.id)
              }
            } catch (postError) {
              console.error('⚠️ Erreur sauvegarde post:', postError)
            }
          }
        } else if (rawResponse.image_base64) {
          // Fallback: image base64 (ancien comportement)
          console.log('🖼️ Image base64 détectée, taille:', rawResponse.image_base64.length)
          const mimeType = rawResponse.mimeType || 'image/png'
          imageUrl = `data:${mimeType};base64,${rawResponse.image_base64}`
          console.log('🔄 Utilisation base64 directe')
        } else {
          console.log('⚠️ Pas d\'image dans la réponse, clés:', Object.keys(rawResponse))
        }

        // Extraire la vidéo locale si présente
        if (rawResponse.video_local_url) {
          // Vidéo téléchargée et sauvegardée localement
          videoUrl = rawResponse.video_local_url
          console.log('🎬 Vidéo locale détectée:', videoUrl)

          // Si c'est un post social avec vidéo, sauvegarder vers /api/posts
          if (socialPost && socialPost.platform) {
            try {
              const postResponse = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  platform: socialPost.platform,
                  content: {
                    text: socialPost.post_content?.text || '',
                    hashtags: socialPost.hashtags || []
                  },
                  mediaUrl: rawResponse.video_local_url,
                  mediaType: 'video',
                  status: 'draft'
                })
              })
              const postData = await postResponse.json()
              if (postData.success) {
                console.log('📱 Post vidéo social sauvegardé:', postData.post?.id)
              }
            } catch (postError) {
              console.error('⚠️ Erreur sauvegarde post vidéo:', postError)
            }
          }
        }

        // Debug: afficher toutes les clés pour comprendre la structure
        console.log('📦 Structure réponse:', Object.keys(rawResponse), 'video_local_url:', rawResponse.video_local_url, 'video_ready:', rawResponse.video_ready)
      } else {
        responseText = rawResponse || `Je suis ${selectedAgent.name}. Je traite votre demande...`
      }

      // Nettoyer socialPost pour ne PAS stocker les données volumineuses (base64)
      const cleanedSocialPost = socialPost ? {
        ...socialPost,
        image_base64: undefined,  // Ne pas stocker en localStorage (trop gros)
        video_base64: undefined,
      } : undefined

      // Si c'est un post social SANS média (texte seul), le sauvegarder quand même
      if (socialPost && socialPost.platform && !imageUrl && !videoUrl) {
        try {
          const postResponse = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform: socialPost.platform,
              content: {
                text: socialPost.post_content?.text || '',
                hashtags: socialPost.hashtags || []
              },
              status: 'draft'
            })
          })
          const postData = await postResponse.json()
          if (postData.success) {
            console.log('📝 Post texte sauvegardé:', postData.post?.id)
          }
        } catch (postError) {
          console.error('⚠️ Erreur sauvegarde post texte:', postError)
        }
      }

      const documentUrl = typeof rawResponse === 'object' ? rawResponse?.document_url : undefined
      const documentFilename = typeof rawResponse === 'object' ? rawResponse?.document_filename : undefined
      const documentFormat = typeof rawResponse === 'object' ? rawResponse?.document_format : undefined
      const documentPreviewUrl = typeof rawResponse === 'object' ? rawResponse?.document_preview_url : undefined
      const documentDownloadUrl = typeof rawResponse === 'object' ? rawResponse?.document_download_url : undefined
      const documentDownloadFilename = typeof rawResponse === 'object' ? rawResponse?.document_download_filename : undefined

      const aiMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        imageUrl,
        videoUrl,
        documentUrl,
        documentFilename,
        documentFormat,
        documentPreviewUrl,
        documentDownloadUrl,
        documentDownloadFilename,
        socialPost: cleanedSocialPost
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
        id: generateUUID(),
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !currentConversation) return

    setIsUploading(true)
    const userId = String((user as Record<string, unknown>)?.id || 'anonymous')
    const uploaded: MessageAttachment[] = []
    const newMedias: MediaFile[] = []

    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('conversationId', currentConversation.id)
        fd.append('userId', userId)

        const res = await fetch('/api/uploads', { method: 'POST', body: fd })
        const data = await res.json()

        if (!res.ok || !data.success) {
          console.error('[UPLOAD] echec:', data.error)
          alert(`Echec upload "${file.name}": ${data.error || 'erreur inconnue'}`)
          continue
        }

        uploaded.push({
          id: data.id,
          name: data.name,
          filename: data.filename,
          size: data.size,
          type: data.type,
          url: data.url,
        })

        newMedias.push({
          id: data.id,
          name: data.name,
          filename: data.filename,
          type: data.type,
          size: data.size,
          url: data.url,
          uploadedAt: new Date(),
          agentIdOrigin: selectedAgent.id,
          conversationId: currentConversation.id,
        })
      } catch (err) {
        console.error('[UPLOAD] exception:', err)
      }
    }

    if (uploaded.length > 0) {
      setPendingAttachments((prev) => [...prev, ...uploaded])
      const updatedMedias = [...sharedMedias, ...newMedias]
      setSharedMedias(updatedMedias)
      saveSharedMedias(updatedMedias)
    }

    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id))
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
          <Link href="/chat/calendar" className="sidebar-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Calendrier
          </Link>
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

          {/* Onglets des agents ouverts */}
          {openAgentIds.length > 0 && (
            <div className="agent-tabs">
              {openAgentIds.map((id) => {
                const a = getAgentById(id)
                const active = id === selectedAgent.id
                return (
                  <button
                    key={id}
                    className={`agent-tab ${active ? 'active' : ''}`}
                    onClick={() => handleAgentChange(a)}
                    style={{ '--tab-color': a.color } as React.CSSProperties}
                    title={`${a.name} - ${a.role}`}
                  >
                    <Image src={a.avatar} alt={a.name} width={22} height={22} className="tab-avatar" />
                    <span className="tab-name">{a.name}</span>
                    <span
                      className="tab-close"
                      role="button"
                      aria-label={`Fermer ${a.name}`}
                      onClick={(e) => closeAgentTab(e, id)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>
                  </button>
                )
              })}
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
                    {/* Afficher le mockup social si disponible */}
                    {message.socialPost ? (
                      <SocialPostPreview
                        content={message.socialPost}
                        imageUrl={message.imageUrl}
                        videoUrl={message.videoUrl}
                        onContentChange={(newContent) => {
                          // Update the message with new content
                          if (currentConversation) {
                            const updatedMessages = currentConversation.messages.map(m =>
                              m.id === message.id ? { ...m, socialPost: newContent } : m
                            )
                            const updatedConv = { ...currentConversation, messages: updatedMessages }
                            setCurrentConversation(updatedConv)
                            const updatedConversations = conversations.map(c =>
                              c.id === updatedConv.id ? updatedConv : c
                            )
                            setConversations(updatedConversations)
                            saveAgentConversations(selectedAgent.id, updatedConversations)
                          }
                        }}
                      />
                    ) : message.status === 'pending' ? (
                      <div className="msg-pending">
                        <div className="msg-typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="msg-pending-text">Generation en cours...</span>
                      </div>
                    ) : (
                      <>
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                        {message.imageUrl && (
                          <div className="msg-image" style={{ marginTop: '12px' }}>
                            <img
                              src={message.imageUrl}
                              alt="Image générée"
                              style={{
                                maxWidth: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            />
                          </div>
                        )}
                        {message.videoUrl && (
                          <div className="msg-video" style={{ marginTop: '12px' }}>
                            <video
                              src={message.videoUrl}
                              controls
                              autoPlay
                              muted
                              loop
                              playsInline
                              style={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            />
                          </div>
                        )}
                        {message.documentUrl && (
                          <DocumentPreview
                            url={message.documentUrl}
                            filename={message.documentFilename}
                            format={message.documentFormat}
                            previewUrl={message.documentPreviewUrl}
                            downloadUrl={message.documentDownloadUrl}
                            downloadFilename={message.documentDownloadFilename}
                          />
                        )}
                        {message.actions && message.actions.length > 0 && (
                          <div className="msg-actions">
                            {message.actions.map((action, i) => (
                              <button
                                key={i}
                                className="msg-action-btn"
                                onClick={() => handleMessageAction(action)}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="msg-attachments">
                        {message.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="msg-attachment-chip"
                          >
                            <span className="att-icon">{getAttachmentIcon(att.type, att.name)}</span>
                            <span className="att-info">
                              <span className="att-name">{att.name}</span>
                              <span className="att-size">{formatFileSize(att.size)}</span>
                            </span>
                          </a>
                        ))}
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

            {/* Suggestions shown only when conversation has just the welcome message */}
            {currentConversation && currentConversation.messages.length === 1 && currentConversation.messages[0].role === 'assistant' && AGENT_SUGGESTIONS[selectedAgent.agentId] && (
              <div className="suggestions-container">
                <div className="suggestions-title">Pour commencer, essaie :</div>
                <div className="suggestions-grid">
                  {AGENT_SUGGESTIONS[selectedAgent.agentId].map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="suggestion-chip"
                      onClick={() => {
                        setInputValue(suggestion)
                        setTimeout(() => textareaRef.current?.focus(), 0)
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          {(pendingAttachments.length > 0 || isUploading) && (
            <div className="pending-attachments">
              {pendingAttachments.map((att) => (
                <div key={att.id} className="pending-chip">
                  <span className="pending-icon">{getAttachmentIcon(att.type, att.name)}</span>
                  <span className="pending-name">{att.name}</span>
                  <span className="pending-size">{formatFileSize(att.size)}</span>
                  <button
                    type="button"
                    className="pending-remove"
                    onClick={() => removePendingAttachment(att.id)}
                    aria-label="Retirer"
                  >
                    ×
                  </button>
                </div>
              ))}
              {isUploading && (
                <div className="pending-chip uploading">
                  <span className="pending-spinner" />
                  <span className="pending-name">Upload en cours...</span>
                </div>
              )}
            </div>
          )}
          <div className="input-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className="input-btn attach"
              onClick={() => fileInputRef.current?.click()}
              title="Joindre un fichier"
              disabled={isUploading}
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
              disabled={(!inputValue.trim() && pendingAttachments.length === 0) || isLoading || isUploading}
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
        .suggestions-container {
          margin: 32px auto;
          max-width: 1080px;
          padding: 0 24px;
          animation: suggestions-in 0.5s ease-out;
        }
        @keyframes suggestions-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .suggestions-title {
          font-size: 0.85rem;
          color: var(--text-secondary, #6b7280);
          margin-bottom: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (max-width: 640px) {
          .suggestions-grid { grid-template-columns: 1fr; }
        }
        .suggestion-chip {
          padding: 14px 18px;
          background: var(--bg-secondary, #f9fafb);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px;
          color: var(--text-primary, #111827);
          font-size: 0.92rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          line-height: 1.4;
        }
        .suggestion-chip:hover {
          border-color: var(--accent, #4F46E5);
          background: var(--bg-primary, #fff);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
        }
        .suggestion-chip:active {
          transform: translateY(0);
        }

        .msg-attachments {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .msg-attachment-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          max-width: 280px;
        }
        .msg-attachment-chip:hover {
          background: #fff;
          border-color: var(--agent-color, #4F46E5);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .message.user .msg-attachment-chip {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
        .message.user .msg-attachment-chip:hover {
          background: rgba(255, 255, 255, 0.28);
        }
        .att-icon { font-size: 1.4rem; line-height: 1; }
        .att-info { display: flex; flex-direction: column; min-width: 0; }
        .att-name {
          font-size: 0.88rem; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 200px;
        }
        .att-size { font-size: 0.72rem; opacity: 0.7; }

        .msg-actions {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .msg-action-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--agent-color, #4F46E5);
          background: rgba(79, 70, 229, 0.06);
          color: var(--agent-color, #4F46E5);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .msg-action-btn:hover {
          background: var(--agent-color, #4F46E5);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .pending-attachments {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 8px 10px;
          max-width: 1080px;
          margin: 0 auto;
          width: 100%;
        }
        .pending-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: var(--bg-secondary, #f3f4f6);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          font-size: 0.82rem;
        }
        .pending-chip.uploading {
          opacity: 0.7;
          font-style: italic;
        }
        .pending-icon { font-size: 1.1rem; line-height: 1; }
        .pending-name {
          font-weight: 500;
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pending-size { opacity: 0.65; font-size: 0.72rem; }
        .pending-remove {
          background: none;
          border: none;
          font-size: 1.2rem;
          line-height: 1;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          padding: 0 2px;
        }
        .pending-remove:hover { color: #ef4444; }
        .pending-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: var(--agent-color, #4F46E5);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .msg-pending {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 0;
        }
        .msg-pending-text {
          font-size: 0.9rem;
          color: var(--text-secondary, #6b7280);
          font-style: italic;
        }
        .msg-typing-indicator {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .msg-typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--accent, #4F46E5);
          border-radius: 50%;
          animation: typing-bounce 1.2s infinite ease-in-out;
        }
        .msg-typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
        .msg-typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

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
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-primary);
          position: relative;
          z-index: 20;
        }

        /* Onglets des agents ouverts */
        .agent-tabs {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 4px;
          scrollbar-width: thin;
        }
        .agent-tabs::-webkit-scrollbar { height: 4px; }
        .agent-tabs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .agent-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          max-width: 180px;
          padding: 6px 8px 6px 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.18s ease;
          color: var(--text-secondary);
        }
        .agent-tab:hover { border-color: var(--tab-color); color: var(--text-primary); }
        .agent-tab.active {
          background: var(--bg-card);
          border-color: var(--tab-color);
          color: var(--text-primary);
          box-shadow: 0 0 0 1px var(--tab-color);
        }
        .agent-tab :global(.tab-avatar) {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .tab-name {
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tab-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          color: var(--text-tertiary);
          transition: all 0.15s ease;
        }
        .tab-close:hover { background: rgba(239, 68, 68, 0.12); color: #EF4444; }

        @media (max-width: 768px) {
          .agent-tabs { display: none; }
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
          max-width: 1080px;
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
          white-space: normal;
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

        /* Force white text on user messages (dark gradient backgrounds) */
        .message.user .msg-bubble {
          color: white !important;
        }

        .message.user .msg-bubble * {
          color: white !important;
        }

        .message.user .markdown-content,
        .message.user .markdown-content :global(p),
        .message.user .markdown-content :global(span),
        .message.user .markdown-content :global(h1),
        .message.user .markdown-content :global(h2),
        .message.user .markdown-content :global(h3),
        .message.user .markdown-content :global(h4),
        .message.user .markdown-content :global(h5),
        .message.user .markdown-content :global(h6),
        .message.user .markdown-content :global(strong),
        .message.user .markdown-content :global(em),
        .message.user .markdown-content :global(li),
        .message.user .markdown-content :global(ul),
        .message.user .markdown-content :global(ol),
        .message.user .markdown-content :global(blockquote) {
          color: white !important;
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

        /* Markdown Styles */
        .markdown-content {
          word-wrap: break-word;
          line-height: 1.5;
n          font-size: inherit;
        }

        .markdown-content :global(h1) {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 16px 0 12px 0;
          color: var(--text-primary);
        }

        .markdown-content :global(h2) {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 14px 0 10px 0;
          color: var(--text-primary);
        }

        .markdown-content :global(h3) {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 12px 0 8px 0;
          color: var(--text-primary);
        }

        .markdown-content :global(h4),
        .markdown-content :global(h5),
        .markdown-content :global(h6) {
          font-size: 1rem;
          font-weight: 600;
          margin: 10px 0 6px 0;
          color: var(--text-primary);
        }

        .markdown-content :global(p) {
          margin: 0 0 12px 0;
        }

        .markdown-content :global(p:last-child) {
          margin-bottom: 0;
        }

        .markdown-content :global(strong) {
          font-weight: 600;
          color: var(--text-primary);
        }

        .markdown-content :global(em) {
          font-style: italic;
        }

        .markdown-content :global(ul),
        .markdown-content :global(ol) {
          margin: 4px 0 8px 0;
          padding-left: 24px;
          list-style: disc !important;
        }

        .markdown-content :global(li) {
          font-size: inherit;
          margin: 2px 0;
        }

        .markdown-content :global(ul li) {
          display: list-item;
          list-style-type: disc !important;
        }

        .markdown-content :global(ol li) {
          list-style-type: decimal;
        }

        .markdown-content :global(code) {
          background: rgba(0, 0, 0, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.85em;
        }

        .message.user .markdown-content :global(code) {
          background: rgba(255, 255, 255, 0.2);
        }

        .markdown-content :global(pre) {
          background: rgba(0, 0, 0, 0.06);
          padding: 12px 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
        }

        .message.user .markdown-content :global(pre) {
          background: rgba(255, 255, 255, 0.15);
        }

        .markdown-content :global(pre code) {
          background: transparent;
          padding: 0;
        }

        .markdown-content :global(blockquote) {
          border-left: 3px solid var(--agent-color, #4F46E5);
          margin: 12px 0;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 0 8px 8px 0;
        }

        .message.user .markdown-content :global(blockquote) {
          border-left-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
        }

        .markdown-content :global(hr) {
          border: none;
          border-top: 1px solid var(--border);
          margin: 16px 0;
        }

        .markdown-content :global(a) {
          color: var(--agent-color, #4F46E5);
          text-decoration: underline;
        }

        .message.user .markdown-content :global(a) {
          color: white;
        }

        .markdown-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 0.9em;
        }

        .markdown-content :global(th),
        .markdown-content :global(td) {
          border: 1px solid var(--border);
          padding: 8px 12px;
          text-align: left;
        }

        .markdown-content :global(th) {
          background: rgba(0, 0, 0, 0.04);
          font-weight: 600;
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
          max-width: 1080px;
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
n          font-size: inherit;
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
          max-width: 1080px;
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
