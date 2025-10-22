'use client'

import DashboardSidebar from '@/components/Dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-main">
        {children}
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          min-height: 100vh;
        }

        .dashboard-main {
          background: #f9f9f9;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-main {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  )
}
