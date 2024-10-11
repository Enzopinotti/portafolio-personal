// models/Usuario.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define(
  'Usuario',
  {
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_usuario',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nombre',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contraseña',
    },
    idRol: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_rol',
    },
  },
  {
    tableName: 'usuario',
    timestamps: false,
  }
);

export default Usuario;
