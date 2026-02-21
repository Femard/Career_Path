#!/bin/bash
# Script de déploiement initial sur Oracle Cloud (Ubuntu 22.04 ARM)
# Usage : bash deploy.sh
set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${CYAN}▶ $1${NC}"; }

# ── 1. Docker ──────────────────────────────────────────────────
log "Installation de Docker..."
sudo apt-get update -qq
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

# ── 2. Ollama ─────────────────────────────────────────────────
log "Installation d'Ollama..."
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable --now ollama

log "Téléchargement du modèle qwen2.5:7b (~4.7 Go)..."
ollama pull qwen2.5:7b

# ── 3. Firewall Oracle (iptables) ─────────────────────────────
log "Ouverture du port 80..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
# Rendre persistant
sudo apt-get install -y iptables-persistent -qq
sudo netfilter-persistent save

# ── 4. Configuration ──────────────────────────────────────────
REPO_DIR="$(pwd)"
log "Configuration du backend..."

if [ ! -f "$REPO_DIR/backend/.env" ]; then
    cp "$REPO_DIR/backend/.env.example" "$REPO_DIR/backend/.env"
    echo -e "${GREEN}✅ Fichier backend/.env créé depuis .env.example${NC}"
    echo "   → Éditez-le si nécessaire : nano $REPO_DIR/backend/.env"
else
    echo "   → backend/.env existe déjà"
fi

# ── 5. Build et démarrage ─────────────────────────────────────
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
