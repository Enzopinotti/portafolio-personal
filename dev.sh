#!/bin/bash

# Portafolio Personal - Local Development Script (Hot Reload)

# 1. Comprobar si existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: no se encontró el archivo .env en la raíz."
    echo "Copia .env.example a .env para continuar."
    exit 1
fi

# 2. Comprobar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor, inicia Docker Desktop y vuelve a intentarlo."
    exit 1
fi

# 3. Función de limpieza para cerrar todo al salir
cleanup() {
    echo ""
    echo "🛑 Apagando el entorno de desarrollo..."
    # Aseguramos que docker compose se ejecute correctamente
    docker compose -p portafolio-dev -f docker-compose.dev.yml down
    echo "✅ Limpieza completada. ¡Nos vemos!"
    exit
}

# Capturar Ctrl+C (SIGINT) y otras señales
trap cleanup SIGINT SIGTERM

echo "🚀 Iniciando entorno de desarrollo con Docker (Hot Reload)..."

# 4. Levantar los contenedores en segundo plano
docker compose -p portafolio-dev -f docker-compose.dev.yml up -d --build

echo "⏳ Esperando a que la base de datos esté lista..."

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
docker compose -p portafolio-dev -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate

echo "🌱  Revisando y Ejecutando Seeders..."
docker compose -p portafolio-dev -f docker-compose.dev.yml exec backend npx sequelize-cli db:seed:all

echo "✅  Entorno de Desarrollo Listo y Sincronizado!"
echo "-------------------------------------------------------"
echo "Frontend (Hot Reload): http://localhost:3000"
echo "Backend API (Nodemon): http://localhost:3001/api"
echo "-------------------------------------------------------"
echo ""
echo "📺 Mostrando logs (Presiona Ctrl+C para detener y limpiar los contenedores):"
docker compose -p portafolio-dev -f docker-compose.dev.yml logs -f --tail=50 backend frontend
