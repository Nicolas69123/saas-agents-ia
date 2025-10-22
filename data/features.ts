export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  points: string[]
}

export const features: Feature[] = [
  {
    id: 'automation',
    title: 'Automatisation Intelligente',
    description: 'Laissez nos agents IA gérer vos processus métier sans intervention manuelle.',
    icon: '⚙️',
    points: [
      'Workflows personnalisés par agent',
      'Déclenchement automatique basé sur conditions',
      'Chaînes d\'action complexes',
      'Logging et audit complets'
    ]
  },
  {
    id: 'integration',
    title: 'Intégrations Faciles',
    description: 'Connectez-vous à vos outils préférés en quelques clics.',
    icon: '🔗',
    points: [
      'Webhooks natifs',
      'API REST complète',
      'Intégrations Zapier & n8n',
      '50+ connecteurs pré-configurés'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Avancées',
    description: 'Suivez les performances de vos agents et mesurez l\'impact.',
    icon: '📊',
    points: [
      'Dashboards en temps réel',
      'Rapports détaillés',
      'Suivi des coûts économisés',
      'Exportation des données'
    ]
  },
  {
    id: 'security',
    title: 'Sécurité de Niveau Enterprise',
    description: 'Vos données sont protégées avec les meilleurs standards.',
    icon: '🔒',
    points: [
      'Chiffrement end-to-end',
      'Authentification 2FA',
      'Conformité RGPD & ISO27001',
      'Audit trail complet'
    ]
  }
]
