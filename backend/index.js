// index.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Seleccionar el archivo .env según el entorno
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: resolve(__dirname, envFile) });
// NO cargar el .env de la raíz para evitar que variables de producción (como FRONTEND_URL de enzopinotti.dev) 
// se filtren en el entorno de desarrollo local.


import http from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import app from './app.js';
import logger from './config/logger.js';
import { scrapeTechNews } from './services/scraperService.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' },
});

io.on('connection', (socket) => {
  logger.info(`Nuevo cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Servidor iniciado en el puerto ${PORT}`);
  
  // Programar el scraper para que se ejecute cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    logger.info('[Cron] Ejecutando scraper de noticias...');
    await scrapeTechNews();
  });
  
  // Ejecutar una vez al iniciar el servidor para tener datos iniciales
  scrapeTechNews();
});
