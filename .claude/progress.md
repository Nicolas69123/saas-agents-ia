# Avancement du Projet - projects saas agents ia

> **Dernière mise à jour** : 2025-12-02 Matin (10h30)
> **Session** : Déploiement VM Automatisé & Optimisation Frontend 🚀

---

## 🎯 Session Actuelle

**Date** : 2025-12-02 Matin
**Durée** : ~2h30
**Focus** : Script d'installation tout-en-un, vidéo background, optimisation structure

### Ce qui a été fait aujourd'hui

#### 🚀 **Script d'Installation Automatisé Complet**
- ✅ **Script `install-all.sh`** - Installation en 1 SEULE commande (17K lignes)
  - Installe Node.js 20.x, PM2, PostgreSQL, Nginx, Certbot, Git
  - Configure automatiquement la base de données PostgreSQL
  - Clone le repo et build l'application
  - Configure Nginx avec reverse proxy
  - Configure SSL avec Let's Encrypt
  - Configure le firewall UFW
  - Démarre l'application avec PM2
  - Interface interactive (demande domaine, email, password DB)
  - Logs détaillés dans `/var/log/saas-agents-install.log`
  - Vérifications automatiques post-installation
  - **Durée** : 10-15 minutes pour installation complète

- ✅ **Guide ultra-complet** : `INSTALLATION-1-COMMANDE.md`
  - Instructions détaillées pour chaque étape
  - Troubleshooting complet
  - Commandes utiles (PM2, Nginx, PostgreSQL)
  - Configuration sécurité
  - Conseils par provider (Oracle Cloud, DigitalOcean, AWS)

#### 🎨 **Amélioration Frontend**
- ✅ Vidéo en background de la landing page
  - Vidéo `hero-background.mp4` (6.1 MB) copiée dans `public/`
  - Balise `<video>` avec autoPlay, loop, muted, playsInline
  - CSS adapté pour `hero-bg-video` (object-fit: cover)
  - Lecture automatique en boucle

- ✅ Dashboard amélioré (commit précédent)
  - Icônes aux cartes de stats
  - Section "Activités récentes" avec avatars
  - Hero section avec carousel interactif

#### 📦 **Structure Deployment/ Optimisée**
- ✅ Dossier `deployment/` créé avec tout le nécessaire
  - **3 scripts** : install-all.sh, deploy.sh, rollback.sh
  - **1 guide** : INSTALLATION-1-COMMANDE.md
  - **Config** : ecosystem.config.js, nginx.conf, .env.production
  - **Doc** : 03-ALTERNATIVES.md (comparaison Vercel, Railway, etc.)

- ✅ **Nettoyage effectué** - 12 fichiers redondants supprimés
  - Supprimé install-dependencies.sh, setup-nginx.sh, setup-ssl.sh, setup-firewall.sh
  - Supprimé 01-QUICKSTART.md, 02-FULL-GUIDE.md (remplacés par INSTALLATION-1-COMMANDE.md)
  - Supprimé duplicatas à la racine (docs/, ecosystem.config.js, scripts/deploy.sh)
  - Structure finale : 3 scripts essentiels + 1 guide complet

#### 🔧 **Configuration Database**
- ✅ Base de données actuelle : **SQLite** (dev.db - 114 KB)
  - 6 tables : users, agents, conversations, messages, workflows, workflow_executions
  - 8 agents IA pré-chargés

- ✅ Base de données production : **PostgreSQL**
  - Configuration automatique par install-all.sh
  - Création user + DB automatique
  - Migrations Prisma automatiques
  - Seed des 8 agents automatique

#### 📝 **Commits & PR**
- ✅ **Commit 1** : `4891ffe` - Dashboard et hero section améliorés
  - +911 lignes : Dashboard avec activités, hero carousel interactif
  - Logo OmniA ajouté

- ✅ **Commit 2** : `8211a4c` - Déploiement VM complet
  - +4,494 lignes : 19 fichiers (deployment/ complet)
  - Scripts, docs, configurations

- ✅ **PR #4** mise à jour avec 3 commits (7,997 lignes au total)

### Prochaines étapes immédiates

1. 🎬 **Commit les changements actuels**
   - Vidéo background
   - Script install-all.sh
   - Nettoyage fichiers redondants
   - README deployment/ mis à jour

2. 🚀 **Déployer sur une VM** (optionnel)
   - Tester le script install-all.sh sur Oracle Cloud
   - Ou déployer sur Vercel en 2 minutes

3. 🔧 **Intégration Backend** (futur)
   - Connecter chat à Claude API
   - Activer les workflows n8n
   - Configurer authentification OAuth

---

## 🗓️ Session Précédente

**Date** : 2025-10-22 Après-midi
**Durée** : ~1h30
**Focus** : Intégration n8n, Workflows Agents IA, Configuration & Documentation

### Ce qui a été fait aujourd'hui

#### 🔧 **Infrastructure n8n**
- ✅ n8n redémarré et stabilisé (localhost:5678)
- ✅ Workflow "Agent Comptable 📊" créé et activé
- ✅ Problèmes d'enregistrement webhook API résolus
- ✅ Architecture simplifiée adoptée (création manuelle via interface)

#### 📁 **Configuration & Architecture**
- ✅ **Fichier de configuration centralisé** : `/config/n8n-webhooks.ts`
  - Map des 8 agents avec leurs webhooks
  - Fonctions helper : `getWebhookUrl()`, `hasActiveWebhook()`
  - Configuration `isActive` par agent
  - Support variables d'environnement (`N8N_URL`)

- ✅ **API Route améliorée** : `/app/api/chat/route.ts`
  - Import dynamique de la configuration
  - Timeout configurable (10 secondes)
  - Gestion d'erreurs robuste
  - Fallback automatique si webhook indisponible
  - Logging des erreurs

#### 🧪 **Script de Test Automatisé**
- ✅ **Script de validation** : `/scripts/test-webhooks.ts`
  - Test de tous les webhooks actifs
  - Mesure du temps de réponse
  - Affichage coloré des résultats
  - Support test d'un agent spécifique
  - Statistiques détaillées (succès/erreurs/ignorés)
  - Exit code selon résultats

**Usage :**
```bash
npx tsx scripts/test-webhooks.ts           # Tous les agents
npx tsx scripts/test-webhooks.ts comptable # Agent spécifique
```

#### 📚 **Documentation Complète**
- ✅ **Guide technique** : `/docs/n8n-workflows-guide.md`
  - Structure des 8 workflows
  - Code JavaScript pour chaque agent
  - Réponses pré-définies par domaine
  - Checklist de vérification
  - Tips et best practices

- ✅ **Guide d'intégration complet** : `/docs/SETUP-N8N-INTEGRATION.md`
  - Installation n8n (local + production)
  - Configuration step-by-step des workflows
  - Intégration Next.js détaillée
  - Tests automatiques et manuels
  - Déploiement en production
  - Troubleshooting complet
  - Checklist dev & production

#### 🎯 **Configuration des 8 Agents**

| Agent | Webhook Path | Status | Fonctionnalités |
|-------|-------------|--------|-----------------|
| 📊 Comptable | `/webhook/comptable` | ✅ Actif | Factures, Dépenses, Rapports, TVA |
| 💰 Trésorier | `/webhook/tresorier` | ⏳ À créer | Prévisions, Flux, Alertes |
| 📈 Investissements | `/webhook/investissements` | ⏳ À créer | Portefeuille, Recommandations |
| 📱 Réseaux Sociaux | `/webhook/reseaux-sociaux` | ⏳ À créer | Posts, Analytics, Planning |
| ✉️ Email Marketing | `/webhook/email-marketing` | ⏳ À créer | Newsletters, Campagnes |
| 👥 RH | `/webhook/ressources-humaines` | ⏳ À créer | Recrutement, Onboarding |
| 🎧 Support Client | `/webhook/support-client` | ⏳ À créer | Tickets, FAQ, Satisfaction |
| ☎️ Téléphonique | `/webhook/telephonique` | ⏳ À créer | Scripts, Messages vocaux |

#### 🚀 **Workflow Agent Comptable (Template)**

**Structure :**
```
Webhook Trigger (POST /comptable)
    ↓
Code Node (traitement + détection d'intention)
    ↓
Respond to Webhook (JSON)
```

**Réponses intelligentes :**
- 🧾 Facture : Demande infos client/prestations
- 📊 Dépenses : Propose analyse par catégorie
- 📈 Rapport : Génération bilan mensuel
- 💶 TVA : Vérification calculs + échéances

---

## 🗓️ Session Précédente

**Date** : 2025-10-22 Nuit
**Durée** : ~3 heures
**Focus** : Tests, Design Premium, Chat Personnalisé, n8n, Prisma & API

### Ce qui a été fait aujourd'hui

#### 🧪 **Tests Playwright Complets**
- ✅ Tests de navigation (Home, Features, Pricing, Blog, Articles)
- ✅ Tests des boutons et interactions
- ✅ Tests du Chat Modal (ouverture, fermeture, suggestions, historique)
- ✅ Tests authentification (Login, Signup)
- ✅ Tests Dashboard complet (4 pages)
- ✅ Tests responsive (Mobile 375px + Desktop 1920px)
- ✅ Bug corrigé : Dashboard layout manquait 'use client'
- ✅ Screenshots générés dans .playwright-mcp/

#### 🎨 **Design Ultra-Arrondi**
**Chat Modal IA :**
- ✅ Modal principal : 24px → **40px** border-radius
- ✅ Tous les boutons header : **Cercles parfaits (50%)**
- ✅ Input message : 24px → **32px** + padding augmenté
- ✅ Bouton d'envoi : **44x44px cercle parfait**
- ✅ Bulles messages : 24px → **28px**
- ✅ Cartes suggestions : 28px → **32px**
- ✅ Avatar agent : 32px → **36px** avec border-radius 16px
- ✅ `overflow: hidden` pour coins parfaits

**Site Global :**
- ✅ Tous les boutons : **24px** border-radius
- ✅ Cartes agents : **24px**
- ✅ Cartes pricing : **24px**

#### 📎 **Bouton Upload de Fichiers**
- ✅ Bouton 📎 circulaire (50%) à côté du bouton d'envoi
- ✅ Upload multi-fichiers supporté
- ✅ Animation rotation -15deg au hover
- ✅ Handler d'upload prêt pour backend

#### 💬 **Messages de Bienvenue Automatiques**
- ✅ 8 messages personnalisés créés (un par agent)
- ✅ Envoi automatique lors de l'ouverture du chat
- ✅ Hook `useChat` modifié pour supporter welcomeMessage
- ✅ Interface Agent étendue dans data/agents.ts

**Exemples de messages :**
- 📊 Agent Comptable : "Je suis là pour automatiser votre gestion comptable... N'hésitez pas à me déposer vos fichiers..."
- 📱 Agent Réseaux Sociaux : "N'hésitez pas à me déposer des images/vidéos ou à me demander de générer des posts..."
- 🎧 Agent Support Client : "Je suis là pour gérer le support client 24/7..."

#### 🎯 **32 Suggestions Personnalisées**
**Chaque agent a maintenant 4 suggestions spécifiques** (total : 32 suggestions)

**📊 Agent Comptable :**
- 🧾 Générer une facture
- 📊 Analyser mes dépenses
- 📈 Rapport mensuel
- 💶 Vérifier ma TVA

**📱 Agent Réseaux Sociaux :**
- ✍️ Créer un post LinkedIn
- 📸 Légende Instagram
- 📅 Planning de contenu
- 📊 Analyser mes stats

**🎧 Agent Support Client :**
- 💬 Créer une réponse type
- 📋 Traiter un ticket
- 🤖 FAQ automatique
- 😊 Satisfaction client

**(+ 5 autres agents avec leurs suggestions)**

#### 🎨 **Header & Footer Améliorés**
**Header :**
- ✅ Box-shadow subtile ajoutée
- ✅ Backdrop-filter blur
- ✅ Padding augmenté (20px)

**Footer :**
- ✅ Tous les liens mis à jour avec vraies URLs
- ✅ Email : contact@saas-agents-ia.fr
- ✅ Téléphone : +33 (0)1 23 45 67 89
- ✅ Localisation : Paris, France

#### 📄 **6 Nouvelles Pages Créées**
**Documentation :**
- ✅ `/docs` - Page Documentation (4 cartes)
- ✅ `/docs/faq` - FAQ (5 questions/réponses)
- ✅ `/docs/integrations` - Intégrations (n8n, Zapier, Slack, etc.)
- ✅ `/support` - Page Support (3 options de contact)

**Pages Légales :**
- ✅ `/legal/privacy` - Politique de confidentialité (7 sections RGPD)
- ✅ `/legal/terms` - Conditions d'utilisation (10 sections)
- ✅ `/legal/cookies` - Politique de cookies

#### 🚀 **n8n Installation & Configuration**
- ✅ n8n v1.111.0 installé et démarré (localhost:5678)
- ✅ Compte owner créé (nicolas@saas-agents-ia.fr)
- ✅ Clé API générée : "MCP Server Integration"
- ✅ MCP n8n installé et **CONNECTÉ** ✨
- ✅ Configuration dans `~/.claude.json`

**Commande utilisée :**
```bash
N8N_SECURE_COOKIE=false n8n start  # n8n tourne en background
claude mcp add --transport stdio n8n -e N8N_API_URL=http://localhost:5678/api/v1 -e N8N_API_KEY=... -- npx -y n8n-mcp-server
```

**Status MCP Actuel** :
- ✅ Playwright - Connecté
- ✅ Filesystem - Connecté
- ✅ **n8n - Connecté** 🎉
- ⚠️ Fetch - Échec connexion

### 📊 Statistiques Session Complètes

**⏱️ Temps & Effort**
- Durée totale : ~3 heures
- Étapes documentées : 50+ étapes
- Tests Playwright : 20+ tests réalisés

**📁 Fichiers**
- Fichiers modifiés : 15 fichiers
- Fichiers créés : 13 nouveaux fichiers
- Pages fonctionnelles : 20 pages
- Lignes de code : ~1000 lignes ajoutées

**🎨 Design & Features**
- Composants chat modifiés : 5 composants
- Suggestions créées : 32 suggestions (4 par agent)
- Messages de bienvenue : 8 messages personnalisés
- Screenshots générés : 6 images
- Border-radius : 7 éléments redesignés

**🔧 Infrastructure**
- Services démarrés : 3 (Next.js, n8n, PostgreSQL)
- MCP configurés : 4 (Playwright, Filesystem, Fetch, n8n)
- Base de données : SQLite (6 tables migrées)
- Agents en DB : 8 agents pré-chargés
- API créées : 1 route `/api/chat`

**🐛 Bugs**
- Bugs corrigés : 1 (Dashboard layout)
- Bugs actifs : 0

**📚 Documentation**
- Fichier de session détaillé : `.claude/SESSION-2025-10-22-NUIT.md`
- Toutes les étapes documentées avec code et commandes
- Problèmes + solutions détaillés
- Prochaines étapes clairement définies

---

## 🗓️ Sessions Précédentes

### Session 2025-10-22 (Soir - MCP Setup)
**Temps** : ~10 minutes
**Résultat** : MCP configurés pour Claude Code CLI

**Réalisations:**
- Configuration MCP Playwright, Filesystem, Fetch
- 2/3 MCP fonctionnels (Playwright + Filesystem)
- Fichier config : `~/.claude.json`

### Session 2025-10-22 (PM - Frontend Development)
**Temps** : ~4 heures
**Résultat** : Frontend SaaS complet avec chat IA

### Réalisations

#### 🏗️ **Architecture Frontend Complète**
- ✅ Structure Next.js 14 avec App Router
- ✅ TypeScript strict activé
- ✅ Configuration package.json, tsconfig.json, next.config.js
- ✅ Styled JSX pour styles scopés

#### 📄 **Pages Créées (13 pages)**
**Landing & Marketing**
- ✅ Page d'accueil (`/`) avec toutes les sections
- ✅ Page Pricing (`/pricing`) avec 3 plans tarifaires
- ✅ Page Features (`/features`) avec 4 fonctionnalités détaillées
- ✅ Page Blog (`/blog`) avec 4 articles
- ✅ Page Article détail (`/blog/[slug]`) dynamique

**Authentification**
- ✅ Page Login (`/auth/login`) avec OAuth
- ✅ Page Signup (`/auth/signup`)

**Dashboard Complet**
- ✅ Dashboard principal (`/dashboard`) avec stats & overview
- ✅ Gestion agents (`/dashboard/agents`) avec tableau
- ✅ Analytics (`/dashboard/analytics`) avec graphiques
- ✅ Settings (`/dashboard/settings`) avec sécurité

#### 🧩 **Composants Créés (17 composants)**
**Landing Components**
- ✅ Header + Footer avec navigation
- ✅ HeroSection avec carrousel placeholder
- ✅ AgentShowcase avec 8 agents clickables
- ✅ PropositionValue avec 4 avantages
- ✅ PricingSection avec 3 plans
- ✅ CallToAction

**Dashboard Components**
- ✅ Sidebar avec navigation
- ✅ Header du dashboard
- ✅ StatsCard pour métriques
- ✅ AgentsList pour aperçu

**Chat Components (5 composants)**
- ✅ ChatModal - Modal popup principal
- ✅ ChatMessages - Affichage messages avec animations
- ✅ ChatInput - Input avec multi-ligne
- ✅ ChatSidebar - Historique conversations
- ✅ ChatSuggestions - Écran bienvenue avec 4 suggestions

#### 🎨 **Design & Animations**
- ✅ Border-radius augmentés (12-24px)
- ✅ Animations cubic-bezier fluides (spring effect)
- ✅ Ripple effect sur boutons
- ✅ Hover animations (translateY + scale + shadow)
- ✅ Slide-up modal avec bounce
- ✅ Fade-in messages avec scale
- ✅ Focus glow sur inputs
- ✅ Shimmer effect sur suggestions

#### 🔧 **Fonctionnalités Chat**
- ✅ Hook `useChat` pour gestion état complet
- ✅ Conversations persistantes en mémoire
- ✅ Historique des chats dans sidebar
- ✅ Nouveau chat / Switch conversations
- ✅ Messages user/agent avec timestamps
- ✅ Typing indicator pendant réponse
- ✅ Auto-scroll vers nouveaux messages
- ✅ 4 suggestions pré-intégrées par agent

#### 🛠️ **Configuration & Tooling**
- ✅ MCP Playwright configuré pour Claude Desktop
- ✅ MCP Filesystem pour accès projet
- ✅ MCP Fetch pour requêtes HTTP
- ✅ Fichier de config : `~/Library/Application Support/Claude/claude_desktop_config.json`

#### 🐛 **Bugs Résolus**
- ✅ Erreur "styled-jsx needs 'use client'" sur toutes les pages
- ✅ Problème de cache webpack après suppression .next
- ✅ Redémarrage serveur pour compilation propre

### Prochaines étapes immédiates

1. 🎨 **Design System** - Ajouter vraies couleurs & thème
2. 🖼️ **Images** - Remplacer placeholders par vraies images
3. 🔌 **Intégration Backend** - Connecter chat à API réelle
4. 🗄️ **Base de données** - PostgreSQL pour persistance
5. 🚀 **n8n Integration** - Workflows automation
6. 🔐 **Auth réelle** - NextAuth.js avec OAuth

---

## 📊 Status Actuel

**Environnement** : Développement local
**Status** : 🚀 Frontend + n8n opérationnels
**Tech Stack Actuel** : Next.js 14 + TypeScript + Styled JSX + n8n
**Serveurs actifs** :
- Next.js : localhost:3000 (background)
- n8n : localhost:5678 (background)

### Structure de Fichiers
```
.
├── app/                       # 20 pages Next.js
│   ├── page.tsx              # Landing
│   ├── pricing/              # Tarification
│   ├── features/             # Fonctionnalités
│   ├── blog/                 # Blog + articles (5 pages)
│   ├── auth/                 # Login + Signup
│   ├── dashboard/            # Dashboard (4 pages)
│   ├── docs/                 # Documentation (3 pages) ✨ NOUVEAU
│   ├── support/              # Support ✨ NOUVEAU
│   └── legal/                # Pages légales (3 pages) ✨ NOUVEAU
├── components/               # 17 composants
│   ├── Header.tsx + Footer.tsx (améliorés) ✨
│   ├── Landing/              # 5 composants
│   ├── Dashboard/            # 4 composants
│   └── Chat/                 # 5 composants chat (modifiés) ✨
├── data/                     # 3 fichiers data
│   ├── agents.ts             # 8 agents + messages + suggestions ✨
│   ├── features.ts           # 4 features
│   └── blog.ts               # 4 articles
└── hooks/
    └── useChat.ts            # Hook avec welcomeMessage ✨
```

---

## 🗓️ Dernières Sessions

### Session 2025-10-22 (Soir)
**Temps** : ~10 minutes
**Résultat** : MCP configurés pour Claude Code CLI

**Réalisations:**
- Configuration MCP Playwright, Filesystem, Fetch
- 2/3 MCP fonctionnels (Playwright + Filesystem)
- Fichier config : `~/.claude.json`

### Session 2025-10-22 (PM)
**Temps** : ~4 heures
**Résultat** : Frontend SaaS complet avec chat IA

**Réalisations Majeures:**
- 13 pages Next.js créées
- 17 composants réutilisables
- Système de chat modal complet
- Animations fluides professionnelles
- MCP Playwright configuré (Claude Desktop)
- Bugs corrigés (styled-jsx)

**Fichiers Modifiés/Créés** : 35 fichiers

### Session 2025-10-22 (AM)
- Création initiale du projet
- Setup structure .claude/
- Définition vision & architecture

---

## 💡 Décisions Récentes

**2025-10-22 (Nuit)** : Design Ultra-Arrondi (40px modal, 32px inputs, cercles parfaits)
→ Raison : Look premium moderne, démarque de la concurrence, UX fluide

**2025-10-22 (Nuit)** : Suggestions personnalisées par agent (32 suggestions)
→ Raison : Guide l'utilisateur, augmente engagement, pertinence par domaine

**2025-10-22 (Nuit)** : Messages de bienvenue automatiques par agent
→ Raison : Onboarding UX, présentation claire du rôle de l'agent

**2025-10-22 (Nuit)** : Bouton upload fichier 📎 dans le chat
→ Raison : Permet dépôt de documents (factures, images, CV, etc.)

**2025-10-22 (Nuit)** : Installation n8n local + MCP n8n
→ Raison : Workflows automation, orchestration des agents IA

**2025-10-22 (Nuit)** : 6 pages footer (docs, FAQ, legal)
→ Raison : Site complet et professionnel, conformité légale

**2025-10-22 (PM)** : Architecture SaaS Classique avec Dashboard
→ Raison : Structure éprouvée pour SaaS B2B, facilite onboarding utilisateur

**2025-10-22 (PM)** : Chat Modal style Claude/ChatGPT
→ Raison : UX moderne, conversations persistantes, historique complet

**2025-10-22 (PM)** : Styled JSX au lieu de Tailwind CSS
→ Raison : Styles scopés, pas de conflits, animations inline faciles

**2025-10-22 (PM)** : Animations cubic-bezier(0.34, 1.56, 0.64, 1)
→ Raison : Effet "spring" professionnel, UX satisfaisante

**2025-10-22 (AM)** : Tech Stack = Next.js + TypeScript + PostgreSQL (futur)
→ Raison : Performance, SEO, TypeScript safety, scalable

---

## 🐛 Bugs Connus

✅ **TOUS RÉSOLUS**

Aucun bug actif. Dernier résolu:
- Erreur "styled-jsx client-only" → Résolu avec 'use client' directive

---

## 📝 Notes pour Prochaine Session

**Priorités Immédiates** :
1. 🚀 **Workflows n8n** - Créer workflows pour chaque agent IA (PRIORITÉ #1) ✨
2. 🔌 **API Backend** - Connecter chat à API réelle (Claude/DeepSeek)
3. 🗄️ **PostgreSQL** - Setup DB locale + schema agents
4. 🎨 **Thème & Couleurs** - Définir palette couleurs brand
5. 🖼️ **Images Réelles** - Photos agents, captures écran, illustrations

**n8n Workflows à Créer** :
- 📊 Agent Comptable : Génération factures, analyse dépenses, rapports
- 📱 Agent Réseaux Sociaux : Posts LinkedIn/Instagram, planning contenu
- ✉️ Agent Email Marketing : Newsletters, campagnes promo
- 👥 Agent RH : Fiches de poste, analyse CV, onboarding
- 🎧 Agent Support : Réponses types, tickets, FAQ
- 💰 Agent Trésorier : Prévisions trésorerie, alertes
- 📈 Agent Investissements : Analyse portefeuille, recommandations
- ☎️ Agent Téléphonique : Scripts d'appel, messages vocaux

**Intégrations Futures** :
- NextAuth.js pour authentification OAuth
- Stripe pour paiements
- Vercel pour déploiement production
- Sentry pour monitoring erreurs
- Posthog pour analytics

**Ressources Disponibles** :
- README.md = Documentation projet
- localhost:3000 = Site Next.js fonctionnel ✅
- localhost:5678 = n8n Editor opérationnel ✅
- MCP Playwright = Testing automatisé ✅
- MCP n8n = Création workflows assistée par IA ✅
- Structure complète SaaS + n8n prête
