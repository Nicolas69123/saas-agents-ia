export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readingTime: number
  icon: string
  author: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'comment-automatiser-compta',
    title: 'Comment Automatiser Votre Comptabilité avec l\'IA',
    excerpt: 'Découvrez comment notre Agent Comptable peut vous faire économiser des heures de travail chaque mois.',
    category: 'Finance',
    date: '22 Oct 2025',
    readingTime: 5,
    icon: '📊',
    author: 'Nicolas',
    content: `
      <h2>Introduction à l'automatisation comptable</h2>
      <p>La comptabilité est l'une des tâches les plus chronophages pour les petites entreprises.
      Notre Agent Comptable révolutionne cette approche en automatisant entièrement vos processus.</p>

      <h3>Les avantages</h3>
      <ul>
        <li><strong>Gain de temps:</strong> Réduisez le temps de 40 heures/mois à 4 heures/mois</li>
        <li><strong>Zéro erreur:</strong> Nos algorithmes vérifient chaque transaction</li>
        <li><strong>Conformité garantie:</strong> Respectez toujours les normes comptables</li>
      </ul>

      <h3>Comment ça marche?</h3>
      <p>L'Agent Comptable se connecte directement à vos comptes bancaires et enregistre automatiquement
      chaque transaction. Il catégorise les dépenses, génère les déclarations et vous alerte en cas d'anomalie.</p>

      <p>Les résultats parlent d'eux-mêmes: <strong>98% de nos clients économisent plus de 10 000€ par an</strong>.</p>
    `
  },
  {
    id: '2',
    slug: 'integration-n8n-guide',
    title: 'Intégrer n8n avec nos Agents IA - Guide Complet',
    excerpt: 'Un tutoriel étape par étape pour connecter n8n et créer des workflows puissants.',
    category: 'Intégrations',
    date: '20 Oct 2025',
    readingTime: 8,
    icon: '🔗',
    author: 'Nicolas',
    content: `
      <h2>Introduction à n8n et nos agents</h2>
      <p>n8n est une plateforme d'automatisation puissante. Combinée avec nos agents IA,
      elle devient une machine à optimiser votre entreprise.</p>

      <h3>Prérequis</h3>
      <ul>
        <li>Un compte SaaS Agents IA</li>
        <li>Une instance n8n (cloud ou self-hosted)</li>
        <li>Une clé API valide</li>
      </ul>

      <h3>Étapes d'intégration</h3>
      <p><strong>Étape 1:</strong> Générez une clé API dans votre dashboard</p>
      <p><strong>Étape 2:</strong> Créez un nouveau workflow n8n</p>
      <p><strong>Étape 3:</strong> Configurez le webhook vers nos agents</p>
      <p><strong>Étape 4:</strong> Testez et activez</p>

      <h3>Exemples de workflows</h3>
      <ul>
        <li>Email entrant → Agent Support → Ticket créé</li>
        <li>Formulaire → Agent Validation → CRM mis à jour</li>
        <li>Slack → Agent Compta → Facture générée</li>
      </ul>
    `
  },
  {
    id: '3',
    slug: 'tendances-ia-2025',
    title: 'Les Tendances de l\'IA en 2025',
    excerpt: 'Explorez les futures de l\'automatisation et de l\'intelligence artificielle.',
    category: 'Actualités',
    date: '18 Oct 2025',
    readingTime: 6,
    icon: '🔮',
    author: 'Nicolas',
    content: `
      <h2>L'avenir de l'IA en entreprise</h2>
      <p>2025 marque un tournant majeur dans l'adoption de l'IA. Les entreprises découvrent
      que l'automatisation n'est pas un luxe mais une nécessité.</p>

      <h3>Top 5 Tendances</h3>
      <ol>
        <li><strong>Agents spécialisés:</strong> Pas d'IA généraliste, mais des experts par domaine</li>
        <li><strong>Zéro-code automation:</strong> Plus besoin de développeurs</li>
        <li><strong>Privacy-first:</strong> Données sur serveurs privés</li>
        <li><strong>Multi-agents orchestration:</strong> Des équipes d'IA qui collaborent</li>
        <li><strong>ROI mesurable:</strong> Chaque euro investi doit être justifié</li>
      </ol>

      <p>Nos agents IA embrassent toutes ces tendances. Prêt à rester compétitif?</p>
    `
  },
  {
    id: '4',
    slug: 'cas-client-pme',
    title: 'Étude de Cas: Comment Dupont SAS a économisé 50k€',
    excerpt: 'Découvrez comment une PME a transformé son opérations avec nos agents.',
    category: 'Cas Clients',
    date: '15 Oct 2025',
    readingTime: 7,
    icon: '🏆',
    author: 'Nicolas',
    content: `
      <h2>Profil du client</h2>
      <p><strong>Dupont SAS</strong> est une PME comptable avec 15 collaborateurs.
      Ils géraient 3000 clients et passaient 200h/mois sur l'administratif.</p>

      <h3>Le Problème</h3>
      <ul>
        <li>Processus manuels et répétitifs</li>
        <li>Erreurs humaines fréquentes</li>
        <li>Coûts de main-d'oeuvre élevés</li>
        <li>Manque de scalabilité</li>
      </ul>

      <h3>La Solution</h3>
      <p>Nous avons déployé nos 3 agents Finance: Comptable, Trésorier, et Investissements.</p>

      <h3>Les Résultats (6 mois)</h3>
      <ul>
        <li>📉 80% réduction du temps administratif</li>
        <li>✅ 99.8% de précision</li>
        <li>💰 50 000€ économisés</li>
        <li>📈 Capacité augmentée de 40%</li>
      </ul>

      <blockquote>
        "C'est un game-changer. Nous avons pu embaucher un consultant de haut niveau
        au lieu d'ajouter une position administrative." - Directeur Dupont SAS
      </blockquote>
    `
  }
]
