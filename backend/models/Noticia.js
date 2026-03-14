import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Noticia = sequelize.define('Noticia', {
  idNoticia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enlace: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fuente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Noticias',
  timestamps: true,
});

export default Noticia;
