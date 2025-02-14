// controllers/rolController.js
import Rol from '../models/Rol.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

export const crearRol = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    logger.info(`Crear Rol: Intento de creación para rol "${nombre}"`);
    const existe = await Rol.findOne({ where: { nombre } });
    if (existe) {
      logger.info(`Crear Rol: El rol "${nombre}" ya existe.`);
      return next(Boom.badRequest('Ya existe un rol con ese nombre.'));
    }
    const nuevoRol = await Rol.create({ nombre });
    logger.info(`Rol creado exitosamente: "${nombre}" (ID: ${nuevoRol.idRol})`);
    res.status(201).json({ mensaje: 'Rol creado exitosamente.', rol: nuevoRol });
  } catch (error) {
    logger.error(`Error al crear rol: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const listarRoles = async (req, res, next) => {
  try {
    logger.info('Listar Roles: Obteniendo todos los roles.');
    const roles = await Rol.findAll();
    logger.info(`Listar Roles: Se obtuvieron ${roles.length} roles.`);
    res.status(200).json(roles);
  } catch (error) {
    logger.error(`Error al listar roles: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Rol: Buscando rol con ID ${id}`);
    const rol = await Rol.findByPk(id);
    if (!rol) {
      logger.info(`Ver Rol: Rol con ID ${id} no encontrado.`);
      return next(Boom.notFound('Rol no encontrado.'));
    }
    logger.info(`Ver Rol: Rol con ID ${id} encontrado.`);
    res.status(200).json(rol);
  } catch (error) {
    logger.error(`Error al ver rol: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    logger.info(`Editar Rol: Editando rol con ID ${id}`);
    const rol = await Rol.findByPk(id);
    if (!rol) {
      logger.info(`Editar Rol: Rol con ID ${id} no encontrado.`);
      return next(Boom.notFound('Rol no encontrado.'));
    }
    if (nombre) rol.nombre = nombre;
    await rol.save();
    logger.info(`Editar Rol: Rol con ID ${id} actualizado a "${nombre}"`);
    res.status(200).json({ mensaje: 'Rol actualizado exitosamente.', rol });
  } catch (error) {
    logger.error(`Error al editar rol: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Rol: Buscando rol con ID ${id}`);
    const rol = await Rol.findByPk(id);
    if (!rol) {
      logger.info(`Eliminar Rol: Rol con ID ${id} no encontrado.`);
      return next(Boom.notFound('Rol no encontrado.'));
    }
    await rol.destroy();
    logger.info(`Eliminar Rol: Rol con ID ${id} eliminado.`);
    res.status(200).json({ mensaje: 'Rol eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error al eliminar rol: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
