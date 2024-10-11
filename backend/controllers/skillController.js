// controllers/skillController.js

import Skill from '../models/Skill.js';
import CategoriaSkill from '../models/CategoriaSkill.js';
import Imagen from '../models/Imagen.js';

export const crearSkill = async (req, res) => {
  try {
    const { nombre, nivel, idCategoriaSkill, idImagen } = req.body;

    // Verificar si la skill ya existe
    const skillExistente = await Skill.findOne({ where: { nombre } });
    if (skillExistente) {
      return res.status(400).json({ error: 'La skill ya existe.' });
    }

    const nuevaSkill = await Skill.create({
      nombre,
      nivel,
      idCategoriaSkill,
      idImagen,
    });

    res.status(201).json({ mensaje: 'Skill creada exitosamente.', skill: nuevaSkill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, nivel, idCategoriaSkill, idImagen } = req.body;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill no encontrada.' });
    }

    // Actualizar los campos
    if (nombre) skill.nombre = nombre;
    if (nivel) skill.nivel = nivel;
    if (idCategoriaSkill) skill.idCategoriaSkill = idCategoriaSkill;
    if (idImagen) skill.idImagen = idImagen;

    await skill.save();

    res.status(200).json({ mensaje: 'Skill actualizada exitosamente.', skill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill no encontrada.' });
    }

    await skill.destroy();

    res.status(200).json({ mensaje: 'Skill eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarSkills = async (req, res) => {
  try {
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

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verSkill = async (req, res) => {
  try {
    const { id } = req.params;

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
      return res.status(404).json({ error: 'Skill no encontrada.' });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
