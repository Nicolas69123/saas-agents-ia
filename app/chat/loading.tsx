'use client'

export default function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner" />
        <p>Chargement...</p>
      </div>
      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary, #0a0a0a);
          color: var(--text-primary, #ffffff);
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-content p {
          font-size: 1rem;
          opacity: 0.7;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
