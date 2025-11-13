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
    icon: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80',
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
    icon: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
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
    icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
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
    icon: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
    points: [
      'Chiffrement end-to-end',
      'Authentification 2FA',
      'Conformité RGPD & ISO27001',
      'Audit trail complet'
    ]
  }
]
