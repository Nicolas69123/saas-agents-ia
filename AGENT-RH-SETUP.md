# 🎯 Configuration Agent RH - Instructions Complètes

## ✅ Ce qui est déjà fait

1. ✅ Workflow "Agent RH - Chat Web" créé dans n8n (ID: `Ee4Fa5PPNnemPVM8`)
2. ✅ Webhook configuré: `/webhook/agent-rh-chat`
3. ✅ Node AI Agent RH avec prompt spécialisé RH ajouté
4. ✅ Configuration site mise à jour (`config/n8n-webhooks.ts` + `app/api/chat/route.ts`)

---

## 🚀 Prochaines étapes (à faire MAINTENANT)

### Étape 1: Activer le workflow dans n8n

1. **Ouvre n8n** dans ton navigateur:
   ```
   http://localhost:5678/workflow/Ee4Fa5PPNnemPVM8
   ```

2. **Configure le node "AI Agent RH"**:
   - Clique sur le node "AI Agent RH"
   - Dans le panneau de droite:
     - **Model**: Sélectionne ton modèle Gemini (ex: `gemini-1.5-flash` ou `gemini-2.0-flash`)
     - **Credentials**: Ajoute tes credentials Google Gemini API
       - Clique sur "+ Create New Credential"
       - Sélectionne "Google Gemini API"
       - Colle ta clé API: `AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I`
   - Sauvegarde le node

3. **Active le workflow**:
   - Toggle en haut à droite: **OFF → ON** ⚡
   - Le workflow doit passer en vert "Active"
   - Le webhook sera maintenant enregistré: `http://localhost:5678/webhook/agent-rh-chat`

### Étape 2: Tester le webhook

Exécute ce script de test:
```bash
node scripts/test-agent-rh.js
```

Tu devrais voir:
```
✅ Succès (XXXms)
📊 Réponse: { ... }
```

### Étape 3: Tester depuis le site

1. Lance le site Next.js (s'il n'est pas déjà lancé):
   ```bash
   npm run dev
   ```

2. Ouvre le site: `http://localhost:3000`

3. Ouvre le chat et sélectionne **"Agent RH"**

4. Envoie un message test:
   ```
   Bonjour, peux-tu m'aider à créer une fiche de poste pour un développeur Full Stack ?
   ```

5. Tu devrais recevoir une réponse personnalisée de Sophie, l'experte RH ! 🎉

---

## 🔧 Dépannage

### Erreur "webhook is not registered"
➡️ **Solution**: Le workflow n'est pas activé dans n8n. Suis l'Étape 1.

### Erreur "Model not found"
➡️ **Solution**: Configure le modèle Gemini dans le node "AI Agent RH".

### Erreur 500 dans le chat
➡️ **Solution**: Vérifie les logs n8n et les logs Next.js (`npm run dev`).

### Le workflow ne répond pas
➡️ **Solution**:
1. Vérifie que n8n tourne: `http://localhost:5678`
2. Vérifie que le workflow est bien "Active" (vert)
3. Teste directement le webhook avec `scripts/test-agent-rh.js`

---

## 📊 Architecture

```
User (Site Next.js)
    ↓
    📱 Chat Modal (Agent RH sélectionné)
    ↓
    🌐 API Route: /api/chat
    ↓
    🔗 Webhook n8n: http://localhost:5678/webhook/agent-rh-chat
    ↓
    🤖 Workflow n8n "Agent RH - Chat Web"
        ├─ Webhook - Chat RH (reçoit le message)
        ├─ AI Agent RH (Gemini - analyse + génère réponse)
        └─ Respond to Webhook (retourne JSON)
    ↓
    📱 Chat affiche la réponse
```

---

## 📁 Fichiers modifiés

- ✅ `config/n8n-webhooks.ts` - Webhook Agent RH activé
- ✅ `app/api/chat/route.ts` - Route API avec support Agent RH
- ✅ `scripts/create-simple-rh-workflow.js` - Script création workflow
- ✅ `scripts/test-agent-rh.js` - Script de test
- ✅ `n8n-workflow-agent-rh.json` - Workflow original (backup)

---

## 🎯 Workflow n8n créé

**ID**: `Ee4Fa5PPNnemPVM8`
**Nom**: "Agent RH - Chat Web"
**URL**: http://localhost:5678/workflow/Ee4Fa5PPNnemPVM8

**Nodes**:
1. **Webhook - Chat RH** - Reçoit les messages du site
2. **AI Agent RH** - Gemini avec prompt spécialisé RH
3. **Respond to Webhook** - Retourne la réponse JSON

**Prompt AI Agent RH**:
- Expert RH nommé "Sophie"
- Compétences: Analyse CV, Fiches de poste, Onboarding, Entretiens
- Format JSON structuré pour les réponses
- Accès à l'historique de conversation

---

## 💡 Fonctionnalités de l'Agent RH

L'Agent RH (Sophie) peut:

1. 📄 **Analyser des CV** - Extraction d'informations (formation, expérience, compétences)
2. 📝 **Créer des fiches de poste** - Offres d'emploi attractives et conformes
3. 🎓 **Plans d'onboarding** - Intégration personnalisée des nouveaux employés
4. 💬 **Questions d'entretien** - Grilles d'évaluation ciblées
5. 💼 **Conseils RH** - Droit du travail, gestion des talents, culture d'entreprise

**Exemples de demandes**:
- "Analyse ce CV et extrait les compétences principales"
- "Crée une fiche de poste pour un Data Scientist"
- "Génère un plan d'onboarding pour un développeur junior"
- "Quelles questions poser en entretien pour un Product Manager ?"

---

## 🔐 Sécurité

- ⚠️ La clé API Gemini est hardcodée dans le script pour le test
- ✅ En production, utilise des variables d'environnement (`.env.local`)
- ✅ N'expose jamais les clés API dans le code versionné

---

**🎉 Une fois le workflow activé, l'Agent RH sera opérationnel sur le site ! 🚀**
