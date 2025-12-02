#!/bin/bash

###############################################################################
# Script de Configuration Nginx - SaaS Agents IA
#
# Description: Configure Nginx comme reverse proxy pour Next.js
# Usage: sudo ./setup-nginx.sh your-domain.com
###############################################################################

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Vérifier les arguments
if [ -z "$1" ]; then
    log_error "Usage: ./setup-nginx.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
APP_NAME="saas-agents-ia"
CONFIG_FILE="/etc/nginx/sites-available/$APP_NAME"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🌐 Configuration Nginx                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

log_info "Configuration Nginx pour: $DOMAIN"

# Créer la configuration Nginx
log_info "Création de la configuration Nginx..."

sudo tee "$CONFIG_FILE" > /dev/null <<EOF
# Configuration Nginx pour SaaS Agents IA
# Domaine: $DOMAIN

server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN www.$DOMAIN;

    # Logs
    access_log /var/log/nginx/${APP_NAME}-access.log;
    error_log /var/log/nginx/${APP_NAME}-error.log;

    # Taille maximale des uploads
    client_max_body_size 50M;

    # Reverse proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques Next.js
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Cache pour les images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml+rss;
}
EOF

log_success "Configuration Nginx créée"

# Activer la configuration
log_info "Activation de la configuration..."

# Supprimer le lien symbolique existant s'il existe
if [ -L "/etc/nginx/sites-enabled/$APP_NAME" ]; then
    sudo rm "/etc/nginx/sites-enabled/$APP_NAME"
fi

# Créer le lien symbolique
sudo ln -s "$CONFIG_FILE" /etc/nginx/sites-enabled/

log_success "Configuration activée"

# Désactiver le site par défaut (optionnel)
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    log_info "Désactivation du site par défaut..."
    sudo rm /etc/nginx/sites-enabled/default
    log_success "Site par défaut désactivé"
fi

# Tester la configuration
log_info "Test de la configuration Nginx..."
if sudo nginx -t; then
    log_success "Configuration Nginx valide"
else
    log_error "Erreur dans la configuration Nginx"
    exit 1
fi

# Recharger Nginx
log_info "Rechargement de Nginx..."
sudo systemctl reload nginx
log_success "Nginx rechargé"

echo ""
log_success "✨ Nginx configuré avec succès !"
echo ""
log_info "Prochaines étapes:"
echo "  1. Configurer les DNS pour pointer vers cette VM"
echo "  2. Configurer SSL: ./setup-ssl.sh $DOMAIN"
echo "  3. Déployer l'application: ./deploy.sh"
echo ""
log_info "Test:"
echo "  curl http://$DOMAIN"
echo ""
