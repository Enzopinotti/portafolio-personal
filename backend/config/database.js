// config/database.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true, // Convierte nombres de atributos y tablas a snake_case
      freezeTableName: true, // Evita que Sequelize pluralice los nombres de las tablas
      timestamps: false, // Desactiva los campos createdAt y updatedAt
    },
  }
);

export default sequelize;
