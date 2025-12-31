/**
 * Import PROPRE du workflow Agent RH avec nodes de chat
 * Nettoie toutes les propriétés non-acceptées par l'API n8n
 */

const fs = require('fs');
const path = require('path');

const N8N_API_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';

function cleanNode(node) {
  // Garder seulement les propriétés acceptées
  const clean = {
    parameters: node.parameters || {},
    type: node.type,
    typeVersion: node.typeVersion,
    position: node.position,
    name: node.name
  };

  // Garder credentials si présent
  if (node.credentials) {
    clean.credentials = node.credentials;
  }

  return clean;
}

async function importWorkflow() {
  console.log('📥 Lecture du workflow Agent RH original...\n');

  const workflowPath = path.join(__dirname, '..', 'n8n-workflow-agent-rh.json');
  const original = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

  console.log(`✅ Workflow: "${original.name}"`);
  console.log(`📊 Nodes originaux: ${original.nodes.length}`);

  // Nettoyer tous les nodes existants
  const cleanedNodes = original.nodes.map(cleanNode);

  // Nodes de chat à AJOUTER
  const chatNodes = [
    {
      parameters: {
        httpMethod: "POST",
        path: "agent-rh-chat",
        responseMode: "lastNode",
        options: {}
      },
      name: "Webhook Chat RH",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2.1,
      position: [-1200, 600]
    },
    {
      parameters: {
        hasOutputParser: true,
        options: {
          systemMessage: "Tu es Sophie, experte RH. Historique: {{ $json.body.history || '' }}. Message: {{ $json.body.chatInput || $json.body.message }}. Réponds en JSON: {\"response\": \"...\", \"type\": \"chat|analyse_cv\"}"
        }
      },
      name: "AI Agent RH",
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 1.6,
      position: [-900, 600]
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: "={{ $json }}",
        options: {}
      },
      name: "Respond Chat",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.4,
      position: [-600, 600]
    }
  ];

  // Combiner: 56 originaux + 3 nouveaux = 59 nodes
  const allNodes = [...cleanedNodes, ...chatNodes];

  console.log(`➕ Nodes chat ajoutés: ${chatNodes.length}`);
  console.log(`📊 Total nodes: ${allNodes.length}`);

  // Connexions (garder originales + ajouter nouvelles)
  const connections = original.connections || {};

  connections["Webhook Chat RH"] = {
    main: [[{ node: "AI Agent RH", type: "main", index: 0 }]]
  };
  connections["AI Agent RH"] = {
    main: [[{ node: "Respond Chat", type: "main", index: 0 }]]
  };

  // Workflow propre pour l'API
  const cleanWorkflow = {
    name: "Agent RH - Site Web (avec Chat)",
    nodes: allNodes,
    connections: connections,
    settings: {
      executionOrder: "v1"
    }
  };

  console.log('\n📤 Import vers n8n...');

  const response = await fetch(`${N8N_API_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': N8N_API_KEY
    },
    body: JSON.stringify(cleanWorkflow)
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('❌ Erreur:', err);

    // Sauvegarder pour import manuel
    const outPath = path.join(__dirname, '..', 'n8n-workflow-rh-ready.json');
    fs.writeFileSync(outPath, JSON.stringify(cleanWorkflow, null, 2));
    console.log(`\n💾 Fichier sauvegardé pour import manuel: ${outPath}`);
    console.log('👉 Ouvre http://localhost:5678 → Import workflow → Sélectionne ce fichier');
    return;
  }

  const result = await response.json();
  console.log('\n✅ IMPORTÉ !');
  console.log(`📝 ID: ${result.id}`);
  console.log(`🔗 http://localhost:5678/workflow/${result.id}`);
  console.log(`🌐 Webhook: http://localhost:5678/webhook/agent-rh-chat`);
}

importWorkflow();
