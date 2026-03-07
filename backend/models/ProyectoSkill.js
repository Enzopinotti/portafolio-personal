// models/ProyectoSkill.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProyectoSkill = sequelize.define(
  'ProyectoSkill',
  {
    idProyecto: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'id_proyecto',
    },
    idSkill: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'id_skill',
    },
    nivel: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      field: 'nivel',
    },
  },
  {
    tableName: 'proyecto_skill',
    timestamps: false,
  }
);

export default ProyectoSkill;
