# 🚀 Guide de Configuration des Workflows n8n

## 📋 Vue d'ensemble

Ce guide explique comment créer les 8 workflows n8n pour les agents IA du SaaS.

---

## 🔧 Accès à n8n

1. **Démarrer n8n** (si pas déjà lancé) :
   ```bash
   N8N_SECURE_COOKIE=false n8n start
   ```

2. **Ouvrir l'interface** :
   - URL : http://localhost:5678
   - Email : nicolas@saas-agents-ia.fr
   - Password : [votre mot de passe]

---

## 🎯 Workflow 1 : Agent Comptable 📊

### Structure du Workflow

**Nodes à créer :**

1. **Webhook Trigger** (déclencheur)
   - Type : `Webhook`
   - HTTP Method : `POST`
   - Path : `comptable`
   - Response Mode : `Using 'Respond to Webhook' Node`

2. **Code Node** (traitement)
   - Type : `Code`
   - Mode : `Run Once for All Items`
   - Code JavaScript :
   ```javascript
   const userMessage = $input.first().json.body.message || "";
   const agentId = $input.first().json.body.agentId || "comptable";
   const conversationId = $input.first().json.body.conversationId || "";

   // Réponses intelligentes selon le message
   const responses = {
     facture: "📄 Parfait ! Pour générer une facture, j'ai besoin de :\n\n1. **Nom du client**\n2. **Prestations** (description + montant HT)\n3. **Date de facturation**\n4. **Numéro de facture** (ex: FAC-2025-001)\n\nVous pouvez me déposer un modèle ou me donner ces infos ! 💼",

     depense: "📊 Excellent ! Pour analyser vos dépenses :\n\n**Options :**\n• 📁 Déposez vos relevés bancaires (PDF/CSV)\n• 📈 Rapport détaillé par catégorie\n• ⚠️ Détection dépenses inhabituelles\n• 💡 Suggestions d'optimisation\n\nQuelle période analyser ? 📅",

     rapport: "📈 Rapport mensuel en préparation...\n\n**Inclus :**\n✅ CA du mois\n✅ Dépenses par catégorie\n✅ Marges et rentabilité\n✅ Comparatif mois précédent\n✅ Prévisions\n\nGraphiques visuels souhaités ? 📊",

     tva: "💶 Vérification TVA...\n\n**Contrôles :**\n1. ✅ TVA collectée (ventes)\n2. ✅ TVA déductible (achats)\n3. ✅ Solde à payer/récupérer\n4. ✅ Échéances déclaration\n\nDéposez vos factures pour analyse auto ! 📋",

     default: "Bonjour ! 📊 Agent Comptable à votre service.\n\n**Mes spécialités :**\n• 🧾 Factures professionnelles\n• 📊 Analyse dépenses\n• 📈 Rapports mensuels\n• 💶 Gestion TVA\n\nComment puis-je vous aider ? 💼"
   };

   const msgLower = userMessage.toLowerCase();
   let response = responses.default;

   if (msgLower.includes("facture")) response = responses.facture;
   else if (msgLower.includes("dépense") || msgLower.includes("depense") || msgLower.includes("cout") || msgLower.includes("analyse")) response = responses.depense;
   else if (msgLower.includes("rapport") || msgLower.includes("mensuel") || msgLower.includes("bilan")) response = responses.rapport;
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

3. **Respond to Webhook** (réponse)
   - Type : `Respond to Webhook`
   - Respond With : `JSON`
   - Response Body : `{{ $json }}`

### Connexions
- Webhook → Code → Respond to Webhook

### Activation
1. Cliquer sur **Save** (sauvegarder)
2. Activer le toggle **Active** en haut à droite
3. Copier l'URL du webhook : `http://localhost:5678/webhook/comptable`

---

## 🎯 Workflow 2 : Agent Trésorier 💰

Même structure que l'Agent Comptable avec modifications :

- **Path** : `tresorier`
- **Réponses adaptées** :
```javascript
const responses = {
  prevision: "💸 Prévision de trésorerie sur 3 mois...\n\n**Analyse :**\n• 📊 Flux entrants estimés\n• 📉 Flux sortants prévus\n• ⚖️ Solde prévisionnel\n• 🎯 Points d'attention\n\nDéposez vos fichiers pour analyse précise ! 📁",

  flux: "📊 Analyse de flux de trésorerie...\n\n**Vue d'ensemble :**\n• ✅ Entrées (encaissements)\n• ❌ Sorties (décaissements)\n• 📈 Évolution sur période\n• 💡 Recommandations\n\nQuelle période analyser ? 📅",

  alerte: "⚠️ Configuration des alertes...\n\n**Seuils disponibles :**\n• 🔴 Trésorerie critique (< X€)\n• 🟡 Attention (< Y€)\n• 🟢 Trésorerie saine (> Z€)\n• 📧 Notifications automatiques\n\nQuels seuils définir ? 🎯",

  optimisation: "💰 Suggestions d'optimisation...\n\n**Actions possibles :**\n• 📅 Délais de paiement clients\n• 💳 Gestion fournisseurs\n• 📊 Placement excédents\n• 🔄 Flux récurrents\n\nAnalyse complète souhaitée ? 📈",

  default: "Bonjour ! 💰 Agent Trésorier à votre service.\n\n**Mes spécialités :**\n• 💸 Prévisions de trésorerie\n• 📊 Analyse des flux\n• ⚠️ Alertes de trésorerie\n• 💡 Optimisation\n\nComment puis-je vous aider ? 📈"
};

const msgLower = userMessage.toLowerCase();
let response = responses.default;

if (msgLower.includes("prevision") || msgLower.includes("prévoir") || msgLower.includes("projection")) response = responses.prevision;
else if (msgLower.includes("flux") || msgLower.includes("entree") || msgLower.includes("sortie")) response = responses.flux;
else if (msgLower.includes("alerte") || msgLower.includes("seuil") || msgLower.includes("notification")) response = responses.alerte;
else if (msgLower.includes("optimis") || msgLower.includes("amelior") || msgLower.includes("suggestion")) response = responses.optimisation;
```

---

## 🎯 Workflow 3 : Agent Investissements 📈

- **Path** : `investissements`
- **Réponses** : Analyse portefeuille, recommandations, diversification, rapports

---

## 🎯 Workflow 4 : Agent Réseaux Sociaux 📱

- **Path** : `reseaux-sociaux`
- **Réponses** : Posts LinkedIn, captions Instagram, planning contenu, analytics

---

## 🎯 Workflow 5 : Agent Email Marketing ✉️

- **Path** : `email-marketing`
- **Réponses** : Newsletters, campagnes promo, analytics, optimisation

---

## 🎯 Workflow 6 : Agent RH 👥

- **Path** : `ressources-humaines`
- **Réponses** : Fiches de poste, analyse CV, onboarding, entretiens

---

## 🎯 Workflow 7 : Agent Support Client 🎧

- **Path** : `support-client`
- **Réponses** : Réponses types, traitement tickets, FAQ, satisfaction

---

## 🎯 Workflow 8 : Agent Téléphonique ☎️

- **Path** : `telephonique`
- **Réponses** : Scripts d'appel, messages vocaux, analytics, planification

---

## ✅ Checklist de Vérification

Après avoir créé chaque workflow :

- [ ] Workflow sauvegardé
- [ ] Toggle "Active" activé (en haut à droite)
- [ ] Webhook URL copiée
- [ ] Test curl réussi :
  ```bash
  curl -X POST http://localhost:5678/webhook/[path] \
    -H "Content-Type: application/json" \
    -d '{"message": "test", "agentId": "xxx", "conversationId": "test-123"}'
  ```

---

## 📝 Mapping des Webhooks

Ajouter dans `/app/api/chat/route.ts` :

```typescript
const webhookUrls: Record<string, string> = {
  'comptable': 'http://localhost:5678/webhook/comptable',
  'tresorier': 'http://localhost:5678/webhook/tresorier',
  'investissements': 'http://localhost:5678/webhook/investissements',
  'reseaux-sociaux': 'http://localhost:5678/webhook/reseaux-sociaux',
  'email-marketing': 'http://localhost:5678/webhook/email-marketing',
  'ressources-humaines': 'http://localhost:5678/webhook/ressources-humaines',
  'support-client': 'http://localhost:5678/webhook/support-client',
  'telephonique': 'http://localhost:5678/webhook/telephonique',
}
```

---

## 🚀 Prochaines Étapes

1. **Phase 1** : Workflows simples avec réponses pré-définies ✅
2. **Phase 2** : Intégration Claude API / DeepSeek pour vraies réponses IA
3. **Phase 3** : Ajout de nodes complexes (génération PDF, envoi emails, etc.)
4. **Phase 4** : Intégrations tierces (Stripe, SendGrid, Google Drive, etc.)

---

## 💡 Tips

- Utiliser le bouton "Execute Workflow" pour tester avant activation
- Consulter les logs d'exécution dans n8n (menu Executions)
- Sauvegarder régulièrement les workflows
- Exporter les workflows en JSON pour backup

---

**📚 Documentation complète** : https://docs.n8n.io
