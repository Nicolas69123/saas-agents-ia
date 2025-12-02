#!/bin/bash

###############################################################################
# Script de Configuration Firewall - SaaS Agents IA
#
# Description: Configure UFW (Ubuntu Firewall)
# Usage: sudo ./setup-firewall.sh
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

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🔥 Configuration Firewall (UFW)         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est root ou sudo
if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
    log_error "Ce script nécessite les privilèges sudo"
    exit 1
fi

# Vérifier que UFW est installé
if ! command -v ufw &> /dev/null; then
    log_info "Installation de UFW..."
    sudo apt update && sudo apt install -y ufw
    log_success "UFW installé"
fi

# Désactiver UFW temporairement (pour éviter de se bloquer)
log_info "Configuration des règles firewall..."

# Réinitialiser les règles (optionnel)
# sudo ufw --force reset

# Politique par défaut: bloquer tout entrant, autoriser tout sortant
sudo ufw default deny incoming
sudo ufw default allow outgoing

log_success "Politique par défaut configurée"

# Autoriser SSH (IMPORTANT!)
log_info "Autorisation SSH (port 22)..."
sudo ufw allow ssh
sudo ufw allow 22/tcp
log_success "SSH autorisé"

# Autoriser HTTP (port 80)
log_info "Autorisation HTTP (port 80)..."
sudo ufw allow http
sudo ufw allow 80/tcp
log_success "HTTP autorisé"

# Autoriser HTTPS (port 443)
log_info "Autorisation HTTPS (port 443)..."
sudo ufw allow https
sudo ufw allow 443/tcp
log_success "HTTPS autorisé"

# Optionnel: Autoriser d'autres ports si nécessaire
# Décommenter selon tes besoins:

# PostgreSQL (si base de données externe)
# sudo ufw allow 5432/tcp

# n8n (si accessible de l'extérieur - NON RECOMMANDÉ en production)
# sudo ufw allow 5678/tcp

# Afficher les règles avant activation
echo ""
log_info "Règles firewall configurées:"
sudo ufw show added

# Demander confirmation avant activation
echo ""
log_warning "⚠️  ATTENTION: Le firewall va être activé !"
log_warning "Assurez-vous que SSH est bien autorisé (port 22)"
echo ""
read -p "Activer le firewall maintenant? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Activation du firewall annulée"
    log_info "Pour activer plus tard: sudo ufw enable"
    exit 0
fi

# Activer UFW
log_info "Activation du firewall..."
sudo ufw --force enable
log_success "Firewall activé"

# Afficher le statut
echo ""
log_info "Statut du firewall:"
sudo ufw status verbose

echo ""
log_success "✨ Firewall configuré avec succès !"
echo ""
log_info "Ports autorisés:"
echo "  - 22 (SSH)"
echo "  - 80 (HTTP)"
echo "  - 443 (HTTPS)"
echo ""
log_warning "N'oubliez pas de configurer aussi le firewall de votre cloud provider!"
log_info "(Security Groups sur AWS/Oracle Cloud, Firewall Rules sur GCP, etc.)"
echo ""
log_info "Commandes utiles:"
echo "  - Voir le statut: sudo ufw status"
echo "  - Ajouter une règle: sudo ufw allow <port>/tcp"
echo "  - Supprimer une règle: sudo ufw delete allow <port>/tcp"
echo "  - Désactiver: sudo ufw disable"
echo ""
