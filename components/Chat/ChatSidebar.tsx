'use client'

import { Conversation } from '@/hooks/useChat'

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onNewChat: () => void
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          ➕ Nouveau chat
        </button>
      </div>

      <div className="sidebar-content">
        <h3>Historique</h3>
        {conversations.length === 0 ? (
          <p className="empty-state">Aucune conversation</p>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  conv.id === currentConversationId ? 'active' : ''
                }`}
              >
                <button
                  className="conversation-button"
                  onClick={() => onSelectConversation(conv.id)}
                  title={conv.title}
                >
                  <span className="conversation-icon">💬</span>
                  <span className="conversation-text">{conv.title}</span>
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDeleteConversation(conv.id)}
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-sidebar {
          width: 280px;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          background: #f9f9f9;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .new-chat-btn {
          width: 100%;
          padding: 12px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }

        .new-chat-btn:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .new-chat-btn:hover {
          background: #222;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .new-chat-btn:active:before {
          width: 80px;
          height: 80px;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .sidebar-content h3 {
          margin: 0 0 16px 0;
          font-size: 0.85rem;
          opacity: 0.6;
          font-weight: 600;
          text-transform: uppercase;
        }

        .empty-state {
          text-align: center;
          opacity: 0.5;
          font-size: 0.9rem;
          padding: 20px 0;
        }

        .conversations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .conversation-item.active {
          background: #e5e7eb;
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .conversation-button {
          flex: 1;
          padding: 10px 12px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-size: 0.9rem;
          color: inherit;
        }

        .conversation-item:hover .conversation-button {
          background: rgba(0, 0, 0, 0.08);
          transform: translateX(4px);
        }

        .conversation-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .conversation-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .delete-btn {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .conversation-item:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            width: 0;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: width 0.3s;
          }

          .chat-sidebar.open {
            width: 280px;
          }
        }
      `}</style>
    </aside>
  )
}
