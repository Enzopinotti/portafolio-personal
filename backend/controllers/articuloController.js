// controllers/articuloController.js
import Articulo from '../models/Articulo.js';
import Usuario from '../models/Usuario.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

export const crearArticulo = async (req, res, next) => {
  try {
    const { titulo, contenido, fechaPublicacion, autor, categoria } = req.body;
    const idUsuario = req.usuario ? req.usuario.idUsuario : null;
    logger.info(`Crear Artículo: Usuario ${idUsuario || 'Visitante'} crea el artículo "${titulo}"`);

    const nuevoArticulo = await Articulo.create({
      titulo,
      contenido,
      fechaPublicacion: fechaPublicacion || new Date(),
      autor,
      categoria,
      idUsuario,
    });

    logger.info(`Crear Artículo: Artículo creado exitosamente (ID: ${nuevoArticulo.id_articulo}).`);
    res.status(201).json({
      mensaje: 'Artículo creado exitosamente.',
      articulo: nuevoArticulo,
    });
  } catch (error) {
    logger.error(`Error en crearArticulo: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const listarArticulos = async (req, res, next) => {
  try {
    logger.info('Listar Artículos: Obteniendo todos los artículos.');
    const articulos = await Articulo.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
      order: [['fechaPublicacion', 'DESC']],
    });
    logger.info(`Listar Artículos: Se obtuvieron ${articulos.length} artículos.`);
    res.status(200).json(articulos);
  } catch (error) {
    logger.error(`Error en listarArticulos: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verArticulo = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Artículo: Buscando artículo con ID ${id}`);
    const articulo = await Articulo.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
    });
    if (!articulo) {
      logger.info(`Ver Artículo: Artículo con ID ${id} no encontrado.`);
      return next(Boom.notFound('Artículo no encontrado.'));
    }
    logger.info(`Ver Artículo: Artículo con ID ${id} encontrado.`);
    res.status(200).json(articulo);
  } catch (error) {
    logger.error(`Error en verArticulo: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarArticulo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, fechaPublicacion, autor, categoria } = req.body;
    logger.info(`Editar Artículo: Editando artículo con ID ${id}`);
    const articulo = await Articulo.findByPk(id);
    if (!articulo) {
      logger.info(`Editar Artículo: Artículo con ID ${id} no encontrado.`);
      return next(Boom.notFound('Artículo no encontrado.'));
    }
    if (titulo) articulo.titulo = titulo;
    if (contenido) articulo.contenido = contenido;
    if (fechaPublicacion) articulo.fechaPublicacion = fechaPublicacion;
    if (autor) articulo.autor = autor;
    if (categoria) articulo.categoria = categoria;
    await articulo.save();
    logger.info(`Editar Artículo: Artículo con ID ${id} actualizado.`);
    res.status(200).json({
      mensaje: 'Artículo actualizado exitosamente.',
      articulo,
    });
  } catch (error) {
    logger.error(`Error en editarArticulo: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarArticulo = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Artículo: Buscando artículo con ID ${id}`);
    const articulo = await Articulo.findByPk(id);
    if (!articulo) {
      logger.info(`Eliminar Artículo: Artículo con ID ${id} no encontrado.`);
      return next(Boom.notFound('Artículo no encontrado.'));
    }
    await articulo.destroy();
    logger.info(`Eliminar Artículo: Artículo con ID ${id} eliminado.`);
    res.status(200).json({ mensaje: 'Artículo eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error en eliminarArticulo: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
