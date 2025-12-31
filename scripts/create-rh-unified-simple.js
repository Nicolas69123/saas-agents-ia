const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTIwNzMwLCJleHAiOjE3Njk2NjI4MDB9.bQfsgYn3V2JLBJX-1x7me6Y0iPpoiKMcN0VnirONaKw';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function create() {
  console.log('🚀 Création workflow Agent RH Unifié (version simple)...\n');

  const workflow = {
    name: 'Agent RH - Unifié v2',
    nodes: [
      // 1. Webhook
      {
        parameters: {
          httpMethod: 'POST',
          path: 'rh',
          responseMode: 'responseNode',
          options: {}
        },
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [0, 300],
        webhookId: 'rh-v2'
      },

      // 2. Traitement complet dans un seul Code node
      {
        parameters: {
          jsCode: `const input = $input.first().json;
const body = input.body || input;
const message = body.chatInput || body.message || 'Bonjour';
const history = body.history || '';

// Construire le prompt
const prompt = \`Tu es Sophie, experte RH avec 15 ans d'expérience.

Historique: \${history}

Message: \${message}

Actions disponibles:
- schedule_interview: Planifier entretien (params: candidat, poste, date, heure)
- send_email: Envoyer email (params: destinataire, sujet, contenu)
- search_cv: Rechercher CV (params: criteres)
- create_job: Créer fiche de poste
- none: Conversation simple

Réponds en JSON: {"response": "texte", "action": "nom_action", "params": {...}}\`;

// Appeler Gemini
const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}';

const geminiResponse = await fetch(geminiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
  })
});

const geminiData = await geminiResponse.json();
const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

// Parser la réponse
let response = "Je suis Sophie, votre experte RH. Comment puis-je vous aider?";
let action = "none";
let params = {};

try {
  let jsonStr = text.trim();
  // Enlever les backticks markdown si présents
  jsonStr = jsonStr.replace(/\`\`\`json\\n?/g, '').replace(/\\n?\`\`\`/g, '');
  const match = jsonStr.match(/\\{[\\s\\S]*\\}/);
  if (match) {
    const parsed = JSON.parse(match[0]);
    response = parsed.response || response;
    action = parsed.action || "none";
    params = parsed.params || {};
  }
} catch (e) {
  response = text;
}

// Retourner le résultat
return [{ json: { response, action, params, success: true } }];`
        },
        name: 'Process Chat',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [250, 300]
      },

      // 3. Réponse
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ $json }}',
          options: {}
        },
        name: 'Respond',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [500, 300]
      }
    ],
    connections: {
      'Webhook': { main: [[{ node: 'Process Chat', type: 'main', index: 0 }]] },
      'Process Chat': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' }
  };

  console.log('1. Création du workflow...');
  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    console.error('Erreur:', await res.text());
    return;
  }

  const wf = await res.json();
  console.log('   ID:', wf.id);

  console.log('2. Activation...');
  const actRes = await fetch(\`http://localhost:5678/api/v1/workflows/\${wf.id}/activate\`, { method: 'POST', headers });
  const actData = await actRes.json();
  console.log('   Active:', actData.active);

  await new Promise(r => setTimeout(r, 2000));

  console.log('3. Test...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatInput: 'Bonjour Sophie, peux-tu me créer une fiche de poste pour un développeur React?' })
  });

  if (test.ok) {
    const data = await test.json();
    console.log('   ✅ Action:', data.action);
    console.log('   ✅ Réponse:', data.response?.slice(0, 150) + '...');
  } else {
    console.log('   ❌ Erreur:', test.status);
  }

  console.log('\\n✅ Workflow déployé!');
  console.log('   Webhook: http://localhost:5678/webhook/rh');
}

create().catch(console.error);
