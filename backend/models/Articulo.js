// models/Articulo.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Articulo = sequelize.define(
  'Articulo',
  {
    idArticulo: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_articulo',
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'titulo',
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'contenido',
    },
    fechaPublicacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_publicacion',
    },
    autor: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'autor',
    },
    categoria: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'categoria',
    },
    // Si deseas enlazarlo a un usuario en lugar de simplemente guardar el nombre:
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
       allowNull: true,
       field: 'id_usuario',
    },
  },
  { 
    tableName: 'articulo',
    timestamps: false,
  }
);

export default Articulo;
