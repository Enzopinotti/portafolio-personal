// app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import sequelize from './config/database.js';
import logger from './config/logger.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import mensajeContactoRoutes from './routes/mensajeContactoRoutes.js';
import testimonioRoutes from './routes/testimonioRoutes.js'
import articuloRoutes from './routes/articuloRoutes.js'
import servicioRoutes from './routes/servicioRoutes.js'
import rolRoutes from './routes/rolRoutes.js'
import './models/associations.js'; // Asegúrate de importar las asociaciones

dotenv.config();

const app = express();

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(helmet());

// Registro de solicitudes HTTP
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Límite de tasa de solicitudes
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Límite de solicitudes
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos.',
});

app.use(limiter);

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/mensajes', mensajeContactoRoutes);
app.use('/api/testimonios', testimonioRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/roles', rolRoutes);

// Manejo de errores (debe ir después de las rutas)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Sincronización con la base de datos
sequelize.sync()
  .then(() => {
    logger.info('Base de datos sincronizada');
  })
  .catch((error) => {
    logger.error('Error al sincronizar la base de datos:', error);
  });

// Configuración de Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
});

io.on('connection', (socket) => {
  logger.info(`Nuevo cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });

  // Aquí puedes manejar eventos personalizados
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Servidor iniciado en el puerto ${PORT}`);
});
