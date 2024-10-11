// models/Proyecto.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Proyecto = sequelize.define(
  'Proyecto',
  {
    idProyecto: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_proyecto',
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'titulo',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'descripcion',
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'fecha_inicio',
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_fin',
    },
    enlace: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'enlace',
    },
    maxImagenes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 5,
      field: 'max_imagenes',
    },
  },
  {
    tableName: 'proyecto',
    timestamps: false,
  }
);

export default Proyecto;
