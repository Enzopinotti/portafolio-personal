import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';

import Articulo from './Articulo.js';
import AuditLog from './AuditLog.js';
import CategoriaSkill from './CategoriaSkill.js';
import Imagen from './Imagen.js';
import MensajeContacto from './MensajeContacto.js';
import Proyecto from './Proyecto.js';
import ProyectoServicio from './ProyectoServicio.js';
import ProyectoSkill from './ProyectoSkill.js';
import Rol from './Rol.js';
import Servicio from './Servicio.js';
import Settings from './Settings.js';
import Skill from './Skill.js';
import SkillCategoria from './SkillCategoria.js';
import Testimonio from './Testimonio.js';
import Usuario from './Usuario.js';

// Import associations to ensure relationships are set up
import './associations.js';

const db = {
  Articulo,
  AuditLog,
  CategoriaSkill,
  Imagen,
  MensajeContacto,
  Proyecto,
  ProyectoServicio,
  ProyectoSkill,
  Rol,
  Servicio,
  Settings,
  Skill,
  SkillCategoria,
  Testimonio,
  Usuario,
  sequelize,
  Sequelize
};

export default db;
