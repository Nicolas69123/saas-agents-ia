# 📦 Dossier de Déploiement VM

> Tous les fichiers nécessaires pour déployer le site Next.js sur une VM

---

## 📁 Structure du Dossier

```
deployment/
├── README.md                          # Ce fichier
├── docs/                              # Documentation complète
│   ├── 01-QUICKSTART.md              # ⚡ Guide rapide (5 commandes)
│   ├── 02-FULL-GUIDE.md              # 📖 Guide complet détaillé
│   └── 03-ALTERNATIVES.md            # 🎯 Comparaison des solutions
├── scripts/                           # Scripts automatisés
│   ├── deploy.sh                     # 🚀 Script de déploiement
│   ├── install-dependencies.sh       # 📦 Installation dépendances
│   ├── setup-nginx.sh                # 🌐 Configuration Nginx
│   ├── setup-ssl.sh                  # 🔒 Configuration SSL
│   └── rollback.sh                   # ⏮️  Rollback en cas d'erreur
└── config/                            # Fichiers de configuration
    ├── ecosystem.config.js           # ⚙️  Configuration PM2
    ├── nginx.conf                    # 🌐 Configuration Nginx
    ├── .env.production               # 🔐 Variables d'environnement
    └── setup-firewall.sh             # 🔥 Configuration firewall
```

---

## 🚀 Démarrage Rapide

### Option 1 : Guide Ultra-Rapide (10 minutes)
```bash
cd deployment/docs
cat 01-QUICKSTART.md
```

### Option 2 : Guide Complet (avec explications)
```bash
cd deployment/docs
cat 02-FULL-GUIDE.md
```

### Option 3 : Déploiement Automatisé (1 commande)
```bash
# Sur ta VM, après avoir cloné le repo
cd ~/saas-agents-ia/deployment/scripts
./deploy.sh
```

---

## 📋 Checklist Avant de Démarrer

- [ ] VM Linux (Ubuntu 20.04+) avec IP publique
- [ ] Accès SSH à la VM
- [ ] Nom de domaine configuré
- [ ] Accès au panneau DNS du domaine
- [ ] Repo GitHub cloné sur la VM

---

## 🎯 Workflows de Déploiement

### Première Installation

```bash
# 1. Sur ta VM
ssh user@your-vm-ip
cd ~
git clone https://github.com/Nicolas69123/saas-agents-ia.git
cd saas-agents-ia/deployment/scripts

# 2. Installer les dépendances
./install-dependencies.sh

# 3. Configurer Nginx
./setup-nginx.sh saas-agents-ia.fr

# 4. Configurer SSL
./setup-ssl.sh saas-agents-ia.fr

# 5. Déployer l'application
./deploy.sh
```

### Mises à Jour Futures

```bash
# Une seule commande !
cd ~/saas-agents-ia/deployment/scripts
./deploy.sh main
```

### Rollback (en cas de problème)

```bash
cd ~/saas-agents-ia/deployment/scripts
./rollback.sh
```

---

## 🔧 Configuration Personnalisée

### Variables d'Environnement

Édite `config/.env.production` avant le déploiement :

```bash
nano deployment/config/.env.production
```

### Configuration PM2

Édite `config/ecosystem.config.js` si nécessaire :

```bash
nano deployment/config/ecosystem.config.js
```

### Configuration Nginx

Édite `config/nginx.conf` pour personnaliser :

```bash
nano deployment/config/nginx.conf
```

---

## 📊 Scripts Disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `install-dependencies.sh` | Installe Node.js, PM2, Nginx, Git | `./install-dependencies.sh` |
| `deploy.sh` | Déploie l'application (pull, build, restart) | `./deploy.sh [branch]` |
| `setup-nginx.sh` | Configure Nginx automatiquement | `./setup-nginx.sh domain.com` |
| `setup-ssl.sh` | Configure SSL avec Let's Encrypt | `./setup-ssl.sh domain.com` |
| `rollback.sh` | Restaure la version précédente | `./rollback.sh` |
| `setup-firewall.sh` | Configure UFW (firewall) | `./setup-firewall.sh` |

---

## 🐛 Troubleshooting

### Problème d'installation

```bash
# Voir les logs du script
tail -f /var/log/deployment.log
```

### Application ne démarre pas

```bash
# Voir les logs PM2
pm2 logs saas-agents-ia

# Redémarrer manuellement
pm2 restart saas-agents-ia
```

### Nginx ne fonctionne pas

```bash
# Tester la configuration
sudo nginx -t

# Voir les erreurs
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 Documentation Complète

- **Guide Rapide** : `docs/01-QUICKSTART.md`
- **Guide Complet** : `docs/02-FULL-GUIDE.md`
- **Alternatives** : `docs/03-ALTERNATIVES.md`

---

## 💡 Tips

✅ **Backup** : Les scripts font des backups automatiques
✅ **Logs** : Tous les logs sont dans `~/saas-agents-ia/logs/`
✅ **Monitoring** : Utilise `pm2 monit` pour surveiller l'app
✅ **Updates** : Lance `./deploy.sh` après chaque push GitHub

---

## 🔗 Liens Utiles

- **Repo GitHub** : https://github.com/Nicolas69123/saas-agents-ia
- **Next.js Docs** : https://nextjs.org/docs/deployment
- **PM2 Docs** : https://pm2.keymetrics.io/docs
- **Nginx Docs** : https://nginx.org/en/docs/

---

**🎉 Bon déploiement !**
