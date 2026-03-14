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
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import CategoriaSkill from '../models/CategoriaSkill.js';

export const crearProyecto = async (req, res, next) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills, servicios, enlaceGithub } = req.body;
    console.log('enlace de github: ', enlaceGithub);
    // Crear el proyecto en BD (sin imagenPastilla)
    const nuevoProyecto = await Proyecto.create({
      titulo,
      descripcion,
      fechaInicio,
      fechaFin: fechaFin || null,
      enlace,
      enlaceGithub,
    });

    // Asociar con el usuario creador
    await nuevoProyecto.addUsuario(req.usuario.idUsuario);
    logger.info(`Crear Proyecto: Proyecto ID ${nuevoProyecto.idProyecto} creado y asociado al usuario ${req.usuario.idUsuario}`);

    // Asignar skills manualmente si se han enviado
    if (skills && Array.isArray(skills) && skills.length > 0) {
      const nuevosRegistrosSkills = skills.map(skillItem => {
        // Puede venir como ID (número) o como Objeto { idSkill, nivel }
        const idSkill = typeof skillItem === 'object' ? skillItem.idSkill : parseInt(skillItem, 10);
        const nivel = typeof skillItem === 'object' ? skillItem.nivel : null;
        return {
          idProyecto: nuevoProyecto.idProyecto,
          idSkill: idSkill,
          nivel: nivel
        };
      });
      await ProyectoSkill.bulkCreate(nuevosRegistrosSkills);
      logger.info(`Crear Proyecto: Se asociaron ${skills.length} skills al proyecto.`);
    }

    // Asignar servicios manualmente si se han enviado
    if (servicios && Array.isArray(servicios) && servicios.length > 0) {
      const servicioIds = servicios.map(id => parseInt(id, 10));
      const nuevosRegistrosServicios = servicioIds.map(idServicio => ({
        idProyecto: nuevoProyecto.idProyecto,
        idServicio: idServicio,
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


    // Devolver el proyecto recién creado (con su idProyecto)
    // Devolver el proyecto recién creado con todas sus asociaciones
    const proyectoCompleto = await Proyecto.findByPk(nuevoProyecto.idProyecto, {
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre', 'nivel'],
          include: [{
            model: CategoriaSkill,
            as: 'Categorias',
            attributes: ['idCategoriaSkill', 'nombre'],
            through: { attributes: [] }
          }],
          through: { attributes: ['nivel'] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Servicio,
          attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
          through: { attributes: [] },
        },
      ]
    });

    res.status(201).json({
      mensaje: 'Proyecto creado exitosamente.',
      proyecto: proyectoCompleto,
    });
  } catch (error) {
    logger.error(`Error crearProyecto: ${error.message}`);
    next(Boom.internal(error.message));
  }
};

export const subirImagenPastilla = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) return next(Boom.notFound('Proyecto no encontrado'));

    if (!req.file) {
      return next(Boom.badRequest('No se recibió ninguna imagen'));
    }

    // Subir a Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'proyectos/portada',
    });

    // Borrar archivo local
    fs.unlinkSync(req.file.path);

    // OPCIONAL: Si había una imagen previa, borrarla de Cloudinary
    if (proyecto.publicIdPastilla) {
      await cloudinary.uploader.destroy(proyecto.publicIdPastilla);
    }

    // Guardar la URL y el publicId en la BD
    proyecto.imagenPastilla = resultado.secure_url;
    proyecto.publicIdPastilla = resultado.public_id;
    await proyecto.save();

    res.status(200).json({
      mensaje: 'Imagen de pastilla subida correctamente.',
      proyecto,
    });
  } catch (error) {
    next(Boom.internal(error.message));
  }
};


export const subirImagenesProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) return next(Boom.notFound('Proyecto no encontrado'));

    // Validar límite
    const imagenesActuales = await Imagen.count({ where: { idProyecto } });
    const nuevas = req.files.length;
    if (imagenesActuales + nuevas > proyecto.maxImagenes) {
      return next(Boom.badRequest(`Se excede el máximo de ${proyecto.maxImagenes} imágenes.`));
    }

    const imagenesGuardadas = [];

    for (const file of req.files) {
      const resultado = await cloudinary.uploader.upload(file.path, {
        folder: `proyectos/${idProyecto}`,
      });
      fs.unlinkSync(file.path);

      const nuevaImagen = await Imagen.create({
        ruta: resultado.secure_url,
        publicId: resultado.public_id,
        idProyecto,
      });

      imagenesGuardadas.push(nuevaImagen);
    }

    res.status(201).json({
      mensaje: 'Imágenes subidas correctamente.',
      imagenes: imagenesGuardadas,
    });
  } catch (error) {
    next(Boom.internal(error.message));
  }
};

export const editarProyecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectID = parseInt(id, 10);
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills, servicios, enlaceGithub } = req.body;

    logger.info(`Editar Proyecto: ID ${projectID}. Skills: ${JSON.stringify(skills)}, Servicios: ${JSON.stringify(servicios)}`);

    const proyecto = await Proyecto.findByPk(projectID);
    if (!proyecto) {
      logger.info(`Editar Proyecto: Proyecto ID ${projectID} no encontrado.`);
      return next(Boom.notFound('Proyecto no encontrado.'));
    }

    if (titulo !== undefined) proyecto.titulo = titulo;
    if (descripcion !== undefined) proyecto.descripcion = descripcion;
    if (fechaInicio !== undefined) proyecto.fechaInicio = fechaInicio;
    if (fechaFin !== undefined) proyecto.fechaFin = fechaFin;
    if (enlace !== undefined) proyecto.enlace = enlace;
    if (enlaceGithub !== undefined) proyecto.enlaceGithub = enlaceGithub;

    await proyecto.save();

    // Actualizar Skills
    if (skills !== undefined && Array.isArray(skills)) {
      logger.info(`Editar Proyecto: Borrando skills previas para el proyecto ${projectID}`);
      await ProyectoSkill.destroy({ where: { idProyecto: projectID } });

      if (skills.length > 0) {
        const nuevosRegistrosSkills = skills.map(skillItem => {
          const idSkill = typeof skillItem === 'object' ? skillItem.idSkill : parseInt(skillItem, 10);
          const nivel = typeof skillItem === 'object' ? skillItem.nivel : null;
          return {
            idProyecto: projectID,
            idSkill: parseInt(idSkill, 10),
            nivel: nivel !== null ? parseInt(nivel, 10) : null
          };
        });
        await ProyectoSkill.bulkCreate(nuevosRegistrosSkills);
        logger.info(`Editar Proyecto: Creadas ${nuevosRegistrosSkills.length} nuevas asociaciones de skills.`);
      }
    }

    // Actualizar Servicios
    if (servicios !== undefined && Array.isArray(servicios)) {
      logger.info(`Editar Proyecto: Borrando servicios previos para el proyecto ${projectID}`);
      await ProyectoServicio.destroy({ where: { idProyecto: projectID } });

      if (servicios.length > 0) {
        const nuevosRegistrosServicios = servicios.map(idServicio => ({
          idProyecto: projectID,
          idServicio: parseInt(idServicio, 10),
        }));
        await ProyectoServicio.bulkCreate(nuevosRegistrosServicios);
        logger.info(`Editar Proyecto: Creadas ${nuevosRegistrosServicios.length} nuevas asociaciones de servicios.`);
      }
    }

    await registrarEvento({
      userId: req.usuario.idUsuario,
      action: 'EDIT_PROYECTO',
      target: 'proyecto',
      details: { proyectoId: projectID, cambios: { titulo, descripcion, fechaInicio, fechaFin, enlace } },
      req,
    });

    // Recargar el proyecto con todas sus asociaciones para devolverlo completo
    const proyectoActualizado = await Proyecto.findByPk(projectID, {
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre', 'nivel'],
          include: [{
            model: CategoriaSkill,
            as: 'Categorias',
            attributes: ['idCategoriaSkill', 'nombre'],
            through: { attributes: [] }
          }],
          through: { attributes: ['nivel'] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Servicio,
          attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
          through: { attributes: [] },
        },
      ],
    });

    logger.info(`Editar Proyecto: Proyecto ID ${projectID} actualizado exitosamente.`);
    res.status(200).json({ mensaje: 'Proyecto actualizado exitosamente.', proyecto: proyectoActualizado });
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
          attributes: ['idSkill', 'nombre', 'nivel'],
          include: [{
            model: CategoriaSkill,
            as: 'Categorias',
            attributes: ['idCategoriaSkill', 'nombre'],
            through: { attributes: [] }
          }],
          through: { attributes: ['nivel'] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Servicio,
          attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
          through: { attributes: [] },
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
          attributes: ['idSkill', 'nombre', 'nivel'],
          include: [{
            model: CategoriaSkill,
            as: 'Categorias',
            attributes: ['idCategoriaSkill', 'nombre'],
            through: { attributes: [] }
          }],
          through: { attributes: ['nivel'] },
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
        {
          model: Servicio, // <-- Incluye Servicios aquí
          attributes: ['idServicio', 'nombre', 'descripcion'],
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
    const proyectos = await Proyecto.findAll({
      where: whereClause,
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre', 'nivel'],
          include: [{
            model: CategoriaSkill,
            as: 'Categorias',
            attributes: ['idCategoriaSkill', 'nombre'],
            through: { attributes: [] }
          }],
          through: { attributes: ['nivel'] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Servicio,
          attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
          through: { attributes: [] },
        },
      ],
    });
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
    const projectID = parseInt(idProyecto, 10);
    const { skills } = req.body;
    logger.info(`Asignar Skills: Proyecto ID ${projectID}`);

    if (!Array.isArray(skills)) {
      return next(Boom.badRequest('Se espera un array de objetos en skills.'));
    }

    const proyecto = await Proyecto.findByPk(projectID);
    if (!proyecto) {
      return next(Boom.notFound('Proyecto no encontrado.'));
    }

    await ProyectoSkill.destroy({ where: { idProyecto: projectID } });

    if (skills.length > 0) {
      const nuevosRegistros = skills.map(skillItem => {
        const idSkill = typeof skillItem === 'object' ? skillItem.idSkill : parseInt(skillItem, 10);
        const nivel = typeof skillItem === 'object' ? skillItem.nivel : null;
        return {
          idProyecto: projectID,
          idSkill: parseInt(idSkill, 10),
          nivel: nivel !== null ? parseInt(nivel, 10) : null
        };
      });

      await ProyectoSkill.bulkCreate(nuevosRegistros);
    }

    const proyectoActualizado = await Proyecto.findByPk(projectID, {
      include: [{
        model: Skill,
        attributes: ['idSkill', 'nombre', 'nivel'],
        include: [{
          model: CategoriaSkill,
          as: 'Categorias',
          attributes: ['idCategoriaSkill', 'nombre'],
          through: { attributes: [] }
        }],
        through: { attributes: ['nivel'] }
      }]
    });

    res.status(200).json({ mensaje: 'Skills asignadas exitosamente.', proyecto: proyectoActualizado });
  } catch (error) {
    logger.error(`Error al asignar skills: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const asignarServiciosAProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const projectID = parseInt(idProyecto, 10);
    const { servicios } = req.body;
    logger.info(`Asignar Servicios: Proyecto ID ${projectID}`);

    if (!Array.isArray(servicios)) {
      return next(Boom.badRequest('Se espera un array de IDs en servicios.'));
    }

    const proyecto = await Proyecto.findByPk(projectID);
    if (!proyecto) {
      return next(Boom.notFound('Proyecto no encontrado.'));
    }

    await ProyectoServicio.destroy({ where: { idProyecto: projectID } });

    if (servicios.length > 0) {
      const nuevosRegistros = servicios.map(idServicio => ({
        idProyecto: projectID,
        idServicio: parseInt(idServicio, 10),
      }));

      await ProyectoServicio.bulkCreate(nuevosRegistros);
    }

    const proyectoActualizado = await Proyecto.findByPk(projectID, {
      include: [{
        model: Servicio,
        attributes: ['idServicio', 'nombre', 'descripcion', 'precio'],
        through: { attributes: [] },
      }],
    });

    res.status(200).json({ mensaje: 'Servicios asignados exitosamente.', proyecto: proyectoActualizado });
  } catch (error) {
    logger.error(`Error al asignar servicios: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};


export const listarProyectosPublicos = async (req, res, next) => {
  try {
    const proyectos = await Proyecto.findAll({
      where: {
        imagenPastilla: { [Op.ne]: null },
      },
      // Ahora devolvemos titulo, imagenPastilla y descripcion
      attributes: ['idProyecto', 'titulo', 'imagenPastilla', 'descripcion'],
      order: [['fechaInicio', 'DESC']],
    });
    res.status(200).json(proyectos);
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};

export const eliminarPortadaProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const proyecto = await Proyecto.findByPk(idProyecto);
    if (!proyecto) return next(Boom.notFound('Proyecto no encontrado.'));

    if (proyecto.publicIdPastilla) {
      await cloudinary.uploader.destroy(proyecto.publicIdPastilla);
    }

    proyecto.imagenPastilla = null;
    proyecto.publicIdPastilla = null;
    await proyecto.save();

    res.json({ mensaje: 'Portada de proyecto eliminada con éxito.' });
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};

