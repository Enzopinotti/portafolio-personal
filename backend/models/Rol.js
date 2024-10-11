// models/Rol.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rol = sequelize.define(
  'Rol',
  {
    idRol: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_rol', // Especificamos el nombre real de la columna en la base de datos
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'nombre',
    },
  },
  {
    tableName: 'rol', // Nombre real de la tabla en la base de datos
    timestamps: false,
  }
);

export default Rol;
