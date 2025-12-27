# 🔄 Guide de Mise à Jour

## Mise à jour du site depuis GitHub

### 📋 Prérequis
- Le site doit être déjà installé sur la VM
- Vous devez avoir accès SSH à la VM

### 🚀 Méthode Simple (Recommandée)

Connectez-vous à la VM et exécutez :

```bash
cd /opt/saas-agents-ia
./deployment/scripts/update-from-github.sh
```

Le script va automatiquement :
1. ✅ Récupérer les dernières modifications depuis GitHub
2. ✅ Sauvegarder vos changements locaux (si nécessaire)
3. ✅ Installer les nouvelles dépendances (si package.json modifié)
4. ✅ Générer le client Prisma (si schema.prisma modifié)
5. ✅ Builder l'application
6. ✅ Redémarrer PM2
7. ✅ Afficher le statut

### 🔧 Méthode Manuelle

Si vous préférez faire la mise à jour manuellement :

```bash
cd /opt/saas-agents-ia

# 1. Récupérer les mises à jour
git pull origin main

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Générer le client Prisma (si nécessaire)
npx prisma generate

# 4. Builder l'application
npm run build

# 5. Redémarrer PM2
pm2 restart saas-agents-ia
pm2 save
```

### 📊 Vérifier le statut

```bash
# Statut PM2
pm2 status

# Logs de l'application
pm2 logs saas-agents-ia

# Tester l'accès
curl http://localhost:3000
```

### 🆘 En cas de problème

**L'application ne démarre pas :**
```bash
pm2 logs saas-agents-ia --lines 50
```

**Erreur de build :**
```bash
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

**Apache ne proxie pas correctement :**
```bash
systemctl status apache2
apache2ctl configtest
systemctl restart apache2
```

### 🔄 Automatisation (Optionnel)

Pour automatiser les mises à jour, vous pouvez créer un cron job :

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour mettre à jour tous les jours à 3h du matin
0 3 * * * cd /opt/saas-agents-ia && ./deployment/scripts/update-from-github.sh >> /var/log/saas-agents-ia-update.log 2>&1
```

### 📝 Notes

- Le script sauvegarde automatiquement vos changements locaux avec `git stash`
- Les migrations Prisma nécessitent une confirmation manuelle
- PM2 est automatiquement redémarré après le build
- Les logs de mise à jour sont affichés en temps réel

---

**💡 Conseil** : Testez d'abord vos changements en local avant de les déployer en production !
