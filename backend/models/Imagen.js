// models/Imagen.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Imagen = sequelize.define(
  'Imagen',
  {
    idImagen: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_imagen',
    },
    ruta: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'ruta',
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'descripcion',
    },
    idProyecto: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'id_proyecto',
    },
  },
  {
    tableName: 'imagen',
    timestamps: false,
  }
);

export default Imagen;
