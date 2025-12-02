'use client'

import { useState } from 'react'
import { agents } from '@/data/agents'

export default function AvatarsPreviewPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])

  const avatarStyles = [
    { id: 1, name: 'Robots Bottts', url: (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}` },
    { id: 2, name: 'Cartoon Avataaars', url: (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` },
    { id: 3, name: 'Personas', url: (seed: string) => `https://api.dicebear.com/7.x/personas/svg?seed=${seed}` },
    { id: 4, name: 'Lorelei', url: (seed: string) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}` },
    { id: 5, name: 'Big Smile', url: (seed: string) => `https://api.dicebear.com/7.x/big-smile/svg?seed=${seed}` },
    { id: 6, name: 'Adventurer', url: (seed: string) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}` },
    { id: 7, name: 'Pixel Art', url: (seed: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}` },
    { id: 8, name: 'Shapes', url: (seed: string) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}` },
    { id: 9, name: 'Thumbs', url: (seed: string) => `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}` },
    { id: 10, name: 'Micah', url: (seed: string) => `https://api.dicebear.com/7.x/micah/svg?seed=${seed}` },
    { id: 11, name: 'Notionists', url: (seed: string) => `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}` },
    { id: 12, name: 'Open Peeps', url: (seed: string) => `https://api.dicebear.com/7.x/open-peeps/svg?seed=${seed}` },
    { id: 13, name: 'Big Ears', url: (seed: string) => `https://api.dicebear.com/7.x/big-ears/svg?seed=${seed}` },
    { id: 14, name: 'Fun Emoji', url: (seed: string) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}` },
    { id: 15, name: 'Icons', url: (seed: string) => `https://api.dicebear.com/7.x/icons/svg?seed=${seed}` },
    { id: 16, name: 'Beam', url: (seed: string) => `https://source.boringavatars.com/beam/120/${seed}?colors=6366f1,8b5cf6,ec4899,f59e0b,10b981` },
    { id: 17, name: 'Ring', url: (seed: string) => `https://source.boringavatars.com/ring/120/${seed}?colors=0f172a,1e293b,334155,475569,64748b` },
    { id: 18, name: 'Marble', url: (seed: string) => `https://source.boringavatars.com/marble/120/${seed}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51` },
    { id: 19, name: 'Sunset', url: (seed: string) => `https://source.boringavatars.com/sunset/120/${seed}?colors=ff6b6b,ee5a6f,c44569,973aa8,6a0572` },
    { id: 20, name: 'Bauhaus', url: (seed: string) => `https://source.boringavatars.com/bauhaus/120/${seed}?colors=1e3a8a,3b82f6,60a5fa,93c5fd,dbeafe` },
    { id: 21, name: 'Initiales Gradient', url: (seed: string) => `https://ui-avatars.com/api/?name=${seed}&size=200&background=random&color=fff&bold=true&font-size=0.35` },
    { id: 22, name: 'Initiales Simple', url: (seed: string) => `https://ui-avatars.com/api/?name=${seed}&size=200&background=6366f1&color=fff&bold=true` },
  ]

  return (
    <div className="preview-page">
      <div className="container">
        <h1>🎨 Choisis l'avatar pour chaque agent</h1>
        <p>Sélectionne un agent, puis choisis son style d'avatar</p>

        {/* Agent Selector */}
        <div className="agent-selector">
          {agents.map(agent => (
            <button
              key={agent.id}
              className={`agent-btn ${selectedAgent.id === agent.id ? 'active' : ''}`}
              onClick={() => setSelectedAgent(agent)}
            >
              {agent.icon} {agent.name}
            </button>
          ))}
        </div>

        {/* Current Agent Info */}
        <div className="current-agent-info">
          <h2>Avatars pour : {selectedAgent.name}</h2>
          <p>{selectedAgent.description}</p>
        </div>

        {/* Avatar Styles Grid */}
        <div className="styles-grid">
          {avatarStyles.map(style => (
            <div key={style.id} className="style-card">
              <div className="style-number">{style.id}</div>
              <img
                src={style.url(selectedAgent.id)}
                alt={`${selectedAgent.name} - ${style.name}`}
                className="avatar-preview"
              />
              <h3>{style.name}</h3>
            </div>
          ))}
        </div>

        <div className="instructions">
          <h3>📝 Comment utiliser ?</h3>
          <p><strong>1.</strong> Clique sur un agent en haut</p>
          <p><strong>2.</strong> Regarde les 22 styles d'avatars pour cet agent</p>
          <p><strong>3.</strong> Dis-moi : "Style 5 pour Agent Comptable" ou "Style 12 pour tous"</p>
        </div>
      </div>

      <style jsx>{`
        .preview-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 60px 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #111;
        }

        .preview-page > .container > p {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
        }

        /* Agent Selector */
        .agent-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .agent-btn {
          padding: 12px 20px;
          background: #fff;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .agent-btn:hover {
          border-color: #111;
          transform: translateY(-2px);
        }

        .agent-btn.active {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        /* Current Agent Info */
        .current-agent-info {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .current-agent-info h2 {
          margin-bottom: 12px;
          color: #111;
        }

        .current-agent-info p {
          color: #666;
          margin: 0;
        }

        /* Styles Grid */
        .styles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .style-card {
          background: #fff;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .style-card:hover {
          border-color: #111;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .style-number {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          background: #111;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          margin-bottom: 16px;
          background: #f9fafb;
        }

        .style-card h3 {
          font-size: 0.875rem;
          color: #333;
          margin: 0;
        }

        .instructions {
          background: #111;
          color: #fff;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
        }

        .instructions h3 {
          margin-bottom: 20px;
          color: #fff;
        }

        .instructions p {
          margin-bottom: 12px;
          color: #ccc;
          font-size: 1rem;
        }

        .instructions strong {
          color: #fff;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.75rem;
          }

          .agent-selector {
            flex-direction: column;
          }

          .agent-btn {
            width: 100%;
          }

          .styles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
