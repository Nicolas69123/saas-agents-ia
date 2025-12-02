#!/bin/bash

###############################################################################
# Script d'Installation des Dépendances - SaaS Agents IA
#
# Description: Installe Node.js, PM2, Nginx, Git sur une VM Linux
# Usage: sudo ./install-dependencies.sh
###############################################################################

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   📦 Installation des Dépendances         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est root ou sudo
if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
    log_error "Ce script nécessite les privilèges sudo"
    exit 1
fi

# 1. Mise à jour du système
log_info "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y
log_success "Système mis à jour"

# 2. Installer Node.js 20.x
log_info "Installation de Node.js 20.x..."
if command -v node &> /dev/null; then
    log_success "Node.js déjà installé ($(node --version))"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    log_success "Node.js installé ($(node --version))"
fi

# 3. Installer PM2
log_info "Installation de PM2..."
if command -v pm2 &> /dev/null; then
    log_success "PM2 déjà installé ($(pm2 --version))"
else
    sudo npm install -g pm2
    log_success "PM2 installé ($(pm2 --version))"
fi

# 4. Installer Nginx
log_info "Installation de Nginx..."
if command -v nginx &> /dev/null; then
    log_success "Nginx déjà installé ($(nginx -v 2>&1))"
else
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    log_success "Nginx installé et démarré"
fi

# 5. Installer Git
log_info "Installation de Git..."
if command -v git &> /dev/null; then
    log_success "Git déjà installé ($(git --version))"
else
    sudo apt install -y git
    log_success "Git installé ($(git --version))"
fi

# 6. Installer Certbot (pour SSL)
log_info "Installation de Certbot..."
if command -v certbot &> /dev/null; then
    log_success "Certbot déjà installé"
else
    sudo apt install -y certbot python3-certbot-nginx
    log_success "Certbot installé"
fi

# 7. Installer UFW (firewall)
log_info "Installation de UFW..."
if command -v ufw &> /dev/null; then
    log_success "UFW déjà installé"
else
    sudo apt install -y ufw
    log_success "UFW installé"
fi

# Résumé
echo ""
log_success "✨ Toutes les dépendances sont installées !"
echo ""
log_info "Versions installées:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - PM2: $(pm2 --version)"
echo "  - Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  - Git: $(git --version | cut -d' ' -f3)"
echo ""
log_info "Prochaines étapes:"
echo "  1. Cloner le repo: git clone https://github.com/Nicolas69123/saas-agents-ia.git"
echo "  2. Configurer Nginx: ./setup-nginx.sh your-domain.com"
echo "  3. Configurer SSL: ./setup-ssl.sh your-domain.com"
echo "  4. Déployer: ./deploy.sh"
echo ""
