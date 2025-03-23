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
    // Antes "nombre", ahora "nombre_completo"
    nombreCompleto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nombre_completo',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'email',
    },
    // Se eliminó "asunto"

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
    // Nuevo campo para el servicio de interés (texto, por ejemplo, el nombre del servicio)
    servicioInteres: {
      type: DataTypes.STRING(255),
      allowNull: false, // Ajusta según lo que necesites (false si es obligatorio)
      field: 'servicio_interes',
    }
  },
  {
    tableName: 'mensaje_contacto',
    timestamps: false,
  }
);

sequelizePaginate.paginate(MensajeContacto);

export default MensajeContacto;
