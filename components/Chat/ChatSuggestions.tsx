'use client'

import { AgentSuggestion } from '@/data/agents'

interface ChatSuggestionsProps {
  agentName: string
  suggestions?: AgentSuggestion[]
  onSuggestionClick: (suggestion: string) => void
}

export default function ChatSuggestions({
  agentName,
  suggestions = [
    {
      icon: '⚡',
      title: 'Démarrer maintenant',
      description: 'Initialiser une tâche automatisée',
    },
    {
      icon: '📊',
      title: 'Voir les stats',
      description: 'Afficher les performances',
    },
    {
      icon: '🔧',
      title: 'Configurer',
      description: 'Ajuster les paramètres',
    },
    {
      icon: '💡',
      title: 'Obtenir une idée',
      description: 'Suggérer une utilisation',
    },
  ],
  onSuggestionClick,
}: ChatSuggestionsProps) {

  return (
    <div className="chat-suggestions">
      <div className="suggestions-content">
        <h2>Bienvenue avec {agentName}</h2>
        <p>Comment puis-je vous aider aujourd'hui?</p>

        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() =>
                onSuggestionClick(`${suggestion.title}: ${suggestion.description}`)
              }
            >
              <span className="suggestion-icon">{suggestion.icon}</span>
              <div className="suggestion-text">
                <h3>{suggestion.title}</h3>
                <p>{suggestion.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="suggestions-footer">
          <p>
            Je suis prêt à automatiser vos processus métier. Commencez simplement
            en cliquant sur une suggestion ou en tapant votre demande.
          </p>
        </div>
      </div>

      <style jsx>{`
        .chat-suggestions {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          overflow-y: auto;
        }

        .suggestions-content {
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .suggestions-content h2 {
          font-size: 2rem;
          margin: 0 0 12px 0;
        }

        .suggestions-content > p {
          font-size: 1.1rem;
          opacity: 0.7;
          margin: 0 0 40px 0;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .suggestion-card {
          padding: 24px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .suggestion-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.03);
          transition: left 0.3s ease;
        }

        .suggestion-card:hover {
          border-color: #000;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          transform: translateY(-6px) scale(1.02);
        }

        .suggestion-card:hover:before {
          left: 100%;
        }

        .suggestion-card:active {
          transform: translateY(-2px) scale(0.98);
        }

        .suggestion-icon {
          font-size: 1.8rem;
        }

        .suggestion-text h3 {
          margin: 0 0 4px 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .suggestion-text p {
          margin: 0;
          font-size: 0.85rem;
          opacity: 0.6;
        }

        .suggestions-footer {
          padding: 24px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 24px;
        }

        .suggestions-footer p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.7;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .chat-suggestions {
            padding: 20px;
          }

          .suggestions-content h2 {
            font-size: 1.5rem;
          }

          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
