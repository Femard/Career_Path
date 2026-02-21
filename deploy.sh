#!/bin/bash
# Script de déploiement initial sur Oracle Cloud (Oracle Linux 9.7 ARM)
# Usage : bash deploy.sh
set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${CYAN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }

# ── 1. Docker CE ────────────────────────────────────────────────
log "Installation de Docker CE..."
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

# ── 2. Ollama ───────────────────────────────────────────────────
log "Installation d'Ollama..."
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable --now ollama

log "Téléchargement du modèle qwen2.5:7b (~4.7 Go)..."
ollama pull qwen2.5:7b

# ── 3. Firewall Oracle Linux (firewalld) ────────────────────────
log "Ouverture du port 80..."
# Oracle Linux 9 utilise firewalld
if systemctl is-active --quiet firewalld; then
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --reload
    log "firewalld : port 80 ouvert"
else
    warn "firewalld non actif — vérifiez manuellement l'ouverture du port 80"
fi

# Rappel : ouvrir aussi le port 80 dans la Security List Oracle Cloud Console
warn "N'oubliez pas d'ouvrir le port 80 dans la Security List Oracle Cloud (VCN > Subnet > Ingress Rules)"

# ── 4. Configuration ────────────────────────────────────────────
REPO_DIR="$(pwd)"
log "Configuration du backend..."

if [ ! -f "$REPO_DIR/backend/.env" ]; then
    cp "$REPO_DIR/backend/.env.example" "$REPO_DIR/backend/.env"
    echo -e "${GREEN}✅ Fichier backend/.env créé depuis .env.example${NC}"
    echo "   → Éditez-le si nécessaire : nano $REPO_DIR/backend/.env"
else
    echo "   → backend/.env existe déjà"
fi

# ── 5. Build et démarrage ───────────────────────────────────────
log "Build et démarrage des conteneurs..."
# Appliquer les droits du groupe docker sans relancer la session
newgrp docker << EOF
cd "$REPO_DIR"
docker compose up -d --build
EOF

echo ""
echo -e "${GREEN}✅ Application déployée !${NC}"
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_IP")
echo -e "   Frontend : http://${PUBLIC_IP}"
echo -e "   API docs : http://${PUBLIC_IP}/docs"
echo -e "   Logs     : docker compose logs -f"
echo ""
warn "Si le site est inaccessible, vérifiez :"
warn "  1. Oracle Cloud Console → VCN → Security List → Ingress Rule port 80"
warn "  2. sudo firewall-cmd --list-ports"