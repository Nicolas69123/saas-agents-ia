# 🚀 Guide Rapide - Déploiement VM

> **Guide ultra-rapide** pour déployer ton site en 10 minutes sur n'importe quelle VM

---

## 📝 Checklist Avant de Commencer

- [ ] VM Linux (Ubuntu 20.04+) avec IP publique
- [ ] Accès SSH à la VM
- [ ] Nom de domaine (ex: `saas-agents-ia.fr`)
- [ ] Accès au DNS du domaine

---

## ⚡ Installation en 5 Commandes

### 1️⃣ Sur ta VM - Installation des dépendances

```bash
# Se connecter à la VM
ssh user@your-vm-ip

# Installer Node.js, PM2, Nginx, Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
sudo apt update && \
sudo apt install -y nodejs nginx git && \
sudo npm install -g pm2
```

### 2️⃣ Cloner et Build

```bash
# Cloner le repo
cd ~
git clone https://github.com/Nicolas69123/saas-agents-ia.git
cd saas-agents-ia

# Installer et build
npm ci
npm run build

# Créer le dossier logs
mkdir -p logs
```

### 3️⃣ Démarrer avec PM2

```bash
# Démarrer l'app
pm2 start ecosystem.config.js

# Sauvegarder et auto-start
pm2 save
pm2 startup
# Exécuter la commande affichée
```

### 4️⃣ Configurer Nginx

```bash
# Créer la config Nginx
sudo tee /etc/nginx/sites-available/saas-agents-ia > /dev/null <<'EOF'
server {
    listen 80;
    server_name saas-agents-ia.fr www.saas-agents-ia.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activer et redémarrer
sudo ln -s /etc/nginx/sites-available/saas-agents-ia /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5️⃣ SSL avec Certbot

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL (remplace par ton domaine)
sudo certbot --nginx -d saas-agents-ia.fr -d www.saas-agents-ia.fr
```

---

## 🌐 Configuration DNS

Sur ton registrar (OVH, Gandi, etc.), ajoute :

```
Type A :  @    →  YOUR_VM_IP
Type A :  www  →  YOUR_VM_IP
```

**Attends 5-10 minutes** pour la propagation DNS.

---

## 🔥 Firewall

```bash
# Autoriser les ports nécessaires
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

⚠️ **N'oublie pas** de configurer aussi le firewall de ton cloud provider !

---

## ✅ Test Final

```bash
# Tester en local
curl http://localhost:3000

# Tester le domaine
curl https://saas-agents-ia.fr
```

Ouvre ton navigateur : **https://saas-agents-ia.fr** 🎉

---

## 🔄 Déploiement des Mises à Jour

### Méthode Simple
```bash
cd ~/saas-agents-ia
git pull origin main
npm ci
npm run build
pm2 reload saas-agents-ia
```

### Méthode Automatique (recommandée)
```bash
# Une seule commande !
./scripts/deploy.sh main
```

---

## 📊 Commandes Utiles

```bash
# Voir le statut
pm2 status

# Voir les logs en temps réel
pm2 logs saas-agents-ia

# Redémarrer l'app
pm2 restart saas-agents-ia

# Voir les métriques
pm2 monit
```

---

## 🐛 Problèmes Courants

### App ne démarre pas
```bash
pm2 logs saas-agents-ia --lines 50
```

### Nginx erreur
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 déjà utilisé
```bash
sudo lsof -i :3000
# Puis tuer le processus
kill -9 PID
```

---

## 🔗 Aller Plus Loin

Pour le guide complet avec toutes les explications :
👉 **[DEPLOYMENT-VM.md](./DEPLOYMENT-VM.md)**

---

## 💡 Tips

✅ **Monitoring** : Installe PM2 Plus pour surveiller ton app
✅ **Logs** : Configure la rotation des logs Nginx
✅ **Backup** : Fais des backups réguliers de ta DB
✅ **Security** : Désactive l'accès root SSH
✅ **Updates** : Automatise les déploiements avec GitHub Actions

---

**🎉 C'est tout ! Ton site est en ligne !**
