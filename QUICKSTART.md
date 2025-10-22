# 🚀 Guide de Démarrage Rapide

> **Temps estimé** : 5 minutes

---

## ⚡ Démarrage Ultra-Rapide

### 1. Installer & Démarrer (2 min)

```bash
# Installer dépendances
npm install

# Générer client Prisma
npx prisma generate

# Seed database (8 agents IA)
npx tsx prisma/seed.ts

# Démarrer Next.js
npm run dev
```

✅ **Site accessible** : http://localhost:3000

---

### 2. (Optionnel) Démarrer n8n (1 min)

```bash
# Dans un nouveau terminal
N8N_SECURE_COOKIE=false n8n start
```

✅ **n8n accessible** : http://localhost:5678

**Credentials n8n** :
- Email : nicolas@saas-agents-ia.fr
- Password : N8nAdmin2025!

---

## 🧪 Tester le Site (2 min)

### 1. Ouvrir http://localhost:3000

### 2. Tester un Agent IA
1. Scroll vers "Nos Agents IA Spécialisés"
2. Cliquer "Discuter avec l'agent" sur **Agent Comptable** 📊
3. Le chat s'ouvre avec :
   - ✅ Message de bienvenue automatique
   - ✅ 4 suggestions personnalisées
   - ✅ Bouton upload 📎
   - ✅ Historique conversations

4. Cliquer sur "🧾 Générer une facture"
5. La conversation démarre !

### 3. Tester d'Autres Agents
- **Agent Réseaux Sociaux** 📱 : Suggestions LinkedIn/Instagram
- **Agent Support Client** 🎧 : Suggestions tickets/FAQ
- **Agent RH** 👥 : Suggestions CV/fiches de poste

Chaque agent a ses propres suggestions ! ✨

---

## 📁 Structure Clé

```
.
├── app/
│   ├── page.tsx              # 🏠 Landing page
│   ├── api/chat/route.ts     # 🔌 API Chat
│   └── dashboard/            # 📊 Dashboard
│
├── components/Chat/          # 💬 5 composants chat
│   ├── ChatModal.tsx         # Modal ultra-arrondi (40px)
│   ├── ChatInput.tsx         # Input + bouton 📎
│   ├── ChatMessages.tsx      # Bulles messages
│   ├── ChatSuggestions.tsx   # Suggestions personnalisées
│   └── ChatSidebar.tsx       # Historique
│
├── data/agents.ts            # 🤖 8 agents + 32 suggestions
│
├── prisma/
│   ├── schema.prisma         # 📐 Schéma DB (6 modèles)
│   ├── dev.db                # 💾 SQLite database
│   └── seed.ts               # 🌱 Seed 8 agents
│
└── .claude/
    ├── progress.md           # 📊 Avancement global
    └── SESSION-*.md          # 📚 Doc détaillée
```

---

## 🔧 Commandes Utiles

### Développement
```bash
npm run dev              # Démarrer Next.js
npx prisma studio        # UI pour voir la DB
npm run build            # Build production
```

### Base de Données
```bash
npx prisma migrate dev   # Créer migration
npx prisma generate      # Générer client
npx tsx prisma/seed.ts   # Peupler DB
```

### n8n
```bash
N8N_SECURE_COOKIE=false n8n start    # Démarrer n8n
claude mcp list                       # Voir status MCP
```

---

## 🎯 Que Tester ?

### ✅ Fonctionnalités Complètes
- [x] Navigation (Home, Features, Pricing, Blog)
- [x] Chat Modal avec 8 agents différents
- [x] 32 suggestions personnalisées
- [x] Messages de bienvenue automatiques
- [x] Upload fichier 📎
- [x] Responsive mobile/desktop
- [x] Dashboard 4 pages
- [x] Pages footer (docs, FAQ, legal)

### ⏳ En Développement
- [ ] Connexion frontend → API
- [ ] Workflows n8n actifs
- [ ] Upload fichiers fonctionnel
- [ ] Authentification
- [ ] Paiements

---

## 📖 Documentation Complète

**Pour tout le détail technique** :
👉 Voir `.claude/SESSION-2025-10-22-NUIT.md`

**Contient** :
- ✅ 50+ étapes détaillées
- ✅ Code avant/après
- ✅ Toutes les commandes
- ✅ 6 problèmes + solutions
- ✅ Statistiques complètes
- ✅ Prochaines étapes

---

## 🆘 Problèmes Courants

### Le site ne démarre pas
```bash
# Réinstaller dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur Prisma
```bash
# Régénérer client
npx prisma generate
npx prisma migrate dev
```

### n8n ne démarre pas
```bash
# Vérifier le port
lsof -ti:5678 | xargs kill -9
N8N_SECURE_COOKIE=false n8n start
```

---

## 🎉 C'est Parti !

```bash
npm run dev
```

Ouvre http://localhost:3000 et teste les agents ! 🚀

---

**Questions ?** → Voir `.claude/SESSION-2025-10-22-NUIT.md` pour la doc complète
