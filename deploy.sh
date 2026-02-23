#!/bin/bash

# Portafolio Personal - Docker Deployment Script

# 1. Check if .env file exists in the root
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in the root directory."
    echo "Please copy .env.example to .env and fill in your credentials."
    exit 1
fi

echo "🚀 Starting deployment with Docker..."

# 2. Build and start containers
# Determine if we should use 'docker-compose' or 'docker compose'
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    DOCKER_COMPOSE_CMD="docker compose"
fi

echo "📦 Using $DOCKER_COMPOSE_CMD..."
$DOCKER_COMPOSE_CMD up -d --build

echo "⏳ Waiting for database to be ready..."
# Wait for the database container to be healthy
until [ "`docker inspect -f {{.State.Health.Status}} portafolio-db`"=="healthy" ]; do
    sleep 2
done

echo "⚙️ Running Database Migrations..."
docker exec -it portafolio-backend npx sequelize-cli db:migrate

echo "🌱 Running Seeders (Optional)..."
read -p "Do you want to run seeders? (y/N): " run_seeders
if [[ $run_seeders =~ ^[Yy]$ ]]; then
    docker exec -it portafolio-backend npx sequelize-cli db:seed:all
fi

echo "✅ Deployment completed successfully!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
