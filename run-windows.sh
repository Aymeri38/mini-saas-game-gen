#!/bin/bash
# Windows (Git Bash / WSL)

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone https://github.com/Aymeri38/mini-saas-game-gen.git
cd mini-saas-game-gen
npm ci
npm run build
npm start