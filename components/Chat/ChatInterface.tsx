'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { agents, Agent } from '@/data/agents'
import Header from '@/components/Header'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  agentId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatInterfaceProps {
  agent: Agent
}

export default function ChatInterface({ agent }: ChatInterfaceProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les conversations depuis localStorage au montage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat_conversations')
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations)
      // Convertir les dates en objets Date
      const converted = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setConversations(converted)

      // Charger la dernière conversation de cet agent
      const agentConversations = converted.filter((c: Conversation) => c.agentId === agent.id)
      if (agentConversations.length > 0) {
        setCurrentConversationId(agentConversations[0].id)
      }
    }
  }, [agent.id])

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, currentConversationId])

  // Créer une nouvelle conversation
  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      agentId: agent.id,
      title: 'Nouvelle conversation',
      messages: [{
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: agent.welcomeMessage || `Bonjour ! Je suis ${agent.name}, ${agent.description}. Comment puis-je vous aider ?`,
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(newConv.id)
  }

  // Obtenir la conversation actuelle
  const getCurrentConversation = (): Conversation | null => {
    if (!currentConversationId) return null
    return conversations.find(c => c.id === currentConversationId) || null
  }

  // Envoyer un message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    let conversation = getCurrentConversation()

    // Créer une conversation si elle n'existe pas
    if (!conversation) {
      createNewConversation()
      conversation = conversations[0]
    }

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        // Mettre à jour le titre avec le premier message
        const newTitle = conv.messages.length === 1 ? inputMessage.slice(0, 50) : conv.title
        return {
          ...conv,
          title: newTitle,
          messages: [...conv.messages, userMessage],
          updatedAt: new Date()
        }
      }
      return conv
    }))

    setInputMessage('')
    setIsTyping(true)

    // Simuler la réponse de l'agent (à remplacer par l'API réelle)
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg_${Date.now()}_agent`,
        role: 'agent',
        content: `Je suis ${agent.name} et je traite votre demande concernant : "${inputMessage}". Dans une version complète, cette réponse viendrait de l'API Claude ou des workflows n8n.`,
        timestamp: new Date()
      }

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, agentMessage],
            updatedAt: new Date()
          }
        }
        return conv
      }))

      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  // Changer d'agent
  const switchAgent = (newAgentId: string) => {
    router.push(`/chat/${newAgentId}`)
  }

  // Supprimer une conversation
  const deleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (currentConversationId === convId) {
      const remaining = conversations.filter(c => c.id !== convId && c.agentId === agent.id)
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const currentConversation = getCurrentConversation()
  const currentMessages = currentConversation?.messages || []
  const agentConversations = conversations.filter(c => c.agentId === agent.id)

  return (
    <>
      <Header />

      <div className="chat-interface">
        {/* Sidebar gauche - Historique */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Historique</h2>
            <button className="btn-new-chat" onClick={createNewConversation}>
              + Nouveau
            </button>
          </div>

          <div className="conversations-list">
            {agentConversations.length === 0 ? (
              <div className="no-conversations">
                <p>Aucune conversation</p>
                <button onClick={createNewConversation}>Démarrer</button>
              </div>
            ) : (
              agentConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                  onClick={() => setCurrentConversationId(conv.id)}
                >
                  <div className="conversation-info">
                    <h4>{conv.title}</h4>
                    <p>{conv.messages.length} messages</p>
                    <span className="conversation-date">
                      {new Date(conv.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <button
                    className="btn-delete-conv"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Zone principale - Chat */}
        <main className="chat-main">
          {/* Sélecteur d'agents en haut */}
          <div className="agent-selector">
            <div className="current-agent">
              <img src={agent.avatar} alt={agent.name} className="agent-avatar-small" />
              <div className="agent-info-compact">
                <h3>{agent.icon} {agent.name}</h3>
                <p>{agent.domain}</p>
              </div>
            </div>

            <div className="agents-dropdown">
              <span>Changer d'agent:</span>
              <div className="agents-grid-selector">
                {agents.map(a => (
                  <button
                    key={a.id}
                    className={`agent-option ${a.id === agent.id ? 'active' : ''}`}
                    onClick={() => switchAgent(a.id)}
                    title={a.name}
                  >
                    <span className="agent-icon-large">{a.icon}</span>
                    <span className="agent-name-small">{a.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {currentMessages.length === 0 ? (
              <div className="empty-chat">
                <div className="agent-avatar-large">
                  <img src={agent.avatar} alt={agent.name} />
                </div>
                <h2>{agent.icon} {agent.name}</h2>
                <p>{agent.description}</p>
                <button className="btn-start-chat" onClick={createNewConversation}>
                  Démarrer la conversation
                </button>
              </div>
            ) : (
              <>
                {currentMessages.map(message => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-avatar">
                      {message.role === 'agent' ? (
                        <img src={agent.avatar} alt={agent.name} />
                      ) : (
                        <div className="user-avatar">👤</div>
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <strong>{message.role === 'agent' ? agent.name : 'Vous'}</strong>
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message agent typing">
                    <div className="message-avatar">
                      <img src={agent.avatar} alt={agent.name} />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input de message */}
          <div className="message-input-container">
            <textarea
              className="message-input"
              placeholder={`Message à ${agent.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              rows={1}
            />
            <button
              className="btn-send"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </main>
      </div>

      <style jsx>{`
        .chat-interface {
          display: grid;
          grid-template-columns: 300px 1fr;
          height: calc(100vh - 80px);
          margin-top: 80px;
        }

        /* SIDEBAR */
        .chat-sidebar {
          background: #f8f9fa;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          font-size: 1.2rem;
          margin: 0;
          color: #333;
        }

        .btn-new-chat {
          background: #667eea;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-new-chat:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }

        .no-conversations {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .no-conversations button {
          margin-top: 15px;
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .conversation-item {
          background: white;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 10px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          position: relative;
        }

        .conversation-item:hover {
          border-color: #667eea;
          transform: translateX(5px);
        }

        .conversation-item.active {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .conversation-info h4 {
          font-size: 0.95rem;
          margin: 0 0 5px 0;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-info p {
          font-size: 0.85rem;
          color: #666;
          margin: 3px 0;
        }

        .conversation-date {
          font-size: 0.75rem;
          color: #999;
        }

        .btn-delete-conv {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4757;
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .conversation-item:hover .btn-delete-conv {
          opacity: 1;
        }

        /* MAIN CHAT AREA */
        .chat-main {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
        }

        /* AGENT SELECTOR */
        .agent-selector {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-agent {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .agent-avatar-small {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          object-fit: cover;
        }

        .agent-info-compact h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .agent-info-compact p {
          margin: 3px 0 0 0;
          font-size: 0.85rem;
          color: #666;
        }

        .agents-dropdown {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .agents-dropdown > span {
          font-size: 0.9rem;
          color: #666;
        }

        .agents-grid-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .agent-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .agent-option:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .agent-option.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .agent-icon-large {
          font-size: 1.5rem;
        }

        .agent-name-small {
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* MESSAGES */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #666;
        }

        .agent-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .agent-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-chat h2 {
          font-size: 1.8rem;
          margin: 10px 0;
          color: #333;
        }

        .empty-chat p {
          font-size: 1rem;
          margin-bottom: 30px;
        }

        .btn-start-chat {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-start-chat:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .message {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .message-content {
          flex: 1;
          max-width: 70%;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .message-header strong {
          font-size: 0.9rem;
          color: #333;
        }

        .message-time {
          font-size: 0.75rem;
          color: #999;
        }

        .message-content p {
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 12px;
          margin: 0;
          line-height: 1.6;
          color: #333;
        }

        .message.user .message-content p {
          background: #667eea;
          color: white;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: #f8f9fa;
          border-radius: 12px;
          width: fit-content;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #999;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* MESSAGE INPUT */
        .message-input-container {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
          background: white;
          display: flex;
          gap: 10px;
        }

        .message-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          max-height: 120px;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .btn-send {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #667eea;
          color: white;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .btn-send:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .chat-interface {
            grid-template-columns: 1fr;
          }

          .chat-sidebar {
            display: none;
          }

          .agent-selector {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .agents-grid-selector {
            width: 100%;
            justify-content: flex-start;
          }

          .message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </>
  )
}
