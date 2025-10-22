'use client'

import DashboardHeader from '@/components/Dashboard/Header'

export default function AnalyticsPage() {
  return (
    <div className="dashboard-content">
      <DashboardHeader pageTitle="Analyses" />

      <div className="container-dashboard">
        <div className="analytics-filters">
          <select className="filter-select">
            <option>Derniers 7 jours</option>
            <option>Dernier mois</option>
            <option>Derniers 3 mois</option>
          </select>
          <button className="btn btn-primary">Exporter</button>
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <h3>Exécutions par agent</h3>
            <div className="chart-placeholder">
              <div className="bar-chart">
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '65%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
                <div className="bar" style={{ height: '50%' }}></div>
              </div>
              <div className="chart-legend">
                <span>Compta</span>
                <span>RH</span>
                <span>Email</span>
                <span>Social</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Taux de succès</h3>
            <div className="success-rate">
              <div className="circle-chart">98%</div>
              <p>Taux de réussite moyen</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Temps moyen d'exécution</h3>
            <div className="execution-time">
              <div className="time-item">
                <span className="time-value">2.3s</span>
                <span className="time-label">Agent Compta</span>
              </div>
              <div className="time-item">
                <span className="time-value">1.8s</span>
                <span className="time-label">Agent RH</span>
              </div>
              <div className="time-item">
                <span className="time-value">3.5s</span>
                <span className="time-label">Agent Email</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Coûts économisés</h3>
            <div className="savings">
              <div className="savings-amount">12,540€</div>
              <div className="savings-comparison">
                <span>+28% vs mois dernier</span>
              </div>
              <div className="savings-breakdown">
                <div className="breakdown-item">
                  <span>Heures économisées</span>
                  <span>156h</span>
                </div>
                <div className="breakdown-item">
                  <span>Erreurs évitées</span>
                  <span>23</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detailed-section">
          <h2>Détails des exécutions</h2>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Agent</th>
                <th>Exécutions</th>
                <th>Réussies</th>
                <th>Échouées</th>
                <th>Temps moyen</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Aujourd\'hui', agent: 'Agent Compta', exec: 45, success: 44, failed: 1, time: '2.3s' },
                { date: 'Hier', agent: 'Agent RH', exec: 32, success: 31, failed: 1, time: '1.8s' },
                { date: 'Il y a 2 j', agent: 'Agent Email', exec: 58, success: 57, failed: 1, time: '3.5s' },
                { date: 'Il y a 3 j', agent: 'Agent Social', exec: 26, success: 26, failed: 0, time: '1.5s' },
              ].map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.agent}</td>
                  <td>{row.exec}</td>
                  <td><span className="status-success">✓ {row.success}</span></td>
                  <td><span className="status-error">✗ {row.failed}</span></td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content {
          padding: 30px;
        }

        .container-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .analytics-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
        }

        .filter-select {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .chart-card {
          background: #fff;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .chart-card h3 {
          margin-bottom: 20px;
          font-size: 1rem;
        }

        .chart-placeholder {
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 12px;
          height: 150px;
          padding: 20px 0;
        }

        .bar {
          flex: 1;
          background: #000;
          border-radius: 4px;
          opacity: 0.8;
        }

        .chart-legend {
          display: flex;
          justify-content: space-around;
          font-size: 0.85rem;
          gap: 12px;
        }

        .success-rate {
          text-align: center;
          padding: 20px;
        }

        .circle-chart {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 auto 16px;
        }

        .execution-time {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .time-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .time-value {
          font-weight: 700;
          font-size: 1.2rem;
        }

        .time-label {
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .savings {
          text-align: center;
        }

        .savings-amount {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 16px 0;
          color: #059669;
        }

        .savings-comparison {
          font-size: 0.9rem;
          opacity: 0.6;
          margin-bottom: 20px;
        }

        .savings-breakdown {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9rem;
        }

        .breakdown-item span:first-child {
          opacity: 0.6;
        }

        .breakdown-item span:last-child {
          font-weight: 700;
        }

        .detailed-section {
          background: #fff;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .detailed-section h2 {
          margin-bottom: 20px;
        }

        .analytics-table {
          width: 100%;
          border-collapse: collapse;
        }

        .analytics-table th {
          background: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .analytics-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .analytics-table tbody tr:hover {
          background: #fafafa;
        }

        .status-success {
          color: #059669;
          font-weight: 600;
        }

        .status-error {
          color: #dc2626;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .analytics-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
