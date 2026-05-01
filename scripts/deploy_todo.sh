#!/bin/bash
set -e

echo "🚀  Iniciando deploy completo..."

# 📁 Rutas
BASE_DIR="/var/www/portfolio-backend"
REPO_DIR="$BASE_DIR/portafolio-personal"
BACKEND_DIR="$REPO_DIR/backend"
DEST_HTML="/var/www/html"

# 1️⃣  Clonar / actualizar repo backend (opcional)
if [ ! -d "$REPO_DIR" ]; then
  git clone https://github.com/Enzopinotti/portafolio-personal.git "$REPO_DIR"
else
  cd "$REPO_DIR" && git pull origin main
fi

# 2️⃣  Restaurar .env.production
sudo mv /tmp/.env.production "$BACKEND_DIR/.env.production"

# 3️⃣  Instalar deps backend + migraciones
cd "$BACKEND_DIR"
npm ci --omit=dev
npx sequelize-cli db:migrate

# 4️⃣  PM2 reload
pm2 startOrRestart ecosystem.config.js --env production

echo "✅ Backend OK — PM2 corriendo"

# (los estáticos del frontend ya fueron sincronizados por rsync)

# 5️⃣  Recargar Nginx
sudo nginx -t && sudo systemctl reload nginx
echo "🎉  Deploy COMPLETO"
