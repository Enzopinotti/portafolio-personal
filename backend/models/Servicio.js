// models/Servicio.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';

const Servicio = sequelize.define(
  'Servicio',
  {
    idServicio: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_servicio',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nombre',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'descripcion',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // opcional
      field: 'precio',
    },
    idImagen: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'id_imagen',
    },
  },
  {
    tableName: 'servicio',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Servicio);

export default Servicio;
