#!/bin/bash

###############################################################################
# Script de Déploiement Automatisé - SaaS Agents IA
#
# Description: Déploie automatiquement la dernière version depuis GitHub
# Usage: ./scripts/deploy.sh [branch]
# Exemple: ./scripts/deploy.sh main
###############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="saas-agents-ia"
BRANCH="${1:-main}"  # Branche par défaut: main
BACKUP_DIR="$APP_DIR/../backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi

    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 n'est pas installé. Installez-le avec: npm install -g pm2"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi

    log_success "Tous les prérequis sont installés"
}

# Créer une sauvegarde
create_backup() {
    log_info "Création d'une sauvegarde..."

    mkdir -p "$BACKUP_DIR"

    if [ -f "$APP_DIR/.env" ]; then
        cp "$APP_DIR/.env" "$BACKUP_DIR/.env_$TIMESTAMP"
        log_success "Fichier .env sauvegardé"
    fi

    if [ -d "$APP_DIR/.next" ]; then
        tar -czf "$BACKUP_DIR/build_$TIMESTAMP.tar.gz" -C "$APP_DIR" .next
        log_success "Build précédent sauvegardé"
    fi
}

# Nettoyer les vieilles sauvegardes (garder les 5 dernières)
cleanup_old_backups() {
    log_info "Nettoyage des anciennes sauvegardes..."

    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t build_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm --
        ls -t .env_* 2>/dev/null | tail -n +6 | xargs -r rm --
        log_success "Anciennes sauvegardes nettoyées"
    fi
}

# Déploiement principal
deploy() {
    log_info "🚀 Démarrage du déploiement sur la branche '$BRANCH'..."
    echo ""

    # Aller dans le dossier de l'app
    cd "$APP_DIR"

    # Vérifier l'état Git
    log_info "Vérification de l'état Git..."
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Des modifications locales non committées existent"
        read -p "Voulez-vous continuer? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Déploiement annulé"
            exit 1
        fi
    fi

    # Pull des dernières modifications
    log_info "📥 Pull des dernières modifications depuis origin/$BRANCH..."
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    log_success "Code mis à jour"

    # Installation des dépendances
    log_info "📦 Installation des dépendances..."
    npm ci --production=false
    log_success "Dépendances installées"

    # Build de l'application
    log_info "🏗️  Build de l'application Next.js..."
    npm run build
    log_success "Build terminé"

    # Redémarrage avec PM2
    log_info "🔄 Redémarrage de l'application..."

    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        # L'app existe déjà, la recharger sans downtime
        pm2 reload ecosystem.config.js --update-env
        log_success "Application rechargée"
    else
        # Première fois, démarrer l'app
        pm2 start ecosystem.config.js
        pm2 save
        log_success "Application démarrée"
    fi

    # Attendre quelques secondes
    sleep 3

    # Vérifier le statut
    log_info "📊 Statut de l'application:"
    pm2 status "$APP_NAME"

    echo ""
    log_success "✨ Déploiement terminé avec succès!"

    # Afficher les logs récents
    log_info "📋 Derniers logs:"
    pm2 logs "$APP_NAME" --lines 10 --nostream
}

# Rollback en cas d'erreur
rollback() {
    log_error "Erreur détectée! Tentative de rollback..."

    # Trouver la dernière sauvegarde
    LAST_BACKUP=$(ls -t "$BACKUP_DIR"/build_*.tar.gz 2>/dev/null | head -n 1)

    if [ -n "$LAST_BACKUP" ]; then
        log_info "Restauration du build précédent..."
        cd "$APP_DIR"
        rm -rf .next
        tar -xzf "$LAST_BACKUP"
        pm2 restart "$APP_NAME"
        log_success "Rollback effectué"
    else
        log_error "Aucune sauvegarde trouvée pour le rollback"
    fi

    exit 1
}

# Gestion des erreurs
trap rollback ERR

# Exécution
main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║   🤖 SaaS Agents IA - Déploiement         ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""

    check_prerequisites
    create_backup
    deploy
    cleanup_old_backups

    echo ""
    log_success "🎉 Déploiement complété!"
    echo ""
}

# Lancer le script
main "$@"
