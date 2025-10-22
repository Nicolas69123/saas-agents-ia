'use client'

import { useRef } from 'react'

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  isLoading: boolean
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend()
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // TODO: Gérer l'upload des fichiers
      console.log('Fichiers sélectionnés:', files)
      alert(`Fichier sélectionné : ${files[0].name}\n(Upload à implémenter)`)
    }
  }

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        <textarea
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder="Écrivez votre message... (Maj+Entrée pour une nouvelle ligne)"
          className="chat-textarea"
          rows={3}
          disabled={isLoading}
        />
        <div className="chat-buttons">
          <button
            onClick={handleFileClick}
            disabled={isLoading}
            className="chat-attach-btn"
            title="Joindre un fichier"
          >
            📎
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className="chat-send-btn"
            title="Envoyer (Entrée)"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
      </div>

      <style jsx>{`
        .chat-input-wrapper {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          background: #fff;
        }

        .chat-input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .chat-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .chat-textarea {
          flex: 1;
          padding: 12px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 32px;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          max-height: 120px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .chat-textarea:focus {
          outline: none;
          border-color: #000;
          background: #fafafa;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .chat-textarea:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .chat-attach-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: #f5f5f5;
          color: #000;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .chat-attach-btn:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #000;
          transform: scale(1.05) rotate(-15deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .chat-attach-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .chat-attach-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: #000;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .chat-send-btn:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .chat-send-btn:active:not(:disabled):before {
          width: 100px;
          height: 100px;
        }

        .chat-send-btn:hover:not(:disabled) {
          background: #222;
          border-color: #000;
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .chat-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-input-wrapper {
            padding: 12px 16px;
          }

          .chat-textarea {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
