/**
 * Ajoute des nodes de chat au workflow Agent RH existant
 * SANS supprimer les 56 nodes d'origine
 */

const fs = require('fs');
const path = require('path');

const N8N_API_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';

async function addChatNodes() {
  try {
    console.log('📥 Lecture du workflow Agent RH original...');

    const workflowPath = path.join(__dirname, '..', 'n8n-workflow-agent-rh.json');
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    console.log(`✅ Workflow chargé: "${workflow.name}"`);
    console.log(`📊 Nodes existants: ${workflow.nodes?.length || 0}`);

    // AJOUTER (pas remplacer) les nodes de chat
    const chatNodes = [
      {
        "parameters": {
          "httpMethod": "POST",
          "path": "agent-rh-chat",
          "responseMode": "lastNode",
          "options": {}
        },
        "id": "webhook-chat-entry",
        "name": "🌐 Webhook - Chat Entry",
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2.1,
        "position": [-1200, 600]
      },
      {
        "parameters": {
          "hasOutputParser": true,
          "options": {
            "systemMessage": `Tu es Sophie, experte RH. Tu as accès à un système d'analyse de CV automatique.

📜 HISTORIQUE:
{{ $json.body.history || "Nouvelle conversation" }}

MESSAGE:
{{ $json.body.chatInput || $json.body.message }}

🎯 FONCTIONNALITÉS DISPONIBLES:
1. **Analyse de CV automatique** : Si l'utilisateur mentionne "analyse ce CV" ou upload un fichier
2. **Conseil RH** : Fiches de poste, onboarding, questions d'entretien
3. **Aide recrutement** : Process, sourcing, évaluation candidats

🔍 SI L'UTILISATEUR DEMANDE D'ANALYSER UN CV:
- Réponds que le système va analyser le CV uploadé
- Le workflow existant va extraire: formation, expérience, compétences, coordonnées
- Tu recevras ensuite les résultats pour les présenter

📤 FORMAT RÉPONSE:
\`\`\`json
{
  "type_demande": "chat|analyse_cv|conseil_rh",
  "response": "Ta réponse en MARKDOWN",
  "action": "trigger_cv_analysis|none",
  "recommandations": []
}
\`\`\`

💼 Style: Expert RH bienveillant avec 10+ ans d'expérience.`
          }
        },
        "id": "ai-agent-chat",
        "name": "🤖 AI Agent - Conversation RH",
        "type": "@n8n/n8n-nodes-langchain.agent",
        "typeVersion": 1.6,
        "position": [-900, 600]
      },
      {
        "parameters": {
          "conditions": {
            "options": {
              "caseSensitive": false
            },
            "conditions": [
              {
                "id": "trigger-cv",
                "leftValue": "={{ $json.action }}",
                "rightValue": "trigger_cv_analysis",
                "operator": {
                  "type": "string",
                  "operation": "equals"
                }
              }
            ]
          }
        },
        "id": "router-action",
        "name": "🔀 Router - Action Type",
        "type": "n8n-nodes-base.if",
        "typeVersion": 2,
        "position": [-600, 600]
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={{ $json }}",
          "options": {}
        },
        "id": "respond-chat",
        "name": "📤 Respond - Chat",
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [-300, 500]
      }
    ];

    console.log(`\n➕ Ajout de ${chatNodes.length} nodes de chat...`);

    // AJOUTER les nodes (pas remplacer)
    workflow.nodes.push(...chatNodes);

    // AJOUTER les connexions
    if (!workflow.connections) {
      workflow.connections = {};
    }

    workflow.connections["🌐 Webhook - Chat Entry"] = {
      main: [[{ node: "🤖 AI Agent - Conversation RH", type: "main", index: 0 }]]
    };

    workflow.connections["🤖 AI Agent - Conversation RH"] = {
      main: [[{ node: "🔀 Router - Action Type", type: "main", index: 0 }]]
    };

    workflow.connections["🔀 Router - Action Type"] = {
      main: [
        [{ node: "Search files and folders2", type: "main", index: 0 }], // True = analyse CV
        [{ node: "📤 Respond - Chat", type: "main", index: 0 }]  // False = réponse directe
      ]
    };

    console.log(`✅ Total nodes après ajout: ${workflow.nodes.length}`);

    // Nettoyer les métadonnées pour l'API n8n
    delete workflow.id;
    delete workflow.createdAt;
    delete workflow.updatedAt;
    delete workflow.active;
    delete workflow.isArchived;

    // Sauvegarder le workflow modifié
    const outputPath = path.join(__dirname, '..', 'n8n-workflow-rh-with-chat.json');
    fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
    console.log(`\n💾 Workflow sauvegardé: ${outputPath}`);

    // Importer dans n8n
    console.log(`\n📤 Import vers n8n...`);

    const response = await fetch(`${N8N_API_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log('\n✅ WORKFLOW IMPORTÉ AVEC SUCCÈS !');
    console.log(`📝 ID: ${result.id}`);
    console.log(`📝 Nom: ${result.name}`);
    console.log(`📊 Total nodes: ${workflow.nodes.length} (56 originaux + ${chatNodes.length} nouveaux)`);

    console.log('\n🔗 Webhook URL: http://localhost:5678/webhook/agent-rh-chat');
    console.log('🌐 Ouvre: http://localhost:5678/workflow/' + result.id);

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Ouvre le workflow dans n8n');
    console.log('2. Configure le node "🤖 AI Agent - Conversation RH" avec Gemini');
    console.log('3. Configure les credentials Google Drive si nécessaire');
    console.log('4. Active le workflow');
    console.log('5. Teste depuis le chat du site !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addChatNodes();
