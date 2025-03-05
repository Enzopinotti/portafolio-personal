// controllers/proyectoController.js
import Proyecto from '../models/Proyecto.js';
import Usuario from '../models/Usuario.js';
import Skill from '../models/Skill.js';
import Imagen from '../models/Imagen.js';
import logger from '../config/logger.js';
import { registrarEvento } from '../utils/auditLogger.js';
import { Op } from 'sequelize';
import Boom from '@hapi/boom';
import ProyectoSkill from '../models/ProyectoSkill.js';
import Servicio from '../models/Servicio.js';
import ProyectoServicio from '../models/ProyectoServicio.js';

export const crearProyecto = async (req, res, next) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills, servicios } = req.body;
    logger.info(`Crear Proyecto: Usuario ${req.usuario.idUsuario} crea el proyecto "${titulo}"`);

    // Crear el proyecto
    const nuevoProyecto = await Proyecto.create({
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      enlace,
    });

    // Asociar el proyecto al usuario creador
    await nuevoProyecto.addUsuario(req.usuario.idUsuario);
    logger.info(`Crear Proyecto: Proyecto ID ${nuevoProyecto.idProyecto} creado y asociado al usuario ${req.usuario.idUsuario}`);

    // Asignar skills manualmente si se han enviado
    if (skills && Array.isArray(skills) && skills.length > 0) {
      const skillIds = skills.map(id => parseInt(id, 10));
      const nuevosRegistrosSkills = skillIds.map(idSkill => ({
        id_proyecto: nuevoProyecto.idProyecto,
        id_skill: idSkill,
      }));
      await ProyectoSkill.bulkCreate(nuevosRegistrosSkills);
      logger.info(`Crear Proyecto: Se asociaron ${skills.length} skills al proyecto.`);
    }

    // Asignar servicios manualmente si se han enviado
    if (servicios && Array.isArray(servicios) && servicios.length > 0) {
      const servicioIds = servicios.map(id => parseInt(id, 10));
      const nuevosRegistrosServicios = servicioIds.map(idServicio => ({
        id_proyecto: nuevoProyecto.idProyecto,
        id_servicio: idServicio,
      }));
      await ProyectoServicio.bulkCreate(nuevosRegistrosServicios);
      logger.info(`Crear Proyecto: Se asociaron ${servicios.length} servicios al proyecto.`);
    }

    // Registrar el evento
    await registrarEvento({
      userId: req.usuario.idUsuario,
      action: 'CREATE_PROYECTO',
      target: 'proyecto',
      details: { titulo, descripcion },
      req,
    });

    // Recargar el proyecto con las asociaciones de skills y servicios
    const proyectoRecargado = await Proyecto.findByPk(nuevoProyecto.idProyecto, {
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre', 'nivel'],
          through: { attributes: [] },
        },
        {
          model: Servicio,
          attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json({ mensaje: 'Proyecto creado exitosamente.', proyecto: proyectoRecargado });
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

export const asignarSkillsAProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const { skills } = req.body; // Se espera un array de IDs
    logger.info(`Asignar Skills: Asignando skills al proyecto con ID ${idProyecto}`);
    
    if (!Array.isArray(skills)) {
      return next(Boom.badRequest('Se espera un array de IDs en skills.'));
    }
    
    // Convertir los IDs a números
    const skillIds = skills.map(id => parseInt(id, 10));
    
    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) {
      logger.info(`Asignar Skills: Proyecto con ID ${idProyecto} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }
    
    // Asignar las skills usando el método generado por la asociación (setSkills)
    await proyecto.setSkills(skillIds);
    
    // Recargar el proyecto con las skills asignadas
    const proyectoActualizado = await Proyecto.findByPk(idProyecto, {
      include: [{
         model: Skill,
         attributes: ['idSkill', 'nombre', 'nivel'],
         through: { attributes: [] }
      }]
    });
    
    logger.info(`Asignar Skills: Skills asignadas exitosamente al proyecto con ID ${idProyecto}`);
    res.status(200).json({ mensaje: 'Skills asignadas exitosamente al proyecto.', proyecto: proyectoActualizado });
  } catch (error) {
    logger.error(`Error al asignar skills al proyecto: ${error.message}`);
    return next(Boom.internal(error.message || 'Error al asignar skills'));
  }
};

export const asignarServiciosAProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const { servicios } = req.body; // Se espera un array de IDs
    logger.info(`Asignar Servicios: Asignando servicios al proyecto con ID ${idProyecto}`);

    if (!Array.isArray(servicios)) {
      return next(Boom.badRequest('Se espera un array de IDs en servicios.'));
    }

    // Convertir los IDs a números
    const servicioIds = servicios.map(id => parseInt(id, 10));

    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) {
      logger.info(`Asignar Servicios: Proyecto con ID ${idProyecto} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }

    // Paso 1: Eliminar las asociaciones previas en la tabla intermedia
    await ProyectoServicio.destroy({ where: { id_proyecto: idProyecto } });

    // Paso 2: Preparar los nuevos registros
    const nuevosRegistros = servicioIds.map(idServicio => ({
      id_proyecto: idProyecto,
      id_servicio: idServicio,
    }));

    // Paso 3: Insertar las nuevas asociaciones manualmente
    await ProyectoServicio.bulkCreate(nuevosRegistros);

    // Recargar el proyecto con los servicios asignados
    const proyectoActualizado = await Proyecto.findByPk(idProyecto, {
      include: [{
        model: Servicio,
        attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
        through: { attributes: [] },
      }],
    });

    logger.info(`Asignar Servicios: Servicios asignados exitosamente al proyecto con ID ${idProyecto}`);
    res.status(200).json({ mensaje: 'Servicios asignados exitosamente al proyecto.', proyecto: proyectoActualizado });
  } catch (error) {
    logger.error(`Error al asignar servicios al proyecto: ${error.message}`);
    return next(Boom.internal(error.message || 'Error al asignar servicios'));
  }
};