# 🤖 SaaS Agents IA - Plateforme d'Automatisation

> **Agence IA fournissant des services d'automatisation** pour la compta, les réseaux sociaux, le marketing, RH, support client, et plus.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![n8n](https://img.shields.io/badge/n8n-1.111-FF6D5A)](https://n8n.io/)

---

## 📋 Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [8 Agents IA](#8-agents-ia)
- [Stack Technique](#stack-technique)
- [Documentation](#documentation)

---

## 🎯 Vue d'Ensemble

SaaS Agents IA est une **plateforme complète d'automatisation** qui fournit 8 agents IA spécialisés pour automatiser vos processus métier :

- 📊 **Comptabilité** - Factures, TVA, rapports
- 💰 **Trésorerie** - Flux de cash, prévisions
- 📈 **Investissements** - Analyse portefeuille, recommandations
- 📱 **Réseaux Sociaux** - Posts LinkedIn/Instagram, planning
- ✉️ **Email Marketing** - Newsletters, campagnes
- 👥 **RH** - Recrutement, fiches de poste, onboarding
- 🎧 **Support Client** - Tickets, FAQ, satisfaction
- ☎️ **Téléphonique** - Scripts d'appel, messages vocaux

---

## ✨ Fonctionnalités

### 🎨 Interface Moderne
- **Design ultra-arrondi** (40px modal, cercles parfaits)
- **Responsive** (mobile + desktop)
- **Animations fluides** (cubic-bezier spring effect)
- **Dark mode ready**

### 💬 Chat IA Personnalisé
- **Messages de bienvenue** automatiques par agent
- **32 suggestions personnalisées** (4 par agent)
- **Upload de fichiers** 📎 (factures, images, CV, etc.)
- **Historique conversations** persisté en base
- **Bulles ultra-arrondies** (28px)

### 📊 Dashboard Complet
- **4 pages** : Overview, Agents, Analytics, Settings
- **Stats en temps réel** : Exécutions, économies, performance
- **Gestion des 8 agents** : Tableau avec actions
- **Analytics détaillées** : Graphiques + métriques

### 📄 20 Pages Fonctionnelles
**Marketing** :
- Landing page + Features + Pricing + Blog (5 pages)

**Auth** :
- Login + Signup (OAuth ready)

**Dashboard** :
- 4 pages complètes

**Documentation** :
- Docs + FAQ + Intégrations + Support (4 pages)

**Légal** :
- Privacy + Terms + Cookies (3 pages)

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────┐      ┌─────────┐
│  Next.js    │ ───→ │   API    │ ───→ │  n8n    │
│  Frontend   │      │  Routes  │      │Workflows│
│ (20 pages) │      │(/api/chat│      │(Agents) │
└─────────────┘      └──────────┘      └─────────┘
                           │
                           ↓
                    ┌──────────┐
                    │  SQLite  │
                    │ Database │
                    │(6 tables)│
                    └──────────┘
```

### Flow Utilisateur → Agent IA

1. **Utilisateur** envoie message dans le chat
2. **Frontend** appelle `/api/chat` (POST)
3. **API** sauvegarde message en DB (Prisma)
4. **API** appelle webhook n8n de l'agent
5. **n8n** exécute workflow (traitement métier)
6. **n8n** retourne réponse
7. **API** sauvegarde réponse en DB
8. **Frontend** affiche réponse à l'utilisateur

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- (Optionnel) PostgreSQL pour production

### 1. Cloner le Projet
```bash
git clone <repo>
cd "projects saas agents ia"
```

### 2. Installer Dépendances
```bash
npm install
```

### 3. Setup Base de Données
```bash
# Générer client Prisma
npx prisma generate

# Créer tables
npx prisma migrate dev

# Peupler avec les 8 agents
npx tsx prisma/seed.ts
```

### 4. Démarrer Next.js
```bash
npm run dev
# → http://localhost:3000
```

### 5. (Optionnel) Démarrer n8n
```bash
N8N_SECURE_COOKIE=false n8n start
# → http://localhost:5678
```

---

## 💻 Utilisation

### Développement Local

```bash
# Terminal 1 - Next.js
npm run dev

# Terminal 2 - n8n (optionnel)
N8N_SECURE_COOKIE=false n8n start

# Terminal 3 - Prisma Studio (UI pour DB)
npx prisma studio
```

### URLs
- **Site** : http://localhost:3000
- **n8n** : http://localhost:5678
- **Prisma Studio** : http://localhost:5555

### Tester un Agent
1. Ouvrir http://localhost:3000
2. Cliquer sur "Discuter avec l'agent" (ex: Agent Comptable)
3. Le chat s'ouvre avec message de bienvenue
4. Cliquer sur une suggestion ou taper un message
5. L'agent répond (simulation pour l'instant)

---

## 🤖 8 Agents IA

### Finance (3 agents)

#### 📊 Agent Comptable
**Suggestions** :
- 🧾 Générer une facture
- 📊 Analyser mes dépenses
- 📈 Rapport mensuel
- 💶 Vérifier ma TVA

**Message** : "Je suis là pour automatiser votre gestion comptable..."

#### 💰 Agent Trésorier
**Suggestions** :
- 💸 Prévoir ma trésorerie (3 mois)
- 📊 Analyser mes flux
- ⚠️ Alertes de trésorerie
- 💰 Optimiser ma tréso

#### 📈 Agent Investissements
**Suggestions** :
- 📈 Analyser mon portefeuille
- 💡 Recommandations
- 🎯 Diversifier
- 📊 Rapport détaillé

---

### Gestion d'Entreprise (5 agents)

#### 📱 Agent Réseaux Sociaux
**Suggestions** :
- ✍️ Créer un post LinkedIn
- 📸 Légende Instagram
- 📅 Planning de contenu
- 📊 Analyser mes stats

#### ✉️ Agent Email Marketing
**Suggestions** :
- 📧 Rédiger une newsletter
- 🎯 Campagne promo
- 📊 Analyser mes campagnes
- ✨ Optimiser mes emails

#### 👥 Agent RH
**Suggestions** :
- 📝 Créer une fiche de poste
- 👤 Analyser un CV
- 📋 Onboarding
- 💼 Entretien annuel

#### 🎧 Agent Support Client
**Suggestions** :
- 💬 Créer une réponse type
- 📋 Traiter un ticket
- 🤖 FAQ automatique
- 😊 Satisfaction client

#### ☎️ Agent Téléphonique
**Suggestions** :
- 📞 Créer un script d'appel
- 🎙️ Message vocal
- 📊 Analyser mes appels
- ⏰ Planifier des rappels

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript 5
- **Styling** : Styled JSX (CSS-in-JS)
- **State** : React Hooks

### Backend
- **API** : Next.js API Routes
- **ORM** : Prisma 6
- **Database** : SQLite (dev) → PostgreSQL (prod)
- **Automation** : n8n 1.111.0

### Tools & DevOps
- **Testing** : Playwright (MCP)
- **Package Manager** : npm
- **Version Control** : Git
- **Deployment** : Vercel (prévu)

### MCP Servers (Claude Code)
- ✅ Playwright - Testing automatisé
- ✅ Filesystem - Accès projet
- ✅ n8n - Création workflows assistée
- ⚠️ Fetch - API calls (échec connexion)

---

## 📚 Documentation

### Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `.claude/progress.md` | Avancement global du projet |
| `.claude/SESSION-2025-10-22-NUIT.md` | **Documentation détaillée de cette session** 📚 |
| `CLAUDE.md` | Configuration Claude pour le projet |
| `README.md` | Ce fichier |

### Documentation Détaillée

**📖 Voir `.claude/SESSION-2025-10-22-NUIT.md` pour :**
- Toutes les 50+ étapes réalisées
- Code complet avant/après
- Commandes exactes utilisées
- Problèmes rencontrés + solutions
- Screenshots avec explications
- Prochaines étapes détaillées

---

## 🗂️ Structure des Dossiers

```
.
├── .claude/                    # Documentation Claude
│   ├── progress.md            # Avancement global
│   └── SESSION-*.md           # Docs de sessions
│
├── .playwright-mcp/           # Screenshots tests
│
├── app/                       # 20 Pages Next.js
│   ├── api/chat/             # ✨ Route API Chat
│   ├── dashboard/            # Dashboard (4 pages)
│   ├── docs/                 # Documentation (3 pages)
│   ├── legal/                # Pages légales (3 pages)
│   └── ...
│
├── components/               # 17 Composants
│   ├── Chat/                # 5 composants chat
│   ├── Dashboard/           # 4 composants
│   ├── Landing/             # 5 composants
│   ├── Header.tsx
│   └── Footer.tsx
│
├── data/                    # Données statiques
│   ├── agents.ts           # 8 agents + suggestions + messages
│   ├── features.ts
│   └── blog.ts
│
├── hooks/
│   └── useChat.ts          # Hook gestion chat
│
├── lib/                    # ✨ Utilitaires
│   └── prisma.ts          # Client Prisma
│
├── prisma/                # ✨ ORM & Database
│   ├── schema.prisma      # Schéma (6 modèles)
│   ├── seed.ts            # Seed 8 agents
│   ├── dev.db             # SQLite database
│   └── migrations/
│
└── workflows/             # ✨ Workflows n8n
    └── agent-comptable-workflow.json
```

---

## 🚧 État du Projet

### Complet ✅ (100%)
- [x] Frontend (20 pages)
- [x] Design ultra-arrondi
- [x] Chat Modal complet
- [x] Tests Playwright
- [x] Database schema
- [x] API structure

### En Cours ⏳ (50-90%)
- [x] n8n setup (90%)
- [x] API `/api/chat` (70%)
- [ ] Workflows n8n (30%)
- [ ] Frontend → API (0%)

### À Faire ❌ (0%)
- [ ] NextAuth.js
- [ ] Stripe paiements
- [ ] Déploiement Vercel
- [ ] Images réelles
- [ ] Tests E2E complets

**Progression globale** : **~65%**

---

## 🎯 Prochaines Étapes

### Priorité 1 (Prochaine Session) 🔥
1. **Créer workflows n8n** pour les 8 agents (avec MCP n8n)
2. **Connecter Frontend → API** (modifier hooks/useChat.ts)
3. **Intégrer webhooks n8n** dans `/api/chat`
4. **Tester bout en bout** : Chat → API → n8n → Réponse

### Priorité 2 (Cette Semaine)
5. **NextAuth.js** - Authentification OAuth
6. **Design System** - Palette couleurs brand
7. **Images** - Remplacer placeholders

### Priorité 3 (Semaine Prochaine)
8. **Stripe** - Système de paiement
9. **PostgreSQL** - Migration SQLite → PostgreSQL
10. **Déploiement** - Vercel + Railway

---

## 🔑 Credentials & URLs

### Développement Local
- **Next.js** : http://localhost:3000
- **n8n Editor** : http://localhost:5678
- **Prisma Studio** : http://localhost:5555

### n8n Credentials
- Email : nicolas@saas-agents-ia.fr
- Password : N8nAdmin2025!
- API Key : (voir `.env` ou `.claude/SESSION-*.md`)

### Database
- **Type** : SQLite (dev)
- **Fichier** : `prisma/dev.db`
- **Tables** : 6 tables
- **Agents** : 8 agents pré-chargés

---

## 📞 Contact & Support

### Pour Questions sur le Code
- Voir `.claude/progress.md`
- Voir `.claude/SESSION-2025-10-22-NUIT.md` (documentation complète)

### Support Utilisateurs (Futur)
- Email : support@saas-agents-ia.fr
- Téléphone : +33 (0)1 23 45 67 89
- Localisation : Paris, France

---

## 📄 Licence

Projet privé - Tous droits réservés © 2025 SaaS Agents IA

---

## 🙏 Crédits

**Développé par** : Nicolas
**Formation** : YNOV - Intelligence Artificielle & Data
**Date** : Octobre 2025

**Technologies utilisées** :
- Next.js par Vercel
- Prisma ORM
- n8n workflow automation
- Playwright for testing
- Claude Code by Anthropic

---

**🎉 Projet en développement actif - Dernière mise à jour : 02 Décembre 2025**

🚀 **Déploiement automatique actif !** - Chaque push sur `main` déclenche un déploiement sur la VM.
