// middleware/rolMiddleware.js
import Boom from '@hapi/boom';
import Rol from '../models/Rol.js';

export const verificarRolAdmin = async (req, res, next) => {
  try {
    const { idRol, email } = req.usuario;
    const rol = await Rol.findByPk(idRol);

    if (!rol) {
      console.warn(`[RolMiddleware] Usuario ${email} no tiene rol asignado (idRol: ${idRol})`);
      return next(Boom.forbidden('No tienes autorización para acceder a este recurso (rol no encontrado).'));
    }

    console.log(`[RolMiddleware] Verificando rol para ${email}. Rol encontrado: ${rol.nombre}`);

    // Compara con el nombre del rol que quieras restringir
    if (rol.nombre.toLowerCase() !== 'admin') {
      return next(Boom.forbidden(`No tienes permisos de administrador. Tu rol actual es: ${rol.nombre}`));
    }
    // Continúa si es admin
    next();
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};
