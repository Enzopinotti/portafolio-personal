// controllers/categoriaSkillController.js
import CategoriaSkill from '../models/CategoriaSkill.js';
import logger from '../config/logger.js'; // o usa console.log si no tienes logger
import Boom from '@hapi/boom';

/**
 * Listar todas las categorías de skills (con paginación).
 * GET /api/categorias-skills?page=1&limit=10
 */
export const listarCategoriaSkills = async (req, res, next) => {
  try {
    logger.info('Listar CategoríaSkills: Obteniendo categorías paginadas.');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      paginate: limit,
      // ordena por nombre asc, por ejemplo
      order: [['nombre', 'ASC']],
    };

    // Usamos la paginación
    const { docs, pages, total } = await CategoriaSkill.paginate(options);

    logger.info(
      `Listar CategoríaSkills: Se obtuvieron ${docs.length} registros en la página ${page}. Total: ${total}.`
    );

    return res.status(200).json({
      categorias: docs,
      total,
      pages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    logger.error(`Error al listar categorías de skills: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Ver detalle de una categoría skill por ID.
 * GET /api/categorias-skills/:id
 */
export const verCategoriaSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver CategoríaSkill: Buscando la categoría con ID ${id}`);

    const categoria = await CategoriaSkill.findByPk(id);
    if (!categoria) {
      logger.info(`Categoría con ID ${id} no encontrada.`);
      return next(Boom.notFound('Categoría de skill no encontrada.'));
    }

    logger.info(`Ver CategoríaSkill: Se encontró la categoría con ID ${id}`);
    return res.status(200).json(categoria);
  } catch (error) {
    logger.error(`Error al ver la categoría: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Crear una nueva categoría skill.
 * POST /api/categorias-skills
 */
export const crearCategoriaSkill = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    logger.info(`Crear CategoríaSkill: Intento de creación para "${nombre}"`);

    // Comprobar si ya existe
    const categoriaExistente = await CategoriaSkill.findOne({
      where: { nombre },
    });
    if (categoriaExistente) {
      logger.info(`Crear CategoríaSkill: la categoría "${nombre}" ya existe.`);
      return next(Boom.badRequest('La categoría de skill ya existe.'));
    }

    const nuevaCategoria = await CategoriaSkill.create({
      nombre,
    });

    logger.info(`CategoríaSkill creada exitosamente: ID ${nuevaCategoria.idCategoriaSkill}`);
    return res.status(201).json({
      mensaje: 'Categoría de skill creada exitosamente.',
      categoria: nuevaCategoria,
    });
  } catch (error) {
    logger.error(`Error al crear la categoría skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Editar una categoría skill existente.
 * PUT /api/categorias-skills/:id
 */
export const editarCategoriaSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    logger.info(`Editar CategoríaSkill: Editando la categoría con ID ${id}`);

    const categoria = await CategoriaSkill.findByPk(id);
    if (!categoria) {
      logger.info(`Categoría con ID ${id} no encontrada para edición.`);
      return next(Boom.notFound('Categoría de skill no encontrada.'));
    }

    if (nombre) categoria.nombre = nombre;

    await categoria.save();

    logger.info(`CategoríaSkill con ID ${id} actualizada exitosamente.`);
    return res.status(200).json({
      mensaje: 'Categoría de skill actualizada exitosamente.',
      categoria,
    });
  } catch (error) {
    logger.error(`Error al editar la categoría skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

/**
 * Eliminar una categoría skill.
 * DELETE /api/categorias-skills/:id
 */
export const eliminarCategoriaSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar CategoríaSkill: Buscando la categoría con ID ${id}`);

    const categoria = await CategoriaSkill.findByPk(id);
    if (!categoria) {
      logger.info(`Categoría con ID ${id} no encontrada para eliminar.`);
      return next(Boom.notFound('Categoría de skill no encontrada.'));
    }

    await categoria.destroy();
    logger.info(`CategoríaSkill con ID ${id} eliminada exitosamente.`);

    return res.status(200).json({ mensaje: 'Categoría de skill eliminada exitosamente.' });
  } catch (error) {
    logger.error(`Error al eliminar la categoría skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
