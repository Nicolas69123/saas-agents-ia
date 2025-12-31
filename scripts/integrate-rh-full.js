const fs = require('fs');
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function integrate() {
  console.log('1. Chargement workflow original (56 nodes)...');
  const original = JSON.parse(fs.readFileSync('n8n-workflow-agent-rh.json', 'utf8'));
  console.log('   Nodes:', original.nodes.length);

  // Nettoyer les nodes (enlever les propriétés non acceptées par l'API)
  const cleanNode = (node) => ({
    parameters: node.parameters || {},
    name: node.name,
    type: node.type,
    typeVersion: node.typeVersion,
    position: node.position,
    ...(node.credentials && { credentials: node.credentials }),
    ...(node.webhookId && { webhookId: node.webhookId })
  });

  const cleanedNodes = original.nodes.map(cleanNode);

  console.log('2. Ajout des 5 nodes de chat...');

  // Position des nouveaux nodes (à gauche du workflow existant)
  const chatNodes = [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'rh',
        responseMode: 'responseNode',
        options: {}
      },
      name: 'Chat Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [-1400, 300],
      webhookId: 'rh-chat'
    },
    {
      parameters: {
        jsCode: `const input = $input.first().json;
const message = input.body?.chatInput || input.body?.message || 'Bonjour';
const history = input.body?.history || '';

const prompt = \`Tu es Sophie, experte RH avec 15 ans d'expérience.

Historique: \${history}

Message utilisateur: \${message}

Tu as accès à un système complet de gestion RH:
- Analyse automatique de CV (Google Drive)
- Base de données candidats (Airtable)
- Gestion des entretiens (Google Calendar)
- Communication candidats (Gmail)

Si l'utilisateur demande d'analyser un CV ou de gérer des candidatures, indique-lui comment uploader le CV.
Sinon, réponds à sa question RH de manière professionnelle.

Réponds en JSON: {"response": "ta réponse", "action": "none|analyze_cv|schedule_interview"}\`;

const geminiBody = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
};

return [{ json: { geminiBody: JSON.stringify(geminiBody), originalMessage: message } }];`
      },
      name: 'Prepare Chat',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-1180, 300]
    },
    {
      parameters: {
        method: 'POST',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ $json.geminiBody }}',
        options: {}
      },
      name: 'Gemini Chat',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [-960, 300]
    },
    {
      parameters: {
        jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || '';

let response = text;
let action = 'none';

try {
  const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    response = parsed.response || text;
    action = parsed.action || 'none';
  }
} catch (e) {
  // Garder le texte brut
}

return [{ json: { response, action } }];`
      },
      name: 'Parse Chat Response',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-740, 300]
    },
    {
      parameters: {
        respondWith: 'json',
        responseBody: '={{ $json }}',
        options: {}
      },
      name: 'Chat Respond',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [-520, 300]
    }
  ];

  // Combiner les nodes
  const allNodes = [...chatNodes, ...cleanedNodes];
  console.log('   Total nodes:', allNodes.length);

  // Connexions: garder les originales + ajouter les nouvelles pour le chat
  const connections = original.connections || {};

  // Ajouter les connexions du chat
  connections['Chat Webhook'] = { main: [[{ node: 'Prepare Chat', type: 'main', index: 0 }]] };
  connections['Prepare Chat'] = { main: [[{ node: 'Gemini Chat', type: 'main', index: 0 }]] };
  connections['Gemini Chat'] = { main: [[{ node: 'Parse Chat Response', type: 'main', index: 0 }]] };
  connections['Parse Chat Response'] = { main: [[{ node: 'Chat Respond', type: 'main', index: 0 }]] };

  console.log('3. Suppression ancien workflow simple...');
  try {
    await fetch('http://localhost:5678/api/v1/workflows/FvzW9VPgHMV87tOa', { method: 'DELETE', headers });
  } catch (e) {}

  console.log('4. Import du workflow complet...');
  const workflow = {
    name: 'Agent RH - Complet (CV + Chat)',
    nodes: allNodes,
    connections: connections,
    settings: { executionOrder: 'v1' }
  };

  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    console.error('Erreur:', await res.text());
    return;
  }

  const wf = await res.json();
  console.log('   ID:', wf.id);
  console.log('   Nodes importés:', wf.nodes?.length || allNodes.length);

  console.log('5. Activation...');
  await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });

  await new Promise(r => setTimeout(r, 2000));

  console.log('6. Test webhook...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Bonjour Sophie, comment analyser un CV ?' } })
  });

  console.log('   Status:', test.status);
  if (test.ok) {
    const data = await test.json();
    console.log('   ✅ Réponse:', data.response?.slice(0, 150));
  }

  console.log('\n✅ Workflow complet importé !');
  console.log('   - 56 nodes originaux (CV, Airtable, Gmail, Calendar...)');
  console.log('   - 5 nodes chat (Webhook, Gemini, Respond)');
  console.log('   - Webhook: http://localhost:5678/webhook/rh');
}

integrate().catch(console.error);
