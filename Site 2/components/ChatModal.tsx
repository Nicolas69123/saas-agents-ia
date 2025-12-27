'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  richContent?: RichContent
}

interface RichContent {
  type_contenu: 'image' | 'video' | 'texte' | 'conversation'
  prompt_ameliore?: string
  description?: string
  hashtags?: string[] | string
  keywords?: string[]
  response?: string
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const agents = [
  { id: 1, name: 'Lucas', role: 'Comptable', emoji: '📊', agentId: 'comptable' },
  { id: 2, name: 'Marc', role: 'Trésorier', emoji: '💰', agentId: 'tresorier' },
  { id: 3, name: 'Julie', role: 'Investissements', emoji: '📈', agentId: 'investissements' },
  { id: 4, name: 'Thomas', role: 'Réseaux Sociaux', emoji: '📱', agentId: 'reseaux-sociaux' },
  { id: 5, name: 'Sophie', role: 'Email Marketing', emoji: '✉️', agentId: 'email-marketing' },
  { id: 6, name: 'Claire', role: 'RH', emoji: '👥', agentId: 'ressources-humaines' },
  { id: 7, name: 'Emma', role: 'Support Client', emoji: '🎧', agentId: 'support-client' },
  { id: 8, name: 'Léa', role: 'Téléphonique', emoji: '☎️', agentId: 'telephonique' },
]

const suggestions = [
  'Générer une facture',
  'Créer un post LinkedIn',
  'Analyser mes dépenses',
  'Répondre à un client',
]

// Parse le JSON depuis la réponse de l'AI Agent (peut être wrappé dans ```json...```)
function parseAIResponse(response: string): { text: string; richContent?: RichContent } {
  if (!response) return { text: '' }

  // Essayer d'extraire le JSON depuis le markdown
  let jsonStr = response
  const jsonMatch = response.match(/```json\n?([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  } else if (response.includes('```')) {
    const match = response.match(/```\n?([\s\S]*?)```/)
    if (match) jsonStr = match[1]
  }

  try {
    const parsed = JSON.parse(jsonStr.trim()) as RichContent
    if (parsed.type_contenu) {
      return {
        text: parsed.description || parsed.response || response,
        richContent: parsed
      }
    }
  } catch {
    // Pas de JSON valide, retourner le texte brut
  }

  // Essayer de parser si c'est directement du JSON (via output)
  try {
    const data = JSON.parse(response)
    if (data.output) {
      // L'output peut être un string ou un objet
      if (typeof data.output === 'string') {
        return parseAIResponse(data.output)
      } else if (data.output.type_contenu) {
        return {
          text: data.output.description || data.output.response || response,
          richContent: data.output
        }
      }
    }
  } catch {
    // Pas de JSON
  }

  return { text: response }
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // Appeler l'API n8n via notre backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.agentId,
          message: content,
          sessionId: `session-${selectedAgent.agentId}-${Date.now()}`,
        }),
      })

      const data = await response.json()
      const rawResponse = data.response || `Je suis ${selectedAgent.name}. Je traite votre demande...`

      // Parser la réponse pour extraire le contenu riche
      const { text, richContent } = parseAIResponse(rawResponse)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        richContent,
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Erreur chat:', error)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Désolé, une erreur s'est produite. Réessayez plus tard.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '1rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          height: '70vh',
          maxHeight: 600,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s ease',
          marginBottom: '4rem',
          marginRight: '1rem',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid var(--accent)',
            }}>
              <Image
                src={`/avatars/agent-${selectedAgent.id}.png`}
                alt={selectedAgent.name}
                width={44}
                height={44}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <h4 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                margin: 0,
              }}>
                {selectedAgent.emoji} {selectedAgent.name}
              </h4>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-tertiary)',
                margin: 0,
              }}>
                Agent {selectedAgent.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '1.25rem',
            }}
          >
            ×
          </button>
        </div>

        {/* Agent Selector */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
        }}>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: selectedAgent.id === agent.id 
                  ? '2px solid var(--accent)' 
                  : '1px solid var(--border)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <Image
                src={`/avatars/agent-${agent.id}.png`}
                alt={agent.name}
                width={36}
                height={36}
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {selectedAgent.emoji}
              </div>
              <h4 style={{
                fontFamily: 'Sora, sans-serif',
                marginBottom: '0.5rem',
              }}>
                Bonjour ! Je suis {selectedAgent.name}
              </h4>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-tertiary)',
                marginBottom: '1.5rem',
              }}>
                Votre agent {selectedAgent.role}. Comment puis-je vous aider ?
              </p>
              
              {/* Suggestions */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
              }}>
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.color = 'var(--accent)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: message.role === 'user'
                      ? 'var(--accent)'
                      : 'var(--bg-secondary)',
                    color: message.role === 'user'
                      ? 'white'
                      : 'var(--text-primary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                  }}>
                    {/* Affichage du contenu riche si disponible */}
                    {message.richContent ? (
                      <div>
                        {/* Badge type de contenu */}
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: message.richContent.type_contenu === 'image' ? '#4CAF50' :
                                     message.richContent.type_contenu === 'video' ? '#2196F3' :
                                     message.richContent.type_contenu === 'texte' ? '#FF9800' : '#9E9E9E',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem',
                        }}>
                          {message.richContent.type_contenu === 'image' && '🖼️ '}
                          {message.richContent.type_contenu === 'video' && '🎬 '}
                          {message.richContent.type_contenu === 'texte' && '📝 '}
                          {message.richContent.type_contenu}
                        </div>

                        {/* Description */}
                        <p style={{ margin: '0.5rem 0', fontWeight: 500 }}>
                          {message.richContent.description}
                        </p>

                        {/* Placeholder image si type image */}
                        {message.richContent.type_contenu === 'image' && (
                          <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '0.5rem',
                            padding: '2rem',
                            textAlign: 'center',
                            margin: '0.75rem 0',
                            color: 'white',
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                              Image en cours de génération...
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', opacity: 0.7 }}>
                              Elle sera disponible dans votre galerie
                            </p>
                          </div>
                        )}

                        {/* Prompt amélioré */}
                        {message.richContent.prompt_ameliore && (
                          <div style={{
                            background: 'rgba(0,0,0,0.05)',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.85rem',
                            marginTop: '0.5rem',
                            fontStyle: 'italic',
                            borderLeft: '3px solid var(--accent)',
                          }}>
                            {message.richContent.prompt_ameliore}
                          </div>
                        )}

                        {/* Hashtags */}
                        {message.richContent.hashtags && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.25rem',
                            marginTop: '0.75rem',
                          }}>
                            {(Array.isArray(message.richContent.hashtags)
                              ? message.richContent.hashtags
                              : message.richContent.hashtags.split(/\s+/)
                            ).map((tag, i) => (
                              <span
                                key={i}
                                style={{
                                  background: 'var(--accent)',
                                  color: 'white',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                }}
                              >
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Affichage texte normal */
                      <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{
                  display: 'flex',
                  gap: '0.25rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  width: 'fit-content',
                }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite 0.2s' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite 0.4s' }}>•</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '0.75rem',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Écrivez votre message..."
            className="input"
            style={{ flex: 1 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent)',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              opacity: input.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
