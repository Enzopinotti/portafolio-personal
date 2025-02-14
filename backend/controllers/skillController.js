// controllers/skillController.js
import Skill from '../models/Skill.js';
import CategoriaSkill from '../models/CategoriaSkill.js';
import Imagen from '../models/Imagen.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

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
    logger.info('Listar Skills: Obteniendo todas las skills.');
    const skills = await Skill.findAll({
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
    logger.info(`Listar Skills: Se obtuvieron ${skills.length} skills.`);
    res.status(200).json(skills);
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
