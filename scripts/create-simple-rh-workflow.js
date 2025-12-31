/**
 * Créer un workflow simple Agent RH pour le chat
 */

const N8N_API_URL = process.env.N8N_URL || 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY3MTEzMjk2LCJleHAiOjE3Njk2NjI4MDB9.exHWFLMrNnI1GhwZ6UKDYG87VbNZxGxfl7VhR5nmWwU';

async function createWorkflow() {
  try {
    console.log('🚀 Création du workflow Agent RH pour le chat...\n');

    // Workflow simple: Webhook → AI Agent Gemini → Respond
    const workflow = {
      name: "Agent RH - Chat Web",
      nodes: [
        {
          parameters: {
            httpMethod: "POST",
            path: "agent-rh-chat",
            responseMode: "lastNode",
            options: {}
          },
          id: "webhook-rh-chat",
          name: "Webhook - Chat RH",
          type: "n8n-nodes-base.webhook",
          typeVersion: 2.1,
          position: [240, 300]
        },
        {
          parameters: {
            hasOutputParser: true,
            options: {
              systemMessage: `Tu es Sophie, experte en Ressources Humaines. Tu as accès à l'historique de la conversation.

📜 HISTORIQUE:
{{ $json.body.history || "Début de conversation" }}

MESSAGE UTILISATEUR:
{{ $json.body.chatInput || $json.body.message }}

🎯 TES COMPÉTENCES:
1. **Analyse de CV** : Extraction d'infos (formation, expérience, compétences)
2. **Offres d'emploi** : Fiches de poste attractives
3. **Onboarding** : Plans d'intégration
4. **Entretiens** : Questions et grilles d'évaluation
5. **Conseils RH** : Droit du travail, gestion des talents

🔍 DÉTECTION:
- "analyse ce CV" → analyse_cv
- "crée une fiche de poste" → fiche_poste
- "plan d'onboarding" → onboarding
- "questions d'entretien" → entretien

📤 FORMAT JSON:
\`\`\`json
{
  "type_demande": "analyse_cv|fiche_poste|onboarding|entretien|general",
  "response": "Ta réponse en MARKDOWN avec **gras**, *italique*, listes, etc.",
  "informations_extraites": {
    "nom": "...",
    "competences": [...],
    "experience": "..."
  },
  "recommandations": ["conseil 1", "conseil 2"]
}
\`\`\`

💼 Ton style: Professionnel, bienveillant, expert RH avec 10+ ans d'expérience.`
            }
          },
          id: "ai-agent-rh",
          name: "AI Agent RH",
          type: "@n8n/n8n-nodes-langchain.agent",
          typeVersion: 1.6,
          position: [460, 300]
        },
        {
          parameters: {
            respondWith: "json",
            responseBody: "={{ $json }}",
            options: {}
          },
          id: "respond-webhook",
          name: "Respond to Webhook",
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.4,
          position: [680, 300]
        }
      ],
      connections: {
        "Webhook - Chat RH": {
          main: [[{ node: "AI Agent RH", type: "main", index: 0 }]]
        },
        "AI Agent RH": {
          main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]]
        }
      },
      settings: {
        executionOrder: "v1"
      }
    };

    console.log('📤 Envoi à n8n API...');

    const response = await fetch(`${N8N_API_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log('\n✅ WORKFLOW CRÉÉ !');
    console.log(`📝 ID: ${result.id}`);
    console.log(`📝 Nom: ${result.name}`);

    // Récupérer le webhook URL réel
    const webhookUrl = `${N8N_API_URL}/webhook/agent-rh-chat`;

    console.log(`\n🔗 WEBHOOK URL: ${webhookUrl}`);

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. ✅ Workflow créé dans n8n');
    console.log('2. 🌐 Ouvre http://localhost:5678/workflow/' + result.id);
    console.log('3. ⚡ Active le workflow (toggle en haut)');
    console.log('4. 🔧 Configure l\'AI Agent avec ton modèle Gemini');
    console.log('5. ✅ Teste le webhook');

    return {
      success: true,
      workflowId: result.id,
      webhookUrl: webhookUrl
    };

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  createWorkflow();
}

module.exports = { createWorkflow };
