// associations.js

import Usuario from './Usuario.js';
import Proyecto from './Proyecto.js';
import Skill from './Skill.js';
import MensajeContacto from './MensajeContacto.js';
import CategoriaSkill from './CategoriaSkill.js';
import Imagen from './Imagen.js';
import Rol from './Rol.js';
import Testimonio from './Testimonio.js';
import Articulo from './Articulo.js';
import ProyectoServicio from './ProyectoServicio.js';
import Servicio from './Servicio.js';
import ProyectoSkill from './ProyectoSkill.js';


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

// Relaciones: Usuario - Testimonio (De esta forma, id_usuario en testimonio puede ser null si el testimonio es de un visitante no registrado).
Usuario.hasMany(Testimonio, {
  foreignKey: 'id_usuario',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Testimonio.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
});

// Un usuario puede tener 0..* artículos
Usuario.hasMany(Articulo, {
  foreignKey: 'id_usuario',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Articulo.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
});

// Relacionar Servicio con Imagen
Servicio.belongsTo(Imagen, { foreignKey: 'id_imagen', allowNull: true });
Imagen.hasOne(Servicio, { foreignKey: 'id_imagen' });

Proyecto.belongsToMany(Servicio, {
  through: ProyectoServicio,
  foreignKey: 'id_proyecto',
  otherKey: 'id_servicio',
});

Servicio.belongsToMany(Proyecto, {
  through: ProyectoServicio,
  foreignKey: 'id_servicio',
  otherKey: 'id_proyecto',
});

Proyecto.belongsToMany(Skill, {
  through: ProyectoSkill,
  foreignKey: 'id_proyecto',
  otherKey: 'id_skill',
});
Skill.belongsToMany(Proyecto, {
  through: ProyectoSkill,
  foreignKey: 'id_skill',
  otherKey: 'id_proyecto',
});