// controllers/adminUsuarioController.js
import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import logger from '../config/logger.js';  // o usa console.error/console.log
import Boom from '@hapi/boom';

/**
 * Listar usuarios con paginación.
 * GET /api/admin/usuarios?page=1&limit=10
 */
export const listarUsuarios = async (req, res, next) => {
  try {
    logger.info('Admin - Listar Usuarios: obteniendo usuarios paginados.');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Opciones para la paginación
    const options = {
      page,
      paginate: limit,
      // Por ejemplo, incluimos el rol y ordenamos por id
      order: [['idUsuario', 'ASC']],
      include: [{ model: Rol, attributes: ['idRol', 'nombre'] }],
    };

    const { docs, pages, total } = await Usuario.paginate(options);

    logger.info(
      `Admin - Se obtuvieron ${docs.length} usuarios en la página ${page}. Total de usuarios: ${total}`
    );

    res.status(200).json({
      usuarios: docs,
      total,
      pages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    logger.error(`Admin - Error al listar usuarios: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Ver un usuario por ID (para admin).
 * GET /api/admin/usuarios/:id
 */
export const verUsuarioAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Admin - Ver Usuario: buscando usuario con ID ${id}`);

    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Rol, attributes: ['idRol', 'nombre'] }],
    });
    if (!usuario) {
      logger.info(`Admin - Usuario con ID ${id} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    logger.info(`Admin - Usuario con ID ${id} encontrado.`);
    res.status(200).json(usuario);
  } catch (error) {
    logger.error(`Admin - Error al ver usuario: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Editar un usuario (para admin).
 * PUT /api/admin/usuarios/:id
 */
export const editarUsuarioAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, idRol } = req.body;

    logger.info(`Admin - Editar Usuario: intentando editar usuario con ID ${id}`);

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      logger.info(`Admin - Usuario con ID ${id} no encontrado para editar.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;
    if (idRol) {
      // También podrías validar que el rol exista
      usuario.idRol = idRol;
    }

    await usuario.save();

    logger.info(`Admin - Usuario con ID ${id} actualizado exitosamente.`);
    res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente.',
      usuario,
    });
  } catch (error) {
    logger.error(`Admin - Error al editar usuario: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Eliminar un usuario (para admin).
 * DELETE /api/admin/usuarios/:id
 */
export const eliminarUsuarioAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Admin - Eliminar Usuario: buscando usuario con ID ${id}`);

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      logger.info(`Admin - Usuario con ID ${id} no encontrado para eliminar.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    await usuario.destroy();
    logger.info(`Admin - Usuario con ID ${id} eliminado exitosamente.`);

    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Admin - Error al eliminar usuario: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
