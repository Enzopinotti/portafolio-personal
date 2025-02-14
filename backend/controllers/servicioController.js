// controllers/servicioController.js
import Servicio from '../models/Servicio.js';
import Imagen from '../models/Imagen.js';
import Proyecto from '../models/Proyecto.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

export const crearServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, idImagen } = req.body;
    logger.info(`Crear Servicio: Creando servicio "${nombre}"`);
    const nuevoServicio = await Servicio.create({
      nombre,
      descripcion,
      precio,
      idImagen: idImagen || null,
    });
    logger.info(`Servicio creado exitosamente: "${nombre}" (ID: ${nuevoServicio.id_servicio})`);
    res.status(201).json({
      mensaje: 'Servicio creado exitosamente.',
      servicio: nuevoServicio,
    });
  } catch (error) {
    logger.error(`Error al crear servicio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const listarServicios = async (req, res, next) => {
  try {
    logger.info('Listar Servicios: Obteniendo todos los servicios.');
    const servicios = await Servicio.findAll({
      include: [
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
      ],
    });
    logger.info(`Servicios obtenidos: ${servicios.length}`);
    res.status(200).json(servicios);
  } catch (error) {
    logger.error(`Error al listar servicios: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Servicio: Buscando servicio con ID ${id}`);
    const servicio = await Servicio.findByPk(id, {
      include: [
        { model: Imagen, attributes: ['idImagen', 'ruta', 'descripcion'] },
      ],
    });
    if (!servicio) {
      logger.info(`Ver Servicio: Servicio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Servicio no encontrado.'));
    }
    logger.info(`Ver Servicio: Servicio con ID ${id} encontrado.`);
    res.status(200).json(servicio);
  } catch (error) {
    logger.error(`Error al ver servicio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, idImagen } = req.body;
    logger.info(`Editar Servicio: Editando servicio con ID ${id}`);
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      logger.info(`Editar Servicio: Servicio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Servicio no encontrado.'));
    }
    if (nombre) servicio.nombre = nombre;
    if (descripcion) servicio.descripcion = descripcion;
    if (precio || precio === 0) servicio.precio = precio;
    if (idImagen !== undefined) servicio.idImagen = idImagen;
    await servicio.save();
    logger.info(`Editar Servicio: Servicio con ID ${id} actualizado.`);
    res.status(200).json({
      mensaje: 'Servicio actualizado exitosamente.',
      servicio,
    });
  } catch (error) {
    logger.error(`Error al editar servicio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Servicio: Buscando servicio con ID ${id}`);
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      logger.info(`Eliminar Servicio: Servicio con ID ${id} no encontrado.`);
      return next(Boom.notFound('Servicio no encontrado.'));
    }
    await servicio.destroy();
    logger.info(`Eliminar Servicio: Servicio con ID ${id} eliminado.`);
    res.status(200).json({ mensaje: 'Servicio eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error al eliminar servicio: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
