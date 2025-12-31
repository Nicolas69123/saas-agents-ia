const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTIwNzMwLCJleHAiOjE3Njk2NjI4MDB9.bQfsgYn3V2JLBJX-1x7me6Y0iPpoiKMcN0VnirONaKw';
const headers = { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' };
const GEMINI_KEY = 'AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I';

// Credential IDs
const CREDS = {
  googleDrive: 'vYjewcJmeGGDdzjT',
  googleSheets: '7VEtoqQtvHa8ewxY',
  googleCalendar: 'EDbM0JCfgyqaEFgV',
  gmail: 'TYa5ZCXqmJWh31f3',
  gemini: '39Ek8t8T8OUa5G1g'
};

async function upgrade() {
  console.log('🚀 Upgrade du workflow Agent RH avec actions réelles...\n');

  // Nouveau workflow unifié avec routeur intelligent
  const workflow = {
    name: 'Agent RH - Unifié (Chat + Actions)',
    nodes: [
      // 1. Webhook d'entrée
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
        position: [0, 300],
        webhookId: 'rh-unified'
      },

      // 2. Préparation du prompt avec détection d'action
      {
        parameters: {
          jsCode: `const input = $input.first().json;
const body = input.body || input;
const message = body.chatInput || body.message || 'Bonjour';
const history = body.history || '';

const prompt = \`Tu es Sophie, experte RH avec 15 ans d'expérience.

Historique: \${history}

Message utilisateur: \${message}

Tu as accès à un système complet de gestion RH avec ces ACTIONS RÉELLES que tu peux déclencher:
- schedule_interview: Planifier un entretien (fournir: candidat, poste, date, heure, durée)
- send_email: Envoyer un email (fournir: destinataire, sujet, contenu)
- list_candidates: Lister les candidats de la base de données
- search_cv: Rechercher des CV sur Google Drive (fournir: critères de recherche)
- create_job: Créer une fiche de poste (retourne le texte)
- none: Simple conversation sans action

IMPORTANT: Tu DOIS répondre UNIQUEMENT en JSON valide avec ce format exact:
{
  "response": "Ta réponse textuelle à l'utilisateur",
  "action": "nom_action",
  "params": {
    "param1": "valeur1"
  }
}

Exemples:
- Pour planifier: {"response": "Je planifie l'entretien...", "action": "schedule_interview", "params": {"candidat": "Jean Dupont", "poste": "Dev Python", "date": "2025-01-15", "heure": "14:00", "duree": "1h"}}
- Pour lister: {"response": "Voici les candidats...", "action": "list_candidates", "params": {}}
- Pour conversation: {"response": "Bonjour! Comment puis-je vous aider?", "action": "none", "params": {}}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.\`;

const geminiBody = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 4096,
    responseMimeType: "application/json"
  }
};

return [{ json: { geminiBody: JSON.stringify(geminiBody), originalMessage: message } }];`
        },
        name: 'Prepare Chat',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [220, 300]
      },

      // 3. Appel Gemini
      {
        parameters: {
          method: 'POST',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '={{ $json.geminiBody }}',
          options: { timeout: 30000 }
        },
        name: 'Gemini Chat',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [440, 300]
      },

      // 4. Parse de la réponse Gemini
      {
        parameters: {
          jsCode: `const r = $input.first().json;
const text = r.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

let response = "Je suis Sophie, votre experte RH.";
let action = "none";
let params = {};

try {
  // Nettoyer le JSON (enlever les backticks si présents)
  let jsonStr = text.trim();
  if (jsonStr.startsWith('\`\`\`json')) {
    jsonStr = jsonStr.replace(/\`\`\`json\\n?/, '').replace(/\\n?\`\`\`$/, '');
  }
  if (jsonStr.startsWith('\`\`\`')) {
    jsonStr = jsonStr.replace(/\`\`\`\\n?/, '').replace(/\\n?\`\`\`$/, '');
  }

  const parsed = JSON.parse(jsonStr.trim());
  response = parsed.response || response;
  action = parsed.action || "none";
  params = parsed.params || {};
} catch (e) {
  console.log("Parse error:", e.message);
  response = text;
}

return [{ json: { response, action, params, rawText: text } }];`
        },
        name: 'Parse Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [660, 300]
      },

      // 5. Routeur d'actions (Switch)
      {
        parameters: {
          rules: {
            rules: [
              { outputKey: 'schedule_interview', conditions: { conditions: [{ leftValue: '={{ $json.action }}', rightValue: 'schedule_interview', operator: { type: 'string', operation: 'equals' } }] } },
              { outputKey: 'send_email', conditions: { conditions: [{ leftValue: '={{ $json.action }}', rightValue: 'send_email', operator: { type: 'string', operation: 'equals' } }] } },
              { outputKey: 'list_candidates', conditions: { conditions: [{ leftValue: '={{ $json.action }}', rightValue: 'list_candidates', operator: { type: 'string', operation: 'equals' } }] } },
              { outputKey: 'search_cv', conditions: { conditions: [{ leftValue: '={{ $json.action }}', rightValue: 'search_cv', operator: { type: 'string', operation: 'equals' } }] } }
            ]
          },
          options: { fallbackOutput: 'extra' }
        },
        name: 'Action Router',
        type: 'n8n-nodes-base.switch',
        typeVersion: 3.2,
        position: [880, 300]
      },

      // 6. Action: Planifier un entretien (Calendar)
      {
        parameters: {
          resource: 'event',
          operation: 'create',
          calendarId: { __rl: true, mode: 'list', value: 'primary' },
          title: '={{ "Entretien: " + $json.params.candidat + " - " + $json.params.poste }}',
          start: '={{ $json.params.date + "T" + $json.params.heure + ":00" }}',
          end: '={{ $json.params.date + "T" + (parseInt($json.params.heure.split(":")[0]) + 1) + ":" + $json.params.heure.split(":")[1] + ":00" }}',
          additionalFields: {
            description: '={{ "Entretien avec " + $json.params.candidat + " pour le poste de " + $json.params.poste }}'
          }
        },
        name: 'Create Calendar Event',
        type: 'n8n-nodes-base.googleCalendar',
        typeVersion: 1.2,
        position: [1100, 100],
        credentials: {
          googleCalendarOAuth2Api: { id: CREDS.googleCalendar, name: 'Google Calendar' }
        }
      },

      // 7. Préparer réponse Calendar
      {
        parameters: {
          jsCode: `const event = $input.first().json;
const prev = $('Parse Response').first().json;

return [{ json: {
  response: prev.response + "\\n\\n✅ Événement créé dans Google Calendar!\\nLien: " + (event.htmlLink || "Voir votre calendrier"),
  action: "schedule_interview",
  success: true,
  eventId: event.id
}}];`
        },
        name: 'Format Calendar Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1320, 100]
      },

      // 8. Action: Envoyer un email (Gmail)
      {
        parameters: {
          sendTo: '={{ $json.params.destinataire }}',
          subject: '={{ $json.params.sujet }}',
          message: '={{ $json.params.contenu }}',
          options: {}
        },
        name: 'Send Gmail',
        type: 'n8n-nodes-base.gmail',
        typeVersion: 2.1,
        position: [1100, 250],
        credentials: {
          gmailOAuth2: { id: CREDS.gmail, name: 'Gmail' }
        }
      },

      // 9. Préparer réponse Gmail
      {
        parameters: {
          jsCode: `const email = $input.first().json;
const prev = $('Parse Response').first().json;

return [{ json: {
  response: prev.response + "\\n\\n✅ Email envoyé avec succès!\\nID: " + (email.id || "OK"),
  action: "send_email",
  success: true
}}];`
        },
        name: 'Format Gmail Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1320, 250]
      },

      // 10. Action: Lister les candidats (Sheets)
      {
        parameters: {
          operation: 'read',
          documentId: { __rl: true, mode: 'list', value: '' },
          sheetName: { __rl: true, mode: 'list', value: '' },
          options: { range: 'A:Z' }
        },
        name: 'Read Candidates Sheet',
        type: 'n8n-nodes-base.googleSheets',
        typeVersion: 4.5,
        position: [1100, 400],
        credentials: {
          googleSheetsOAuth2Api: { id: CREDS.googleSheets, name: 'Google Sheets' }
        }
      },

      // 11. Préparer réponse Sheets
      {
        parameters: {
          jsCode: `const items = $input.all();
const prev = $('Parse Response').first().json;
const count = items.length;

let candidatesList = "";
if (count > 0) {
  candidatesList = items.slice(0, 10).map((item, i) => {
    const d = item.json;
    return \`\${i+1}. \${d.Nom || d.Name || d.nom || 'N/A'} - \${d.Poste || d.Position || d.poste || 'N/A'}\`;
  }).join("\\n");
}

return [{ json: {
  response: prev.response + "\\n\\n📋 " + count + " candidat(s) trouvé(s):\\n" + (candidatesList || "Aucun candidat pour le moment"),
  action: "list_candidates",
  success: true,
  count: count
}}];`
        },
        name: 'Format Sheets Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1320, 400]
      },

      // 12. Action: Rechercher des CV (Drive)
      {
        parameters: {
          resource: 'fileFolder',
          operation: 'search',
          queryString: "={{ \"mimeType='application/pdf' and name contains '\" + ($json.params.criteres || 'CV') + \"'\" }}",
          options: {}
        },
        name: 'Search Drive CVs',
        type: 'n8n-nodes-base.googleDrive',
        typeVersion: 3,
        position: [1100, 550],
        credentials: {
          googleDriveOAuth2Api: { id: CREDS.googleDrive, name: 'Google Drive' }
        }
      },

      // 13. Préparer réponse Drive
      {
        parameters: {
          jsCode: `const items = $input.all();
const prev = $('Parse Response').first().json;
const count = items.length;

let filesList = "";
if (count > 0) {
  filesList = items.slice(0, 10).map((item, i) => {
    const d = item.json;
    return \`\${i+1}. 📄 \${d.name || 'Fichier'}\`;
  }).join("\\n");
}

return [{ json: {
  response: prev.response + "\\n\\n📁 " + count + " fichier(s) trouvé(s):\\n" + (filesList || "Aucun fichier trouvé"),
  action: "search_cv",
  success: true,
  count: count
}}];`
        },
        name: 'Format Drive Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1320, 550]
      },

      // 14. Réponse par défaut (conversation simple)
      {
        parameters: {
          jsCode: `const prev = $input.first().json;
return [{ json: {
  response: prev.response,
  action: prev.action || "none",
  success: true
}}];`
        },
        name: 'Default Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1100, 700]
      },

      // 15. Merge toutes les réponses
      {
        parameters: {
          mode: 'chooseBranch',
          output: 'all'
        },
        name: 'Merge Responses',
        type: 'n8n-nodes-base.merge',
        typeVersion: 3,
        position: [1540, 300]
      },

      // 16. Réponse finale
      {
        parameters: {
          respondWith: 'json',
          responseBody: '={{ $json }}',
          options: {}
        },
        name: 'Chat Respond',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [1760, 300]
      }
    ],
    connections: {
      'Chat Webhook': { main: [[{ node: 'Prepare Chat', type: 'main', index: 0 }]] },
      'Prepare Chat': { main: [[{ node: 'Gemini Chat', type: 'main', index: 0 }]] },
      'Gemini Chat': { main: [[{ node: 'Parse Response', type: 'main', index: 0 }]] },
      'Parse Response': { main: [[{ node: 'Action Router', type: 'main', index: 0 }]] },
      'Action Router': {
        main: [
          [{ node: 'Create Calendar Event', type: 'main', index: 0 }],  // schedule_interview
          [{ node: 'Send Gmail', type: 'main', index: 0 }],             // send_email
          [{ node: 'Read Candidates Sheet', type: 'main', index: 0 }],  // list_candidates
          [{ node: 'Search Drive CVs', type: 'main', index: 0 }],       // search_cv
          [{ node: 'Default Response', type: 'main', index: 0 }]        // fallback (none/other)
        ]
      },
      'Create Calendar Event': { main: [[{ node: 'Format Calendar Response', type: 'main', index: 0 }]] },
      'Format Calendar Response': { main: [[{ node: 'Merge Responses', type: 'main', index: 0 }]] },
      'Send Gmail': { main: [[{ node: 'Format Gmail Response', type: 'main', index: 0 }]] },
      'Format Gmail Response': { main: [[{ node: 'Merge Responses', type: 'main', index: 1 }]] },
      'Read Candidates Sheet': { main: [[{ node: 'Format Sheets Response', type: 'main', index: 0 }]] },
      'Format Sheets Response': { main: [[{ node: 'Merge Responses', type: 'main', index: 2 }]] },
      'Search Drive CVs': { main: [[{ node: 'Format Drive Response', type: 'main', index: 0 }]] },
      'Format Drive Response': { main: [[{ node: 'Merge Responses', type: 'main', index: 3 }]] },
      'Default Response': { main: [[{ node: 'Merge Responses', type: 'main', index: 4 }]] },
      'Merge Responses': { main: [[{ node: 'Chat Respond', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' }
  };

  // 1. Désactiver l'ancien workflow
  console.log('1. Désactivation de l\'ancien workflow...');
  try {
    await fetch('http://localhost:5678/api/v1/workflows/epBRVI2bkVAEve3C/deactivate', { method: 'POST', headers });
  } catch (e) {}

  // 2. Créer le nouveau workflow
  console.log('2. Création du nouveau workflow unifié...');
  const res = await fetch('http://localhost:5678/api/v1/workflows', {
    method: 'POST', headers, body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    console.error('❌ Erreur création:', await res.text());
    return;
  }

  const wf = await res.json();
  console.log('   ✅ Workflow créé - ID:', wf.id);
  console.log('   Nodes:', wf.nodes?.length || workflow.nodes.length);

  // 3. Activer le nouveau workflow
  console.log('3. Activation...');
  await fetch(`http://localhost:5678/api/v1/workflows/${wf.id}/activate`, { method: 'POST', headers });

  await new Promise(r => setTimeout(r, 2000));

  // 4. Test rapide
  console.log('4. Test du webhook...');
  const test = await fetch('http://localhost:5678/webhook/rh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatInput: 'Bonjour Sophie!' })
  });

  if (test.ok) {
    const data = await test.json();
    console.log('   ✅ Réponse:', data.response?.slice(0, 100) + '...');
    console.log('   Action:', data.action);
  } else {
    console.log('   ⚠️ Status:', test.status);
  }

  console.log('\n🎉 Workflow unifié déployé!');
  console.log('   Webhook: http://localhost:5678/webhook/rh');
  console.log('\n📋 Actions disponibles:');
  console.log('   - schedule_interview: Planifier dans Google Calendar');
  console.log('   - send_email: Envoyer via Gmail');
  console.log('   - list_candidates: Lister depuis Google Sheets');
  console.log('   - search_cv: Rechercher dans Google Drive');
}

upgrade().catch(console.error);
