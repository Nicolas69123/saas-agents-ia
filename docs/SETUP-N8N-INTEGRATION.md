# 🚀 Guide Complet d'Intégration n8n

## 📚 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation n8n](#installation-n8n)
4. [Configuration des Workflows](#configuration-des-workflows)
5. [Intégration avec Next.js](#intégration-avec-nextjs)
6. [Tests](#tests)
7. [Déploiement en Production](#déploiement-en-production)

---

## 📋 Vue d'ensemble

Ce guide explique comment configurer l'intégration n8n pour les 8 agents IA du SaaS.

**Architecture :**
```
Next.js (Frontend + API)
    ↓
API Route /api/chat
    ↓
Webhooks n8n (localhost:5678 ou production)
    ↓
Workflows n8n (traitement des messages)
    ↓
Réponses IA (via Claude API / DeepSeek)
```

---

## ✅ Prérequis

- [ ] Node.js >= 18.x installé
- [ ] n8n installé globalement : `npm install -g n8n`
- [ ] Next.js dev server fonctionnel
- [ ] Base de données PostgreSQL/SQLite configurée

---

## 🔧 Installation n8n

### 1. Installer n8n

```bash
npm install -g n8n
```

### 2. Démarrer n8n en local

```bash
# Démarrer n8n (en foreground)
N8N_SECURE_COOKIE=false n8n start

# OU en arrière-plan avec logs
N8N_SECURE_COOKIE=false n8n start > /tmp/n8n.log 2>&1 &
```

### 3. Accéder à l'interface

- **URL** : http://localhost:5678
- **Créer un compte owner** lors de la première connexion
- **Email** : votre email
- **Password** : votre mot de passe sécurisé

---

## 🎯 Configuration des Workflows

### Étape 1 : Créer un workflow pour chaque agent

Pour chaque agent (8 au total), suivre cette structure :

#### Structure du Workflow

**Nodes à créer :**

1. **Webhook Trigger**
   - Type : `Webhook`
   - HTTP Method : `POST`
   - Path : `comptable` (ou autre selon l'agent)
   - Response Mode : `Using 'Respond to Webhook' Node`

2. **Code Node** (traitement)
   - Type : `Code`
   - Mode : `Run Once for All Items`
   - JavaScript : Voir `/docs/n8n-workflows-guide.md`

3. **Respond to Webhook**
   - Type : `Respond to Webhook`
   - Respond With : `JSON`
   - Response Body : `{{ $json }}`

#### Connexions

```
Webhook → Code Node → Respond to Webhook
```

### Étape 2 : Code JavaScript pour chaque agent

**Exemple pour l'Agent Comptable :**

```javascript
const userMessage = $input.first().json.body.message || "";
const agentId = $input.first().json.body.agentId || "comptable";
const conversationId = $input.first().json.body.conversationId || "";

const responses = {
  facture: "📄 Parfait ! Pour générer une facture...",
  depense: "📊 Excellent ! Pour analyser vos dépenses...",
  rapport: "📈 Rapport mensuel en préparation...",
  tva: "💶 Vérification TVA...",
  default: "Bonjour ! 📊 Agent Comptable à votre service..."
};

const msgLower = userMessage.toLowerCase();
let response = responses.default;

if (msgLower.includes("facture")) response = responses.facture;
else if (msgLower.includes("dépense")) response = responses.depense;
else if (msgLower.includes("rapport")) response = responses.rapport;
else if (msgLower.includes("tva")) response = responses.tva;

return {
  json: {
    success: true,
    response,
    agentId,
    conversationId,
    timestamp: new Date().toISOString()
  }
};
```

### Étape 3 : Activer le workflow

1. Cliquer sur **Save** (en haut à droite)
2. Activer le toggle **Active**
3. L'URL du webhook sera : `http://localhost:5678/webhook/[path]`

### Étape 4 : Tester le webhook

```bash
curl -X POST http://localhost:5678/webhook/comptable \
  -H "Content-Type: application/json" \
  -d '{"message": "Je veux générer une facture", "agentId": "comptable", "conversationId": "test-123"}'
```

**Réponse attendue :**
```json
{
  "success": true,
  "response": "📄 Parfait ! Pour générer une facture...",
  "agentId": "comptable",
  "conversationId": "test-123",
  "timestamp": "2025-10-22T14:00:00.000Z"
}
```

### Étape 5 : Répéter pour les 8 agents

Créer un workflow pour chaque agent :

| Agent ID | Path Webhook | Nom |
|----------|-------------|------|
| `comptable` | `/webhook/comptable` | Agent Comptable |
| `tresorier` | `/webhook/tresorier` | Agent Trésorier |
| `investissements` | `/webhook/investissements` | Agent Investissements |
| `reseaux-sociaux` | `/webhook/reseaux-sociaux` | Agent Réseaux Sociaux |
| `email-marketing` | `/webhook/email-marketing` | Agent Email Marketing |
| `ressources-humaines` | `/webhook/ressources-humaines` | Agent RH |
| `support-client` | `/webhook/support-client` | Agent Support Client |
| `telephonique` | `/webhook/telephonique` | Agent Téléphonique |

---

## ⚙️ Intégration avec Next.js

### 1. Configuration des Webhooks

Éditer `/config/n8n-webhooks.ts` :

```typescript
export const webhookConfigs: WebhookConfig[] = [
  {
    agentId: 'comptable',
    name: 'Agent Comptable',
    webhookUrl: `${N8N_BASE_URL}/webhook/comptable`,
    isActive: true, // ✅ Mettre à true après création
  },
  // ... autres agents
]
```

**Important :** Mettre `isActive: true` uniquement pour les agents dont le workflow n8n est créé et actif.

### 2. Variables d'environnement

Créer/modifier `.env.local` :

```env
# n8n Configuration
N8N_URL=http://localhost:5678

# En production, utiliser l'URL publique
# N8N_URL=https://n8n.votredomaine.com
```

### 3. API Route

L'API `/app/api/chat/route.ts` est déjà configurée pour utiliser les webhooks n8n automatiquement.

---

## 🧪 Tests

### Test Automatique

Utiliser le script de test :

```bash
# Tester tous les agents actifs
npx tsx scripts/test-webhooks.ts

# Tester un agent spécifique
npx tsx scripts/test-webhooks.ts comptable
```

**Exemple de sortie :**
```
🚀 Démarrage des tests de webhooks n8n...
📝 Nombre d'agents à tester: 8
✅ Agents actifs: 1
⏭️  Agents inactifs: 7

🔍 Test de Agent Comptable (comptable)...

📊 Résultats des tests de webhooks n8n

═══════════════════════════════════════════════════════════
✅ Agent Comptable
   URL: http://localhost:5678/webhook/comptable
   ⏱️  Temps de réponse: 145ms
   ✨ Réponse: Bonjour ! 📊 Agent Comptable à votre service...
```

### Test Manuel via Next.js

1. Démarrer Next.js : `npm run dev`
2. Ouvrir http://localhost:3000
3. Cliquer sur "Agent Comptable"
4. Envoyer un message : "Je veux générer une facture"
5. Vérifier la réponse de l'agent

---

## 🚀 Déploiement en Production

### 1. Déployer n8n

**Options :**

**A. Railway.app (recommandé)**
```bash
# Installer railway CLI
npm install -g @railway/cli

# Login
railway login

# Déployer n8n
railway init
railway add
```

**B. Vercel + n8n Cloud**
- Utiliser n8n.cloud (service hébergé)
- Configurer l'URL dans `.env.production`

**C. VPS (Oracle Cloud, DigitalOcean, etc.)**
```bash
# Installer n8n avec Docker
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Sécuriser n8n

```bash
# Variables d'environnement en production
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=your_username
N8N_BASIC_AUTH_PASSWORD=your_secure_password
N8N_ENCRYPTION_KEY=random_secure_key_32_chars
```

### 3. Configurer Next.js en production

`.env.production` :
```env
N8N_URL=https://n8n.votredomaine.com
```

### 4. Déployer Next.js

```bash
# Vercel
vercel deploy --prod

# OU autre plateforme
npm run build
npm start
```

---

## 🔍 Troubleshooting

### Problème : Webhook n8n ne répond pas 404

**Solutions :**
1. Vérifier que le workflow est **actif** (toggle en haut à droite)
2. Vérifier que le path du webhook correspond : `/webhook/comptable`
3. Redémarrer n8n : `pkill -9 n8n && n8n start`
4. Vérifier les logs n8n : `tail -f /tmp/n8n.log`

### Problème : Next.js ne se connecte pas à n8n

**Solutions :**
1. Vérifier que n8n tourne : `ps aux | grep n8n`
2. Vérifier l'URL dans `/config/n8n-webhooks.ts`
3. Tester avec curl directement
4. Vérifier les CORS dans n8n

### Problème : Timeout des requêtes

**Solutions :**
1. Augmenter le timeout dans `/app/api/chat/route.ts` : `signal: AbortSignal.timeout(30000)`
2. Optimiser le code JavaScript dans n8n
3. Vérifier la performance du serveur n8n

---

## 📚 Ressources

- **Documentation n8n** : https://docs.n8n.io
- **Guide des workflows** : `/docs/n8n-workflows-guide.md`
- **Configuration des webhooks** : `/config/n8n-webhooks.ts`
- **Script de test** : `/scripts/test-webhooks.ts`

---

## ✅ Checklist Complète

### Développement

- [ ] n8n installé et démarré (localhost:5678)
- [ ] Compte owner créé
- [ ] Workflow Agent Comptable créé et actif
- [ ] Webhook testé avec curl
- [ ] `isActive: true` dans `/config/n8n-webhooks.ts`
- [ ] Test automatique réussi : `npx tsx scripts/test-webhooks.ts comptable`
- [ ] Test dans Next.js réussi
- [ ] 8 workflows créés pour les 8 agents
- [ ] Tous les tests automatiques passent

### Production

- [ ] n8n déployé sur serveur distant
- [ ] URL publique configurée dans `.env.production`
- [ ] Authentification Basic Auth activée
- [ ] HTTPS configuré (certificat SSL)
- [ ] Tous les workflows actifs
- [ ] Tests en production réussis
- [ ] Monitoring configuré (Sentry, Logtail, etc.)

---

**💡 Prochaines Étapes :**

1. ✅ **Phase 1 - Réponses Simulées** : Workflows avec réponses pré-définies (ACTUEL)
2. 🔄 **Phase 2 - IA Réelle** : Intégration Claude API / DeepSeek dans les workflows
3. 🚀 **Phase 3 - Fonctionnalités Avancées** : Génération PDF, envoi emails, intégrations tierces
4. 📊 **Phase 4 - Analytics** : Tracking des conversations, satisfaction client

---

**🎉 Félicitations !** Vous avez configuré l'intégration n8n avec succès ! 🚀
