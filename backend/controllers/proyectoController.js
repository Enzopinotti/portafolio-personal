// controllers/proyectoController.js

import Proyecto from '../models/Proyecto.js';
import Usuario from '../models/Usuario.js';
import Skill from '../models/Skill.js';
import Imagen from '../models/Imagen.js';

export const crearProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills } = req.body;

    // Crear el proyecto
    const nuevoProyecto = await Proyecto.create({
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      enlace,
    });

    // Asociar el proyecto al usuario que lo creó
    await nuevoProyecto.addUsuario(req.usuario.idUsuario);

    // Asociar skills al proyecto si se proporcionan
    if (skills && skills.length > 0) {
      await nuevoProyecto.addSkills(skills);
    }

    res.status(201).json({ mensaje: 'Proyecto creado exitosamente.', proyecto: nuevoProyecto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaInicio, fechaFin, enlace, skills } = req.body;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    // Verificar si el usuario tiene permiso para editar el proyecto
    const usuarios = await proyecto.getUsuarios({ where: { idUsuario: req.usuario.idUsuario } });
    if (usuarios.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para editar este proyecto.' });
    }

    // Actualizar los campos
    if (titulo) proyecto.titulo = titulo;
    if (descripcion) proyecto.descripcion = descripcion;
    if (fechaInicio) proyecto.fechaInicio = fechaInicio;
    if (fechaFin) proyecto.fechaFin = fechaFin;
    if (enlace) proyecto.enlace = enlace;

    await proyecto.save();

    // Actualizar skills asociadas si se proporcionan
    if (skills && skills.length > 0) {
      await proyecto.setSkills(skills);
    }

    res.status(200).json({ mensaje: 'Proyecto actualizado exitosamente.', proyecto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    // Verificar si el usuario tiene permiso para eliminar el proyecto
    const usuarios = await proyecto.getUsuarios({ where: { idUsuario: req.usuario.idUsuario } });
    if (usuarios.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este proyecto.' });
    }

    await proyecto.destroy();

    res.status(200).json({ mensaje: 'Proyecto eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll({
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
      ],
    });

    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id, {
      include: [
        {
          model: Skill,
          attributes: ['idSkill', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
          through: { attributes: [] },
        },
      ],
    });

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
