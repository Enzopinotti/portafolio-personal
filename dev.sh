#!/bin/bash

# Portafolio Personal - Local Development Script (Hot Reload)

# 1. Comprobar si existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: no se encontró el archivo .env en la raíz."
    echo "Copia .env.example a .env para continuar."
    exit 1
fi

echo "🚀 Iniciando entorno de desarrollo con Docker (Hot Reload)..."

# 2. Levantar los contenedores en segundo plano con un nombre de proyecto específico
# -p portafolio-dev evita conflictos si tienes contenedores de producción corriendo
docker compose -p portafolio-dev -f docker-compose.dev.yml up -d --build

echo "⏳ Esperando a que la base de datos esté lista..."

# Obtener el ID del contenedor de la DB de forma dinámica
get_db_status() {
    local id=$(docker compose -p portafolio-dev -f docker-compose.dev.yml ps -q db)
    if [ -z "$id" ]; then
        echo "starting"
    else
        docker inspect -f '{{.State.Health.Status}}' "$id" 2>/dev/null || echo "starting"
    fi
}

until [ "$(get_db_status)" = "healthy" ]; do
    echo "..."
    sleep 3
done

echo "⚙️  Revisando y Ejecutando Migraciones..."
# Usamos 'docker compose exec' para que use el nombre del servicio 'backend' directamente
docker compose -p portafolio-dev -f docker-compose.dev.yml exec backend npx -y sequelize-cli db:migrate

echo "🌱  Revisando y Ejecutando Seeders..."
docker compose -p portafolio-dev -f docker-compose.dev.yml exec backend npx -y sequelize-cli db:seed:all

echo "✅  Entorno de Desarrollo Listo y Sincronizado!"
echo "-------------------------------------------------------"
echo "Frontend (Hot Reload): http://localhost:3000"
echo "Backend API (Nodemon): http://localhost:3001/api"
echo "-------------------------------------------------------"
echo ""
echo "📺 Mostrando logs (Presiona Ctrl+C para salir, los contenedores seguirán corriendo):"
docker compose -p portafolio-dev -f docker-compose.dev.yml logs -f --tail=50 backend frontend
