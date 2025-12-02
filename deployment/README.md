# 📦 Dossier de Déploiement VM

> Tout ce dont tu as besoin pour déployer ton site Next.js sur une VM en **1 SEULE commande** !

---

## 🚀 Installation Ultra-Rapide (1 commande)

### Sur ta VM, exécute :

```bash
curl -fsSL https://raw.githubusercontent.com/Nicolas69123/saas-agents-ia/main/deployment/scripts/install-all.sh | sudo bash
```

**C'est TOUT ! ✨**

Le script installe automatiquement :
- ✅ Node.js 20.x + PM2
- ✅ PostgreSQL (base de données)
- ✅ Nginx (reverse proxy)
- ✅ SSL avec Let's Encrypt
- ✅ Firewall (UFW)
- ✅ L'application complète

**Durée** : 10-15 minutes ⏱️

---

## 📁 Structure du Dossier

```
deployment/
├── 📄 README.md                          # Ce fichier
├── 📄 INSTALLATION-1-COMMANDE.md         # 📚 Guide complet d'utilisation
│
├── 📁 scripts/                           # Scripts automatisés
│   ├── install-all.sh                   # 🚀 LE script principal (fait tout)
│   ├── deploy.sh                        # 🔄 Mises à jour futures
│   └── rollback.sh                      # ⏮️  Restaurer version précédente
│
├── 📁 docs/                              # Documentation
│   └── 03-ALTERNATIVES.md               # 🎯 Comparaison des solutions (Vercel, Railway, etc.)
│
└── 📁 config/                            # Fichiers de configuration
    ├── ecosystem.config.js              # ⚙️  Configuration PM2
    ├── nginx.conf                       # 🌐 Configuration Nginx (exemple)
    └── .env.production                  # 🔐 Variables d'environnement (template)
```

---

## 📖 Documentation

### Guide Principal
👉 **[INSTALLATION-1-COMMANDE.md](./INSTALLATION-1-COMMANDE.md)** - Guide ultra-complet

Ce guide contient :
- ✅ Instructions détaillées d'installation
- ✅ Explications de chaque étape
- ✅ Commandes utiles post-installation
- ✅ Troubleshooting complet
- ✅ Configuration sécurité
- ✅ Monitoring & logs

### Comparaison des Solutions
👉 **[docs/03-ALTERNATIVES.md](./docs/03-ALTERNATIVES.md)** - Comparaison Vercel, Railway, Oracle Cloud, etc.

---

## 🎯 Workflows de Déploiement

### 1️⃣ Première Installation (VM vierge)

```bash
# Une seule commande !
curl -fsSL https://raw.githubusercontent.com/Nicolas69123/saas-agents-ia/main/deployment/scripts/install-all.sh | sudo bash
```

Le script te demandera :
1. Ton nom de domaine
2. Ton email (pour SSL)
3. Un mot de passe pour PostgreSQL

Puis il fait **TOUT** automatiquement ! 🤖

---

### 2️⃣ Mises à Jour Futures

Une fois installé, pour déployer une nouvelle version :

```bash
cd /opt/saas-agents-ia/deployment/scripts
./deploy.sh main
```

---

### 3️⃣ Rollback (si problème)

Si une mise à jour pose problème :

```bash
cd /opt/saas-agents-ia/deployment/scripts
./rollback.sh
```

---

## 📋 Prérequis

Avant de lancer le script, assure-toi d'avoir :

- ✅ Une VM Linux (Ubuntu 20.04+ ou Debian 11+)
- ✅ Minimum 2 GB RAM
- ✅ Accès root (sudo)
- ✅ IP publique
- ✅ Un nom de domaine configuré (DNS → IP de ta VM)
- ✅ Un email valide (pour SSL)

---

## 🎁 Ce que tu obtiens

Après l'installation, tu as :

- ✅ **Site en ligne** avec HTTPS (SSL automatique)
- ✅ **PostgreSQL** configuré avec 8 agents IA pré-chargés
- ✅ **PM2** en cluster mode (2 instances)
- ✅ **Nginx** comme reverse proxy
- ✅ **Firewall** sécurisé (UFW)
- ✅ **Auto-restart** au reboot de la VM
- ✅ **Logs centralisés**

---

## 🛠️ Commandes Utiles

### Gérer l'application

```bash
# Voir les logs
pm2 logs saas-agents-ia

# Statut
pm2 status

# Redémarrer
pm2 restart saas-agents-ia

# Monitoring (CPU, RAM)
pm2 monit
```

### Gérer Nginx

```bash
# Tester la config
sudo nginx -t

# Recharger
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/error.log
```

### Gérer PostgreSQL

```bash
# Se connecter
sudo -u postgres psql saas-agents-ia_prod

# Voir les tables
sudo -u postgres psql saas-agents-ia_prod -c "\dt"

# Backup
sudo -u postgres pg_dump saas-agents-ia_prod > backup.sql
```

---

## 🔍 Vérification Post-Installation

```bash
# 1. Vérifier que l'app tourne
pm2 status

# 2. Tester l'application
curl http://localhost:3000

# 3. Vérifier Nginx
sudo systemctl status nginx

# 4. Vérifier PostgreSQL
sudo systemctl status postgresql

# 5. Vérifier SSL
sudo certbot certificates

# 6. Tester le site
curl -I https://ton-domaine.fr
```

---

## 🐛 Troubleshooting

### L'app ne démarre pas

```bash
pm2 logs saas-agents-ia --err
pm2 restart saas-agents-ia
```

### Erreur de base de données

```bash
sudo systemctl status postgresql
psql "postgresql://user:pass@localhost:5432/db" -c "SELECT 1;"
```

### Nginx erreur 502

```bash
curl http://localhost:3000
sudo tail -f /var/log/nginx/error.log
```

### SSL ne fonctionne pas

```bash
dig +short ton-domaine.fr
sudo certbot certificates
sudo certbot renew --force-renewal
```

---

## 📊 Logs

Tous les logs d'installation :
```bash
sudo tail -f /var/log/saas-agents-install.log
```

Logs de l'application :
```bash
pm2 logs saas-agents-ia
# ou
tail -f /opt/saas-agents-ia/logs/*.log
```

---

## 💡 Conseils par Provider

### Oracle Cloud Free Tier
Configure les **Security Lists** :
- Port 80 (TCP) : 0.0.0.0/0
- Port 443 (TCP) : 0.0.0.0/0

### DigitalOcean
Active HTTP et HTTPS dans le firewall cloud

### AWS EC2
Configure le **Security Group** :
- Port 22 (SSH), 80 (HTTP), 443 (HTTPS)

---

## 📚 Ressources

- **Repo GitHub** : https://github.com/Nicolas69123/saas-agents-ia
- **Guide Complet** : [INSTALLATION-1-COMMANDE.md](./INSTALLATION-1-COMMANDE.md)
- **Alternatives** : [docs/03-ALTERNATIVES.md](./docs/03-ALTERNATIVES.md)
- **Next.js Docs** : https://nextjs.org/docs/deployment
- **PM2 Docs** : https://pm2.keymetrics.io/docs

---

**🎉 Bon déploiement !**
