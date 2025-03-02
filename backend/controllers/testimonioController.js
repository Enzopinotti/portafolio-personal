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
    const idUsuario = req.usuario.idUsuario; // al venir de verificarToken

    // Por defecto, se crea con publicado: false
    const nuevoTestimonio = await Testimonio.create({
      nombre,
      mensaje,
      idUsuario,
      publicado: false,
    });

    // ...
    res.status(201).json({
      mensaje: 'Testimonio creado. Esperando revisión del administrador.',
      testimonio: nuevoTestimonio
    });
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};


/**
 * Listar todos los testimonios, incluyendo datos básicos del usuario.
 */
export const listarTestimonios = async (req, res, next) => {
  try {
    logger.info('Listar Testimonios: Obteniendo todos los testimonios paginados.');

    // Tomar page y limit desde query params ?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Puedes agregar un order y includes
    const options = {
      page,             // página actual
      paginate: limit,  // cuántos por página
      order: [['fecha', 'DESC']],
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
    };

    // Usamos Testimonio.paginate
    const { docs, pages, total } = await Testimonio.paginate(options);

    logger.info(`Se obtuvieron ${docs.length} testimonios en la página ${page}. Total: ${total}.`);

    // Retornamos un objeto con docs y la info de paginación
    return res.status(200).json({
      testimonios: docs,
      total,
      pages,
      currentPage: page,
      limit,
    });
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

    const testimonio = await Testimonio.findByPk(id);
    if (!testimonio) {
      return next(Boom.notFound('Testimonio no encontrado.'));
    }

    // Ver si es admin
    let esAdmin = false;
    if (req.usuario.idRol === 1) { // o verif. Rol 'admin'
      esAdmin = true;
    }

    // Si NO es admin y no es el dueño, error
    if (!esAdmin && testimonio.idUsuario !== req.usuario.idUsuario) {
      return next(Boom.forbidden('No puedes editar este testimonio.'));
    }

    // Hacer la actualización
    if (nombre) testimonio.nombre = nombre;
    if (mensaje) testimonio.mensaje = mensaje;

    await testimonio.save();

    res.status(200).json({
      mensaje: 'Testimonio actualizado.',
      testimonio,
    });
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};


/**
 * Eliminar un testimonio.
 */
export const eliminarTestimonio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonio = await Testimonio.findByPk(id);
    if (!testimonio) {
      return next(Boom.notFound('Testimonio no encontrado.'));
    }

    let esAdmin = false;
    if (req.usuario.idRol === 1) {
      esAdmin = true;
    }

    if (!esAdmin && testimonio.idUsuario !== req.usuario.idUsuario) {
      return next(Boom.forbidden('No puedes eliminar este testimonio.'));
    }

    await testimonio.destroy();
    res.status(200).json({ mensaje: 'Testimonio eliminado exitosamente.' });
  } catch (error) {
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

export const publicarTestimonio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { publicar = true } = req.body; // true o false

    const testimonio = await Testimonio.findByPk(id);
    if (!testimonio) {
      return next(Boom.notFound('Testimonio no encontrado.'));
    }

    // Aquí no chequeamos el rol, porque ya lo hicimos en el middleware.
    testimonio.publicado = publicar;
    await testimonio.save();

    const estado = publicar ? 'publicado' : 'oculto';
    res.status(200).json({
      mensaje: `Testimonio ${estado} exitosamente.`,
      testimonio,
    });
  } catch (error) {
    return next(Boom.internal(error.message));
  }
};
