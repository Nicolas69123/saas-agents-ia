'use client'

import { useState, useMemo } from 'react'
import { useChat } from '@/hooks/useChat'
import { agents } from '@/data/agents'
import ChatSidebar from './ChatSidebar'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatSuggestions from './ChatSuggestions'

interface ChatModalProps {
  agentId: string
  agentName: string
  agentIcon: string
  onClose: () => void
}

export default function ChatModal({
  agentId,
  agentName,
  agentIcon,
  onClose,
}: ChatModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Trouver les données de l'agent
  const agentData = useMemo(() => {
    return agents.find(a => a.id === agentId)
  }, [agentId])

  const chat = useChat(agentId, agentName, agentData?.welcomeMessage)

  const handleSuggestionClick = (suggestion: string) => {
    chat.sendMessage(suggestion)
  }

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <span className="agent-icon">{agentIcon}</span>
            <div className="agent-info">
              <h2>{agentName}</h2>
              <p>Toujours prêt à vous aider</p>
            </div>
          </div>
          <div className="chat-header-right">
            <button className="chat-action-btn" title="Paramètres">
              ⚙️
            </button>
            <button className="chat-action-btn" title="Fermer" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="chat-container">
          {/* Sidebar avec historique */}
          {sidebarOpen && (
            <ChatSidebar
              conversations={chat.conversations}
              currentConversationId={chat.currentConversationId}
              onSelectConversation={chat.selectConversation}
              onDeleteConversation={chat.deleteConversation}
              onNewChat={chat.createNewConversation}
            />
          )}

          {/* Zone de chat */}
          <div className="chat-main">
            {!chat.currentConversation ? (
              <ChatSuggestions
                agentName={agentName}
                suggestions={agentData?.suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <>
                <ChatMessages
                  messages={chat.currentConversation.messages}
                  agentName={agentName}
                  agentIcon={agentIcon}
                  isLoading={chat.isLoading}
                />
              </>
            )}

            {/* Input */}
            <ChatInput
              value={chat.inputValue}
              onChange={(e) => chat.setInputValue(e.target.value)}
              onSend={() => chat.sendMessage(chat.inputValue)}
              isLoading={chat.isLoading}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .chat-modal {
          width: 100%;
          max-width: 900px;
          height: 90vh;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.9);
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle {
          color: rgba(255, 255, 255, 0.8);
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
          color: #ffffff;
        }

        .sidebar-toggle:active {
          transform: scale(0.95);
        }

        .agent-icon {
          font-size: 2rem;
        }

        .agent-info h2 {
          margin: 0;
          font-size: 1rem;
          color: #ffffff;
        }

        .agent-info p {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .chat-header-right {
          display: flex;
          gap: 8px;
        }

        .chat-action-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .chat-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1) rotate(5deg);
          color: #ffffff;
        }

        .chat-action-btn:active {
          transform: scale(0.95);
        }

        .chat-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chat-modal {
            max-width: 100%;
            height: 100vh;
            border-radius: 0;
          }

          .sidebar-toggle {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
