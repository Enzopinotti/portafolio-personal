// controllers/skillController.js
import Skill from '../models/Skill.js';
import CategoriaSkill from '../models/CategoriaSkill.js';
import Imagen from '../models/Imagen.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';
import SkillCategoria from '../models/SkillCategoria.js';

export const crearSkill = async (req, res, next) => {
  try {
    const { nombre, nivel, idCategoriaSkill, idImagen } = req.body;
    logger.info(`Crear Skill: Intento de creación de skill "${nombre}"`);
    const skillExistente = await Skill.findOne({ where: { nombre } });
    if (skillExistente) {
      logger.info(`Crear Skill: La skill "${nombre}" ya existe.`);
      return next(Boom.badRequest('La skill ya existe.'));
    }
    const nuevaSkill = await Skill.create({
      nombre,
      nivel,
      idCategoriaSkill,
      idImagen,
    });
    logger.info(`Skill creada exitosamente: "${nombre}" (ID: ${nuevaSkill.id_skill})`);
    res.status(201).json({ mensaje: 'Skill creada exitosamente.', skill: nuevaSkill });
  } catch (error) {
    logger.error(`Error al crear skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, nivel, idCategoriaSkill, idImagen } = req.body;
    logger.info(`Editar Skill: Editando skill con ID ${id}`);
    const skill = await Skill.findByPk(id);
    if (!skill) {
      logger.info(`Editar Skill: Skill con ID ${id} no encontrada.`);
      return next(Boom.notFound('Skill no encontrada.'));
    }
    if (nombre) skill.nombre = nombre;
    if (nivel) skill.nivel = nivel;
    if (idCategoriaSkill) skill.idCategoriaSkill = idCategoriaSkill;
    if (idImagen) skill.idImagen = idImagen;
    await skill.save();
    logger.info(`Editar Skill: Skill con ID ${id} actualizada.`);
    res.status(200).json({ mensaje: 'Skill actualizada exitosamente.', skill });
  } catch (error) {
    logger.error(`Error al editar skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Skill: Buscando skill con ID ${id}`);
    const skill = await Skill.findByPk(id);
    if (!skill) {
      logger.info(`Eliminar Skill: Skill con ID ${id} no encontrada.`);
      return next(Boom.notFound('Skill no encontrada.'));
    }
    await skill.destroy();
    logger.info(`Eliminar Skill: Skill con ID ${id} eliminada.`);
    res.status(200).json({ mensaje: 'Skill eliminada exitosamente.' });
  } catch (error) {
    logger.error(`Error al eliminar skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};


export const listarSkills = async (req, res, next) => {
  try {
    logger.info('Listar Skills: Obteniendo todas las skills paginadas.');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const options = {
      page,
      paginate: limit,
      include: [
        {
          model: CategoriaSkill,
          as: 'Categorias', // Usar el alias definido
          attributes: ['idCategoriaSkill', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
      ],
    };

    const { docs, pages, total } = await Skill.paginate(options);

    logger.info(
      `Listar Skills: Se obtuvieron ${docs.length} skills en la página ${page}. Total: ${total}.`
    );

    res.status(200).json({
      skills: docs,
      total,
      pages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    logger.error(`Error al listar skills: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Skill: Buscando skill con ID ${id}`);
    const skill = await Skill.findByPk(id, {
      include: [
        {
          model: CategoriaSkill,
          attributes: ['idCategoriaSkill', 'nombre'],
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
      ],
    });
    if (!skill) {
      logger.info(`Ver Skill: Skill con ID ${id} no encontrada.`);
      return next(Boom.notFound('Skill no encontrada.'));
    }
    logger.info(`Ver Skill: Skill con ID ${id} encontrada.`);
    res.status(200).json(skill);
  } catch (error) {
    logger.error(`Error al ver skill: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const asignarCategoriaASkill = async (req, res, next) => {
  try {
    const { idSkill } = req.params;
    const { categories } = req.body; // Se espera un array de IDs
    logger.info(`Asignar Categorías: Asignando categorías a la skill con ID ${idSkill}`);

    if (!Array.isArray(categories)) {
      return next(Boom.badRequest('Se espera un array de IDs en categories.'));
    }

    // Convertir los IDs a números
    const catIds = categories.map(id => parseInt(id, 10));

    const skill = await Skill.findByPk(idSkill);
    if (!skill) {
      logger.info(`Asignar Categorías: Skill con ID ${idSkill} no encontrada.`);
      return next(Boom.notFound('Skill no encontrada.'));
    }

    console.log('Skill obtenido:', skill.toJSON());
    console.log('Categorías a setear:', catIds);

    // Paso 1: Eliminar todas las asociaciones existentes para esta skill
    await SkillCategoria.destroy({ where: { id_skill: idSkill } });

    // Paso 2: Insertar las nuevas asociaciones manualmente
    const nuevosRegistros = catIds.map(catId => ({
      id_skill: idSkill,
      id_categoria_skill: catId,
    }));

    await SkillCategoria.bulkCreate(nuevosRegistros);

    // Paso 3: Recargar la skill con las asociaciones actualizadas
    const skillActualizada = await Skill.findByPk(idSkill, {
      include: [{
        model: CategoriaSkill,
        as: 'Categorias',
        attributes: ['idCategoriaSkill', 'nombre'],
        through: { attributes: [] },
      }],
    });

    logger.info(`Asignar Categorías: Categorías asignadas exitosamente a la skill con ID ${idSkill}`);
    res.status(200).json({ mensaje: 'Categorías asignadas exitosamente.', skill: skillActualizada });
  } catch (error) {
    logger.error(`Error al asignar categorías a la skill: ${error.message}`);
    return next(Boom.internal(error.message || 'Error al asignar categorías'));
  }
};