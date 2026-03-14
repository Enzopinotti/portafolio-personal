import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar .env.development en desarrollo o .env.production en producción
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });
dotenv.config(); // Fallback al .env principal


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: false,
    },
  }
);

export default sequelize;
