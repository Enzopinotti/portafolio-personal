// middleware/rolMiddleware.js
import Boom from '@hapi/boom';
import Rol from '../models/Rol.js';

export const verificarRolAdmin = async (req, res, next) => {
  try {
    // Asumiendo que req.usuario.idRol ya está en el token decodificado
    // y que la tabla Rol tiene algo como { idRol, nombre: 'Admin' }
    const { idRol } = req.usuario;
    const rol = await Rol.findByPk(idRol);
    if (!rol) {
      return next(Boom.forbidden('No tienes autorización para acceder a este recurso (rol no encontrado).'));
    }
    // Compara con el nombre del rol que quieras restringir
    if (rol.nombre.toLowerCase() !== 'admin') {
      return next(Boom.forbidden('No tienes permisos de administrador.'));
    }
    // Continúa si es admin
    next();
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};
