// models/Skill.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sequelizePaginate from 'sequelize-paginate';

const Skill = sequelize.define(
  'Skill',
  {
    idSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_skill',
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'nombre',
    },
    nivel: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
      field: 'nivel',
    },
    idCategoriaSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_categoria_skill',
    },
    idImagen: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      unique: true,
      field: 'id_imagen',
    },
  },
  {
    tableName: 'skill',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Skill);
export default Skill;
