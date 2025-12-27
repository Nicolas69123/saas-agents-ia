#!/bin/bash

# Script de configuration du webhook GitHub
# Usage: ./setup-webhook.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}🔧 Configuration Webhook GitHub${NC}"
echo -e "${CYAN}================================${NC}\n"

# Vérifier qu'on est root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Ce script doit être exécuté en root${NC}"
  exit 1
fi

# Générer un secret aléatoire si nécessaire
if [ -z "$WEBHOOK_SECRET" ]; then
  WEBHOOK_SECRET=$(openssl rand -hex 32)
  echo -e "${CYAN}🔐 Secret webhook généré: ${WEBHOOK_SECRET}${NC}"
  echo -e "${YELLOW}⚠️  SAUVEGARDE CE SECRET ! Tu en auras besoin pour GitHub${NC}\n"
fi

# Créer le fichier d'environnement
echo -e "${CYAN}📝 Création du fichier d'environnement...${NC}"
cat > /opt/saas-agents-ia/.env.webhook << EOF
WEBHOOK_PORT=9000
WEBHOOK_SECRET=${WEBHOOK_SECRET}
EOF

chmod 600 /opt/saas-agents-ia/.env.webhook

# Copier le service systemd
echo -e "${CYAN}📦 Installation du service systemd...${NC}"
cp /opt/saas-agents-ia/deployment/webhook/webhook-deploy.service /etc/systemd/system/

# Modifier le service pour utiliser le fichier .env
sed -i "s|Environment=\"WEBHOOK_SECRET=CHANGE_ME_IN_ENV_FILE\"|EnvironmentFile=/opt/saas-agents-ia/.env.webhook|" /etc/systemd/system/webhook-deploy.service

# Rendre le script webhook exécutable
chmod +x /opt/saas-agents-ia/deployment/webhook/webhook-receiver.js

# Créer le fichier de log
touch /var/log/webhook-deployment.log
chmod 644 /var/log/webhook-deployment.log

# Recharger systemd
echo -e "${CYAN}🔄 Rechargement de systemd...${NC}"
systemctl daemon-reload

# Démarrer le service
echo -e "${CYAN}🚀 Démarrage du service webhook...${NC}"
systemctl enable webhook-deploy.service
systemctl start webhook-deploy.service

# Vérifier le statut
sleep 2
if systemctl is-active --quiet webhook-deploy.service; then
  echo -e "\n${GREEN}✅ Webhook service démarré avec succès !${NC}\n"
else
  echo -e "\n${RED}❌ Erreur lors du démarrage du service${NC}"
  systemctl status webhook-deploy.service
  exit 1
fi

# Configurer le firewall
echo -e "${CYAN}🔥 Configuration du firewall...${NC}"
if command -v ufw &> /dev/null; then
  ufw allow 9000/tcp comment "GitHub Webhook"
  echo -e "${GREEN}✅ Port 9000 ouvert${NC}"
fi

# Afficher les informations
echo -e "\n${CYAN}================================${NC}"
echo -e "${GREEN}✨ Configuration terminée ! ✨${NC}"
echo -e "${CYAN}================================${NC}\n"

echo -e "${YELLOW}📋 Informations importantes:${NC}"
echo -e "   Port webhook: ${CYAN}9000${NC}"
echo -e "   URL webhook: ${CYAN}http://$(hostname -I | awk '{print $1}'):9000/webhook${NC}"
echo -e "   Secret: ${CYAN}${WEBHOOK_SECRET}${NC}"
echo -e "   Logs: ${CYAN}/var/log/webhook-deployment.log${NC}\n"

echo -e "${YELLOW}🔧 Commandes utiles:${NC}"
echo -e "   Status: ${CYAN}systemctl status webhook-deploy${NC}"
echo -e "   Logs: ${CYAN}tail -f /var/log/webhook-deployment.log${NC}"
echo -e "   Restart: ${CYAN}systemctl restart webhook-deploy${NC}"
echo -e "   Stop: ${CYAN}systemctl stop webhook-deploy${NC}\n"

echo -e "${YELLOW}📝 Configuration GitHub Webhook:${NC}"
echo -e "   1. Va sur: ${CYAN}https://github.com/Nicolas69123/saas-agents-ia/settings/hooks${NC}"
echo -e "   2. Clique sur 'Add webhook'"
echo -e "   3. Payload URL: ${CYAN}http://$(hostname -I | awk '{print $1}'):9000/webhook${NC}"
echo -e "   4. Content type: ${CYAN}application/json${NC}"
echo -e "   5. Secret: ${CYAN}${WEBHOOK_SECRET}${NC}"
echo -e "   6. Events: ${CYAN}Just the push event${NC}"
echo -e "   7. Active: ${CYAN}✓${NC}\n"

echo -e "${GREEN}🎉 Le déploiement automatique est maintenant actif !${NC}"
echo -e "${GREEN}Chaque push sur 'main' déclenchera une mise à jour automatique.${NC}\n"
