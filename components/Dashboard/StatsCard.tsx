'use client'

interface StatsCardProps {
  label: string
  value: string
  icon: string
  change: string
}

export default function StatsCard({ label, value, icon, change }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-icon">{icon}</span>
        <span className="stats-change">{change}</span>
      </div>
      <h3 className="stats-label">{label}</h3>
      <p className="stats-value">{value}</p>

      <style jsx>{`
        .stats-card {
          background: #fff;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .stats-card:hover {
          border-color: #000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stats-icon {
          font-size: 1.8rem;
        }

        .stats-change {
          font-size: 0.8rem;
          font-weight: 600;
          opacity: 0.6;
        }

        .stats-label {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .stats-value {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}
