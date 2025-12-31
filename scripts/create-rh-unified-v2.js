const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTIwNzMwLCJleHAiOjE3Njk2NjI4MDB9.bQfsgYn3V2JLBJX-1x7me6Y0iPpoiKMcN0VnirONaKw';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

// Credentials
const CREDS = {
  calendar: 'EDbM0JCfgyqaEFgV',
  gmail: 'TYa5ZCXqmJWh31f3',
  drive: 'vYjewcJmeGGDdzjT',
  sheets: '7VEtoqQtvHa8ewxY'
};

async function create() {
  console.log('🚀 Création workflow Agent RH Unifié v2...\n');

  const workflow = {
    name: 'Agent RH - Unifié v2',
    nodes: [
      // 1. Webhook d'entrée
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
        webhookId: 'rh-unified-v2'
      },

      // 2. Préparer le prompt
      {
        parameters: {
          jsCode: `const input = $input.first().json;
const body = input.body || input;
const message = body.chatInput || body.message || 'Bonjour';
const history = body.history || '';

const prompt = \`Tu es Sophie, experte RH avec 15 ans d'expérience.

Historique: \${history}

Message: \${message}

Tu peux effectuer ces ACTIONS RÉELLES:
- schedule_interview: Planifier un entretien dans Google Calendar
  Paramètres requis: candidat, poste, date (YYYY-MM-DD), heure (HH:MM)
- send_email: Envoyer un email via Gmail
  Paramètres requis: destinataire (email), sujet, contenu
- search_cv: Rechercher des CV dans Google Drive
  Paramètres requis: criteres (mot-clé de recherche)
- none: Simple conversation

IMPORTANT: Réponds TOUJOURS en JSON valide avec ce format:
{
  "response": "Ta réponse textuelle",
  "action": "nom_action",
  "params": {"clé": "valeur"}
}

Exemples:
{"response": "Je planifie l'entretien...", "action": "schedule_interview", "params": {"candidat": "Marie Martin", "poste": "Dev React", "date": "2025-01-20", "heure": "10:00"}}
{"response": "Bonjour! Je suis Sophie.", "action": "none", "params": {}}\`;

const geminiBody = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
};

return [{ json: { geminiBody: JSON.stringify(geminiBody), originalMessage: message } }];`
        },
        name: 'Prepare Prompt',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [220, 300]
      },

      // 3. Appeler Gemini
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={{ $json.geminiBody }}',
          options: {}
        },
        name: 'Call Gemini',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [440, 300]
      },

      // 4. Parser la réponse
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

let response = "Je suis Sophie, votre experte RH.";
let action = "none";
let params = {};

try {
  let jsonStr = text.trim().replace(/\`\`\`json\\n?/g, '').replace(/\\n?\`\`\`/g, '');
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

return [{ json: { response, action, params } }];`
        },
        name: 'Parse Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [660, 300]
      },

      // 5. Router selon l'action
      {
        parameters: {
          conditions: {
            string: [
              { value1: '={{ $json.action }}', value2: 'schedule_interview', operation: 'equals' }
            ]
          }
        },
        name: 'Is Calendar?',
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position: [880, 200]
      },

      // 6. Créer événement Calendar
      {
        parameters: {
          resource: 'event',
          operation: 'create',
          calendar: { __rl: true, mode: 'id', value: 'primary' },
          title: '={{ "Entretien: " + $json.params.candidat + " - " + $json.params.poste }}',
          start: '={{ $json.params.date + "T" + $json.params.heure + ":00+01:00" }}',
          end: '={{ $json.params.date + "T" + (parseInt($json.params.heure.split(":")[0]) + 1).toString().padStart(2, "0") + ":00:00+01:00" }}',
          options: {}
        },
        name: 'Create Event',
        type: 'n8n-nodes-base.googleCalendar',
        typeVersion: 1.3,
        position: [1100, 100],
        credentials: {
          googleCalendarOAuth2Api: { id: CREDS.calendar, name: 'Google Calendar' }
        }
      },

      // 7. Format Calendar result
      {
        parameters: {
          jsCode: `const event = $input.first().json;
const prev = $('Parse Response').first().json;
return [{ json: {
  response: prev.response + "\\n\\n✅ Événement créé!\\n📅 " + (event.summary || '') + "\\n🔗 " + (event.htmlLink || 'Calendrier'),
  action: "schedule_interview",
  success: true,
  eventId: event.id
}}];`
        },
        name: 'Format Calendar',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1320, 100]
      },

      // 8. Default (pas d'action)
      {
        parameters: {
          jsCode: `const prev = $input.first().json;
return [{ json: { response: prev.response, action: prev.action, success: true } }];`
        },
        name: 'No Action',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1100, 400]
      },

      // 9. Merge
      {
        parameters: { mode: 'chooseBranch' },
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        typeVersion: 3,
        position: [1540, 250]
      },

      // 10. Réponse finale
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ $json }}',
          options: {}
        },
        name: 'Respond',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [1760, 250]
      }
    ],
    connections: {
      'Webhook': { main: [[{ node: 'Prepare Prompt', type: 'main', index: 0 }]] },
      'Prepare Prompt': { main: [[{ node: 'Call Gemini', type: 'main', index: 0 }]] },
      'Call Gemini': { main: [[{ node: 'Parse Response', type: 'main', index: 0 }]] },
      'Parse Response': { main: [[{ node: 'Is Calendar?', type: 'main', index: 0 }]] },
      'Is Calendar?': {
        main: [
          [{ node: 'Create Event', type: 'main', index: 0 }],
          [{ node: 'No Action', type: 'main', index: 0 }]
        ]
      },
      'Create Event': { main: [[{ node: 'Format Calendar', type: 'main', index: 0 }]] },
      'Format Calendar': { main: [[{ node: 'Merge', type: 'main', index: 0 }]] },
      'No Action': { main: [[{ node: 'Merge', type: 'main', index: 1 }]] },
      'Merge': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' }
  };

  console.log('1. Création du workflow...');
  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Erreur:', err);
    return;
  }

  const wf = await res.json();
  console.log('   ID:', wf.id);
  console.log('   Nodes:', wf.nodes?.length);

  console.log('2. Activation...');
  const actRes = await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });

  if (!actRes.ok) {
    console.log('   ⚠️ Erreur activation:', await actRes.text());
  } else {
    const actData = await actRes.json();
    console.log('   Active:', actData.active);
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log('3. Test conversation simple...');
  const test1 = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatInput: 'Bonjour Sophie!' })
  });

  if (test1.ok) {
    const d = await test1.json();
    console.log('   ✅ Réponse:', d.response?.slice(0, 100));
  }

  console.log('4. Test planification entretien...');
  const test2 = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatInput: 'Planifie un entretien avec Marie Dupont pour le poste de développeur React le 15 janvier 2025 à 14h' })
  });

  if (test2.ok) {
    const d = await test2.json();
    console.log('   Action:', d.action);
    console.log('   ✅ Réponse:', d.response?.slice(0, 150));
  }

  console.log('\\n🎉 Workflow déployé!');
  console.log('   http://localhost:5678/webhook/rh');
}

create().catch(console.error);
