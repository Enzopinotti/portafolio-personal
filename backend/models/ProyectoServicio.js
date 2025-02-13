// models/ProyectoServicio.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProyectoServicio = sequelize.define(
  'ProyectoServicio',
  {
    idProyecto: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true, // combinando con idServicio
      field: 'id_proyecto',
    },
    idServicio: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true, // combinando con idProyecto
      field: 'id_servicio',
    },
  },
  {
    tableName: 'proyecto_servicio',
    timestamps: false,
  }
);

export default ProyectoServicio;
