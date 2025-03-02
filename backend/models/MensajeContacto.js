// models/MensajeContacto.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';
const MensajeContacto = sequelize.define(
  'MensajeContacto',
  {
    idMensajeContacto: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_mensaje_contacto',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nombre',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'email',
    },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'asunto',
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'mensaje',
    },
    fechaEnvio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_envio',
    },
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'id_usuario',
    },
  },
  {
    tableName: 'mensaje_contacto',
    timestamps: false,
  }
);

sequelizePaginate.paginate(MensajeContacto);

export default MensajeContacto;
