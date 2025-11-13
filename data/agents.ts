export interface AgentSuggestion {
  icon: string
  title: string
  description: string
}

export interface Agent {
  id: string
  name: string
  firstName: string
  icon: string
  avatar: string
  description: string
  domain: string
  category: 'finance' | 'management'
  welcomeMessage: string
  suggestions: AgentSuggestion[]
}

export const agents: Agent[] = [
  // Finance Domain
  {
    id: 'comptable',
    name: 'Agent Comptable',
    firstName: 'Lucas',
    icon: '📊',
    avatar: '/avatars/agent-1.png',
    description: 'Automatise la gestion comptable et la facturation',
    domain: 'Finance',
    category: 'finance',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Comptable 📊. Je suis là pour automatiser votre gestion comptable, la facturation et le suivi de vos finances. N\'hésitez pas à me déposer vos fichiers (factures, relevés bancaires) ou à me demander de générer des rapports financiers !',
    suggestions: [
      { icon: '🧾', title: 'Générer une facture', description: 'Créer une facture professionnelle' },
      { icon: '📊', title: 'Analyser mes dépenses', description: 'Vue d\'ensemble de mes coûts' },
      { icon: '📈', title: 'Rapport mensuel', description: 'Bilan comptable du mois' },
      { icon: '💶', title: 'Vérifier ma TVA', description: 'Calcul et déclaration TVA' }
    ]
  },
  {
    id: 'tresorier',
    name: 'Agent Trésorier',
    firstName: 'Marc',
    icon: '💰',
    avatar: '/avatars/agent-2.png',
    description: 'Gère la trésorerie et les flux de cash',
    domain: 'Finance',
    category: 'finance',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Trésorier 💰. Je suis là pour optimiser la gestion de votre trésorerie et analyser vos flux de cash. N\'hésitez pas à me déposer vos fichiers financiers ou à me demander des prévisions de trésorerie !',
    suggestions: [
      { icon: '💸', title: 'Prévoir ma trésorerie', description: 'Projection sur 3 mois' },
      { icon: '📊', title: 'Analyser mes flux', description: 'Entrées vs sorties' },
      { icon: '⚠️', title: 'Alertes de trésorerie', description: 'Configurer des seuils' },
      { icon: '💰', title: 'Optimiser ma tréso', description: 'Suggestions d\'amélioration' }
    ]
  },
  {
    id: 'investissements',
    name: 'Agent Investissements',
    firstName: 'Julie',
    icon: '📈',
    avatar: '/avatars/agent-3.png',
    description: 'Analyse et optimise vos placements financiers',
    domain: 'Finance',
    category: 'finance',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Investissements 📈. Je suis là pour analyser et optimiser vos placements financiers. N\'hésitez pas à me déposer vos documents de portefeuille ou à me demander des recommandations d\'investissement !',
    suggestions: [
      { icon: '📈', title: 'Analyser mon portefeuille', description: 'Performance et risques' },
      { icon: '💡', title: 'Recommandations', description: 'Opportunités d\'investissement' },
      { icon: '🎯', title: 'Diversifier', description: 'Stratégie de diversification' },
      { icon: '📊', title: 'Rapport détaillé', description: 'Analyse complète' }
    ]
  },

  // Management Domain
  {
    id: 'reseaux-sociaux',
    name: 'Agent Réseaux Sociaux',
    firstName: 'Thomas',
    icon: '📱',
    avatar: '/avatars/agent-4.png',
    description: 'Crée et publie vos contenus sur les réseaux',
    domain: 'Gestion d\'Entreprise',
    category: 'management',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Réseaux Sociaux 📱. Je suis là pour créer et publier vos contenus sur les réseaux sociaux. N\'hésitez pas à me déposer des images/vidéos ou à me demander de générer des posts engageants pour LinkedIn, Instagram, Facebook, etc. !',
    suggestions: [
      { icon: '✍️', title: 'Créer un post LinkedIn', description: 'Post professionnel engageant' },
      { icon: '📸', title: 'Légende Instagram', description: 'Caption + hashtags pertinents' },
      { icon: '📅', title: 'Planning de contenu', description: 'Calendrier pour le mois' },
      { icon: '📊', title: 'Analyser mes stats', description: 'Performance des posts' }
    ]
  },
  {
    id: 'email-marketing',
    name: 'Agent Email Marketing',
    firstName: 'Sophie',
    icon: '✉️',
    avatar: '/avatars/agent-5.png',
    description: 'Gère vos campagnes email automatisées',
    domain: 'Gestion d\'Entreprise',
    category: 'management',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Email Marketing ✉️. Je suis là pour créer et gérer vos campagnes email automatisées. N\'hésitez pas à me déposer vos listes de contacts ou à me demander de rédiger des newsletters performantes !',
    suggestions: [
      { icon: '📧', title: 'Rédiger une newsletter', description: 'Email engageant pour clients' },
      { icon: '🎯', title: 'Campagne promo', description: 'Email de vente ciblé' },
      { icon: '📊', title: 'Analyser mes campagnes', description: 'Taux d\'ouverture et clics' },
      { icon: '✨', title: 'Optimiser mes emails', description: 'Améliorer les performances' }
    ]
  },
  {
    id: 'ressources-humaines',
    name: 'Agent RH',
    firstName: 'Claire',
    icon: '👥',
    avatar: '/avatars/agent-6.png',
    description: 'Optimise la gestion de vos ressources humaines',
    domain: 'Gestion d\'Entreprise',
    category: 'management',
    welcomeMessage: 'Bonjour ! Je suis votre Agent RH 👥. Je suis là pour optimiser la gestion de vos ressources humaines (recrutement, onboarding, paie). N\'hésitez pas à me déposer des CV ou à me demander de générer des fiches de poste !',
    suggestions: [
      { icon: '📝', title: 'Créer une fiche de poste', description: 'Offre d\'emploi professionnelle' },
      { icon: '👤', title: 'Analyser un CV', description: 'Évaluation de candidat' },
      { icon: '📋', title: 'Onboarding', description: 'Checklist nouveau salarié' },
      { icon: '💼', title: 'Entretien annuel', description: 'Préparer les évaluations' }
    ]
  },
  {
    id: 'support-client',
    name: 'Agent Support Client',
    firstName: 'Emma',
    icon: '🎧',
    avatar: '/avatars/agent-7.png',
    description: 'Fournit un support client automatisé 24/7',
    domain: 'Gestion d\'Entreprise',
    category: 'management',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Support Client 🎧. Je suis là pour vous aider à gérer le support client 24/7. N\'hésitez pas à me déposer vos tickets ou à me demander de créer des réponses automatisées pour vos clients !',
    suggestions: [
      { icon: '💬', title: 'Créer une réponse type', description: 'Modèle de réponse client' },
      { icon: '📋', title: 'Traiter un ticket', description: 'Résoudre une demande' },
      { icon: '🤖', title: 'FAQ automatique', description: 'Base de connaissances' },
      { icon: '😊', title: 'Satisfaction client', description: 'Analyser les retours' }
    ]
  },
  {
    id: 'telephonique',
    name: 'Agent Téléphonique',
    firstName: 'Léa',
    icon: '☎️',
    avatar: '/avatars/agent-8.png',
    description: 'Gère les appels et communications vocales',
    domain: 'Gestion d\'Entreprise',
    category: 'management',
    welcomeMessage: 'Bonjour ! Je suis votre Agent Téléphonique ☎️. Je suis là pour automatiser la gestion de vos appels et communications vocales. N\'hésitez pas à me demander de créer des scripts d\'appel ou de générer des messages vocaux !',
    suggestions: [
      { icon: '📞', title: 'Créer un script d\'appel', description: 'Guide de conversation' },
      { icon: '🎙️', title: 'Message vocal', description: 'Répondeur professionnel' },
      { icon: '📊', title: 'Analyser mes appels', description: 'Stats et durée' },
      { icon: '⏰', title: 'Planifier des rappels', description: 'Automatiser les suivis' }
    ]
  }
]
