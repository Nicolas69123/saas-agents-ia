# Documentation Technique - OmnIA SaaS

> Documentation complète du site OmnIA - Plateforme d'agents IA automatisés

![Page d'accueil OmnIA](./images/homepage.png)

---

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack Technique](#stack-technique)
3. [Architecture du Projet](#architecture-du-projet)
4. [Structure des Dossiers](#structure-des-dossiers)
5. [Pages du Site](#pages-du-site)
6. [Système de Chat](#système-de-chat)
7. [Intégration n8n](#intégration-n8n)
8. [API Routes](#api-routes)
9. [Base de Données](#base-de-données)
10. [Déploiement](#déploiement)

---

## Vue d'ensemble

OmnIA est une plateforme SaaS qui fournit 8 agents IA spécialisés pour automatiser différents aspects d'une entreprise :

| Agent | Domaine | Fonctionnalités |
|-------|---------|-----------------|
| Lucas | Comptabilité | Factures, dépenses, TVA, rapports |
| Marc | Trésorerie | Cash-flow, alertes, prévisions |
| Julie | Investissements | Analyse marché, portefeuille |
| Thomas | Réseaux Sociaux | Posts, images, planning éditorial |
| Sophie | Email Marketing | Newsletters, campagnes, A/B testing |
| Claire | RH | Recrutement, CV, onboarding |
| Emma | Support Client | Tickets, FAQ, satisfaction |
| Léa | Téléphonique | Appels, scripts, transcriptions |

![Page des agents](./images/agents-page.png)

---

## Stack Technique

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 14.2.x | Framework React avec App Router |
| **React** | 18.x | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Styled JSX** | - | Styles scopés par composant |

### Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js API Routes** | 14.x | Endpoints REST |
| **Prisma** | 5.x | ORM base de données |
| **n8n** | 1.x | Orchestration workflows |

### IA & APIs

| Service | Usage |
|---------|-------|
| **Gemini 2.0 Flash** | Génération texte + images |
| **Twitter API v2** | Publication automatique |

### Base de Données

| Environnement | Base de données |
|---------------|-----------------|
| Développement | SQLite |
| Production | PostgreSQL |

---

## Architecture du Projet

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Home   │  │  Chat   │  │Dashboard│  │Calendar │            │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
│       │            │            │            │                  │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTES (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │/api/chat │  │/api/posts│  │/api/media│  │/api/publish│       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         n8n WEBHOOKS                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │/comptable  │  │/reseaux-   │  │/publish-   │                │
│  │            │  │sociaux     │  │post        │                │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                │
└────────┼───────────────┼───────────────┼────────────────────────┘
         │               │               │
         ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GEMINI API + TWITTER API                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Structure des Dossiers

```
saas-agents-ia/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Page d'accueil
│   ├── loading.tsx               # Loading screen global
│   ├── agents/                   # Page des agents
│   ├── pricing/                  # Page tarification
│   ├── blog/                     # Blog + articles
│   ├── contact/                  # Page contact
│   ├── auth/                     # Login + Signup
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                # Dashboard utilisateur
│   │   ├── page.tsx              # Vue d'ensemble
│   │   ├── agents/               # Gestion des agents
│   │   ├── settings/             # Paramètres
│   │   └── loading.tsx           # Loading dashboard
│   ├── chat/                     # Interface de chat
│   │   ├── page.tsx              # Chat principal
│   │   ├── calendar/             # Calendrier publication
│   │   ├── medias/               # Galerie médias
│   │   └── loading.tsx           # Loading chat
│   └── api/                      # API Routes
│       ├── chat/route.ts         # API chat → n8n
│       ├── posts/route.ts        # CRUD posts
│       ├── media/route.ts        # Gestion médias
│       └── publish/route.ts      # Publication Twitter
│
├── components/                   # Composants React
│   ├── Header.tsx                # Navigation principale
│   ├── Footer.tsx                # Pied de page
│   ├── Landing/                  # Composants landing
│   │   ├── HeroSection.tsx
│   │   ├── AgentShowcase.tsx
│   │   └── PricingSection.tsx
│   ├── Dashboard/                # Composants dashboard
│   │   ├── Sidebar.tsx
│   │   └── StatsCard.tsx
│   ├── Chat/                     # Composants chat
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatSidebar.tsx
│   └── SocialMockups/            # Previews réseaux sociaux
│       ├── index.tsx
│       ├── TwitterMockup.tsx
│       ├── LinkedInMockup.tsx
│       ├── InstagramMockup.tsx
│       ├── FacebookMockup.tsx
│       └── TikTokMockup.tsx
│
├── config/                       # Configuration
│   └── n8n-webhooks.ts           # URLs webhooks n8n
│
├── data/                         # Données statiques
│   ├── agents.ts                 # Définition des 8 agents
│   └── social-posts.json         # Posts sauvegardés
│
├── hooks/                        # Hooks React personnalisés
│   └── useChat.ts                # Logique du chat
│
├── lib/                          # Utilitaires
│   └── prisma.ts                 # Client Prisma
│
├── prisma/                       # Base de données
│   ├── schema.prisma             # Schéma DB
│   └── dev.db                    # SQLite (dev)
│
├── public/                       # Assets statiques
│   ├── logos/                    # Logos OmnIA
│   ├── agents/                   # Avatars des agents
│   └── media/                    # Images générées
│
├── scripts/                      # Scripts utilitaires
│   ├── demo-video.mjs            # Script vidéo Playwright
│   └── *.js                      # Scripts n8n
│
├── docs/                         # Documentation
│   ├── site-documentation.md     # Ce fichier
│   ├── workflow-agent-marketing.md
│   ├── workflow-agent-rh.md
│   └── images/                   # Screenshots
│
└── deployment/                   # Déploiement
    ├── scripts/
    ├── INSTALLATION.md
    └── ecosystem.config.js
```

---

## Pages du Site

### 1. Page d'Accueil (`/`)

![Hero Section](./images/homepage.png)

**Sections :**
- **Hero** : Titre accrocheur + CTA
- **Agent Showcase** : Présentation des 8 agents
- **Proposition de Valeur** : 4 avantages clés
- **CTA Final** : Appel à l'action

### 2. Page Agents (`/agents`)

![Page Agents](./images/agents-page.png)

Présentation détaillée de chaque agent avec :
- Avatar et nom
- Domaine d'expertise
- Fonctionnalités principales
- Bouton "Essayer"

### 3. Dashboard (`/dashboard`)

![Dashboard](./images/dashboard.png)

**Fonctionnalités :**
- Statistiques d'utilisation
- Agents actifs
- Activité récente
- Actions rapides

### 4. Interface Chat (`/chat`)

![Chat](./images/chat-page.png)

**Fonctionnalités :**
- Sélection d'agent
- Historique des conversations
- Génération de contenu
- Preview des posts (mockups)
- Upload de fichiers

### 5. Calendrier (`/chat/calendar`)

![Calendrier](./images/calendar-page.png)

**Fonctionnalités :**
- Vue calendrier mensuel
- Programmation de posts
- Publication immédiate
- Gestion des brouillons

---

## Système de Chat

### Hook `useChat`

```typescript
// hooks/useChat.ts
export function useChat(agentId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);

    // Appel API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content, agentId })
    });

    const data = await response.json();

    // Ajout du message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.response,
      image: data.image?.url
    }]);

    setIsLoading(false);
  };

  return { messages, sendMessage, isLoading };
}
```

### Composant ChatMessages

```tsx
// components/Chat/ChatMessages.tsx
export function ChatMessages({ messages, agent }) {
  return (
    <div className="messages-container">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.role}`}>
          {msg.role === 'assistant' && (
            <img src={agent.avatar} alt={agent.name} />
          )}
          <div className="content">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            {msg.image && <img src={msg.image} alt="Generated" />}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Intégration n8n

### Architecture Webhook

```
┌─────────────────┐         ┌─────────────────┐
│    Next.js      │  POST   │      n8n        │
│   /api/chat     │────────▶│   Webhook       │
│                 │         │   Trigger       │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   Router Node   │
                            │ (Détection      │
                            │  d'intention)   │
                            └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌───────────┐    ┌───────────┐    ┌───────────┐
            │  Gemini   │    │  Gemini   │    │  Action   │
            │  (Texte)  │    │  (Image)  │    │  Spéciale │
            └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
                  │                │                │
                  └────────────────┼────────────────┘
                                   ▼
                          ┌─────────────────┐
                          │    Response     │
                          │   to Webhook    │
                          └─────────────────┘
```

### Configuration des Webhooks

```typescript
// config/n8n-webhooks.ts
export const N8N_URL = process.env.N8N_URL || 'http://localhost:5678';

export const webhookConfig: Record<number, WebhookConfig> = {
  1: { name: "comptable", path: "/webhook/comptable", isActive: true },
  2: { name: "tresorier", path: "/webhook/tresorier", isActive: false },
  3: { name: "investissements", path: "/webhook/investissements", isActive: false },
  4: { name: "reseaux-sociaux", path: "/webhook/reseaux-sociaux", isActive: true },
  5: { name: "email-marketing", path: "/webhook/email-marketing", isActive: false },
  6: { name: "ressources-humaines", path: "/webhook/ressources-humaines", isActive: true },
  7: { name: "support-client", path: "/webhook/support-client", isActive: false },
  8: { name: "telephonique", path: "/webhook/telephonique", isActive: false }
};

export function getWebhookUrl(agentId: number): string {
  const config = webhookConfig[agentId];
  return config ? `${N8N_URL}${config.path}` : '';
}
```

### Flux de Publication Twitter

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Calendrier │────▶│ API Publish │────▶│ n8n Webhook │
│  (Bouton)   │     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                       ┌─────────────┐
                                       │ Twitter API │
                                       │  (Post)     │
                                       └─────────────┘
```

---

## API Routes

### POST `/api/chat`

**Description** : Envoie un message à un agent et reçoit une réponse

**Request** :
```json
{
  "message": "Crée un post LinkedIn",
  "agentId": 4
}
```

**Response** :
```json
{
  "success": true,
  "response": "Voici votre post LinkedIn...",
  "post": {
    "platform": "linkedin",
    "content": "..."
  },
  "image": {
    "url": "/media/generated-123.png"
  }
}
```

### GET/POST `/api/posts`

**GET** : Récupère tous les posts
```json
[
  {
    "id": "1",
    "platform": "twitter",
    "content": "...",
    "status": "draft",
    "createdAt": "2025-12-31T12:00:00Z"
  }
]
```

**POST** : Crée un nouveau post
```json
{
  "platform": "twitter",
  "content": "Mon post",
  "imageUrl": "/media/image.png"
}
```

### POST `/api/publish`

**Description** : Publie un post sur Twitter

**Request** :
```json
{
  "platform": "twitter",
  "content": "Mon tweet",
  "postId": "1"
}
```

### GET/POST `/api/media`

**GET** : Liste des médias générés
**POST** : Upload/Sauvegarde d'un média

---

## Base de Données

### Schéma Prisma

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  plan      String   @default("free")
  createdAt DateTime @default(now())

  conversations Conversation[]
}

model Agent {
  id          Int      @id @default(autoincrement())
  name        String
  role        String
  category    String
  avatar      String
  description String
  isActive    Boolean  @default(true)
}

model Conversation {
  id        String    @id @default(uuid())
  userId    String
  agentId   Int
  title     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user     User      @relation(fields: [userId], references: [id])
  messages Message[]
}

model Message {
  id             String   @id @default(uuid())
  conversationId String
  role           String   // "user" | "assistant"
  content        String
  imageUrl       String?
  createdAt      DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id])
}

model Post {
  id         String   @id @default(uuid())
  platform   String   // twitter, linkedin, etc.
  content    String
  imageUrl   String?
  status     String   @default("draft") // draft, scheduled, published
  scheduledAt DateTime?
  publishedAt DateTime?
  createdAt  DateTime @default(now())
}
```

---

## Déploiement

### Développement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
npx prisma generate
npx prisma db push

# 3. Lancer le serveur
npm run dev

# 4. Lancer n8n (dans un autre terminal)
n8n start
```

### Production (VM)

```bash
# Installation automatique
curl -fsSL https://raw.githubusercontent.com/[repo]/main/deployment/scripts/install-all.sh | bash
```

Voir `deployment/INSTALLATION-1-COMMANDE.md` pour le guide complet.

### Variables d'Environnement

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/omnia"

# n8n
N8N_URL="http://localhost:5678"
N8N_API_KEY="your-n8n-api-key"

# Gemini
GEMINI_API_KEY="your-gemini-api-key"

# Twitter
TWITTER_API_KEY="..."
TWITTER_API_SECRET="..."
TWITTER_ACCESS_TOKEN="..."
TWITTER_ACCESS_SECRET="..."
```

---

## Design System

### Couleurs

```css
:root {
  /* Primaires */
  --primary: #6366f1;        /* Indigo */
  --primary-dark: #4f46e5;

  /* Backgrounds */
  --bg-primary: #0a0a0a;     /* Noir profond */
  --bg-secondary: #1a1a2e;   /* Bleu nuit */

  /* Texte */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;

  /* Accents */
  --accent-green: #22c55e;
  --accent-red: #ef4444;
}
```

### Border Radius

```css
/* Design ultra-arrondi */
.card { border-radius: 24px; }
.button { border-radius: 12px; }
.input { border-radius: 12px; }
.modal { border-radius: 40px; }
.avatar { border-radius: 50%; }
```

### Animations

```css
/* Effet spring */
.button {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3);
}
```

---

## Scripts Utiles

### Vidéo de Démo

```bash
# Enregistrer une vidéo de démo du site
node scripts/demo-video.mjs
```

### Test des Webhooks

```bash
# Tester tous les webhooks n8n
npx tsx scripts/test-webhooks.ts
```

### Migration DB

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Ouvrir Prisma Studio
npx prisma studio
```

---

## Ressources

- **Repository** : [GitHub](https://github.com/Nicolas69123/saas-agents-ia)
- **n8n Local** : http://localhost:5678
- **Site Dev** : http://localhost:3000
- **Prisma Studio** : `npx prisma studio`

---

## Changelog

### v1.0.0 (Décembre 2025)
- 8 agents IA configurés
- Interface de chat complète
- Génération d'images avec Gemini
- Mockups réseaux sociaux
- Calendrier de publication
- Publication Twitter automatique
- Dashboard utilisateur
