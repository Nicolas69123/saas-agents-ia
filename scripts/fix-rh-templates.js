const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function fix() {
  console.log('1. Récupération workflow...');
  const res = await fetch('http://localhost:5678/api/v1/workflows/AYX6DkrQP2JQKJbi', { headers });
  const wf = await res.json();

  // Trouver le node Gemini et corriger le jsonBody
  const geminiIdx = wf.nodes.findIndex(n => n.name === 'Gemini');
  if (geminiIdx >= 0) {
    // Utiliser une expression n8n pour construire le JSON dynamiquement
    wf.nodes[geminiIdx].parameters.jsonBody = `={
  "contents": [{"parts": [{"text": "Tu es Sophie, experte RH avec 15 ans d'expérience.\\n\\nHistorique: " + ($json.body.history || "") + "\\n\\nMessage: " + ($json.body.chatInput || $json.body.message || "") + "\\n\\nExpertise: analyse CV, fiches de poste, onboarding, entretiens, conseil RH.\\n\\nRéponds professionnellement et de manière structurée."}]}],
  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 4096}
}`;
    console.log('2. Template corrigé');
  }

  // Sauvegarder
  console.log('3. Sauvegarde...');
  const updateRes = await fetch('http://localhost:5678/api/v1/workflows/AYX6DkrQP2JQKJbi', {
    method: 'PUT', headers,
    body: JSON.stringify({ name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings })
  });

  if (!updateRes.ok) {
    console.error('Erreur:', await updateRes.text());
    return;
  }

  // Réactiver
  console.log('4. Réactivation...');
  await fetch('http://localhost:5678/api/v1/workflows/AYX6DkrQP2JQKJbi/deactivate', { method: 'POST', headers });
  await new Promise(r => setTimeout(r, 500));
  await fetch('http://localhost:5678/api/v1/workflows/AYX6DkrQP2JQKJbi/activate', { method: 'POST', headers });

  // Test
  await new Promise(r => setTimeout(r, 1000));
  console.log('5. Test...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: { chatInput: 'Crée-moi une fiche de poste pour un développeur Python senior', history: '' } })
  });

  if (test.ok) {
    const data = await test.json();
    console.log('✅ Réponse:', data.response?.slice(0, 200));
  } else {
    console.log('❌', await test.text());
  }
}

fix().catch(console.error);
