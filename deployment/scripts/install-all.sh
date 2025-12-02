#!/bin/bash

###############################################################################
# 🚀 SCRIPT D'INSTALLATION COMPLET - SaaS Agents IA
#
# Ce script installe et configure TOUT automatiquement :
# - Dépendances système (Node.js, PM2, Nginx, PostgreSQL, Git, Certbot)
# - Base de données PostgreSQL
# - Clone du repository
# - Build de l'application
# - Configuration Nginx
# - SSL avec Let's Encrypt
# - Firewall (UFW)
# - Démarrage de l'application
#
# Usage: curl -fsSL https://raw.githubusercontent.com/Nicolas69123/saas-agents-ia/main/deployment/scripts/install-all.sh | sudo bash
#        ou: sudo ./install-all.sh
#
# Requis: Ubuntu 20.04+ / Debian 11+
###############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables globales
SCRIPT_VERSION="1.0.0"
APP_NAME="saas-agents-ia"
APP_DIR="/opt/$APP_NAME"
REPO_URL="https://github.com/Nicolas69123/saas-agents-ia.git"
BRANCH="main"
NODE_VERSION="20"
LOG_FILE="/var/log/saas-agents-install.log"

# Fonctions d'affichage
log_info() { echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"; }
log_success() { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"; }
log_error() { echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"; }
log_step() { echo -e "${CYAN}🔷 $1${NC}" | tee -a "$LOG_FILE"; }

# Fonction pour afficher une barre de progression
show_progress() {
    local duration=$1
    local message=$2
    echo -ne "${BLUE}⏳ $message${NC}"
    for ((i=0; i<duration; i++)); do
        echo -n "."
        sleep 1
    done
    echo -e " ${GREEN}✓${NC}"
}

# Banner d'accueil
show_banner() {
    clear
    echo -e "${PURPLE}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🤖  INSTALLATION AUTOMATIQUE - SaaS Agents IA          ║
║                                                           ║
║   Ce script va installer et configurer :                 ║
║   • Node.js 20.x + PM2                                   ║
║   • PostgreSQL 14+                                       ║
║   • Nginx + SSL (Let's Encrypt)                          ║
║   • Firewall (UFW)                                       ║
║   • Application Next.js                                  ║
║                                                           ║
║   Durée estimée : 10-15 minutes                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Vérifier les prérequis
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root (sudo)"
        exit 1
    fi
}

check_os() {
    if [ ! -f /etc/os-release ]; then
        log_error "OS non supporté. Ce script nécessite Ubuntu 20.04+ ou Debian 11+"
        exit 1
    fi

    . /etc/os-release
    if [[ ! "$ID" =~ ^(ubuntu|debian)$ ]]; then
        log_error "OS non supporté: $ID. Ce script nécessite Ubuntu ou Debian"
        exit 1
    fi

    log_success "OS détecté: $PRETTY_NAME"
}

# Demander les informations à l'utilisateur
get_user_input() {
    echo ""
    log_step "ÉTAPE 1/12 - Configuration initiale"
    echo ""

    # Domaine
    read -p "$(echo -e ${CYAN}📍 Nom de domaine (ex: saas-agents-ia.fr): ${NC})" DOMAIN
    if [ -z "$DOMAIN" ]; then
        log_error "Le nom de domaine est requis"
        exit 1
    fi

    # Email pour SSL
    read -p "$(echo -e ${CYAN}📧 Email pour SSL (Let's Encrypt): ${NC})" SSL_EMAIL
    if [ -z "$SSL_EMAIL" ]; then
        log_error "L'email est requis"
        exit 1
    fi

    # Mot de passe PostgreSQL
    read -sp "$(echo -e ${CYAN}🔐 Mot de passe PostgreSQL (DB): ${NC})" DB_PASSWORD
    echo ""
    if [ -z "$DB_PASSWORD" ]; then
        log_error "Le mot de passe DB est requis"
        exit 1
    fi

    # Confirmation
    echo ""
    log_info "Configuration:"
    echo "  - Domaine: $DOMAIN"
    echo "  - Email: $SSL_EMAIL"
    echo "  - App: $APP_DIR"
    echo ""
    read -p "$(echo -e ${YELLOW}Continuer avec cette configuration? (y/N): ${NC})" CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        log_error "Installation annulée"
        exit 1
    fi
}

# 1. Mise à jour du système
update_system() {
    echo ""
    log_step "ÉTAPE 2/12 - Mise à jour du système"
    log_info "Mise à jour des paquets..."

    apt update -qq >> "$LOG_FILE" 2>&1
    apt upgrade -y -qq >> "$LOG_FILE" 2>&1

    log_success "Système mis à jour"
}

# 2. Installation de Node.js
install_nodejs() {
    echo ""
    log_step "ÉTAPE 3/12 - Installation Node.js $NODE_VERSION"

    if command -v node &> /dev/null; then
        CURRENT_VERSION=$(node --version)
        log_info "Node.js déjà installé: $CURRENT_VERSION"

        # Vérifier si c'est la bonne version
        MAJOR_VERSION=$(echo "$CURRENT_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -lt "$NODE_VERSION" ]; then
            log_warning "Version trop ancienne, mise à jour..."
        else
            log_success "Node.js OK"
            return 0
        fi
    fi

    log_info "Installation de Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - >> "$LOG_FILE" 2>&1
    apt install -y nodejs >> "$LOG_FILE" 2>&1

    log_success "Node.js $(node --version) installé"
}

# 3. Installation PM2
install_pm2() {
    echo ""
    log_step "ÉTAPE 4/12 - Installation PM2"

    if command -v pm2 &> /dev/null; then
        log_success "PM2 déjà installé"
        return 0
    fi

    log_info "Installation de PM2..."
    npm install -g pm2 >> "$LOG_FILE" 2>&1

    log_success "PM2 $(pm2 --version) installé"
}

# 4. Installation PostgreSQL
install_postgresql() {
    echo ""
    log_step "ÉTAPE 5/12 - Installation PostgreSQL"

    if command -v psql &> /dev/null; then
        log_success "PostgreSQL déjà installé"
    else
        log_info "Installation de PostgreSQL..."
        apt install -y postgresql postgresql-contrib >> "$LOG_FILE" 2>&1
        systemctl start postgresql
        systemctl enable postgresql
        log_success "PostgreSQL installé"
    fi

    # Créer la base de données et l'utilisateur
    log_info "Configuration de la base de données..."

    sudo -u postgres psql -c "CREATE DATABASE ${APP_NAME}_prod;" 2>/dev/null || log_warning "DB existe déjà"
    sudo -u postgres psql -c "CREATE USER ${APP_NAME}_user WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || log_warning "User existe déjà"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${APP_NAME}_prod TO ${APP_NAME}_user;" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER DATABASE ${APP_NAME}_prod OWNER TO ${APP_NAME}_user;" >> "$LOG_FILE" 2>&1

    log_success "Base de données configurée"
}

# 5. Installation Nginx
install_nginx() {
    echo ""
    log_step "ÉTAPE 6/12 - Installation Nginx"

    if command -v nginx &> /dev/null; then
        log_success "Nginx déjà installé"
        return 0
    fi

    log_info "Installation de Nginx..."
    apt install -y nginx >> "$LOG_FILE" 2>&1
    systemctl start nginx
    systemctl enable nginx

    log_success "Nginx installé"
}

# 6. Installation Certbot (SSL)
install_certbot() {
    echo ""
    log_step "ÉTAPE 7/12 - Installation Certbot"

    if command -v certbot &> /dev/null; then
        log_success "Certbot déjà installé"
        return 0
    fi

    log_info "Installation de Certbot..."
    apt install -y certbot python3-certbot-nginx >> "$LOG_FILE" 2>&1

    log_success "Certbot installé"
}

# 7. Installation Git
install_git() {
    if command -v git &> /dev/null; then
        return 0
    fi

    log_info "Installation de Git..."
    apt install -y git >> "$LOG_FILE" 2>&1
}

# 8. Clone du repository
clone_repository() {
    echo ""
    log_step "ÉTAPE 8/12 - Clone du repository"

    if [ -d "$APP_DIR" ]; then
        log_warning "Le dossier $APP_DIR existe déjà"
        read -p "$(echo -e ${YELLOW}Supprimer et re-cloner? (y/N): ${NC})" CONFIRM
        if [[ $CONFIRM =~ ^[Yy]$ ]]; then
            rm -rf "$APP_DIR"
        else
            log_info "Utilisation du dossier existant"
            cd "$APP_DIR"
            git pull origin "$BRANCH" >> "$LOG_FILE" 2>&1
            log_success "Repository mis à jour"
            return 0
        fi
    fi

    log_info "Clone du repository..."
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR" >> "$LOG_FILE" 2>&1
    cd "$APP_DIR"

    log_success "Repository cloné"
}

# 9. Configuration de l'application
configure_app() {
    echo ""
    log_step "ÉTAPE 9/12 - Configuration de l'application"

    cd "$APP_DIR"

    # Créer le fichier .env
    log_info "Création du fichier .env..."

    cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://$DOMAIN

# Database
DATABASE_URL="postgresql://${APP_NAME}_user:$DB_PASSWORD@localhost:5432/${APP_NAME}_prod"

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://$DOMAIN

# n8n (optionnel)
N8N_URL=http://localhost:5678
N8N_API_KEY=

# Feature Flags
ENABLE_CHAT=true
ENABLE_N8N_INTEGRATION=false
ENABLE_ANALYTICS=true
ENABLE_SIGNUP=true
EOF

    log_success "Fichier .env créé"

    # Installer les dépendances
    log_info "Installation des dépendances npm..."
    npm ci --production >> "$LOG_FILE" 2>&1

    log_success "Dépendances installées"

    # Migrer la base de données
    log_info "Migration de la base de données..."
    npx prisma migrate deploy >> "$LOG_FILE" 2>&1 || log_warning "Migrations déjà appliquées"
    npx prisma db seed >> "$LOG_FILE" 2>&1 || log_warning "Seed déjà exécuté"

    log_success "Base de données migrée"

    # Build de l'application
    log_info "Build de l'application Next.js (cela peut prendre 2-3 min)..."
    npm run build >> "$LOG_FILE" 2>&1

    log_success "Application buildée"
}

# 10. Configuration Nginx
configure_nginx() {
    echo ""
    log_step "ÉTAPE 10/12 - Configuration Nginx"

    log_info "Création de la configuration Nginx..."

    cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF

    # Activer la configuration
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

    # Tester la configuration
    nginx -t >> "$LOG_FILE" 2>&1
    systemctl reload nginx

    log_success "Nginx configuré"
}

# 11. Configuration SSL
configure_ssl() {
    echo ""
    log_step "ÉTAPE 11/12 - Configuration SSL (Let's Encrypt)"

    # Vérifier le DNS
    log_info "Vérification du DNS..."
    VM_IP=$(curl -s ifconfig.me)
    DOMAIN_IP=$(dig +short "$DOMAIN" | tail -n1)

    if [ -z "$DOMAIN_IP" ]; then
        log_error "Le DNS ne retourne pas d'IP pour $DOMAIN"
        log_warning "Configurez votre DNS pour pointer vers: $VM_IP"
        log_warning "SSL sera ignoré. Vous pourrez le configurer plus tard avec:"
        echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        return 1
    fi

    if [ "$DOMAIN_IP" != "$VM_IP" ]; then
        log_warning "DNS pointe vers: $DOMAIN_IP (VM: $VM_IP)"
        log_warning "SSL ignoré. Configurez le DNS puis exécutez:"
        echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        return 1
    fi

    log_success "DNS configuré correctement"

    # Obtenir le certificat SSL
    log_info "Obtention du certificat SSL..."
    certbot --nginx \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "$SSL_EMAIL" \
        --redirect >> "$LOG_FILE" 2>&1

    if [ $? -eq 0 ]; then
        log_success "SSL configuré avec succès"
    else
        log_warning "Erreur SSL. Vous pouvez le configurer plus tard."
    fi
}

# 12. Configuration Firewall
configure_firewall() {
    echo ""
    log_step "ÉTAPE 12/12 - Configuration Firewall"

    log_info "Configuration UFW..."

    ufw --force reset >> "$LOG_FILE" 2>&1
    ufw default deny incoming >> "$LOG_FILE" 2>&1
    ufw default allow outgoing >> "$LOG_FILE" 2>&1
    ufw allow ssh >> "$LOG_FILE" 2>&1
    ufw allow 80/tcp >> "$LOG_FILE" 2>&1
    ufw allow 443/tcp >> "$LOG_FILE" 2>&1
    ufw --force enable >> "$LOG_FILE" 2>&1

    log_success "Firewall configuré"
}

# 13. Démarrage de l'application
start_application() {
    echo ""
    log_step "ÉTAPE 13/13 - Démarrage de l'application"

    cd "$APP_DIR"

    # Créer le dossier logs
    mkdir -p logs

    # Arrêter PM2 si déjà en cours
    pm2 delete $APP_NAME 2>/dev/null || true

    # Démarrer avec PM2
    log_info "Démarrage avec PM2..."
    pm2 start ecosystem.config.js >> "$LOG_FILE" 2>&1
    pm2 save >> "$LOG_FILE" 2>&1
    pm2 startup -u root --hp /root >> "$LOG_FILE" 2>&1

    # Attendre que l'app démarre
    sleep 3

    log_success "Application démarrée"
}

# Vérification finale
final_checks() {
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}   🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
    echo ""

    log_success "Application installée et démarrée"
    echo ""
    log_info "Informations d'accès:"
    echo "  🌐 URL: https://$DOMAIN"
    echo "  📁 App: $APP_DIR"
    echo "  🗄️  DB: ${APP_NAME}_prod"
    echo ""
    log_info "Commandes utiles:"
    echo "  • Voir les logs: pm2 logs $APP_NAME"
    echo "  • Statut: pm2 status"
    echo "  • Redémarrer: pm2 restart $APP_NAME"
    echo "  • Voir les logs Nginx: tail -f /var/log/nginx/error.log"
    echo ""
    log_info "Prochaines étapes:"
    echo "  1. Ouvrir https://$DOMAIN dans votre navigateur"
    echo "  2. Configurer n8n (optionnel)"
    echo "  3. Configurer les variables d'environnement dans $APP_DIR/.env"
    echo ""

    # Test de l'application
    log_info "Test de l'application..."
    sleep 2
    if curl -s http://localhost:3000 > /dev/null; then
        log_success "Application répond correctement"
    else
        log_warning "L'application ne répond pas. Vérifiez les logs: pm2 logs $APP_NAME"
    fi

    echo ""
    log_success "🎉 Installation complète ! Visitez https://$DOMAIN"
    echo ""
}

# Gestion des erreurs
handle_error() {
    log_error "Une erreur est survenue à l'étape: $1"
    log_error "Consultez les logs: $LOG_FILE"
    exit 1
}

trap 'handle_error "Installation"' ERR

# Script principal
main() {
    # Initialiser le fichier de log
    touch "$LOG_FILE"
    chmod 644 "$LOG_FILE"

    show_banner
    check_root
    check_os
    get_user_input

    # Installation
    update_system
    install_nodejs
    install_pm2
    install_postgresql
    install_nginx
    install_certbot
    install_git
    clone_repository
    configure_app
    configure_nginx
    configure_ssl
    configure_firewall
    start_application
    final_checks
}

# Lancer le script
main "$@"
