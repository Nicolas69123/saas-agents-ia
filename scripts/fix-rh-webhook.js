const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';
const WORKFLOW_ID = '9bb5YVgsMh8o71Ip';

async function fix() {
  console.log('1. Récupération du workflow RH...');
  const res = await fetch(`http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}`, { headers });
  const wf = await res.json();
  console.log(`   ${wf.name} - ${wf.nodes.length} nodes`);

  // Trouver le webhook et ajouter webhookId
  const webhookIdx = wf.nodes.findIndex(n => n.name === 'Webhook Chat RH');
  if (webhookIdx >= 0) {
    wf.nodes[webhookIdx].webhookId = 'agent-rh';
    console.log('2. WebhookId "agent-rh" ajouté au node Webhook');
  } else {
    console.log('   Webhook non trouvé!');
  }

  // Trouver l'AI Agent et le configurer avec Gemini
  const aiIdx = wf.nodes.findIndex(n => n.name === 'AI Agent RH');
  if (aiIdx >= 0) {
    const pos = wf.nodes[aiIdx].position;
    wf.nodes[aiIdx] = {
      parameters: {
        method: 'POST',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "contents": [{"parts": [{"text": "Tu es Sophie, experte RH avec 10+ ans d'expérience.\\n\\nHistorique conversation: {{ $json.body.history || '' }}\\n\\nMessage utilisateur: {{ $json.body.chatInput || $json.body.message }}\\n\\nTu aides pour: analyse de CV, création de fiches de poste, plans d'onboarding, questions d'entretien, conseils RH.\\n\\nRéponds de manière professionnelle et bienveillante."}]}],
  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
}`,
        options: {}
      },
      name: 'AI Agent RH',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos
    };
    console.log('3. AI Agent RH configuré avec Gemini API');
  }

  // Vérifier/ajouter le node de parsing
  let parseIdx = wf.nodes.findIndex(n => n.name === 'Parse Gemini Response');
  if (parseIdx < 0) {
    wf.nodes.push({
      parameters: {
        jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis Sophie, votre experte RH. Comment puis-je vous aider?';
return [{ json: { response: text } }];`
      },
      name: 'Parse Gemini Response',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-700, 600]
    });
    console.log('4. Node Parse Gemini Response ajouté');
  }

  // Mettre à jour les connexions
  wf.connections['Webhook Chat RH'] = { main: [[{ node: 'AI Agent RH', type: 'main', index: 0 }]] };
  wf.connections['AI Agent RH'] = { main: [[{ node: 'Parse Gemini Response', type: 'main', index: 0 }]] };
  wf.connections['Parse Gemini Response'] = { main: [[{ node: 'Respond Chat', type: 'main', index: 0 }]] };
  console.log('5. Connexions mises à jour');

  // Sauvegarder
  console.log('6. Sauvegarde...');
  const updateRes = await fetch(`http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings })
  });

  if (!updateRes.ok) {
    console.error('   Erreur:', await updateRes.text());
    return;
  }
  console.log('   OK');

  // Réactiver
  console.log('7. Réactivation...');
  await fetch(`http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}/deactivate`, { method: 'POST', headers });
  await new Promise(r => setTimeout(r, 500));
  await fetch(`http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}/activate`, { method: 'POST', headers });
  console.log('   OK');

  // Test
  await new Promise(r => setTimeout(r, 1000));
  console.log('8. Test webhook...');
  const test = await fetch('http://localhost:5678/webhook/agent-rh-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Bonjour Sophie' } })
  });
  console.log('   Status:', test.status);

  if (test.ok) {
    const data = await test.json();
    console.log('   Réponse:', data.response?.slice(0, 100) || JSON.stringify(data).slice(0, 100));
  } else {
    console.log('   Erreur:', (await test.text()).slice(0, 200));
  }
}

fix().catch(console.error);
