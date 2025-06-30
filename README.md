
# 📖 Portafolio Personal – Enzo Pinotti

¡Bienvenido/a! Este repositorio contiene **mi aplicación de portfolio personal** desarrollada con un stack **React + Node.js + MySQL**.  
El objetivo es mostrar mis proyectos, artículos, servicios y permitir contacto directo.

> Demo en producción: **https://enzopinotti.dev** ✨

---

## 🗂️ Tabla de contenidos
1. [Stack & features](#stack--features)  
2. [Arquitectura del proyecto](#arquitectura-del-proyecto)  
3. [Requisitos previos](#requisitos-previos)  
4. [Variables de entorno](#variables-de-entorno)  
5. [Instalación local (desarrollo)](#instalación-local-desarrollo)  
6. [Scripts útiles](#scripts-útiles)  
7. [Despliegue en producción](#despliegue-en-producción)  
8. [Docker (opcional)](#docker-opcional)  
9. [Contribuir](#contribuir)  
10. [Licencia](#licencia)

---

## Stack & Features

| Capa | Tecnologías | Highlights |
|------|-------------|------------|
| **Frontend** | React 18, CRA, SCSS, React Router 6, Framer Motion, React‑Toastify | UI responsive, i18n, animaciones, trail global, componentes modulares |
| **Backend**  | Node 20, Express 5, Sequelize, Passport (JWT + Google OAuth), Socket.IO | API REST `/api/*`, autenticación, roles, rate‑limit, i18n, logger, Cloudinary uploads |
| **Database** | MySQL 8 | Migraciones automáticas (`sequelize.sync()`), relaciones & audit‑log |
| **Infra**    | DonWeb VPS + Nginx reverse proxy | HTTPS Let’s Encrypt, PM2, backups automáticos |

### Funcionalidades clave
- Registro / login local y con Google
- Confirmación de e‑mail y recuperación de contraseña
- CRUD de usuarios, skills, proyectos, testimonios, artículos y servicios
- Subida y transformación de imágenes vía Cloudinary
- Sistema de roles (`admin`, `usuario`)
- Audit log completo de acciones sensibles
- Contact form con envío de mensajes y notificaciones toast

---

## Arquitectura del proyecto
```text
portafolio-personal/
├── backend/
│   ├── app.js              # Express app
│   ├── index.js            # Arranque + Socket.IO
│   ├── config/             # DB, Cloudinary, Passport, Logger, i18n
│   ├── routes/             # Rutas agrupadas por recurso
│   ├── controllers/        # Lógica de negocio
│   ├── models/             # Modelos Sequelize + asociaciones
│   └── middleware/         # Auth, validaciones, etc.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js          # Entry point
│   └── ...
└── docs/                   # Diagramas, capturas, etc.
```
> **Monorepo:** backend y frontend viven en el mismo repo para facilitar issues, PRs y CI/CD.

---

## Requisitos previos
* **Node.js ≥ 20** y **npm ≥ 10**  
* **MySQL 8** (o MariaDB equivalente)  
* (Producción) **Nginx** y **PM2** recomendados  
* Cuenta **Cloudinary** para imágenes  
* Credenciales **Google OAuth 2.0** (si usás login con Google)

---

## Variables de entorno

Crea dos archivos en la raíz del **backend**:

### `.env.development`
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portafolio_dev
DB_USER=root
DB_PASSWORD=changeme
JWT_SECRET=loquesea
JWT_REFRESH_SECRET=otrosecreto
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### `.env.production`
> **¡Nunca subas este archivo al repo!** Incluye los mismos campos con valores productivos.

Para el **frontend**, las variables comienzan con `REACT_APP_` y viven en `/frontend/.env`.

---

## Instalación local (desarrollo)

```bash
# 1. Clonar el repo
git clone https://github.com/Enzopinotti/portafolio-personal.git
cd portafolio-personal

# 2. Backend: instalar dependencias y levantar
cd backend
npm install
npm run dev            # http://localhost:3001

# 3. Frontend: en nueva terminal
cd ../frontend
npm install
npm start              # http://localhost:3000

# 4. Listo 🚀 – CRA se proxeará al backend
```

---

## Scripts útiles

### Backend (`/backend/package.json`)

| Script | Descripción |
|--------|-------------|
| `npm run dev`   | Arranca con **nodemon** y variables de desarrollo |
| `npm start`     | Ejecuta en modo producción |
| `npm run lint`  | Lint + fix con ESLint & Prettier |

### Frontend (`/frontend/package.json`)

| Script | Descripción |
|--------|-------------|
| `npm start`     | CRA dev server + HMR |
| `npm run build` | Compila assets optimizados en `/build` |
| `npm test`      | Tests con React Testing Library |

---

## Despliegue en producción

1. **Build frontend** y copiar estáticos al servidor
   ```bash
   cd frontend && npm ci && npm run build
   cp -r build/* /var/www/enzopinotti.dev/html
   ```
2. **Backend**
   ```bash
   cd backend && npm ci && NODE_ENV=production pm2 start index.js --name portafolio-api
   ```
3. **Nginx**
   ```nginx
   server {
     server_name enzopinotti.dev;

     location / {
       root /var/www/enzopinotti.dev/html;
       try_files $uri /index.html;
     }

     location /api/ {
       proxy_pass         http://localhost:3001/api/;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection 'upgrade';
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```
4. **SSL** con Let’s Encrypt
   ```bash
   sudo certbot --nginx -d enzopinotti.dev -m contacto@enzopinotti.dev --agree-tos --redirect
   ```
5. **Backups MySQL** – dump nightly y subir a S3 / Backblaze.

---

## Docker (opcional)

`docker-compose.yml` mínimo:
```yaml
version: "3.9"
services:
  db:
    image: mysql:8.3
    restart: always
    env_file: .env.production
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: ./backend
    env_file: .env.production
    depends_on:
      - db
    ports:
      - "3001:3001"

  frontend:
    build: ./frontend
    environment:
      - REACT_APP_API_URL=/api
    ports:
      - "80:80"
volumes:
  db_data:
```
> Te evita instalar dependencias en el host y facilita CI/CD con ambientes idénticos.

---

## Contribuir

1. **Fork** y rama feature:  
   ```bash
   git checkout -b feature/mi-mejora
   ```
2. Commits en español siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).  
3. Abre un **Pull Request** 🐙.

---

## Licencia
MIT © Enzo Pinotti – 2025
