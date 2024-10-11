const Usuario = require('./Usuario');
const Proyecto = require('./Proyecto');
const Skill = require('./Skill');
const MensajeContacto = require('./MensajeContacto');
const CategoriaSkill = require('./CategoriaSkill');
const Imagen = require('./Imagen');
const Rol = require('./Rol');

// Relaciones Usuario - Rol
Usuario.belongsTo(Rol, { foreignKey: 'idRol' });
Rol.hasMany(Usuario, { foreignKey: 'idRol' });

// Relaciones Usuario - Proyecto (muchos a muchos)
Usuario.belongsToMany(Proyecto, { through: 'usuario_proyecto', foreignKey: 'idUsuario' });
Proyecto.belongsToMany(Usuario, { through: 'usuario_proyecto', foreignKey: 'idProyecto' });

// Relaciones Proyecto - Skill (muchos a muchos)
Proyecto.belongsToMany(Skill, { through: 'proyecto_skill', foreignKey: 'idProyecto' });
Skill.belongsToMany(Proyecto, { through: 'proyecto_skill', foreignKey: 'idSkill' });

// Relaciones Skill - CategoriaSkill
Skill.belongsTo(CategoriaSkill, { foreignKey: 'idCategoriaSkill' });
CategoriaSkill.hasMany(Skill, { foreignKey: 'idCategoriaSkill' });

// Relaciones Skill - Imagen
Skill.belongsTo(Imagen, { foreignKey: 'idImagen', allowNull: true });
Imagen.hasOne(Skill, { foreignKey: 'idImagen' });

// Relaciones Proyecto - Imagen
Proyecto.hasMany(Imagen, { foreignKey: 'idProyecto' });
Imagen.belongsTo(Proyecto, { foreignKey: 'idProyecto', allowNull: true });

// Puedes definir más relaciones según sea necesario
