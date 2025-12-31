/**
 * Script de test pour l'Agent RH
 *
 * Usage: node scripts/test-agent-rh.js
 */

const WEBHOOK_URL = 'http://localhost:5678/webhook/agent-rh-chat';

async function testAgentRH() {
  console.log('🧪 Test de l\'Agent RH\n');
  console.log(`🔗 Webhook: ${WEBHOOK_URL}\n`);

  // Test 1: Question simple
  const test1 = {
    sessionId: 'test-session-1',
    chatInput: 'Bonjour, peux-tu m\'aider à créer une fiche de poste pour un développeur Full Stack ?',
    message: 'Bonjour, peux-tu m\'aider à créer une fiche de poste pour un développeur Full Stack ?',
    agentId: 'ressources-humaines',
    history: ''
  };

  console.log('📝 Test 1: Création fiche de poste');
  console.log(`   Message: "${test1.chatInput}"\n`);

  try {
    const start = Date.now();
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test1),
    });

    const elapsed = Date.now() - start;

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Succès (${elapsed}ms)`);
      console.log(`   📊 Réponse:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`   ❌ Échec (${response.status})`);
      const errorText = await response.text();
      console.log(`   Erreur:`, errorText);
    }
  } catch (error) {
    console.log(`   ❌ Erreur réseau:`, error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Avec historique
  const test2 = {
    sessionId: 'test-session-2',
    chatInput: 'Et quelles compétences techniques dois-je mettre en avant ?',
    message: 'Et quelles compétences techniques dois-je mettre en avant ?',
    agentId: 'ressources-humaines',
    history: 'Utilisateur: Bonjour, peux-tu m\'aider à créer une fiche de poste pour un développeur Full Stack ?\nAssistant: Bien sûr ! Je vais t\'aider...'
  };

  console.log('📝 Test 2: Question avec contexte');
  console.log(`   Message: "${test2.chatInput}"\n`);

  try {
    const start = Date.now();
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test2),
    });

    const elapsed = Date.now() - start;

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Succès (${elapsed}ms)`);
      console.log(`   📊 Réponse:`, JSON.stringify(data, null, 2).slice(0, 300) + '...');
    } else {
      console.log(`   ❌ Échec (${response.status})`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur:`, error.message);
  }

  console.log('\n📋 RÉSUMÉ:');
  console.log('Pour activer le workflow dans n8n:');
  console.log('1. Ouvre http://localhost:5678');
  console.log('2. Trouve "Agent RH - Chat Web"');
  console.log('3. Active le workflow (toggle en haut à droite)');
  console.log('4. Configure le node "AI Agent RH" avec ton modèle Gemini');
  console.log('5. Re-teste avec ce script');
}

testAgentRH();
