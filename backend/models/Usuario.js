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
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: true,                // O false, según tu lógica
      field: 'apellido',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password',              // En la BD sería la columna "password"
    },
    idRol: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_rol',
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_registro',
    },
    refreshToken: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: 'refresh_token',
    },
  },
  {
    tableName: 'usuario',
    timestamps: false,
  }
);

export default Usuario;
