import Rol from '../models/Rol.js';

/**
 * Crear un nuevo rol
 */
export const crearRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Verificar si ya existe un rol con el mismo nombre
    const existe = await Rol.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ error: 'Ya existe un rol con ese nombre.' });
    }

    const nuevoRol = await Rol.create({ nombre });
    res.status(201).json({ mensaje: 'Rol creado exitosamente.', rol: nuevoRol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar roles
 */
export const listarRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Ver rol por ID
 */
export const verRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado.' });
    }

    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Editar rol
 */
export const editarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado.' });
    }

    if (nombre) rol.nombre = nombre;
    await rol.save();

    res.status(200).json({ mensaje: 'Rol actualizado exitosamente.', rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar rol
 */
export const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado.' });
    }

    // Si el rol está asociado a usuarios, puede que debas verificarlo antes de borrar
    await rol.destroy();
    res.status(200).json({ mensaje: 'Rol eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
