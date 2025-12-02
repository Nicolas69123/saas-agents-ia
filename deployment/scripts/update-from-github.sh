#!/bin/bash

# Script de mise à jour du site depuis GitHub
# Usage: ./update-from-github.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Chemin de l'application
APP_DIR="/opt/saas-agents-ia"

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}🔄 Mise à jour depuis GitHub${NC}"
echo -e "${CYAN}================================${NC}\n"

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Erreur: Le répertoire $APP_DIR n'existe pas${NC}"
    exit 1
fi

cd "$APP_DIR"

# 1. Sauvegarder les changements locaux éventuels
echo -e "${YELLOW}📋 Vérification des changements locaux...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Changements locaux détectés. Sauvegarde...${NC}"
    git stash
    STASHED=true
else
    STASHED=false
fi

# 2. Récupérer les mises à jour depuis GitHub
echo -e "${CYAN}📥 Récupération des mises à jour depuis GitHub...${NC}"
git fetch origin main
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du git pull${NC}"
    exit 1
fi

# 3. Vérifier si package.json a changé
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    echo -e "${CYAN}📦 package.json modifié, installation des dépendances...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Aucun changement dans package.json${NC}"
fi

# 4. Vérifier si schema.prisma a changé
if git diff --name-only HEAD@{1} HEAD | grep -q "prisma/schema.prisma"; then
    echo -e "${CYAN}🗄️  schema.prisma modifié, génération du client Prisma...${NC}"
    npx prisma generate

    echo -e "${YELLOW}⚠️  Voulez-vous exécuter les migrations ? (y/n)${NC}"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx prisma migrate deploy
    fi
else
    echo -e "${GREEN}✅ Aucun changement dans schema.prisma${NC}"
fi

# 5. Build de l'application
echo -e "${CYAN}🔨 Build de l'application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

# 6. Redémarrer PM2
echo -e "${CYAN}🔄 Redémarrage de l'application...${NC}"
if pm2 describe saas-agents-ia &> /dev/null; then
    pm2 restart saas-agents-ia
    pm2 save
else
    echo -e "${YELLOW}⚠️  L'application n'est pas démarrée dans PM2. Démarrage...${NC}"
    pm2 start npm --name "saas-agents-ia" -- start
    pm2 save
fi

# 7. Restaurer les changements locaux si nécessaire
if [ "$STASHED" = true ]; then
    echo -e "${YELLOW}📋 Restauration des changements locaux...${NC}"
    git stash pop
fi

# 8. Afficher le statut
echo -e "\n${GREEN}✅ Mise à jour terminée avec succès !${NC}\n"

echo -e "${CYAN}📊 Statut PM2:${NC}"
pm2 status

echo -e "\n${CYAN}📝 Derniers commits:${NC}"
git log --oneline -5

echo -e "\n${CYAN}🌐 Site accessible sur:${NC}"
echo -e "   http://$(hostname -I | awk '{print $1}')"
echo -e "   http://86.202.190.207\n"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✨ Mise à jour réussie ! ✨${NC}"
echo -e "${GREEN}================================${NC}\n"
