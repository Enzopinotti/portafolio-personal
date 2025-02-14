// controllers/proyectoController.js
import Proyecto from '../models/Proyecto.js';
import Usuario from '../models/Usuario.js';
import Skill from '../models/Skill.js';
import Imagen from '../models/Imagen.js';
import logger from '../config/logger.js';
import { registrarEvento } from '../utils/auditLogger.js';
import { Op } from 'sequelize';
import Boom from '@hapi/boom';

export const crearProyecto = async (req, res, next) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills } = req.body;
    logger.info(`Crear Proyecto: Usuario ${req.usuario.idUsuario} crea el proyecto "${titulo}"`);
    const nuevoProyecto = await Proyecto.create({
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      enlace,
    });
    await nuevoProyecto.addUsuario(req.usuario.idUsuario);
    logger.info(`Crear Proyecto: Proyecto ID ${nuevoProyecto.id_proyecto} creado y asociado al usuario ${req.usuario.idUsuario}`);
    if (skills && skills.length > 0) {
      await nuevoProyecto.addSkills(skills);
      logger.info(`Crear Proyecto: Se asociaron ${skills.length} skills al proyecto.`);
    }
    await registrarEvento({
      userId: req.usuario.idUsuario,
      action: 'CREATE_PROYECTO',
      target: 'proyecto',
      details: { titulo, descripcion },
      req,
    });
    res.status(201).json({ mensaje: 'Proyecto creado exitosamente.', proyecto: nuevoProyecto });
  } catch (error) {
    logger.error(`Error en crearProyecto: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarProyecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills } = req.body;
    logger.info(`Editar Proyecto: Usuario ${req.usuario.idUsuario} intenta editar el proyecto ID ${id}`);
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      logger.info(`Editar Proyecto: Proyecto ID ${id} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }
    const usuarios = await proyecto.getUsuarios({ where: { idUsuario: req.usuario.idUsuario } });
    if (usuarios.length === 0) {
      logger.info(`Editar Proyecto: Usuario ${req.usuario.idUsuario} sin permisos para editar el proyecto ID ${id}.`);
      return next(Boom.forbidden('No tienes permiso para editar este proyecto.'));
    }
    if (titulo) proyecto.titulo = titulo;
    if (descripcion) proyecto.descripcion = descripcion;
    if (fechaInicio) proyecto.fechaInicio = fechaInicio;
    if (fechaFin) proyecto.fechaFin = fechaFin;
    if (enlace) proyecto.enlace = enlace;
    await proyecto.save();
    if (skills && skills.length > 0) {
      await proyecto.setSkills(skills);
      logger.info(`Editar Proyecto: Se actualizaron las skills asociadas al proyecto ID ${id}.`);
    }
    await registrarEvento({
      userId: req.usuario.idUsuario,
      action: 'EDIT_PROYECTO',
      target: 'proyecto',
      details: { proyectoId: id, cambios: { titulo, descripcion, fechaInicio, fechaFin, enlace } },
      req,
    });
    logger.info(`Editar Proyecto: Proyecto ID ${id} actualizado exitosamente.`);
    res.status(200).json({ mensaje: 'Proyecto actualizado exitosamente.', proyecto });
  } catch (error) {
    logger.error(`Error en editarProyecto: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarProyecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Proyecto: Usuario ${req.usuario.idUsuario} intenta eliminar el proyecto ID ${id}`);
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      logger.info(`Eliminar Proyecto: Proyecto ID ${id} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }
    const usuarios = await proyecto.getUsuarios({ where: { idUsuario: req.usuario.idUsuario } });
    if (usuarios.length === 0) {
      logger.info(`Eliminar Proyecto: Usuario ${req.usuario.idUsuario} sin permisos para eliminar el proyecto ID ${id}.`);
      return next(Boom.forbidden('No tienes permiso para eliminar este proyecto.'));
    }
    await proyecto.destroy();
    logger.info(`Eliminar Proyecto: Proyecto ID ${id} eliminado exitosamente.`);
    await registrarEvento({
      userId: req.usuario.idUsuario,
      action: 'DELETE_PROYECTO',
      target: 'proyecto',
      details: { proyectoId: id },
      req,
    });
    res.status(200).json({ mensaje: 'Proyecto eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error en eliminarProyecto: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const listarProyectos = async (req, res, next) => {
  try {
    logger.info('Listar Proyectos: Obteniendo todos los proyectos.');
    const proyectos = await Proyecto.findAll({
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
      ],
    });
    logger.info(`Listar Proyectos: Se obtuvieron ${proyectos.length} proyectos.`);
    res.status(200).json(proyectos);
  } catch (error) {
    logger.error(`Error en listarProyectos: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verProyecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Proyecto: Buscando proyecto con ID ${id}`);
    const proyecto = await Proyecto.findByPk(id, {
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
          through: { attributes: [] },
        },
      ],
    });
    if (!proyecto) {
      logger.info(`Ver Proyecto: Proyecto con ID ${id} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }
    logger.info(`Ver Proyecto: Proyecto con ID ${id} encontrado.`);
    res.status(200).json(proyecto);
  } catch (error) {
    logger.error(`Error en verProyecto: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const buscarProyectos = async (req, res, next) => {
  try {
    const { titulo, fechaInicio, fechaFin } = req.query;
    const whereClause = {};
    logger.info('Buscar Proyectos: Iniciando búsqueda de proyectos.');
    if (titulo) {
      whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }
    if (fechaInicio) {
      whereClause.fechaInicio = { [Op.gte]: fechaInicio };
    }
    if (fechaFin) {
      whereClause.fechaFin = { [Op.lte]: fechaFin };
    }
    const proyectos = await Proyecto.findAll({ where: whereClause });
    logger.info(`Buscar Proyectos: Se encontraron ${proyectos.length} proyectos.`);
    res.status(200).json(proyectos);
  } catch (error) {
    logger.error(`Error en buscarProyectos: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const asignarSkillAProyecto = async (req, res, next) => {
  try {
    const { idProyecto, idSkill } = req.params;
    logger.info(`Asignar Skill: Usuario ${req.usuario.idUsuario} asigna skill ${idSkill} al proyecto ${idProyecto}`);
    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) {
      logger.info(`Asignar Skill: Proyecto ${idProyecto} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }
    const skill = await Skill.findByPk(idSkill);
    if (!skill) {
      logger.info(`Asignar Skill: Skill ${idSkill} no encontrada.`);
      return next(Boom.notFound('Skill no encontrada.'));
    }
    await proyecto.addSkill(skill);
    logger.info(`Asignar Skill: Skill ${idSkill} asignada al proyecto ${idProyecto} exitosamente.`);
    res.status(200).json({ mensaje: 'Skill asignada exitosamente al proyecto.' });
  } catch (error) {
    logger.error(`Error en asignarSkillAProyecto: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
