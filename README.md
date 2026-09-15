# Portafolio Personal — Enzo Pinotti

Aplicación full-stack de portfolio personal para **enzopinotti.dev**, con frontend React, API Node.js/Express, persistencia MySQL y despliegue containerizado en VPS.

> Producción: **https://enzopinotti.dev**

## Arquitectura actual

```text
browser
  ↓
React 18 / Create React App
  ↓ /api
Node.js 20 / Express 4
  ↓
Sequelize / MySQL 8

production boundary
  Docker Compose · Nginx/VPS · external integrations
```

El repositorio contiene frontend y backend en un mismo árbol para mantener cambios de producto, infraestructura y documentación coordinados.

### Frontend

- React 18 + Create React App;
- React Router 6;
- SCSS;
- i18n;
- Framer Motion y otros componentes visuales;
- consumo de API mediante Axios.

### Backend

- Node.js 20 como runtime de referencia del quality gate;
- Express **4.22**, no Express 5;
- Sequelize + MySQL;
- Passport/JWT y Google OAuth;
- Cloudinary;
- Socket.IO;
- correo mediante Nodemailer;
- rate limiting, Helmet, logging e internacionalización.

### Infraestructura

- Docker + Docker Compose;
- MySQL 8;
- frontend servido por Nginx dentro de su imagen;
- despliegue productivo existente hacia VPS mediante un workflow separado.

## Variables de entorno y seguridad

Los archivos de entorno de runtime **no son contenido del repositorio**.

Usá `.env.example` como referencia y creá tus archivos locales/productivos fuera de Git:

```bash
cp .env.example .env
```

El árbol actual ignora `.env` / `.env.*` también dentro de subdirectorios y conserva sólo archivos `.env.example` de documentación.

### Historial de credenciales

En septiembre de 2026 se removieron del árbol actual archivos de entorno de backend que habían sido trackeados previamente.

Eliminar esos archivos de `main` **no revoca secretos que hayan existido en Git history**. Cualquier credencial real expuesta previamente debe considerarse comprometida y rotarse/revocarse de forma independiente. Reescribir historia, si alguna vez se hace, no reemplaza la rotación.

## Desarrollo local

Runtime de referencia:

```bash
nvm use
```

La raíz incluye `.nvmrc` con Node.js 20.

Backend:

```bash
cd backend
npm ci
npm run start:dev
```

Frontend, en otra terminal:

```bash
cd frontend
npm ci
npm start
```

No se documenta `npm run dev` para el backend porque el script real se llama `start:dev`.

## Quality gate independiente

El quality gate del repositorio está separado del despliegue productivo.

Desde la raíz:

```bash
./scripts/quality.sh
```

Ejecuta tres contratos reales:

1. **backend** — `npm ci` y validación sintáctica con `node --check` sobre los archivos JavaScript del backend;
2. **frontend** — `npm ci` y build de producción de Create React App;
3. **Compose** — `docker compose --env-file .env.example config --quiet`.

También podés correr un carril aislado:

```bash
./scripts/quality.sh backend
./scripts/quality.sh frontend
./scripts/quality.sh compose
```

GitHub Actions ejecuta esos mismos modos en jobs separados y paralelos, con permisos de repositorio `contents: read` y actions de setup fijadas a commits inmutables.

### Qué NO afirma el quality gate

Hoy el repositorio **no tiene una suite de tests automatizados de producto mantenida**. Los antiguos scripts `test` devolvían éxito imprimiendo “Sin tests aún”; se eliminan para que un comando verde no parezca evidencia que no existe.

Por eso CI informa sólo lo que realmente valida:

- instalación reproducible desde ambos lockfiles;
- sintaxis JavaScript del backend;
- build productivo del frontend;
- contrato de Docker Compose.

Tests futuros deberían enfocarse en comportamiento de alto valor —por ejemplo autenticación/autorización, contratos de API o flujos críticos— en lugar de agregar tests vacíos para obtener otro check verde.

## Quality vs. deploy

`.github/workflows/quality.yml` valida PRs y `main` sin usar secretos productivos.

`.github/workflows/deploy.yml` es una superficie distinta: usa credenciales del environment de producción y ejecuta el proceso remoto de despliegue en el VPS. Este hardening no convierte un build de PR en un deploy ni necesita acceso SSH para validar el código.

La seguridad y supply-chain del workflow de deploy deben revisarse en un carril propio antes de modificar ese proceso productivo.

## Docker

Para validar la configuración sin levantar servicios:

```bash
./scripts/quality.sh compose
```

Para un entorno completo necesitás valores de runtime reales/no productivos y luego podés utilizar Docker Compose según el entorno correspondiente.

## Estructura principal

```text
portafolio-personal/
├── backend/                 # API Express + datos/integraciones
├── frontend/                # React / CRA
├── docs/                    # documentación del proyecto
├── scripts/quality.sh       # contrato local/CI
├── docker-compose.yml       # stack productivo
├── docker-compose.dev.yml   # stack de desarrollo
└── .github/workflows/
    ├── quality.yml          # validación independiente
    └── deploy.yml           # despliegue productivo separado
```

## Estado de madurez

El repositorio es una aplicación real que evolucionó durante varios ciclos. La modernización pública prioriza primero **seguridad, reproducibilidad y verdad documental** antes de reescribir el stack sólo para usar versiones más nuevas.

Próximos bloques útiles incluyen tests enfocados de comportamiento, revisión aislada del workflow de deploy y limpieza/optimización de assets grandes donde exista una ganancia medible.

## Licencia

El repositorio no contiene actualmente un archivo de licencia de nivel raíz. No debe inferirse una licencia de reutilización sólo a partir del código público.
