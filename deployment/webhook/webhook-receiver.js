#!/usr/bin/env node

/**
 * Webhook Receiver pour déploiement automatique depuis GitHub
 * Lance le script de mise à jour quand GitHub push sur main
 */

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');

// Configuration
const PORT = process.env.WEBHOOK_PORT || 9000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const UPDATE_SCRIPT = '/opt/saas-agents-ia/deployment/scripts/update-from-github.sh';
const LOG_FILE = '/var/log/webhook-deployment.log';

// Fonction de log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Vérification de la signature GitHub
function verifySignature(payload, signature) {
  if (!WEBHOOK_SECRET) {
    log('⚠️  ATTENTION: WEBHOOK_SECRET non défini - signature non vérifiée');
    return true; // Mode permissif si pas de secret
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Exécuter le script de mise à jour
function runUpdateScript() {
  log('🚀 Démarrage de la mise à jour...');

  const child = exec(UPDATE_SCRIPT, (error, stdout, stderr) => {
    if (error) {
      log(`❌ Erreur lors de la mise à jour: ${error.message}`);
      log(stderr);
      return;
    }

    log('✅ Mise à jour terminée avec succès !');
    log(stdout);
  });

  // Afficher la sortie en temps réel
  child.stdout.on('data', (data) => {
    log(data.toString().trim());
  });

  child.stderr.on('data', (data) => {
    log(`⚠️  ${data.toString().trim()}`);
  });
}

// Serveur HTTP
const server = http.createServer((req, res) => {
  // Healthcheck
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Webhook GitHub
  if (req.url === '/webhook' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const signature = req.headers['x-hub-signature-256'];
        const event = req.headers['x-github-event'];

        log(`📨 Webhook reçu: ${event}`);

        // Vérifier la signature
        if (!verifySignature(body, signature)) {
          log('❌ Signature invalide - requête rejetée');
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }

        const payload = JSON.parse(body);

        // Ne traiter que les événements push sur main
        if (event === 'push' && payload.ref === 'refs/heads/main') {
          log(`✅ Push détecté sur main par ${payload.pusher.name}`);
          log(`📝 Commits: ${payload.commits.length}`);

          payload.commits.forEach((commit, i) => {
            log(`   ${i + 1}. ${commit.message.split('\n')[0]} (${commit.author.name})`);
          });

          // Lancer la mise à jour
          runUpdateScript();

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'success',
            message: 'Deployment started',
            commits: payload.commits.length
          }));
        } else {
          log(`ℹ️  Événement ignoré: ${event} sur ${payload.ref || 'N/A'}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ignored', event, ref: payload.ref }));
        }
      } catch (error) {
        log(`❌ Erreur: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Démarrer le serveur
server.listen(PORT, '0.0.0.0', () => {
  log(`🎯 Webhook receiver démarré sur le port ${PORT}`);
  log(`📝 Logs: ${LOG_FILE}`);
  log(`🔒 Secret webhook: ${WEBHOOK_SECRET ? 'Configuré ✓' : 'Non configuré ⚠️'}`);
  log(`📜 Script de mise à jour: ${UPDATE_SCRIPT}`);
});

// Gestion des erreurs
server.on('error', (error) => {
  log(`❌ Erreur serveur: ${error.message}`);
  process.exit(1);
});

// Gestion du signal SIGTERM
process.on('SIGTERM', () => {
  log('⏹️  Signal SIGTERM reçu - arrêt du serveur');
  server.close(() => {
    log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});
