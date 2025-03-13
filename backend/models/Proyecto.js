// models/Proyecto.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';

const Proyecto = sequelize.define(
  'Proyecto',
  {
    idProyecto: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_proyecto',
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'titulo',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'descripcion',
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'fecha_inicio',
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_fin',
    },
    enlace: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'enlace',
    },
    maxImagenes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 5,
      field: 'max_imagenes',
    },
    imagenPastilla: {
      type: DataTypes.STRING(255),
      allowNull: true,  
      field: 'imagen_pastilla',
    },
    enlaceGithub: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'enlace_github',
    },
  },
  {
    tableName: 'proyecto',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Proyecto);

export default Proyecto;
