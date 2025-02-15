// controllers/testimonioController.js
import Testimonio from '../models/Testimonio.js';
import Usuario from '../models/Usuario.js';
import logger from '../config/logger.js';
import { registrarEvento } from '../utils/auditLogger.js';
import Boom from '@hapi/boom';

/**
 * Crear un nuevo testimonio.
 * Puede venir de un usuario registrado (id_usuario != null) o visitante (null).
 */
export const crearTestimonio = async (req, res, next) => {
  try {
    const { nombre, mensaje } = req.body;
    const idUsuario = req.usuario ? req.usuario.idUsuario : null;

    logger.info(`Crear Testimonio: Iniciando creación para usuario: ${idUsuario || 'Visitante'}`);

    const nuevoTestimonio = await Testimonio.create({
      nombre,
      mensaje,
      idUsuario,
    });

    // Registrar evento de auditoría (opcional)
    await registrarEvento({
      userId: idUsuario,
      action: 'CREATE_TESTIMONIO',
      target: 'testimonio',
      details: { nombre, mensaje },
      req,
    });
    logger.info(`Testimonio creado exitosamente (ID: ${nuevoTestimonio.id_testimonio}).`);

    res.status(201).json({ 
      mensaje: 'Testimonio creado exitosamente.', 
      testimonio: nuevoTestimonio 
    });
  } catch (error) {
    logger.error(`Error al crear testimonio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Listar todos los testimonios, incluyendo datos básicos del usuario.
 */
export const listarTestimonios = async (req, res, next) => {
  try {
    logger.info('Listar Testimonios: Obteniendo todos los testimonios.');
    const testimonios = await Testimonio.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
      order: [['fecha', 'DESC']],
    });
    logger.info(`Testimonios obtenidos: ${testimonios.length}`);
    res.status(200).json(testimonios);
  } catch (error) {
    logger.error(`Error al listar testimonios: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Ver un testimonio por su ID.
 */
export const verTestimonio = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Testimonio: Buscando testimonio con ID ${id}`);
    const testimonio = await Testimonio.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
    });
    if (!testimonio) {
      logger.info(`Testimonio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Testimonio no encontrado.'));
    }
    logger.info(`Testimonio con ID ${id} encontrado.`);
    res.status(200).json(testimonio);
  } catch (error) {
    logger.error(`Error al ver testimonio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Editar un testimonio.
 */
export const editarTestimonio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, mensaje } = req.body;
    logger.info(`Editar Testimonio: Intentando editar testimonio con ID ${id}`);
    const testimonio = await Testimonio.findByPk(id);
    if (!testimonio) {
      logger.info(`Editar Testimonio: Testimonio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Testimonio no encontrado.'));
    }
    if (nombre) testimonio.nombre = nombre;
    if (mensaje) testimonio.mensaje = mensaje;
    await testimonio.save();
    logger.info(`Editar Testimonio: Testimonio con ID ${id} actualizado.`);
    res.status(200).json({
      mensaje: 'Testimonio actualizado exitosamente.',
      testimonio,
    });
  } catch (error) {
    logger.error(`Error al editar testimonio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Eliminar un testimonio.
 */
export const eliminarTestimonio = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Testimonio: Buscando testimonio con ID ${id}`);
    const testimonio = await Testimonio.findByPk(id);
    if (!testimonio) {
      logger.info(`Eliminar Testimonio: Testimonio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Testimonio no encontrado.'));
    }
    await testimonio.destroy();
    logger.info(`Eliminar Testimonio: Testimonio con ID ${id} eliminado.`);
    res.status(200).json({ mensaje: 'Testimonio eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error al eliminar testimonio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Listar todos los testimonios de un usuario específico.
 */
export const listarTestimoniosDeUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    logger.info(`Listar Testimonios de Usuario: Obteniendo testimonios para usuario ID ${idUsuario}`);
    const testimonios = await Testimonio.findAll({
      where: { idUsuario },
      order: [['fecha', 'DESC']],
    });
    logger.info(`Testimonios obtenidos para usuario ${idUsuario}: ${testimonios.length}`);
    res.status(200).json(testimonios);
  } catch (error) {
    logger.error(`Error al listar testimonios de usuario: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};