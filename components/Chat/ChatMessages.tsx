'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/hooks/useChat'

interface ChatMessagesProps {
  messages: Message[]
  agentName: string
  agentIcon: string
  isLoading: boolean
}

export default function ChatMessages({
  messages,
  agentName,
  agentIcon,
  isLoading,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message message-${message.role}`}
        >
          {message.role === 'agent' && (
            <div className="message-avatar">{agentIcon}</div>
          )}
          <div className="message-content">
            {message.role === 'agent' && (
              <span className="message-sender">{agentName}</span>
            )}
            <div className="message-text">{message.content}</div>
            <span className="message-time">
              {message.timestamp.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="message message-agent">
          <div className="message-avatar">{agentIcon}</div>
          <div className="message-content">
            <span className="message-sender">{agentName}</span>
            <div className="message-text">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      <style jsx>{`
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fff;
        }

        .message {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-avatar {
          font-size: 1.8rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 16px;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message-user .message-content {
          align-items: flex-end;
        }

        .message-sender {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.6;
          padding: 0 8px;
        }

        .message-text {
          padding: 14px 18px;
          border-radius: 28px;
          line-height: 1.5;
          word-wrap: break-word;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center;
        }

        .message-agent .message-text {
          background: #f5f5f5;
          color: #000;
          border-bottom-left-radius: 4px;
        }

        .message-user .message-text {
          background: #000;
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .message-user .message-text:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.5;
          padding: 0 8px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #999;
          border-radius: 50%;
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
            opacity: 0.5;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .chat-messages {
            padding: 16px;
          }

          .message-content {
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  )
}
