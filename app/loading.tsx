'use client'

export default function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">OmnIA</div>
        <div className="loading-spinner" />
      </div>
      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: #ffffff;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .loading-logo {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
