/**
 * PM2 Ecosystem Configuration for SaaS Agents IA
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js
 *   pm2 delete ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'saas-agents-ia',
      script: 'npm',
      args: 'start',
      cwd: process.cwd(), // Utilise le dossier courant
      instances: 2, // Utiliser 2 instances (cluster mode pour load balancing)
      exec_mode: 'cluster',
      autorestart: true,
      watch: false, // Ne pas watcher en production
      max_memory_restart: '1G', // Redémarrer si l'app dépasse 1GB de RAM
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true, // Ajouter des timestamps aux logs
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Options avancées
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,

      // Monitoring
      max_restarts: 10,
      min_uptime: '10s',

      // Cron restart (optionnel - redémarrer tous les jours à 4h du matin)
      // cron_restart: '0 4 * * *',
    }
  ],

  /**
   * Déploiement avec PM2 Deploy (optionnel)
   */
  deploy: {
    production: {
      user: 'deployer',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/Nicolas69123/saas-agents-ia.git',
      path: '/home/deployer/saas-agents-ia',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    },
    development: {
      user: 'deployer',
      host: ['your-dev-server-ip'],
      ref: 'origin/feature/development',
      repo: 'https://github.com/Nicolas69123/saas-agents-ia.git',
      path: '/home/deployer/saas-agents-ia-dev',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env development',
      env: {
        NODE_ENV: 'development'
      }
    }
  }
}
