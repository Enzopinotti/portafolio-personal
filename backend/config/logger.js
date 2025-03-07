// config/logger.js
import fs from 'fs';
import dotenvFlow from 'dotenv-flow';
import winston from 'winston';

dotenvFlow.config();

// Asegurarse de que la carpeta "logs" exista
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH || 'logs/app.log'
    })
  ]
});

export default logger;
