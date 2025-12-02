# 🚀 Installation en 1 SEULE Commande

> **Script d'installation automatique qui fait TOUT** : base de données, déploiement, configuration, SSL, firewall, etc.

---

## ✨ Ce que fait le script

Le script `install-all.sh` automatise **13 étapes** d'installation :

1. ✅ Mise à jour du système
2. ✅ Installation Node.js 20.x
3. ✅ Installation PM2 (process manager)
4. ✅ Installation PostgreSQL 14+
5. ✅ Installation Nginx (reverse proxy)
6. ✅ Installation Certbot (SSL)
7. ✅ Installation Git
8. ✅ Clone du repository GitHub
9. ✅ Configuration de l'application (.env, migrations, build)
10. ✅ Configuration Nginx
11. ✅ Configuration SSL (Let's Encrypt)
12. ✅ Configuration Firewall (UFW)
13. ✅ Démarrage de l'application

**Durée totale** : 10-15 minutes ⏱️

---

## 📋 Prérequis

### Ce qu'il vous faut AVANT de lancer le script :

1. **Une VM Linux**
   - Ubuntu 20.04+ ou Debian 11+
   - Minimum 2 GB RAM
   - Accès root (sudo)
   - IP publique

2. **Un nom de domaine**
   - Ex: `saas-agents-ia.fr`
   - DNS configuré pour pointer vers l'IP de votre VM
   - Sous-domaines : `@` et `www` → IP de la VM

3. **Un email valide**
   - Pour les certificats SSL (Let's Encrypt)

---

## 🚀 Installation - Méthode 1 (Direct depuis GitHub)

### Sur votre VM, exécutez UNE SEULE commande :

```bash
curl -fsSL https://raw.githubusercontent.com/Nicolas69123/saas-agents-ia/main/deployment/scripts/install-all.sh | sudo bash
```

**C'est tout ! ✨**

Le script va vous demander :
1. Votre nom de domaine
2. Votre email (pour SSL)
3. Un mot de passe pour la base de données

Puis il fait TOUT automatiquement !

---

## 🚀 Installation - Méthode 2 (Clone manuel)

### Si vous préférez cloner d'abord :

```bash
# 1. Se connecter à votre VM
ssh user@your-vm-ip

# 2. Cloner le repo
git clone https://github.com/Nicolas69123/saas-agents-ia.git
cd saas-agents-ia/deployment/scripts

# 3. Lancer le script
sudo ./install-all.sh
```

---

## 📊 Informations demandées par le script

Le script est **interactif** et vous demandera :

### 1. Nom de domaine
```
📍 Nom de domaine (ex: saas-agents-ia.fr): _
```
→ Entrez votre domaine sans `https://` ni `www`

### 2. Email (pour SSL)
```
📧 Email pour SSL (Let's Encrypt): _
```
→ Email valide pour recevoir les notifications SSL

### 3. Mot de passe PostgreSQL
```
🔐 Mot de passe PostgreSQL (DB): _
```
→ Créez un mot de passe sécurisé pour la base de données

### 4. Confirmation
```
Configuration:
  - Domaine: saas-agents-ia.fr
  - Email: contact@example.com
  - App: /opt/saas-agents-ia

Continuer avec cette configuration? (y/N):
```
→ Tapez `y` pour continuer

---

## 🎬 Déroulement de l'installation

Une fois lancé, le script affiche en temps réel :

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🤖  INSTALLATION AUTOMATIQUE - SaaS Agents IA          ║
║                                                           ║
║   Ce script va installer et configurer :                 ║
║   • Node.js 20.x + PM2                                   ║
║   • PostgreSQL 14+                                       ║
║   • Nginx + SSL (Let's Encrypt)                          ║
║   • Firewall (UFW)                                       ║
║   • Application Next.js                                  ║
║                                                           ║
║   Durée estimée : 10-15 minutes                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🔷 ÉTAPE 1/12 - Configuration initiale
✅ OS détecté: Ubuntu 22.04.3 LTS

🔷 ÉTAPE 2/12 - Mise à jour du système
✅ Système mis à jour

🔷 ÉTAPE 3/12 - Installation Node.js 20
✅ Node.js v20.11.0 installé

... (etc.)
```

---

## ✅ Fin de l'installation

À la fin, vous verrez :

```
════════════════════════════════════════════════
   🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !
════════════════════════════════════════════════

✅ Application installée et démarrée

ℹ️  Informations d'accès:
  🌐 URL: https://saas-agents-ia.fr
  📁 App: /opt/saas-agents-ia
  🗄️  DB: saas-agents-ia_prod

ℹ️  Commandes utiles:
  • Voir les logs: pm2 logs saas-agents-ia
  • Statut: pm2 status
  • Redémarrer: pm2 restart saas-agents-ia
  • Voir les logs Nginx: tail -f /var/log/nginx/error.log

ℹ️  Prochaines étapes:
  1. Ouvrir https://saas-agents-ia.fr dans votre navigateur
  2. Configurer n8n (optionnel)
  3. Configurer les variables d'environnement dans /opt/saas-agents-ia/.env

✅ 🎉 Installation complète ! Visitez https://saas-agents-ia.fr
```

---

## 🔍 Vérification Post-Installation

### 1. Vérifier que l'app tourne

```bash
pm2 status
```

Vous devriez voir :
```
┌─────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ mode        │ status  │ cpu     │ memory   │
├─────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ saas-agents-ia     │ cluster     │ online  │ 0%      │ 120 MB   │
└─────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### 2. Tester l'application

```bash
curl http://localhost:3000
```

### 3. Vérifier Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

### 4. Vérifier PostgreSQL

```bash
sudo -u postgres psql -c "\l" | grep saas-agents-ia
```

### 5. Vérifier SSL

```bash
sudo certbot certificates
```

### 6. Tester le site

Ouvrez votre navigateur et allez sur :
- https://votre-domaine.fr

Vous devriez voir le site avec le cadenas SSL 🔒

---

## 📁 Structure après installation

```
/opt/saas-agents-ia/
├── .env                    # Variables d'environnement
├── .next/                  # Build Next.js
├── node_modules/           # Dépendances
├── prisma/                 # Base de données
│   └── migrations/        # Migrations SQL
├── public/                 # Assets statiques
├── logs/                   # Logs PM2
│   ├── out.log
│   ├── err.log
│   └── combined.log
└── ecosystem.config.js     # Config PM2
```

---

## 🛠️ Commandes Utiles Post-Installation

### Gérer l'application

```bash
# Voir les logs en temps réel
pm2 logs saas-agents-ia

# Voir le statut
pm2 status

# Redémarrer
pm2 restart saas-agents-ia

# Arrêter
pm2 stop saas-agents-ia

# Voir les métriques (CPU, RAM)
pm2 monit
```

### Gérer Nginx

```bash
# Tester la config
sudo nginx -t

# Recharger
sudo systemctl reload nginx

# Voir les logs
sudo tail -f /var/log/nginx/error.log
```

### Gérer PostgreSQL

```bash
# Se connecter à la DB
sudo -u postgres psql saas-agents-ia_prod

# Voir les tables
sudo -u postgres psql saas-agents-ia_prod -c "\dt"

# Backup de la DB
sudo -u postgres pg_dump saas-agents-ia_prod > backup.sql
```

### Mettre à jour l'application

```bash
cd /opt/saas-agents-ia
git pull origin main
npm ci
npm run build
pm2 restart saas-agents-ia
```

---

## 🐛 Troubleshooting

### Problème : L'app ne démarre pas

```bash
# Voir les logs d'erreur
pm2 logs saas-agents-ia --err

# Redémarrer
pm2 restart saas-agents-ia
```

### Problème : Erreur de base de données

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Tester la connexion
psql "postgresql://saas-agents-ia_user:PASSWORD@localhost:5432/saas-agents-ia_prod" -c "SELECT 1;"
```

### Problème : Nginx erreur 502

```bash
# Vérifier que l'app tourne sur le port 3000
curl http://localhost:3000

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problème : SSL ne fonctionne pas

```bash
# Vérifier le DNS
dig +short votre-domaine.fr

# Vérifier les certificats
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew --force-renewal
```

---

## 📝 Variables d'Environnement

Le fichier `.env` est créé automatiquement dans `/opt/saas-agents-ia/.env`

Pour le modifier :

```bash
sudo nano /opt/saas-agents-ia/.env
```

Variables importantes :
- `DATABASE_URL` : Connexion PostgreSQL
- `NEXTAUTH_SECRET` : Secret pour l'auth (généré auto)
- `NEXTAUTH_URL` : URL de votre site
- `NEXT_PUBLIC_API_URL` : URL publique de l'API

Après modification, redémarrez :
```bash
pm2 restart saas-agents-ia
```

---

## 🔒 Sécurité

Le script configure automatiquement :
- ✅ Firewall UFW (ports 22, 80, 443 autorisés)
- ✅ SSL/TLS avec Let's Encrypt
- ✅ Redirection HTTP → HTTPS
- ✅ PostgreSQL accessible uniquement en local

**Recommandations supplémentaires** :
1. Désactiver l'accès root SSH :
   ```bash
   sudo nano /etc/ssh/sshd_config
   # PermitRootLogin no
   sudo systemctl restart sshd
   ```

2. Configurer fail2ban (optionnel) :
   ```bash
   sudo apt install fail2ban
   ```

---

## 📊 Logs

Tous les logs d'installation sont dans :
```
/var/log/saas-agents-install.log
```

Pour les consulter :
```bash
sudo tail -f /var/log/saas-agents-install.log
```

---

## 💡 Conseils

### Pour Oracle Cloud Free Tier

Si vous utilisez Oracle Cloud, n'oubliez pas de configurer les **Security Lists** :
1. Allez dans votre instance → Subnet → Security List
2. Ajoutez des règles Ingress :
   - Port 80 (TCP) : 0.0.0.0/0
   - Port 443 (TCP) : 0.0.0.0/0

### Pour DigitalOcean

Les Droplets ont déjà le firewall cloud configuré. Assurez-vous d'autoriser HTTP et HTTPS.

### Pour AWS EC2

Configurez le Security Group :
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS)

---

## 🎯 Ce que vous obtenez

Après installation, vous avez :
- ✅ Site Next.js en production (HTTPS)
- ✅ Base de données PostgreSQL configurée
- ✅ 8 agents IA pré-chargés
- ✅ PM2 en cluster mode (2 instances)
- ✅ SSL automatique (Let's Encrypt)
- ✅ Firewall configuré
- ✅ Auto-restart au reboot
- ✅ Logs centralisés

---

## 🚀 Prochaines Étapes

1. **Personnaliser le site**
   - Modifier les couleurs dans le code
   - Ajouter votre logo
   - Configurer les agents IA

2. **Configurer n8n** (optionnel)
   - Pour les workflows d'automatisation
   - Suivre le guide dans `docs/n8n-workflows-guide.md`

3. **Configurer l'authentification**
   - Ajouter OAuth (Google, GitHub)
   - Configurer les variables dans `.env`

4. **Monitoring**
   - Installer PM2 Plus pour le monitoring
   - Configurer Sentry pour les erreurs

---

**🎉 Félicitations ! Votre site SaaS Agents IA est en ligne !**
