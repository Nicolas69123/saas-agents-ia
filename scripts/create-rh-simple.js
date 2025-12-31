const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function create() {
  // Supprimer l'ancien
  console.log('1. Suppression ancien...');
  try {
    await fetch('http://localhost:5678/api/v1/workflows/AYX6DkrQP2JQKJbi', { method: 'DELETE', headers });
  } catch (e) {}

  console.log('2. Création workflow Agent RH...');

  const workflow = {
    name: 'Agent RH - Production',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'rh',
          responseMode: 'responseNode',
          options: {}
        },
        id: 'webhook',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [0, 0],
        webhookId: 'rh'
      },
      {
        parameters: {
          jsCode: `// Préparer le prompt pour Gemini
const input = $input.first().json;
const message = input.body?.chatInput || input.body?.message || 'Bonjour';
const history = input.body?.history || '';

const prompt = \`Tu es Sophie, experte RH avec 15 ans d'expérience en recrutement et gestion des talents.

Historique de la conversation:
\${history}

Message de l'utilisateur:
\${message}

Tes domaines d'expertise:
- Analyse et scoring de CV
- Rédaction de fiches de poste attractives
- Création de plans d'onboarding personnalisés
- Préparation d'entretiens (questions, grilles d'évaluation)
- Conseil en droit du travail et RH

Réponds de manière professionnelle, structurée et bienveillante.\`;

return [{ json: { prompt } }];`
        },
        id: 'prepare',
        name: 'Prepare Prompt',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [220, 0]
      },
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={"contents":[{"parts":[{"text":"{{ $json.prompt }}"}]}],"generationConfig":{"temperature":0.7,"maxOutputTokens":4096}}',
          options: {}
        },
        id: 'gemini',
        name: 'Gemini',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [440, 0]
      },
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis Sophie, votre experte RH. Comment puis-je vous aider ?';
return [{ json: { response: text } }];`
        },
        id: 'parse',
        name: 'Parse Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [660, 0]
      },
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ $json }}',
          options: {}
        },
        id: 'respond',
        name: 'Respond',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [880, 0]
      }
    ],
    connections: {
      Webhook: { main: [[{ node: 'Prepare Prompt', type: 'main', index: 0 }]] },
      'Prepare Prompt': { main: [[{ node: 'Gemini', type: 'main', index: 0 }]] },
      Gemini: { main: [[{ node: 'Parse Response', type: 'main', index: 0 }]] },
      'Parse Response': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
    },
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

  console.log('3. Activation...');
  await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });

  await new Promise(r => setTimeout(r, 2000));

  console.log('4. Test...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Crée-moi une fiche de poste pour un développeur Python senior' } })
  });

  console.log('   Status:', test.status);
  if (test.ok) {
    const text = await test.text();
    if (text) {
      const data = JSON.parse(text);
      console.log('   ✅ Réponse:', data.response?.slice(0, 200));
    } else {
      console.log('   ⚠️ Réponse vide');
    }
  } else {
    console.log('   ❌', (await test.text()).slice(0, 150));
  }

  console.log('\n✅ Webhook: http://localhost:5678/webhook/rh');
}

create().catch(console.error);
