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
      allowNull: true, // coincidir con la migración
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
      field: 'password', // antes era 'contraseña'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'avatar',
    },
    idRol: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_rol',
    },
    estado: {
      type: DataTypes.ENUM('visitante', 'usuario', 'admin'),
      allowNull: false,
      defaultValue: 'visitante',
      field: 'estado',
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_registro',
    },
  },
  {
    tableName: 'usuario',
    timestamps: false,
  }
);

export default Usuario;
