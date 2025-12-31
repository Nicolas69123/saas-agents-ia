const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function create() {
  // Supprimer l'ancien
  console.log('1. Suppression ancien workflow RH...');
  await fetch('http://localhost:5678/api/v1/workflows/QHvZX8AoYGZAjlHs', { method: 'DELETE', headers });

  console.log('2. Création workflow Agent RH (copie structure marketing)...');

  const workflow = {
    name: 'Agent RH - Production',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'rh',
          responseMode: 'responseNode',  // Comme le marketing!
          options: {}
        },
        id: 'webhook-rh',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [0, 0],
        webhookId: 'rh-webhook'
      },
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          sendBody: true,
          specifyBody: 'json',
          jsonBody: `{
  "contents": [{"parts": [{"text": "Tu es Sophie, experte RH avec 15 ans d'expérience.\\n\\nHistorique: {{ $json.body.history || '' }}\\n\\nMessage: {{ $json.body.chatInput || $json.body.message }}\\n\\nExpertise: analyse CV, fiches de poste, onboarding, entretiens, conseil RH.\\n\\nRéponds professionnellement."}]}],
  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 4096}
}`,
          options: {}
        },
        id: 'gemini',
        name: 'Gemini',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [220, 0]
      },
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis Sophie, votre experte RH.';
return [{ json: { response: text } }];`
        },
        id: 'parse',
        name: 'Parse',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [440, 0]
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
        position: [660, 0]
      }
    ],
    connections: {
      Webhook: { main: [[{ node: 'Gemini', type: 'main', index: 0 }]] },
      Gemini: { main: [[{ node: 'Parse', type: 'main', index: 0 }]] },
      Parse: { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
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
    body: JSON.stringify({ body: { chatInput: 'Bonjour Sophie !' } })
  });

  console.log('   Status:', test.status);
  if (test.ok) {
    const data = await test.json();
    console.log('   ✅', data.response?.slice(0, 100));
  } else {
    console.log('   ❌', (await test.text()).slice(0, 150));
  }
}

create().catch(console.error);
