#!/bin/bash

###############################################################################
# Script de Configuration SSL - SaaS Agents IA
#
# Description: Configure SSL avec Let's Encrypt (Certbot)
# Usage: sudo ./setup-ssl.sh your-domain.com
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
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Vérifier les arguments
if [ -z "$1" ]; then
    log_error "Usage: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🔒 Configuration SSL (Let's Encrypt)    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

log_info "Configuration SSL pour: $DOMAIN et www.$DOMAIN"

# Vérifier que Certbot est installé
if ! command -v certbot &> /dev/null; then
    log_error "Certbot n'est pas installé. Installez-le avec:"
    echo "  sudo apt install -y certbot python3-certbot-nginx"
    exit 1
fi

# Vérifier que Nginx fonctionne
if ! sudo systemctl is-active --quiet nginx; then
    log_error "Nginx n'est pas démarré. Démarrez-le avec:"
    echo "  sudo systemctl start nginx"
    exit 1
fi

# Vérifier que le DNS pointe vers cette VM
log_info "Vérification du DNS..."
VM_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short "$DOMAIN" | tail -n1)

if [ -z "$DOMAIN_IP" ]; then
    log_warning "Le DNS pour $DOMAIN ne retourne pas d'IP"
    log_warning "Assurez-vous que votre DNS pointe vers: $VM_IP"
    read -p "Voulez-vous continuer quand même? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Configuration SSL annulée"
        exit 1
    fi
elif [ "$DOMAIN_IP" != "$VM_IP" ]; then
    log_warning "Le DNS pointe vers: $DOMAIN_IP"
    log_warning "Mais votre VM est sur: $VM_IP"
    read -p "Voulez-vous continuer quand même? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Configuration SSL annulée"
        exit 1
    fi
else
    log_success "DNS configuré correctement"
fi

# Obtenir le certificat SSL
log_info "Obtention du certificat SSL avec Certbot..."
log_info "Cela peut prendre quelques minutes..."

# Options Certbot:
# --nginx: Plugin Nginx (configure automatiquement)
# -d: Domaine(s)
# --non-interactive: Mode non-interactif
# --agree-tos: Accepter les conditions
# --redirect: Rediriger HTTP vers HTTPS

if sudo certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --redirect \
    --email "nicolas@saas-agents-ia.fr"; then

    log_success "Certificat SSL obtenu et installé !"
else
    log_error "Erreur lors de l'obtention du certificat SSL"
    log_info "Vérifiez que:"
    echo "  1. Le DNS pointe vers cette VM"
    echo "  2. Les ports 80 et 443 sont ouverts"
    echo "  3. Nginx est configuré correctement"
    exit 1
fi

# Vérifier le renouvellement automatique
log_info "Configuration du renouvellement automatique..."

# Tester le renouvellement
if sudo certbot renew --dry-run; then
    log_success "Renouvellement automatique configuré"
else
    log_warning "Erreur lors du test de renouvellement"
fi

# Vérifier le timer systemd
if sudo systemctl is-active --quiet certbot.timer; then
    log_success "Timer de renouvellement actif"
else
    log_info "Activation du timer de renouvellement..."
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    log_success "Timer activé"
fi

# Afficher les certificats
echo ""
log_info "Certificats installés:"
sudo certbot certificates

echo ""
log_success "✨ SSL configuré avec succès !"
echo ""
log_info "Votre site est maintenant accessible en HTTPS:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
log_info "Renouvellement automatique:"
echo "  - Les certificats sont valides 90 jours"
echo "  - Le renouvellement automatique est actif"
echo "  - Vérifier le statut: sudo systemctl status certbot.timer"
echo ""
