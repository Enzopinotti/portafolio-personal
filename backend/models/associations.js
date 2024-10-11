// associations.js

import Usuario from './Usuario.js';
import Proyecto from './Proyecto.js';
import Skill from './Skill.js';
import MensajeContacto from './MensajeContacto.js';
import CategoriaSkill from './CategoriaSkill.js';
import Imagen from './Imagen.js';
import Rol from './Rol.js';

// Relaciones Usuario - Rol
Usuario.belongsTo(Rol, {
    foreignKey: 'id_rol',
    onDelete: 'RESTRICT', // o 'CASCADE' según tus necesidades
    onUpdate: 'CASCADE',
  });
  Rol.hasMany(Usuario, {
    foreignKey: 'id_rol',
    onDelete: 'RESTRICT', // o 'CASCADE' según tus necesidades
    onUpdate: 'CASCADE',
  });
// Relaciones Usuario - Proyecto (muchos a muchos)
Usuario.belongsToMany(Proyecto, {
  through: 'usuario_proyecto',
  foreignKey: 'id_usuario',
  otherKey: 'id_proyecto',
});
Proyecto.belongsToMany(Usuario, {
  through: 'usuario_proyecto',
  foreignKey: 'id_proyecto',
  otherKey: 'id_usuario',
});

// Relaciones Proyecto - Skill (muchos a muchos)
Proyecto.belongsToMany(Skill, {
  through: 'proyecto_skill',
  foreignKey: 'id_proyecto',
  otherKey: 'id_skill',
});
Skill.belongsToMany(Proyecto, {
  through: 'proyecto_skill',
  foreignKey: 'id_skill',
  otherKey: 'id_proyecto',
});

// Relaciones Skill - CategoriaSkill
Skill.belongsTo(CategoriaSkill, {
    foreignKey: 'id_categoria_skill',
    onDelete: 'RESTRICT', // o 'CASCADE' según tus necesidades
    onUpdate: 'CASCADE',
  });
  CategoriaSkill.hasMany(Skill, {
    foreignKey: 'id_categoria_skill',
    onDelete: 'RESTRICT', // o 'CASCADE' según tus necesidades
    onUpdate: 'CASCADE',
  });

// Relaciones Skill - Imagen
Skill.belongsTo(Imagen, { foreignKey: 'id_imagen', allowNull: true });
Imagen.hasOne(Skill, { foreignKey: 'id_imagen' });

// Relaciones Proyecto - Imagen
Proyecto.hasMany(Imagen, { foreignKey: 'id_proyecto' });
Imagen.belongsTo(Proyecto, { foreignKey: 'id_proyecto', allowNull: true });

// Relaciones MensajeContacto - Usuario (opcional)
MensajeContacto.belongsTo(Usuario, { foreignKey: 'id_usuario', allowNull: true });
Usuario.hasMany(MensajeContacto, { foreignKey: 'id_usuario' });
