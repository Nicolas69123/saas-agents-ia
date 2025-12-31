const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function create() {
  // Supprimer les anciens workflows RH
  console.log('1. Nettoyage anciens workflows RH...');
  const list = await fetch('http://localhost:5678/api/v1/workflows', { headers });
  const wfs = await list.json();
  for (const wf of wfs.data || []) {
    if (wf.name.includes('Agent RH')) {
      await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}`, { method: 'DELETE', headers });
      console.log('   Supprimé:', wf.name);
    }
  }

  // Créer nouveau workflow propre
  console.log('2. Création workflow Agent RH avec Gemini 2.5...');

  const workflow = {
    name: 'Agent RH - Gemini 2.5',
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
        position: [250, 300],
        webhookId: 'rh-webhook'
      },
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          sendBody: true,
          specifyBody: 'json',
          jsonBody: `{
  "contents": [{
    "parts": [{
      "text": "Tu es Sophie, experte RH senior avec 15 ans d'expérience en recrutement et gestion des talents.\\n\\nHistorique conversation:\\n{{ $json.body.history || 'Nouvelle conversation' }}\\n\\nMessage de l'utilisateur:\\n{{ $json.body.chatInput || $json.body.message }}\\n\\nTes domaines d'expertise:\\n- Analyse et scoring de CV\\n- Rédaction de fiches de poste attractives\\n- Création de plans d'onboarding personnalisés\\n- Préparation d'entretiens (questions, grilles d'évaluation)\\n- Conseil en droit du travail et RH\\n\\nRéponds de manière professionnelle, structurée et bienveillante. Utilise des listes et du formatage quand c'est pertinent."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 4096
  }
}`,
          options: {}
        },
        name: 'Gemini 2.5 Flash',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [450, 300]
      },
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis Sophie, votre experte RH. Comment puis-je vous aider ?';
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
        name: 'Respond',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [850, 300]
      }
    ],
    connections: {
      Webhook: { main: [[{ node: 'Gemini 2.5 Flash', type: 'main', index: 0 }]] },
      'Gemini 2.5 Flash': { main: [[{ node: 'Format Response', type: 'main', index: 0 }]] },
      'Format Response': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' }
  };

  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    console.error('Erreur création:', await res.text());
    return;
  }

  const wf = await res.json();
  console.log('   ID:', wf.id);

  // Activer
  console.log('3. Activation...');
  await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });

  // Attendre
  await new Promise(r => setTimeout(r, 2000));

  // Test
  console.log('4. Test webhook http://localhost:5678/webhook/rh ...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Bonjour Sophie, peux-tu me créer une fiche de poste pour un développeur ?' } })
  });

  console.log('   Status:', test.status);
  if (test.ok) {
    const data = await test.json();
    console.log('   ✅ Réponse:', data.response?.slice(0, 150) + '...');
  } else {
    console.log('   ❌ Erreur:', (await test.text()).slice(0, 200));
  }

  console.log('\n✅ Webhook: http://localhost:5678/webhook/rh');
}

create().catch(console.error);
