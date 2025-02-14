// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import logger from './config/logger.js';
import sequelize from './config/database.js';
import routes from './routes/index.js'; // Importa el enrutador central
import './models/associations.js'; // Asegúrate de importar las asociaciones

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(helmet());
app.set('trust proxy', true);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Límite de solicitudes
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos.',
});
app.use(limiter);

// Inicializar Passport (sin sesiones)
app.use(passport.initialize());

// Usar el enrutador central bajo el prefijo /api
app.use('/api', routes);

// Middleware de manejo de errores (después de las rutas)
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

export default app;
