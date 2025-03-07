// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import logger from './config/logger.js';
import sequelize from './config/database.js';
import i18n from './config/i18n.js';
import routes from './routes/index.js';

import './models/associations.js';
import './config/passport.js';
import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(helmet());
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // confía en el primer proxy
} else {
  app.set('trust proxy', false);
}
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(cookieParser());

// Configuración de i18n
app.use(i18n.init);

// Middleware para cambiar el idioma según ?lang=xx
app.use((req, res, next) => {
  if (req.query.lang && i18n.getLocales().includes(req.query.lang)) {
    req.setLocale(req.query.lang);
  }
  next();
});

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde.',
});
app.use(limiter);

app.use(passport.initialize());
app.use('/api', routes);

// Middleware de manejo de errores (después de las rutas)
app.use((err, req, res, next) => {
  // Si el error es de Boom, extrae el status y el mensaje
  const status = err.output && err.output.statusCode ? err.output.statusCode : 500;
  const message =
    err.output && err.output.payload && err.output.payload.message
      ? err.output.payload.message
      : 'Ocurrió un error en el servidor.';
  logger.error(err.stack);
  res.status(status).json({ error: message });
});


sequelize.sync()
  .then(() => logger.info('Base de datos sincronizada'))
  .catch((error) => logger.error('Error al sincronizar la base de datos:', error));

export default app;
