#!/bin/bash

###############################################################################
# Script de Rollback - SaaS Agents IA
#
# Description: Restaure la version précédente en cas de problème
# Usage: ./rollback.sh
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

# Variables
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_NAME="saas-agents-ia"
BACKUP_DIR="$APP_DIR/../backups"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ⏮️  Rollback - Restauration             ║"
echo "╚════════════════════════════════════════════╝"
echo ""

log_warning "⚠️  Ce script va restaurer la version précédente"
echo ""

# Vérifier que le dossier de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Aucun dossier de backup trouvé: $BACKUP_DIR"
    exit 1
fi

# Lister les backups disponibles
echo "Backups disponibles:"
echo ""

BUILD_BACKUPS=($(ls -t "$BACKUP_DIR"/build_*.tar.gz 2>/dev/null))
ENV_BACKUPS=($(ls -t "$BACKUP_DIR"/.env_* 2>/dev/null))

if [ ${#BUILD_BACKUPS[@]} -eq 0 ]; then
    log_error "Aucun backup de build trouvé"
    exit 1
fi

# Afficher les 5 derniers backups
echo "📦 Backups de builds disponibles:"
for i in "${!BUILD_BACKUPS[@]}"; do
    if [ $i -lt 5 ]; then
        TIMESTAMP=$(basename "${BUILD_BACKUPS[$i]}" | sed 's/build_\(.*\)\.tar\.gz/\1/')
        FORMATTED_DATE=$(date -d "${TIMESTAMP:0:8} ${TIMESTAMP:9:2}:${TIMESTAMP:11:2}:${TIMESTAMP:13:2}" '+%d/%m/%Y %H:%M:%S' 2>/dev/null || echo "$TIMESTAMP")
        echo "  [$i] $FORMATTED_DATE - $(basename "${BUILD_BACKUPS[$i]}")"
    fi
done

echo ""
read -p "Quel backup voulez-vous restaurer? [0] " BACKUP_INDEX
BACKUP_INDEX=${BACKUP_INDEX:-0}

# Vérifier que l'index est valide
if [ -z "${BUILD_BACKUPS[$BACKUP_INDEX]}" ]; then
    log_error "Index de backup invalide: $BACKUP_INDEX"
    exit 1
fi

SELECTED_BACKUP="${BUILD_BACKUPS[$BACKUP_INDEX]}"
BACKUP_TIMESTAMP=$(basename "$SELECTED_BACKUP" | sed 's/build_\(.*\)\.tar\.gz/\1/')

log_info "Backup sélectionné: $(basename "$SELECTED_BACKUP")"

# Demander confirmation
echo ""
log_warning "⚠️  Cette action va:"
echo "  1. Arrêter l'application"
echo "  2. Supprimer le build actuel"
echo "  3. Restaurer le backup sélectionné"
echo "  4. Redémarrer l'application"
echo ""
read -p "Continuer? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_error "Rollback annulé"
    exit 1
fi

# Commencer le rollback
log_info "🔄 Démarrage du rollback..."

# 1. Arrêter l'application
log_info "Arrêt de l'application..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 stop "$APP_NAME"
    log_success "Application arrêtée"
else
    log_warning "L'application n'était pas démarrée"
fi

# 2. Sauvegarder le build actuel (au cas où)
if [ -d "$APP_DIR/.next" ]; then
    log_info "Sauvegarde du build actuel..."
    CURRENT_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_DIR/build_before_rollback_$CURRENT_TIMESTAMP.tar.gz" -C "$APP_DIR" .next
    log_success "Build actuel sauvegardé"
fi

# 3. Supprimer le build actuel
log_info "Suppression du build actuel..."
cd "$APP_DIR"
rm -rf .next
log_success "Build supprimé"

# 4. Restaurer le backup
log_info "Restauration du backup..."
tar -xzf "$SELECTED_BACKUP" -C "$APP_DIR"
log_success "Backup restauré"

# 5. Restaurer le .env si disponible
ENV_BACKUP="$BACKUP_DIR/.env_$BACKUP_TIMESTAMP"
if [ -f "$ENV_BACKUP" ]; then
    log_info "Restauration du fichier .env..."
    cp "$ENV_BACKUP" "$APP_DIR/.env"
    log_success "Fichier .env restauré"
fi

# 6. Redémarrer l'application
log_info "Redémarrage de l'application..."
cd "$APP_DIR"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 restart "$APP_NAME"
else
    pm2 start ecosystem.config.js
fi

# Attendre que l'app démarre
sleep 3

log_success "Application redémarrée"

# 7. Vérifier le statut
echo ""
log_info "📊 Statut de l'application:"
pm2 status "$APP_NAME"

echo ""
log_info "📋 Derniers logs:"
pm2 logs "$APP_NAME" --lines 10 --nostream

echo ""
log_success "✨ Rollback terminé avec succès !"
echo ""
log_info "Le backup restauré date de: $BACKUP_TIMESTAMP"
echo ""
log_warning "Si le problème persiste, consultez les logs:"
echo "  pm2 logs $APP_NAME"
echo ""
