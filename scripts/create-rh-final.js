const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function create() {
  const workflow = {
    name: 'Agent RH - Production',
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'rh',
          responseMode: 'lastNode',
          options: {}
        },
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [250, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          sendHeaders: true,
          headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }] },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: `{
  "contents": [{"parts": [{"text": "Tu es Sophie, experte RH avec 10+ ans d'expérience. Tu aides pour: analyse CV, fiches de poste, onboarding, entretiens.\\n\\nMessage: {{ $json.body.chatInput }}\\n\\nRéponds de manière professionnelle."}]}],
  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024}
}`,
          options: {}
        },
        name: 'Gemini API',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [450, 300]
      },
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis Sophie, votre experte RH. Comment puis-je vous aider?';
return [{ json: { response: text } }];`
        },
        name: 'Format Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300]
      },
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ $json }}',
          options: {}
        },
        name: 'Send Response',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [850, 300]
      }
    ],
    connections: {
      Webhook: { main: [[{ node: 'Gemini API', type: 'main', index: 0 }]] },
      'Gemini API': { main: [[{ node: 'Format Response', type: 'main', index: 0 }]] },
      'Format Response': { main: [[{ node: 'Send Response', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' }
  };

  console.log('1. Création du workflow...');
  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    console.error('Erreur création:', await res.text());
    return;
  }

  const wf = await res.json();
  console.log('   ID:', wf.id);

  console.log('2. Activation...');
  const actRes = await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });
  if (!actRes.ok) {
    console.error('Erreur activation:', await actRes.text());
    return;
  }
  console.log('   OK');

  // Attendre un peu
  await new Promise(r => setTimeout(r, 1000));

  console.log('3. Test du webhook...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Aide-moi à créer une fiche de poste pour développeur' } })
  });

  console.log('   Status:', test.status);
  if (test.ok) {
    const data = await test.json();
    console.log('   Réponse:', data.response?.slice(0, 200) + '...');
  } else {
    console.error('   Erreur:', await test.text());
  }

  console.log('\n✅ Webhook URL: http://localhost:5678/webhook/rh');
}

create().catch(console.error);
