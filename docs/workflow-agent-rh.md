# Workflow Agent RH (Ressources Humaines)

> Documentation technique du workflow n8n pour l'Agent RH Claire

## Vue d'ensemble

L'Agent RH "Claire" gère les processus de recrutement, l'onboarding des nouveaux employés, et peut également générer du contenu RH pour les réseaux sociaux (offres d'emploi, marque employeur).

---

## Architecture du Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Chat Next.js  │────▶│  Webhook n8n    │────▶│   Gemini API    │
│   /chat?agent=6 │     │  /ressources-   │     │  (Analyse + Gen)│
│                 │     │   humaines      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────────────────────────┐
                        │         Réponse Intelligente        │
                        │  - Analyse CV                       │
                        │  - Génération offre emploi          │
                        │  - Posts marque employeur           │
                        │  - Conseils onboarding              │
                        └─────────────────────────────────────┘
```

---

## Fonctionnalités de l'Agent

### 1. Analyse de CV

Claire peut analyser les CV et fournir :
- Résumé des compétences clés
- Points forts du candidat
- Points d'amélioration
- Score de matching avec un poste

**Exemple de prompt** :
```
"Analyse ce CV pour un poste de développeur React"
```

### 2. Génération d'Offres d'Emploi

Création automatique d'offres d'emploi optimisées :
- Titre accrocheur
- Description du poste
- Compétences requises
- Avantages proposés

**Exemple de prompt** :
```
"Crée une offre d'emploi pour un Product Manager senior"
```

### 3. Posts Marque Employeur

Génération de contenu RH pour les réseaux sociaux :
- Posts LinkedIn entreprise
- Témoignages employés
- Événements internes
- Culture d'entreprise

**Exemple de prompt** :
```
"Génère un post LinkedIn pour promouvoir notre culture d'entreprise"
```

### 4. Guide d'Onboarding

Création de checklist et guides pour les nouveaux employés :
- Première semaine
- Documentation à fournir
- Formations obligatoires
- Contacts clés

---

## Composants du Workflow n8n

### 1. Webhook Trigger

**URL** : `http://localhost:5678/webhook/ressources-humaines`

**Payload** :
```json
{
  "message": "Crée une offre d'emploi pour développeur",
  "agentId": 6,
  "attachments": []  // CV en base64 si analyse
}
```

### 2. Nœud Router - Détection d'Intention

```javascript
const message = $input.first().json.message.toLowerCase();

let intent = 'general';

if (message.includes('cv') || message.includes('candidat')) {
  intent = 'cv_analysis';
} else if (message.includes('offre') || message.includes('emploi') || message.includes('poste')) {
  intent = 'job_offer';
} else if (message.includes('post') || message.includes('linkedin') || message.includes('marque employeur')) {
  intent = 'employer_branding';
} else if (message.includes('onboarding') || message.includes('intégration')) {
  intent = 'onboarding';
}

return { intent, message };
```

### 3. Nœud Gemini - Génération

**Prompt système pour offres d'emploi** :
```
Tu es Claire, experte RH chez OmnIA.
Génère une offre d'emploi professionnelle et attractive.

Structure :
1. Titre du poste (accrocheur)
2. À propos de l'entreprise (2-3 phrases)
3. Missions principales (5-7 points)
4. Profil recherché (compétences + soft skills)
5. Ce que nous offrons (avantages)
6. Process de recrutement

Ton : professionnel mais chaleureux
```

**Prompt pour posts LinkedIn RH** :
```
Tu es Claire, experte RH chez OmnIA.
Génère un post LinkedIn pour la marque employeur.

Objectif : Attirer des talents et montrer notre culture
Ton : authentique, engageant, humain
Inclure : emojis, hashtags RH, call-to-action
```

### 4. Génération d'Images (Optionnel)

Pour les posts marque employeur, génération d'images :
- Photos d'équipe stylisées
- Visuels "We're hiring"
- Infographies culture d'entreprise

---

## Intégration avec le Site

### Configuration du Webhook

```typescript
// config/n8n-webhooks.ts
export const webhookConfig = {
  6: {  // Agent Claire - RH
    name: "ressources-humaines",
    path: "/webhook/ressources-humaines",
    isActive: true,
    description: "Agent RH - Recrutement, Onboarding, Marque Employeur"
  }
};
```

### Page Chat

L'agent RH est accessible via `/chat?agent=6` :

```typescript
// Sélection de l'agent Claire
const agent = agents.find(a => a.id === 6);
// agent.name = "Claire"
// agent.role = "Agent RH"
```

---

## Templates de Réponses

### Offre d'Emploi

```markdown
# 🚀 [TITRE DU POSTE] - [LIEU]

## À propos de nous
[Description entreprise]

## Vos missions
- Mission 1
- Mission 2
- Mission 3

## Profil recherché
**Compétences techniques :**
- Compétence 1
- Compétence 2

**Soft skills :**
- Soft skill 1
- Soft skill 2

## Ce que nous offrons
✨ [Avantage 1]
🏠 [Avantage 2]
📈 [Avantage 3]

## Process de recrutement
1. Entretien RH (30 min)
2. Test technique (1h)
3. Entretien équipe (1h)
4. Offre !

📩 Postulez : [email]
```

### Post Marque Employeur

```markdown
🎉 [Titre accrocheur]

[Contenu du post - 150-200 mots]

[Appel à l'action]

#Recrutement #OnRecrute #VieEnEntreprise #RH #Emploi
```

---

## Workflow n8n Détaillé

### Fichier : `n8n-workflow-agent-rh.json`

```json
{
  "name": "Agent RH - Claire",
  "nodes": [
    {
      "name": "Webhook RH",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "ressources-humaines",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Router",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Détection d'intention..."
      }
    },
    {
      "name": "Gemini RH",
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "parameters": {
        "modelName": "gemini-2.0-flash-exp"
      }
    },
    {
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json"
      }
    }
  ]
}
```

---

## Exemples d'Utilisation

### Exemple 1 : Créer une offre d'emploi

**Input utilisateur** :
```
Crée une offre d'emploi pour un développeur Full-Stack React/Node.js,
3 ans d'expérience minimum, télétravail possible, Paris
```

**Output Claire** :
```
# 🚀 Développeur Full-Stack React/Node.js (H/F) - Paris

## À propos de nous
OmnIA révolutionne l'automatisation des entreprises grâce à l'IA.
Rejoignez une équipe passionnée et innovante !

## Vos missions
- Développer de nouvelles fonctionnalités front-end (React, TypeScript)
- Concevoir des APIs robustes (Node.js, Express)
- Participer aux code reviews et à l'amélioration continue
- Collaborer avec l'équipe produit sur les spécifications

## Profil recherché
**Technique :**
- 3+ ans d'expérience React & Node.js
- TypeScript, PostgreSQL
- Git, CI/CD

**Soft skills :**
- Autonomie et proactivité
- Esprit d'équipe

## Ce que nous offrons
✨ Salaire : 50-65K€ selon profil
🏠 Télétravail flexible (3j/semaine)
📈 Évolution rapide dans une scale-up

📩 Postulez : jobs@omnia.ai
```

### Exemple 2 : Post LinkedIn Marque Employeur

**Input utilisateur** :
```
Génère un post LinkedIn pour annoncer qu'on recrute 5 développeurs
```

**Output Claire** :
```
🚀 On agrandit l'équipe tech !

Chez OmnIA, on construit les agents IA du futur.
Et pour ça, on cherche 5 développeurs passionnés pour rejoindre l'aventure !

Ce qui vous attend :
✅ Stack moderne (React, Node.js, TypeScript)
✅ Projets IA innovants
✅ Équipe bienveillante
✅ Télétravail flexible

🎯 Vous êtes curieux, autonome, et l'IA vous fascine ?
On veut vous rencontrer !

👉 Postulez : lien dans les commentaires

#Recrutement #Tech #Développeur #IA #OnRecrute #Startup #React
```

---

## Troubleshooting

### L'agent ne répond pas
1. Vérifier que n8n est actif : `http://localhost:5678`
2. Vérifier le webhook : `curl -X POST http://localhost:5678/webhook/ressources-humaines`
3. Consulter les logs n8n

### Réponses génériques
- Affiner le prompt système dans le nœud Gemini
- Ajouter plus de contexte dans le message utilisateur
- Vérifier que l'intention est bien détectée

### Images non générées
- Activer la génération d'images dans le workflow
- Vérifier les quotas API Gemini

---

## Fichiers Associés

- `n8n-workflow-agent-rh.json` - Workflow n8n complet
- `config/n8n-webhooks.ts` - Configuration webhook
- `AGENT-RH-SETUP.md` - Guide de configuration rapide
- `scripts/create-rh-workflow.js` - Script de création du workflow
