#!/usr/bin/env bash

# 🚀 MINI-SAAS-GAME-GEN - 1 COMMANDE TOTALE

set -e

printf "\n🎮 %s MINI-SAAS-GAME-GEN SETUP %s\n" "$(tput setaf 4)" "$(tput sgr0)"

# 1. Clone si pas déjà fait
if [ ! -d "mini-saas-game-gen" ]; then
  git clone https://github.com/Aymeri38/mini-saas-game-gen.git
  cd mini-saas-game-gen
else
  cd mini-saas-game-gen
  git pull origin main
fi

# 2. Dépendances (Node.js auto-detect)
if ! command -v node &> /dev/null; then
  echo "📦 Node.js détecté → Installation auto..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# 3. Dépendances projet
echo "📦 Installation dépendances..."
rm -rf node_modules package-lock.json
npm ci

# 4. Build production
echo "🔨 Build production..."
rm -rf .next
npm run build

# 5. Serveur LIVE (port 3000)
echo "🌐 SERVEUR LIVE → http://localhost:3000"

# Auto-open browser
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000 &
fi

# Lance serveur prod
npm start
