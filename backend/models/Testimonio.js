// models/Testimonio.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';

const Testimonio = sequelize.define(
  'Testimonio',
  {
    idTestimonio: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_testimonio',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nombre',
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'mensaje',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, 
      field: 'id_usuario',
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  },
  {
    tableName: 'testimonio',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Testimonio);

export default Testimonio;
