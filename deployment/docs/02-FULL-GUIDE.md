# Guide de Déploiement sur VM - SaaS Agents IA

> Guide générique pour déployer le site Next.js sur n'importe quelle VM Linux accessible sur Internet

---

## 📋 Prérequis

### VM Requirements
- **OS** : Ubuntu 20.04+ / Debian 11+ / CentOS 8+ (ce guide utilise Ubuntu)
- **RAM** : Minimum 2 GB (recommandé 4 GB)
- **CPU** : Minimum 2 vCPUs
- **Disque** : Minimum 20 GB
- **Accès** : SSH root ou sudo

### Ce dont tu as besoin
- ✅ Une VM avec IP publique
- ✅ Accès SSH à la VM
- ✅ Un nom de domaine (ex: `saas-agents-ia.fr`)
- ✅ Accès au panneau DNS de ton domaine

---

## 🚀 Étape 1 : Connexion et Configuration Initiale

### 1.1 Se connecter à la VM

```bash
# Via SSH (remplace par ton IP et utilisateur)
ssh user@your-vm-ip

# Ou si tu as une clé SSH
ssh -i ~/.ssh/your-key.pem user@your-vm-ip
```

### 1.2 Mettre à jour le système

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Créer un utilisateur dédié (optionnel mais recommandé)

```bash
# Créer un utilisateur pour l'application
sudo adduser deployer
sudo usermod -aG sudo deployer

# Se connecter avec ce nouvel utilisateur
su - deployer
```

---

## 🔧 Étape 2 : Installation des Dépendances

### 2.1 Installer Node.js (version 18+)

```bash
# Installer Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v20.x.x
npm --version   # Doit afficher 10.x.x
```

### 2.2 Installer PM2 (Process Manager)

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Vérifier l'installation
pm2 --version
```

### 2.3 Installer Nginx (Reverse Proxy)

```bash
# Installer Nginx
sudo apt install -y nginx

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier le statut
sudo systemctl status nginx
```

### 2.4 Installer Git

```bash
sudo apt install -y git
git --version
```

---

## 📦 Étape 3 : Déployer l'Application

### 3.1 Cloner le Repository

```bash
# Se placer dans le dossier home
cd ~

# Cloner le repo (remplace par ton URL)
git clone https://github.com/Nicolas69123/saas-agents-ia.git
cd saas-agents-ia

# Checkout la branche de production (si nécessaire)
git checkout main  # ou feature/development
```

### 3.2 Installer les Dépendances

```bash
# Installer les packages npm
npm install

# Ou avec clean install (recommandé en production)
npm ci
```

### 3.3 Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Contenu du `.env` (exemple) :**
```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://saas-agents-ia.fr
PORT=3000

# Database (si nécessaire)
DATABASE_URL="postgresql://user:password@localhost:5432/saasagents"

# n8n (si nécessaire)
N8N_URL=http://localhost:5678
N8N_API_KEY=your-n8n-api-key

# Claude API (si nécessaire)
CLAUDE_API_KEY=your-claude-api-key
```

### 3.4 Build de l'Application

```bash
# Build Next.js pour la production
npm run build

# Vérifier que le build a réussi
ls -la .next
```

---

## 🔄 Étape 4 : Configurer PM2

### 4.1 Créer un fichier de configuration PM2

```bash
# Créer le fichier ecosystem.config.js
nano ecosystem.config.js
```

**Contenu de `ecosystem.config.js` :**
```javascript
module.exports = {
  apps: [
    {
      name: 'saas-agents-ia',
      script: 'npm',
      args: 'start',
      cwd: '/home/deployer/saas-agents-ia',
      instances: 2, // Utiliser 2 instances (cluster mode)
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
```

### 4.2 Créer le dossier logs

```bash
mkdir -p logs
```

### 4.3 Démarrer l'Application avec PM2

```bash
# Démarrer l'app
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs saas-agents-ia

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Copier et exécuter la commande affichée
```

### 4.4 Commandes PM2 Utiles

```bash
# Redémarrer l'app
pm2 restart saas-agents-ia

# Arrêter l'app
pm2 stop saas-agents-ia

# Voir les logs en temps réel
pm2 logs saas-agents-ia --lines 100

# Voir le monitoring
pm2 monit

# Recharger l'app sans downtime
pm2 reload saas-agents-ia
```

---

## 🌐 Étape 5 : Configurer Nginx (Reverse Proxy)

### 5.1 Créer la Configuration Nginx

```bash
# Créer le fichier de configuration
sudo nano /etc/nginx/sites-available/saas-agents-ia
```

**Contenu de `/etc/nginx/sites-available/saas-agents-ia` :**
```nginx
# Configuration HTTP (sera redirigé vers HTTPS plus tard)
server {
    listen 80;
    listen [::]:80;

    server_name saas-agents-ia.fr www.saas-agents-ia.fr;

    # Logs
    access_log /var/log/nginx/saas-agents-ia-access.log;
    error_log /var/log/nginx/saas-agents-ia-error.log;

    # Reverse proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

### 5.2 Activer la Configuration

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/saas-agents-ia /etc/nginx/sites-enabled/

# Supprimer le site par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
sudo nginx -t

# Si OK, recharger Nginx
sudo systemctl reload nginx
```

---

## 🔒 Étape 6 : Configurer SSL avec Let's Encrypt

### 6.1 Installer Certbot

```bash
# Installer Certbot et le plugin Nginx
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtenir un Certificat SSL

```bash
# Obtenir et installer automatiquement le certificat
sudo certbot --nginx -d saas-agents-ia.fr -d www.saas-agents-ia.fr

# Suivre les instructions :
# - Entrer ton email
# - Accepter les termes
# - Choisir de rediriger HTTP vers HTTPS (option 2)
```

### 6.3 Renouvellement Automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est déjà configuré via cron
# Vérifier la tâche cron
sudo systemctl status certbot.timer
```

### 6.4 Configuration Nginx Finale (après SSL)

Nginx aura automatiquement modifié ton fichier de config. Vérifie :

```bash
sudo nano /etc/nginx/sites-available/saas-agents-ia
```

Tu devrais voir les sections HTTPS ajoutées automatiquement.

---

## 🔥 Étape 7 : Configurer le Firewall

### 7.1 Configurer UFW (Ubuntu Firewall)

```bash
# Installer UFW si pas déjà installé
sudo apt install -y ufw

# Autoriser SSH (IMPORTANT avant d'activer le firewall!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status verbose
```

### 7.2 Configuration du Firewall du Cloud Provider

**Sur Oracle Cloud, AWS, GCP, etc. :**
- Va dans le panneau de contrôle de ton cloud provider
- Configure les **Security Groups** ou **Firewall Rules**
- Autorise les ports :
  - **22** (SSH)
  - **80** (HTTP)
  - **443** (HTTPS)

---

## 🌍 Étape 8 : Configurer le DNS

### 8.1 Ajouter des Enregistrements DNS

Sur ton registrar de domaine (OVH, Gandi, Namecheap, etc.), ajoute :

**Type A (IPv4) :**
```
@ (root)        →  YOUR_VM_IP
www             →  YOUR_VM_IP
```

**Exemple :**
```
saas-agents-ia.fr     →  51.178.45.123
www.saas-agents-ia.fr →  51.178.45.123
```

### 8.2 Vérifier la Propagation DNS

```bash
# Depuis ton Mac
dig saas-agents-ia.fr
dig www.saas-agents-ia.fr

# Ou utilise un outil en ligne
# https://dnschecker.org
```

**Attendre 5-30 minutes** pour la propagation DNS complète.

---

## ✅ Étape 9 : Vérification Finale

### 9.1 Tester l'Application

```bash
# Depuis ta VM, tester localhost
curl http://localhost:3000

# Depuis ton Mac, tester le domaine
curl https://saas-agents-ia.fr
```

### 9.2 Ouvrir dans le Navigateur

Ouvre ton navigateur et va sur :
- ✅ `https://saas-agents-ia.fr`
- ✅ `https://www.saas-agents-ia.fr`

Tu devrais voir ton site avec le cadenas SSL vert 🔒

---

## 🔄 Étape 10 : Script de Déploiement Automatisé

### 10.1 Créer un Script de Déploiement

```bash
# Sur ta VM, créer le script
nano ~/deploy.sh
```

**Contenu de `deploy.sh` :**
```bash
#!/bin/bash

# Script de déploiement automatisé
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement..."

# Variables
APP_DIR="/home/deployer/saas-agents-ia"
APP_NAME="saas-agents-ia"

# Aller dans le dossier de l'app
cd $APP_DIR

echo "📥 Pull des dernières modifications..."
git pull origin main

echo "📦 Installation des dépendances..."
npm ci

echo "🏗️ Build de l'application..."
npm run build

echo "🔄 Redémarrage de l'application..."
pm2 reload $APP_NAME

echo "✅ Déploiement terminé avec succès!"

# Afficher le statut
pm2 status $APP_NAME
```

### 10.2 Rendre le Script Exécutable

```bash
chmod +x ~/deploy.sh
```

### 10.3 Utiliser le Script

```bash
# Pour déployer une nouvelle version
./deploy.sh
```

---

## 🎯 Résumé des Commandes Rapides

### Sur ta VM (déploiement)
```bash
cd ~/saas-agents-ia
git pull origin main
npm ci
npm run build
pm2 reload saas-agents-ia
```

### Sur ton Mac (développement)
```bash
# Après avoir fait des modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Puis sur la VM
ssh user@your-vm-ip
./deploy.sh
```

---

## 🐛 Troubleshooting

### L'application ne démarre pas

```bash
# Voir les logs PM2
pm2 logs saas-agents-ia --lines 100

# Voir les logs Nginx
sudo tail -f /var/log/nginx/saas-agents-ia-error.log
```

### Erreur de permissions

```bash
# Donner les bonnes permissions
sudo chown -R deployer:deployer ~/saas-agents-ia
```

### Port 3000 déjà utilisé

```bash
# Trouver le processus qui utilise le port
sudo lsof -i :3000

# Tuer le processus (remplace PID)
kill -9 PID
```

### Nginx ne démarre pas

```bash
# Vérifier la configuration
sudo nginx -t

# Voir les logs d'erreur
sudo tail -f /var/log/nginx/error.log

# Redémarrer Nginx
sudo systemctl restart nginx
```

### SSL ne fonctionne pas

```bash
# Vérifier Certbot
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew --force-renewal
```

---

## 📊 Monitoring et Maintenance

### Monitoring avec PM2

```bash
# Voir les métriques en temps réel
pm2 monit

# Voir les logs
pm2 logs

# Voir le statut
pm2 status
```

### Logs Nginx

```bash
# Access logs
sudo tail -f /var/log/nginx/saas-agents-ia-access.log

# Error logs
sudo tail -f /var/log/nginx/saas-agents-ia-error.log
```

### Nettoyage

```bash
# Nettoyer les logs PM2
pm2 flush

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer les vieux fichiers de build
rm -rf .next
```

---

## 🚀 Améliorations Futures

### 1. GitHub Actions CI/CD
- Déploiement automatique à chaque push sur `main`

### 2. Base de Données
- Installer PostgreSQL sur la VM
- Ou utiliser un service managé (AWS RDS, DigitalOcean DB, etc.)

### 3. Redis pour le Cache
- Améliorer les performances avec Redis

### 4. Docker
- Containeriser l'application pour plus de portabilité

### 5. Monitoring Avancé
- Installer Prometheus + Grafana
- Ou utiliser un service comme Datadog, New Relic

---

## 📚 Ressources

- **Next.js Production** : https://nextjs.org/docs/deployment
- **PM2 Documentation** : https://pm2.keymetrics.io/docs/usage/quick-start/
- **Nginx Documentation** : https://nginx.org/en/docs/
- **Let's Encrypt** : https://letsencrypt.org/getting-started/
- **UFW Tutorial** : https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands

---

**🎉 Félicitations ! Ton site SaaS Agents IA est maintenant en production sur ta VM !**
