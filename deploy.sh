#!/bin/bash

# Portafolio Personal - Docker Deployment Script

# 1. Check if .env file exists in the root
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in the root directory."
    echo "Please copy .env.example to .env and fill in your credentials."
    exit 1
fi

echo "🚀 Starting deployment with Docker..."

echo "📥 Pulling latest changes from Git..."
git pull origin main || echo "⚠️ Warning: git pull failed or is not a git repository. Continuing deployment..."

# 2. Build and start containers
# Robust detection of docker-compose vs docker compose
if docker-compose --version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Error: Neither 'docker-compose' nor 'docker compose' was found."
    exit 1
fi

echo "📦 Using $DOCKER_COMPOSE_CMD..."
$DOCKER_COMPOSE_CMD up -d --build --force-recreate

echo "⏳ Waiting for database to be ready (this may take a minute on first run)..."
# Wait for the database container to be healthy
until [ "$(docker inspect -f '{{.State.Health.Status}}' portafolio-db 2>/dev/null)" = "healthy" ]; do
    echo "..."
    sleep 5
done

echo "⚙️ Running Database Migrations..."
docker exec portafolio-backend npx sequelize-cli db:migrate

echo "🌱 Running Seeders (Optional)..."
# No usar read -p -it en scripts si no es necesario, o dar un timeout
echo "Para ejecutar seeders manualmente: docker exec portafolio-backend npx sequelize-cli db:seed:all"

echo "✅ Deployment completed successfully!"

# Extract FRONTEND_URL from .env file if it exists, otherwise use localhost
DISPLAY_URL=$(grep '^FRONTEND_URL=' .env | cut -d '=' -f2)
if [ -z "$DISPLAY_URL" ]; then
    DISPLAY_URL="http://localhost"
fi

echo "Frontend: $DISPLAY_URL"
echo "Backend API: $DISPLAY_URL/api"
