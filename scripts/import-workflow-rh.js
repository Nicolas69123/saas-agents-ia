/**
 * Script pour importer le workflow Agent RH dans n8n
 *
 * Usage: node scripts/import-workflow-rh.js
 */

const fs = require('fs');
const path = require('path');

const N8N_API_URL = process.env.N8N_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';

async function importWorkflow() {
  try {
    console.log('📥 Lecture du fichier workflow Agent RH...');

    const workflowPath = path.join(__dirname, '..', 'n8n-workflow-agent-rh.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    console.log(`✅ Workflow chargé: ${workflowData.name || 'Agent RH'}`);
    console.log(`📊 Nombre de nodes: ${workflowData.nodes?.length || 0}`);

    // Ajouter un Webhook node au début du workflow pour le chat
    const webhookNode = {
      "parameters": {
        "httpMethod": "POST",
        "path": "agent-rh-chat",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": `webhook-rh-${Date.now()}`,
      "name": "Webhook - Chat Agent RH",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [-1000, 300],
      "webhookId": `agent-rh-chat-${Date.now()}`
    };

    // Ajouter un AI Agent Gemini pour le chat
    const aiAgentNode = {
      "parameters": {
        "hasOutputParser": true,
        "options": {
          "systemMessage": `Tu es Sophie, experte en Ressources Humaines et recrutement. Tu as accès à l'historique de la conversation.

📜 HISTORIQUE:
{{ $json.body.history || "Début de conversation" }}

🎯 FONCTIONNALITÉS:
1. **Analyse de CV** : Extraction complète d'infos (formation, expérience, compétences)
2. **Création offres d'emploi** : Fiches de poste attractives et conformes
3. **Onboarding** : Plans d'intégration personnalisés
4. **Entretiens** : Grilles d'évaluation et questions ciblées
5. **Conseils RH** : Droit du travail, gestion des talents, culture d'entreprise

🔍 DÉTECTION DE DEMANDE:
- "analyse ce CV" / "extrait les infos" → type_demande: "analyse_cv"
- "crée une fiche de poste" / "offre d'emploi" → type_demande: "fiche_poste"
- "plan d'onboarding" → type_demande: "onboarding"
- "questions d'entretien" → type_demande: "entretien"
- Questions générales → Réponds directement (pas de JSON)

📤 FORMAT JSON pour analyses:
{
  "type_demande": "analyse_cv|fiche_poste|onboarding|entretien",
  "contenu": "Le contenu généré en MARKDOWN",
  "informations_extraites": {
    "nom": "...",
    "competences": [...],
    "experience": "...",
    // etc.
  },
  "recommandations": ["conseil 1", "conseil 2"]
}

💼 Ton style: Professionnel, bienveillant, expert RH avec 10+ ans d'expérience.`
        }
      },
      "id": `ai-agent-rh-${Date.now()}`,
      "name": "AI Agent RH - Gemini",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [-700, 300],
      "typeVersion": 1.6
    };

    // Ajouter un Respond to Webhook node
    const respondNode = {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "id": `respond-rh-${Date.now()}`,
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [-400, 300]
    };

    // Insérer les nouveaux nodes au début
    if (!workflowData.nodes) {
      workflowData.nodes = [];
    }
    workflowData.nodes.unshift(webhookNode, aiAgentNode, respondNode);

    // Créer les connexions entre les nodes
    if (!workflowData.connections) {
      workflowData.connections = {};
    }
    workflowData.connections[webhookNode.name] = {
      main: [[{ node: aiAgentNode.name, type: 'main', index: 0 }]]
    };
    workflowData.connections[aiAgentNode.name] = {
      main: [[{ node: respondNode.name, type: 'main', index: 0 }]]
    };

    console.log('🔧 Nodes ajoutés pour le chat:');
    console.log('   1. Webhook - Chat Agent RH');
    console.log('   2. AI Agent RH - Gemini');
    console.log('   3. Respond to Webhook');

    // Importer le workflow via l'API n8n
    console.log(`\n📤 Import du workflow vers ${N8N_API_URL}...`);

    const response = await fetch(`${N8N_API_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(workflowData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API n8n (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    console.log('\n✅ WORKFLOW IMPORTÉ AVEC SUCCÈS !');
    console.log(`📝 ID: ${result.id}`);
    console.log(`📝 Nom: ${result.name}`);

    // Récupérer l'URL du webhook
    const webhookUrl = `${N8N_API_URL}/webhook/agent-rh-chat`;

    console.log('\n🔗 URL DU WEBHOOK:');
    console.log(`   ${webhookUrl}`);

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Ouvre n8n: http://localhost:5678');
    console.log('2. Trouve le workflow "Agent RH : A UTILISER SUR LE SITE WEB"');
    console.log('3. Active le workflow (toggle en haut à droite)');
    console.log(`4. Le webhook sera: ${webhookUrl}`);
    console.log('5. Mise à jour de config/n8n-webhooks.ts automatique...');

    // Retourner les infos pour mise à jour config
    return {
      success: true,
      workflowId: result.id,
      webhookUrl: webhookUrl,
      webhookPath: '/webhook/agent-rh-chat'
    };

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter
if (require.main === module) {
  importWorkflow();
}

module.exports = { importWorkflow };
