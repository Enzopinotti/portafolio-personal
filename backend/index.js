// index.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import logger from './config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

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
});
