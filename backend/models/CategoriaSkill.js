// models/CategoriaSkill.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';

const CategoriaSkill = sequelize.define(
  'CategoriaSkill',
  {
    idCategoriaSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_categoria_skill',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'nombre',
    },
  },
  {
    tableName: 'categoria_skill',
    timestamps: false,
  }
);

sequelizePaginate.paginate(CategoriaSkill);

export default CategoriaSkill;
