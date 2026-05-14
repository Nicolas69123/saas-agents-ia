'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'

type Tab = 'overview' | 'hierarchy' | 'clients' | 'documents'

interface Employee {
  id: string
  name: string
  role: string
  email: string
  managerId: string | null
  avatar: string
  department: string
}

interface Client {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  status: 'Actif' | 'Prospect' | 'Inactif'
  ca: number
  encours: number
  industry: string
  sinceYear: number
}

interface CompanyDoc {
  id: string
  name: string
  type: 'pdf' | 'xlsx' | 'docx'
  size: string
  category: 'Comptabilite' | 'Juridique' | 'Commercial' | 'RH'
  url: string
  uploadedBy: string
  uploadedAt: string
}

const COMPANY = {
  name: 'OmnIA SAS',
  siret: '902 451 783 00012',
  address: '42 rue de la Tech, 75011 Paris',
  capital: 50000,
}

const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Nicolas Chalopin',  role: 'CEO & Fondateur',       email: 'nicolas@omnia.eu',  managerId: null, avatar: 'NC', department: 'Direction' },
  { id: 'e2', name: 'Marc Dubreuil',     role: 'CTO',                   email: 'marc@omnia.eu',     managerId: 'e1', avatar: 'MD', department: 'Tech' },
  { id: 'e3', name: 'Sophie Vandenberg', role: 'COO',                   email: 'sophie@omnia.eu',   managerId: 'e1', avatar: 'SV', department: 'Operations' },
  { id: 'e4', name: 'Claire Bertin',     role: 'Head of HR',            email: 'claire@omnia.eu',   managerId: 'e3', avatar: 'CB', department: 'RH' },
  { id: 'e5', name: 'Thomas Legrand',    role: 'Head of Sales',         email: 'thomas@omnia.eu',   managerId: 'e3', avatar: 'TL', department: 'Commercial' },
  { id: 'e6', name: 'Julie Moreau',      role: 'Lead Product Designer', email: 'julie@omnia.eu',    managerId: 'e2', avatar: 'JM', department: 'Tech' },
  { id: 'e7', name: 'Karim Ouazri',      role: 'Lead Backend Engineer', email: 'karim@omnia.eu',    managerId: 'e2', avatar: 'KO', department: 'Tech' },
  { id: 'e8', name: 'Lea Charpentier',   role: 'Office Manager',        email: 'lea@omnia.eu',      managerId: 'e3', avatar: 'LC', department: 'Operations' },
  { id: 'e9', name: 'Emma Robert',       role: 'Customer Success',      email: 'emma@omnia.eu',     managerId: 'e5', avatar: 'ER', department: 'Commercial' },
  { id: 'e10', name: 'Antoine Marchand', role: 'Senior Frontend',       email: 'antoine@omnia.eu',  managerId: 'e2', avatar: 'AM', department: 'Tech' },
]

const CLIENTS: Client[] = [
  { id: 'c1', name: 'Fiducial Conseil',        contact: 'Helene Royer',         email: 'h.royer@fiducial.fr',         phone: '01 44 21 78 92', status: 'Actif',    ca: 14760, encours: 819,  industry: 'Conseil & Audit', sinceYear: 2024 },
  { id: 'c2', name: 'Numa Studio',             contact: 'Mathieu Ferrand',      email: 'mathieu@numa.studio',         phone: '01 56 12 04 33', status: 'Actif',    ca: 9840,  encours: 0,    industry: 'Design',          sinceYear: 2025 },
  { id: 'c3', name: 'LBM Bichat-Nord',         contact: 'Dr. Antoine Marchal',  email: 'a.marchal@lbm-bichat.fr',     phone: '01 53 04 18 77', status: 'Actif',    ca: 18900, encours: 2450, industry: 'Sante',           sinceYear: 2024 },
  { id: 'c4', name: 'Atelier Verlaine',        contact: 'Sophie Verlaine',      email: 'sophie@atelier-v.fr',          phone: '06 78 45 19 02', status: 'Actif',    ca: 4200,  encours: 350,  industry: 'Artisanat',       sinceYear: 2025 },
  { id: 'c5', name: 'Cabinet Dore & Associes', contact: 'Maitre Pierre Dore',   email: 'pdore@dore-avocats.fr',        phone: '01 42 60 14 22', status: 'Actif',    ca: 7560,  encours: 630,  industry: 'Juridique',       sinceYear: 2025 },
  { id: 'c6', name: 'TechConsult SARL',        contact: 'Marie Dubois',         email: 'marie@techconsult.fr',         phone: '01 70 39 12 88', status: 'Actif',    ca: 12300, encours: 1980, industry: 'IT',              sinceYear: 2024 },
  { id: 'c7', name: 'Studio Mongin',           contact: 'Camille Mongin',       email: 'contact@studio-mongin.com',    phone: '06 14 78 09 22', status: 'Prospect', ca: 0,     encours: 0,    industry: 'Photo',           sinceYear: 2026 },
  { id: 'c8', name: 'Patisserie Lenoir',       contact: 'Elise Lenoir',         email: 'elise@patisserie-lenoir.fr',   phone: '01 47 02 33 18', status: 'Inactif',  ca: 1280,  encours: 0,    industry: 'Restauration',    sinceYear: 2024 },
  { id: 'c9', name: 'Garage Auto-Plus',        contact: 'Frederic Bayard',      email: 'f.bayard@autoplus.fr',         phone: '01 60 22 88 47', status: 'Actif',    ca: 3960,  encours: 0,    industry: 'Automobile',      sinceYear: 2025 },
]

const DOCS: CompanyDoc[] = [
  { id: 'd1', name: 'Facture Fiducial - Mai 2026',  type: 'pdf',  size: '2,5 Ko', category: 'Comptabilite', url: '/mock/documents/facture-fiducial-mai-2026.pdf',   uploadedBy: 'Lucas (Agent)',   uploadedAt: '12 mai 2026' },
  { id: 'd2', name: 'Contrat de prestation Fiducial', type: 'pdf', size: '3,0 Ko', category: 'Juridique',   url: '/mock/documents/contrat-fiducial-2026.pdf',       uploadedBy: 'Nicolas Chalopin', uploadedAt: '03 avr. 2026' },
  { id: 'd3', name: 'Statuts OmnIA SAS',            type: 'pdf',  size: '2,8 Ko', category: 'Juridique',    url: '/mock/documents/statuts-omnia.pdf',               uploadedBy: 'Nicolas Chalopin', uploadedAt: '15 jan. 2026' },
  { id: 'd4', name: 'Bilan Avril 2026',             type: 'xlsx', size: '8,6 Ko', category: 'Comptabilite', url: '/mock/documents/bilan-avril-2026.xlsx',           uploadedBy: 'Lucas (Agent)',   uploadedAt: '02 mai 2026' },
  { id: 'd5', name: 'Liste clients - Q2 2026',      type: 'xlsx', size: '7,4 Ko', category: 'Commercial',   url: '/mock/documents/liste-clients-omnia.xlsx',        uploadedBy: 'Thomas Legrand',   uploadedAt: '10 mai 2026' },
  { id: 'd6', name: 'Procedure Onboarding RH',      type: 'docx', size: '9,4 Ko', category: 'RH',           url: '/mock/documents/procedure-onboarding-omnia.docx', uploadedBy: 'Claire Bertin',   uploadedAt: '08 avr. 2026' },
]

const REVENUE_MONTHS = [
  { m: 'Nov', v: 62100 },
  { m: 'Dec', v: 68400 },
  { m: 'Jan', v: 71200 },
  { m: 'Fev', v: 74900 },
  { m: 'Mar', v: 83200 },
  { m: 'Avr', v: 93600 },
]

const KPIS = [
  { label: "Chiffre d'affaires (Avr)", value: '93 600 €', delta: '+12,4 %',  positive: true, icon: '💰' },
  { label: 'Marge brute',              value: '71,8 %',   delta: '+1,2 pts', positive: true, icon: '📈' },
  { label: 'Clients actifs',           value: '12',       delta: '+3',       positive: true, icon: '👥' },
  { label: 'Tresorerie nette',         value: '64 234 €', delta: '+5,8 %',   positive: true, icon: '🏦' },
  { label: 'Encours clients',          value: '6 229 €',  delta: '-12,1 %',  positive: true, icon: '⏱️' },
  { label: 'DSO moyen',                value: '27 j',     delta: '-3 j',     positive: true, icon: '📅' },
]

const DEPT_DIST = [
  { name: 'Tech',       count: 4, color: '#6366F1' },
  { name: 'Operations', count: 2, color: '#10B981' },
  { name: 'Commercial', count: 2, color: '#F59E0B' },
  { name: 'RH',         count: 1, color: '#EF4444' },
  { name: 'Direction',  count: 1, color: '#8B5CF6' },
]

export default function CompanyPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Connexion requise</h1>
          <p>Connecte-toi pour acceder a l&apos;espace entreprise.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="company-main">
        <header className="company-head">
          <div className="company-logo">{COMPANY.name.charAt(0)}</div>
          <div className="company-meta">
            <h1>{COMPANY.name}</h1>
            <div className="company-sub">
              <span>SIRET {COMPANY.siret}</span>
              <span>·</span>
              <span>{COMPANY.address}</span>
              <span>·</span>
              <span>Capital {COMPANY.capital.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </header>

        <nav className="tabs">
          <button className={tab === 'overview' ? 'tab active' : 'tab'} onClick={() => setTab('overview')}>📊 Vue d&apos;ensemble</button>
          <button className={tab === 'hierarchy' ? 'tab active' : 'tab'} onClick={() => setTab('hierarchy')}>🏢 Hierarchie</button>
          <button className={tab === 'clients' ? 'tab active' : 'tab'} onClick={() => setTab('clients')}>👥 Clients</button>
          <button className={tab === 'documents' ? 'tab active' : 'tab'} onClick={() => setTab('documents')}>📁 Documents</button>
        </nav>

        <section className="tab-content">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'hierarchy' && <HierarchyTab />}
          {tab === 'clients' && <ClientsTab />}
          {tab === 'documents' && <DocumentsTab />}
        </section>
      </main>

      <style jsx>{`
        .company-main { max-width: 1280px; margin: 0 auto; padding: 110px 24px 64px; }
        .company-head { display: flex; gap: 20px; align-items: center; margin-bottom: 32px; }
        .company-logo {
          width: 72px; height: 72px; border-radius: 20px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff; font-size: 2rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .company-meta h1 { font-size: 1.85rem; margin: 0 0 6px; }
        .company-sub { color: #6b7280; font-size: 0.9rem; display: flex; gap: 8px; flex-wrap: wrap; }
        .tabs { display: flex; gap: 8px; border-bottom: 1px solid #e5e7eb; margin-bottom: 28px; overflow-x: auto; }
        .tab {
          padding: 12px 18px; border: none; background: none; font-size: 0.95rem;
          color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent;
          font-weight: 500; transition: all 0.2s; white-space: nowrap;
        }
        .tab:hover { color: #4F46E5; }
        .tab.active { color: #4F46E5; border-bottom-color: #4F46E5; }
      `}</style>
    </>
  )
}

function OverviewTab() {
  const maxRev = Math.max(...REVENUE_MONTHS.map((r) => r.v))
  const totalEmployees = EMPLOYEES.length
  const activeClients = CLIENTS.filter((c) => c.status === 'Actif').length

  return (
    <div className="grid">
      <div className="kpis">
        {KPIS.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-content">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className={`kpi-delta ${k.positive ? 'up' : 'down'}`}>{k.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-head">
          <h3>Chiffre d&apos;affaires - 6 derniers mois</h3>
          <span className="chart-total">{REVENUE_MONTHS.reduce((s, r) => s + r.v, 0).toLocaleString('fr-FR')} € cumule</span>
        </div>
        <div className="bars">
          {REVENUE_MONTHS.map((r) => (
            <div className="bar-wrap" key={r.m}>
              <div className="bar" style={{ height: `${(r.v / maxRev) * 100}%` }}>
                <span className="bar-value">{(r.v / 1000).toFixed(0)}k€</span>
              </div>
              <span className="bar-label">{r.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="side-card">
        <h3>Repartition equipe</h3>
        <p className="muted">{totalEmployees} collaborateurs</p>
        <div className="dept-list">
          {DEPT_DIST.map((d) => (
            <div className="dept-row" key={d.name}>
              <div className="dept-info">
                <span className="dept-dot" style={{ background: d.color }} />
                <span>{d.name}</span>
              </div>
              <span className="dept-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="side-card">
        <h3>Top clients (CA 2026)</h3>
        <p className="muted">{activeClients} clients actifs</p>
        <div className="top-clients">
          {[...CLIENTS].sort((a, b) => b.ca - a.ca).slice(0, 5).map((c, i) => (
            <div className="top-row" key={c.id}>
              <span className="rank">{i + 1}</span>
              <div className="top-info">
                <div className="top-name">{c.name}</div>
                <div className="top-sub">{c.industry}</div>
              </div>
              <span className="top-ca">{c.ca.toLocaleString('fr-FR')} €</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; }
        .kpis { grid-column: span 12; display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
        @media (max-width: 1100px) { .kpis { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .kpis { grid-template-columns: repeat(2, 1fr); } }
        .kpi-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; display: flex; gap: 12px; align-items: center; transition: all 0.2s; }
        .kpi-card:hover { border-color: #c7d2fe; box-shadow: 0 4px 12px rgba(79,70,229,0.08); }
        .kpi-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .kpi-label { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; }
        .kpi-value { font-size: 1.3rem; font-weight: 700; margin-top: 2px; }
        .kpi-delta { font-size: 0.78rem; font-weight: 600; margin-top: 2px; }
        .kpi-delta.up { color: #10b981; }
        .kpi-delta.down { color: #ef4444; }

        .chart-card { grid-column: span 8; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
        @media (max-width: 1100px) { .chart-card { grid-column: span 12; } }
        .chart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .chart-head h3 { margin: 0; font-size: 1.05rem; }
        .chart-total { font-size: 0.85rem; color: #6b7280; }
        .bars { display: flex; gap: 14px; align-items: flex-end; height: 220px; padding: 0 8px; }
        .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
        .bar { width: 100%; max-width: 56px; background: linear-gradient(180deg, #6366F1 0%, #4F46E5 100%); border-radius: 10px 10px 4px 4px; position: relative; min-height: 20px; display: flex; align-items: flex-start; justify-content: center; padding-top: 6px; transition: all 0.3s; }
        .bar:hover { background: linear-gradient(180deg, #7C7FFF 0%, #5C53F0 100%); transform: translateY(-2px); }
        .bar-value { color: #fff; font-size: 0.7rem; font-weight: 600; }
        .bar-label { font-size: 0.8rem; color: #6b7280; }

        .side-card { grid-column: span 4; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; }
        @media (max-width: 1100px) { .side-card { grid-column: span 6; } }
        @media (max-width: 700px)  { .side-card { grid-column: span 12; } }
        .side-card h3 { margin: 0 0 4px; font-size: 1rem; }
        .muted { color: #6b7280; font-size: 0.82rem; margin: 0 0 14px; }
        .dept-list { display: flex; flex-direction: column; gap: 10px; }
        .dept-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 10px; background: #f9fafb; }
        .dept-info { display: flex; align-items: center; gap: 10px; }
        .dept-dot { width: 10px; height: 10px; border-radius: 50%; }
        .dept-count { font-weight: 700; color: #4F46E5; }
        .top-clients { display: flex; flex-direction: column; gap: 8px; }
        .top-row { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 10px; }
        .top-row:hover { background: #f9fafb; }
        .rank { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%); color: #92400e; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; }
        .top-info { flex: 1; min-width: 0; }
        .top-name { font-weight: 600; font-size: 0.9rem; }
        .top-sub { font-size: 0.75rem; color: #6b7280; }
        .top-ca { font-weight: 700; color: #10b981; font-size: 0.9rem; }
      `}</style>
    </div>
  )
}

function isDescendant(employees: Employee[], maybeDescendant: string, ancestor: string): boolean {
  let current: string | null = maybeDescendant
  while (current) {
    if (current === ancestor) return true
    const node: Employee | undefined = employees.find((e) => e.id === current)
    current = node?.managerId || null
  }
  return false
}

function HierarchyTab() {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES)
  const [showForm, setShowForm] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const ceo = employees.find((e) => e.managerId === null)
  const reportsByManager = useMemo(() => {
    const map: Record<string, Employee[]> = {}
    employees.forEach((e) => {
      const key = e.managerId || '_root'
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return map
  }, [employees])

  const onDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }
    if (isDescendant(employees, targetId, draggedId)) {
      setDraggedId(null)
      return
    }
    setEmployees((prev) => prev.map((e) => e.id === draggedId ? { ...e, managerId: targetId } : e))
    setDraggedId(null)
  }

  return (
    <div>
      <div className="hier-head">
        <h3>Organigramme - {employees.length} collaborateurs</h3>
        <div className="hier-actions">
          <span className="hint">Glisse une carte sur un manager pour reorganiser</span>
          <button className="add-btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Annuler' : '+ Ajouter un collaborateur'}
          </button>
        </div>
      </div>

      {showForm && (
        <AddEmployeeForm
          employees={employees}
          onAdd={(emp) => {
            setEmployees((prev) => [...prev, emp])
            setShowForm(false)
          }}
        />
      )}

      <div className="org-tree">
        {ceo && (
          <OrgNode
            employee={ceo}
            reports={reportsByManager}
            draggedId={draggedId}
            setDraggedId={setDraggedId}
            onDrop={onDrop}
          />
        )}
      </div>

      <style jsx>{`
        .hier-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .hier-head h3 { margin: 0; }
        .hier-actions { display: flex; align-items: center; gap: 16px; }
        .hint { font-size: 0.82rem; color: #6b7280; font-style: italic; }
        .add-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff; border: none; border-radius: 12px;
          font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
        .org-tree { display: flex; justify-content: center; padding: 20px; overflow-x: auto; }
      `}</style>
    </div>
  )
}

function OrgNode({ employee, reports, draggedId, setDraggedId, onDrop }: {
  employee: Employee
  reports: Record<string, Employee[]>
  draggedId: string | null
  setDraggedId: (id: string | null) => void
  onDrop: (id: string) => void
}) {
  const [hover, setHover] = useState(false)
  const children = reports[employee.id] || []

  return (
    <div className="node">
      <div
        className={`card ${hover ? 'drop-over' : ''} ${draggedId === employee.id ? 'dragging' : ''}`}
        draggable
        onDragStart={() => setDraggedId(employee.id)}
        onDragEnd={() => setDraggedId(null)}
        onDragOver={(e) => { e.preventDefault(); setHover(true) }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); onDrop(employee.id) }}
      >
        <div className="avatar">{employee.avatar}</div>
        <div className="info">
          <div className="name">{employee.name}</div>
          <div className="role">{employee.role}</div>
          <div className="email">{employee.email}</div>
        </div>
        <span className="dept-tag">{employee.department}</span>
      </div>

      {children.length > 0 && (
        <>
          <div className="connector" />
          <div className="children">
            {children.map((c) => (
              <OrgNode key={c.id} employee={c} reports={reports} draggedId={draggedId} setDraggedId={setDraggedId} onDrop={onDrop} />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .node { display: flex; flex-direction: column; align-items: center; padding: 0 12px; }
        .card {
          width: 220px; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px;
          padding: 14px; display: flex; align-items: center; gap: 12px;
          cursor: grab; transition: all 0.2s; position: relative;
        }
        .card:hover { box-shadow: 0 4px 12px rgba(79,70,229,0.12); border-color: #c7d2fe; }
        .card.dragging { opacity: 0.4; }
        .card.drop-over { border-color: #4F46E5; background: #EEF2FF; transform: scale(1.03); }
        .avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff; font-weight: 700; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .info { flex: 1; min-width: 0; }
        .name { font-weight: 600; font-size: 0.88rem; line-height: 1.2; }
        .role { font-size: 0.75rem; color: #4F46E5; margin-top: 2px; }
        .email { font-size: 0.7rem; color: #6b7280; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dept-tag { position: absolute; top: -8px; right: 8px; font-size: 0.65rem; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
        .connector { width: 2px; height: 24px; background: #e5e7eb; }
        .children { display: flex; gap: 4px; padding-top: 4px; border-top: 2px solid #e5e7eb; }
      `}</style>
    </div>
  )
}

function AddEmployeeForm({ employees, onAdd }: { employees: Employee[]; onAdd: (e: Employee) => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('Tech')
  const [managerId, setManagerId] = useState(employees[0]?.id || '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !role || !email) return
    const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    onAdd({
      id: `e${Date.now()}`,
      name, role, email, department,
      managerId: managerId || null,
      avatar: initials,
    })
    setName(''); setRole(''); setEmail('')
  }

  return (
    <form className="form" onSubmit={submit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" required />
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Poste" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option>Direction</option><option>Tech</option><option>Operations</option><option>Commercial</option><option>RH</option>
      </select>
      <select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <button type="submit">Ajouter</button>

      <style jsx>{`
        .form { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; background: #f9fafb; padding: 16px; border-radius: 14px; margin-bottom: 20px; }
        @media (max-width: 800px) { .form { grid-template-columns: repeat(2, 1fr); } }
        input, select { padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.88rem; background: #fff; }
        input:focus, select:focus { outline: none; border-color: #4F46E5; }
        button { background: #4F46E5; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.88rem; }
        button:hover { background: #4338CA; }
      `}</style>
    </form>
  )
}

function ClientsTab() {
  const [filter, setFilter] = useState<'all' | 'Actif' | 'Prospect' | 'Inactif'>('all')
  const [view, setView] = useState<'cards' | 'table'>('cards')

  const filtered = filter === 'all' ? CLIENTS : CLIENTS.filter((c) => c.status === filter)
  const stats = {
    all: CLIENTS.length,
    Actif: CLIENTS.filter((c) => c.status === 'Actif').length,
    Prospect: CLIENTS.filter((c) => c.status === 'Prospect').length,
    Inactif: CLIENTS.filter((c) => c.status === 'Inactif').length,
  }

  return (
    <div>
      <div className="clients-head">
        <div className="filters">
          {(['all', 'Actif', 'Prospect', 'Inactif'] as const).map((f) => (
            <button key={f} className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tous' : f} <span className="count">{stats[f]}</span>
            </button>
          ))}
        </div>
        <div className="views">
          <button className={view === 'cards' ? 'view-btn active' : 'view-btn'} onClick={() => setView('cards')}>▦ Cartes</button>
          <button className={view === 'table' ? 'view-btn active' : 'view-btn'} onClick={() => setView('table')}>≡ Tableau</button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="clients-grid">
          {filtered.map((c) => (
            <div className="client-card" key={c.id}>
              <div className="cc-head">
                <div className="cc-logo">{c.name.charAt(0)}</div>
                <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
              </div>
              <div className="cc-name">{c.name}</div>
              <div className="cc-industry">{c.industry} · depuis {c.sinceYear}</div>
              <div className="cc-contact">
                <div>{c.contact}</div>
                <div className="cc-sub">{c.email}</div>
                <div className="cc-sub">{c.phone}</div>
              </div>
              <div className="cc-stats">
                <div>
                  <div className="cc-stat-label">CA 2026</div>
                  <div className="cc-stat-value">{c.ca.toLocaleString('fr-FR')} €</div>
                </div>
                <div>
                  <div className="cc-stat-label">Encours</div>
                  <div className={`cc-stat-value ${c.encours > 0 ? 'warn' : ''}`}>{c.encours.toLocaleString('fr-FR')} €</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Client</th><th>Contact</th><th>Statut</th><th>Secteur</th><th>CA 2026</th><th>Encours</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.contact}<br/><span className="muted">{c.email}</span></td>
                  <td><span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td>{c.industry}</td>
                  <td><strong>{c.ca.toLocaleString('fr-FR')} €</strong></td>
                  <td className={c.encours > 0 ? 'warn' : ''}>{c.encours.toLocaleString('fr-FR')} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .clients-head { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter { padding: 8px 16px; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; color: #6b7280; }
        .filter:hover { border-color: #4F46E5; color: #4F46E5; }
        .filter.active { background: #4F46E5; color: #fff; border-color: #4F46E5; }
        .filter .count { font-size: 0.72rem; padding: 1px 7px; border-radius: 999px; background: rgba(0,0,0,0.1); margin-left: 4px; font-weight: 700; }
        .filter.active .count { background: rgba(255,255,255,0.25); }
        .views { display: flex; gap: 4px; }
        .view-btn { padding: 8px 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 10px; cursor: pointer; font-size: 0.82rem; font-weight: 500; color: #6b7280; }
        .view-btn.active { background: #EEF2FF; color: #4F46E5; border-color: #c7d2fe; }

        .clients-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .client-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; transition: all 0.2s; }
        .client-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .cc-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .cc-logo { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: #fff; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
        .badge { padding: 4px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
        .badge.actif { background: #D1FAE5; color: #065F46; }
        .badge.prospect { background: #FEF3C7; color: #92400E; }
        .badge.inactif { background: #FEE2E2; color: #991B1B; }
        .cc-name { font-size: 1.05rem; font-weight: 700; }
        .cc-industry { font-size: 0.78rem; color: #6b7280; margin: 2px 0 12px; }
        .cc-contact { padding: 10px 12px; background: #f9fafb; border-radius: 10px; margin-bottom: 12px; font-size: 0.82rem; }
        .cc-sub { font-size: 0.74rem; color: #6b7280; margin-top: 2px; }
        .cc-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .cc-stat-label { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; }
        .cc-stat-value { font-size: 0.95rem; font-weight: 700; color: #10b981; }
        .cc-stat-value.warn { color: #f59e0b; }

        .table-wrap { overflow-x: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f3f4f6; }
        th { background: #f9fafb; font-weight: 600; color: #6b7280; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
        tbody tr:hover { background: #f9fafb; }
        .muted { color: #6b7280; font-size: 0.78rem; }
        .warn { color: #f59e0b; font-weight: 600; }
      `}</style>
    </div>
  )
}

function DocumentsTab() {
  const [cat, setCat] = useState<'Tous' | CompanyDoc['category']>('Tous')
  const filtered = cat === 'Tous' ? DOCS : DOCS.filter((d) => d.category === cat)

  const counts: Record<string, number> = {
    Tous: DOCS.length,
    'Comptabilite': DOCS.filter((d) => d.category === 'Comptabilite').length,
    'Juridique': DOCS.filter((d) => d.category === 'Juridique').length,
    'Commercial': DOCS.filter((d) => d.category === 'Commercial').length,
    'RH': DOCS.filter((d) => d.category === 'RH').length,
  }

  const iconFor = (t: string) => t === 'pdf' ? '📕' : t === 'xlsx' ? '📊' : '📄'

  return (
    <div>
      <div className="docs-head">
        <div className="cats">
          {(['Tous', 'Comptabilite', 'Juridique', 'Commercial', 'RH'] as const).map((c) => (
            <button key={c} className={cat === c ? 'cat active' : 'cat'} onClick={() => setCat(c)}>
              {c} <span className="count">{counts[c]}</span>
            </button>
          ))}
        </div>
        <div className="upload-zone">
          <span>📤 Glisse un document ici ou</span>
          <button className="upload-btn">Parcourir</button>
        </div>
      </div>

      <div className="docs-list">
        {filtered.map((d) => (
          <div className="doc-card" key={d.id}>
            <div className="doc-icon">{iconFor(d.type)}</div>
            <div className="doc-info">
              <div className="doc-name">{d.name}</div>
              <div className="doc-meta">
                <span>{d.category}</span>
                <span>·</span>
                <span>{d.size}</span>
                <span>·</span>
                <span>{d.uploadedAt}</span>
                <span>·</span>
                <span>par {d.uploadedBy}</span>
              </div>
            </div>
            <div className="doc-actions">
              <a className="doc-btn" href={d.url} target="_blank" rel="noopener noreferrer">Apercu</a>
              <a className="doc-btn primary" href={d.url} download>↓ Telecharger</a>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .docs-head { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
        .cats { display: flex; gap: 8px; flex-wrap: wrap; }
        .cat { padding: 8px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #6b7280; }
        .cat:hover { border-color: #4F46E5; color: #4F46E5; }
        .cat.active { background: #EEF2FF; border-color: #c7d2fe; color: #4F46E5; }
        .count { font-size: 0.7rem; opacity: 0.7; margin-left: 4px; }
        .upload-zone { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: #f9fafb; border: 1px dashed #c7d2fe; border-radius: 12px; font-size: 0.85rem; color: #6b7280; }
        .upload-btn { padding: 6px 14px; background: #4F46E5; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }
        .upload-btn:hover { background: #4338CA; }

        .docs-list { display: flex; flex-direction: column; gap: 10px; }
        .doc-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .doc-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .doc-icon { font-size: 1.8rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: #f9fafb; border-radius: 12px; }
        .doc-info { flex: 1; min-width: 0; }
        .doc-name { font-weight: 600; font-size: 0.92rem; }
        .doc-meta { font-size: 0.78rem; color: #6b7280; margin-top: 2px; display: flex; gap: 6px; flex-wrap: wrap; }
        .doc-actions { display: flex; gap: 8px; }
        .doc-btn { padding: 8px 14px; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 0.82rem; font-weight: 600; text-decoration: none; color: #4F46E5; background: #fff; transition: all 0.2s; }
        .doc-btn:hover { background: #EEF2FF; }
        .doc-btn.primary { background: #4F46E5; color: #fff; border-color: #4F46E5; }
        .doc-btn.primary:hover { background: #4338CA; }
      `}</style>
    </div>
  )
}
