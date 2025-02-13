import Articulo from '../models/Articulo.js';
import Usuario from '../models/Usuario.js';

/**
 * Crear un nuevo artículo
 */
export const crearArticulo = async (req, res) => {
  try {
    const { titulo, contenido, fechaPublicacion, autor, categoria } = req.body;

    // Si estás manejando la referencia al usuario (id_usuario), lo sacas del token
    const idUsuario = req.usuario ? req.usuario.idUsuario : null;

    const nuevoArticulo = await Articulo.create({
      titulo,
      contenido,
      fechaPublicacion: fechaPublicacion || new Date(),
      autor,       // o podrías no usar 'autor' si usas la FK a usuario
      categoria,
      idUsuario,   // si existe la columna en la tabla
    });

    res.status(201).json({
      mensaje: 'Artículo creado exitosamente.',
      articulo: nuevoArticulo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar artículos
 */
export const listarArticulos = async (req, res) => {
  try {
    const articulos = await Articulo.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
      order: [['fechaPublicacion', 'DESC']],
    });

    res.status(200).json(articulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Ver artículo por ID
 */
export const verArticulo = async (req, res) => {
  try {
    const { id } = req.params;

    const articulo = await Articulo.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
    });

    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado.' });
    }

    res.status(200).json(articulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Editar artículo
 */
export const editarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, fechaPublicacion, autor, categoria } = req.body;

    const articulo = await Articulo.findByPk(id);

    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado.' });
    }

    // Verificar permisos (si deseas solo permitir que el autor o admin lo edite)

    if (titulo) articulo.titulo = titulo;
    if (contenido) articulo.contenido = contenido;
    if (fechaPublicacion) articulo.fechaPublicacion = fechaPublicacion;
    if (autor) articulo.autor = autor;
    if (categoria) articulo.categoria = categoria;

    await articulo.save();

    res.status(200).json({
      mensaje: 'Artículo actualizado exitosamente.',
      articulo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar artículo
 */
export const eliminarArticulo = async (req, res) => {
  try {
    const { id } = req.params;

    const articulo = await Articulo.findByPk(id);

    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado.' });
    }

    // Verificar permisos

    await articulo.destroy();

    res.status(200).json({ mensaje: 'Artículo eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
