// src/models/SkillCategoria.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SkillCategoria = sequelize.define(
  'SkillCategoria',
  {
    idSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'id_skill',
    },
    idCategoriaSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'id_categoria_skill',
    },
  },
  {
    tableName: 'skill_categoria',
    timestamps: false,
  }
);

export default SkillCategoria;
