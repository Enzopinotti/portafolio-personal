import Servicio from '../models/Servicio.js';
import Imagen from '../models/Imagen.js';
import Proyecto from '../models/Proyecto.js';

/**
 * Crear servicio
 */
export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio, idImagen } = req.body;

    const nuevoServicio = await Servicio.create({
      nombre,
      descripcion,
      precio,
      idImagen: idImagen || null,
    });

    res.status(201).json({
      mensaje: 'Servicio creado exitosamente.',
      servicio: nuevoServicio,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar servicios
 */
export const listarServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({
      include: [
        {
          model: Imagen,
          attributes: ['idImagen', 'ruta', 'descripcion'],
        },
        // Podrías incluir también la relación con Proyectos, si deseas
        // {
        //   model: Proyecto,
        //   through: { attributes: [] },
        // },
      ],
    });

    res.status(200).json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Ver servicio por ID
 */
export const verServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicio.findByPk(id, {
      include: [
        { model: Imagen, attributes: ['idImagen', 'ruta', 'descripcion'] },
        // Si quieres, también proyectos asociados:
        // {
        //   model: Proyecto,
        //   through: { attributes: [] },
        // },
      ],
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Editar servicio
 */
export const editarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, idImagen } = req.body;

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    // Actualizar campos
    if (nombre) servicio.nombre = nombre;
    if (descripcion) servicio.descripcion = descripcion;
    if (precio || precio === 0) servicio.precio = precio;
    if (idImagen !== undefined) servicio.idImagen = idImagen;

    await servicio.save();

    res.status(200).json({
      mensaje: 'Servicio actualizado exitosamente.',
      servicio,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar servicio
 */
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    await servicio.destroy();
    res.status(200).json({ mensaje: 'Servicio eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
