/**
 * Configure et active le workflow Agent RH
 */

const N8N_API_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';
const WORKFLOW_ID = '9bb5YVgsMh8o71Ip';
const GEMINI_API_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

async function configure() {
  const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY
  };

  // 1. Lister les credentials existantes
  console.log('📋 Credentials existantes...');
  const credRes = await fetch(`${N8N_API_URL}/api/v1/credentials`, { headers });
  const creds = await credRes.json();
  console.log('Credentials:', creds.data?.map(c => `${c.name} (${c.type})`).join(', ') || 'Aucune');

  // Chercher une credential Gemini/Google AI
  const geminiCred = creds.data?.find(c =>
    c.type.includes('gemini') || c.type.includes('googleAi') || c.type.includes('googlePalm')
  );

  // 2. Récupérer le workflow
  console.log('\n📥 Récupération du workflow...');
  const wfRes = await fetch(`${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`, { headers });
  const workflow = await wfRes.json();
  console.log(`Workflow: ${workflow.name} (${workflow.nodes.length} nodes)`);

  // 3. Trouver et modifier le node AI Agent RH
  const aiNodeIndex = workflow.nodes.findIndex(n => n.name === 'AI Agent RH');
  if (aiNodeIndex === -1) {
    console.error('❌ Node "AI Agent RH" non trouvé');
    return;
  }

  console.log('\n🔧 Configuration du node AI Agent RH...');

  // Configurer le node pour utiliser Gemini via HTTP Request
  // On va remplacer le node langchain par un HTTP Request vers Gemini API
  workflow.nodes[aiNodeIndex] = {
    parameters: {
      method: "POST",
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      authentication: "genericCredentialType",
      genericAuthType: "httpQueryAuth",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "Content-Type", value: "application/json" }
        ]
      },
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: "key", value: GEMINI_API_KEY }
        ]
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: `{
  "contents": [{
    "parts": [{
      "text": "Tu es Sophie, experte RH avec 10+ ans d'expérience.\\n\\nHistorique: {{ $json.body.history || 'Nouvelle conversation' }}\\n\\nMessage utilisateur: {{ $json.body.chatInput || $json.body.message }}\\n\\nRéponds de manière professionnelle et bienveillante. Tu peux aider avec: analyse de CV, fiches de poste, onboarding, questions d'entretien, conseils RH.\\n\\nRéponds en JSON: {\\\"response\\\": \\\"ta réponse ici\\\"}"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2048
  }
}`,
      options: {}
    },
    name: "AI Agent RH",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [-900, 600]
  };

  // Ajouter un node pour parser la réponse Gemini
  const parseNode = {
    parameters: {
      jsCode: `const geminiResponse = $input.first().json;
const text = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';

// Essayer de parser le JSON de la réponse
let response = text;
try {
  const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    response = parsed.response || text;
  }
} catch (e) {
  // Garder le texte brut
}

return [{ json: { response } }];`
    },
    name: "Parse Gemini Response",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [-700, 600]
  };

  // Insérer le node de parsing
  workflow.nodes.push(parseNode);

  // Mettre à jour les connexions
  workflow.connections["AI Agent RH"] = {
    main: [[{ node: "Parse Gemini Response", type: "main", index: 0 }]]
  };
  workflow.connections["Parse Gemini Response"] = {
    main: [[{ node: "Respond Chat", type: "main", index: 0 }]]
  };

  console.log('✅ Node AI configuré avec Gemini API');
  console.log(`📊 Total nodes: ${workflow.nodes.length}`);

  // 4. Sauvegarder le workflow
  console.log('\n💾 Sauvegarde du workflow...');
  const updateRes = await fetch(`${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings
    })
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error('❌ Erreur sauvegarde:', err);
    return;
  }
  console.log('✅ Workflow sauvegardé');

  // 5. Activer le workflow
  console.log('\n⚡ Activation du workflow...');
  const activateRes = await fetch(`${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {
    method: 'POST',
    headers
  });

  if (!activateRes.ok) {
    const err = await activateRes.text();
    console.error('❌ Erreur activation:', err);
    return;
  }
  console.log('✅ Workflow ACTIVÉ !');

  console.log('\n🎉 CONFIGURATION TERMINÉE !');
  console.log(`🔗 Webhook: ${N8N_API_URL}/webhook/agent-rh-chat`);
}

configure().catch(console.error);
