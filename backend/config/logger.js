import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const level = env === 'production' ? 'error' : 'debug';

// Función para extraer información simple del caller (archivo y línea)
const extractCallerInfo = () => {
  const error = new Error();
  const stack = error.stack.split('\n');
  // La línea 4 es generalmente la que nos interesa (puedes ajustarla según tu caso)
  if (stack[3]) {
    // Ejemplo: "at Console._write (C:\path\to\file.js:91:33)"
    const match = stack[3].match(/\(([^)]+)\)/);
    if (match && match[1]) {
      // Extrae solo el nombre del archivo y la línea
      const parts = match[1].split(/[\\/]/);
      return parts.pop(); // Devuelve "file.js:91:33"
    }
  }
  return '';
};

const addCallerInfo = winston.format((info) => {
  if (env !== 'production') {
    info.caller = extractCallerInfo();
  }
  return info;
});

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  addCallerInfo(),
  winston.format.printf(({ level, message, timestamp, caller }) => {
    return `[${timestamp}] ${level}: ${message} ${caller ? `(${caller})` : ''}`;
  })
);

const logger = winston.createLogger({
  level,
  transports: [
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH,
      format: fileFormat,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export default logger;
