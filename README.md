# 📖 Portafolio Personal — Enzo Pinotti

Aplicación full-stack de portfolio personal construida con **React + Node.js + MySQL**, con autenticación, contenido administrable, integraciones y despliegue real en producción.

> Demo: **https://enzopinotti.dev**

## Arquitectura

```text
browser
  ↓
React / CRA frontend
  ↓ /api
Node.js / Express backend
  ↓
MySQL / Sequelize

external services → Google OAuth · Cloudinary · email
production       → Docker / Nginx / VPS
```

### Stack actual

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 18, CRA / react-scripts, SCSS, React Router, Framer Motion, i18n |
| Backend | Node.js 20, Express 4, Sequelize, Passport/JWT, Socket.IO, Winston |
| Data | MySQL 8 / Sequelize migrations & models |
| Integraciones | Google OAuth, Cloudinary, email |
| Infra | Docker / Compose, Nginx, VPS, HTTPS |

## Desarrollo local

El repositorio contiene lockfiles independientes para frontend y backend.

Backend:

```bash
cd backend
npm ci
npm run start:dev
```

Frontend:

```bash
cd frontend
npm ci
npm start
```

Para una instalación reproducible, preferí `npm ci` sobre `npm install` cuando trabajes desde los lockfiles del repo.

## Variables de entorno

Copiá el ejemplo raíz y completá los valores únicamente en tu entorno local / servidor:

```bash
cp .env.example .env
```

**Nunca se deben versionar archivos `.env`, `.env.production`, `.env.development` ni credenciales reales.** El repositorio sólo conserva `.env.example` con valores de ejemplo.

Los secretos de producción deben vivir en el entorno de despliegue / secret store correspondiente.

## Quality gate

La validación de PR/push está separada del despliegue y no necesita credenciales productivas.

GitHub Actions valida:

```text
frontend
  npm ci
  npm run build

backend
  npm ci
  syntax-check de los .js del backend

repository
  docker compose --env-file .env.example config --quiet
```

Hoy los scripts `test` de frontend/backend son placeholders y **no se consideran evidencia de tests reales**. La incorporación de tests de comportamiento se sigue por separado; CI no los ejecuta hasta que exista cobertura útil.

## Deploy

El repo mantiene un workflow de despliegue separado de `Quality`. Esa separación es intencional:

- un PR debe poder demostrar que instala/configura/builda sin secretos;
- producción usa credenciales gestionadas fuera del repositorio;
- un deploy no reemplaza a CI y CI no debe desplegar por accidente.

También existen `docker-compose.yml`, `docker-compose.dev.yml`, Dockerfiles y scripts operativos para los entornos que los requieran.

## Estructura principal

```text
portafolio-personal/
├── backend/
│   ├── app.js
│   ├── index.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── migrations/
├── frontend/
│   ├── public/
│   └── src/
├── docs/
├── .github/workflows/
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

## Funcionalidades

El proyecto incluye, entre otras piezas:

- portfolio/proyectos y contenido público;
- autenticación local y Google OAuth;
- roles y rutas protegidas;
- recursos administrables desde la API;
- carga/gestión de imágenes mediante Cloudinary;
- email y formularios de contacto;
- logging, rate limiting y middleware de seguridad;
- Socket.IO en el backend para funcionalidades que lo utilizan.

## Contribuciones

Los cambios deberían entrar por rama + PR y mantener el quality gate verde. Evitá commits de credenciales, archivos locales del sistema operativo o artefactos generados que no sean autoridad del proyecto.

## Licencia

MIT © Enzo Pinotti
