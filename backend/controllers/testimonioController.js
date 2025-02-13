import Testimonio from '../models/Testimonio.js';
import Usuario from '../models/Usuario.js';

/**
 * Crear un nuevo testimonio
 * - Puede venir de un usuario registrado (id_usuario != null) o visitante (null).
 */
export const crearTestimonio = async (req, res) => {
  try {
    const { nombre, mensaje } = req.body;

    // idUsuario vendría del token JWT si el usuario está autenticado,
    // o null si es un visitante. Ej: req.usuario?.idUsuario || null
    const idUsuario = req.usuario ? req.usuario.idUsuario : null;

    const nuevoTestimonio = await Testimonio.create({
      nombre,
      mensaje,
      idUsuario,
      // fecha se setea por default si lo definiste en el modelo
    });

    res.status(201).json({ 
      mensaje: 'Testimonio creado exitosamente.', 
      testimonio: nuevoTestimonio 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar todos los testimonios
 */
export const listarTestimonios = async (req, res) => {
  try {
    // Incluimos la info básica del usuario si existe
    const testimonios = await Testimonio.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    res.status(200).json(testimonios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Ver un testimonio por su ID
 */
export const verTestimonio = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonio = await Testimonio.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre', 'email'],
        },
      ],
    });

    if (!testimonio) {
      return res.status(404).json({ error: 'Testimonio no encontrado.' });
    }

    res.status(200).json(testimonio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Editar un testimonio (opcionalmente solo si el dueño es el usuario actual, o si es admin)
 */
export const editarTestimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, mensaje } = req.body;

    const testimonio = await Testimonio.findByPk(id);

    if (!testimonio) {
      return res.status(404).json({ error: 'Testimonio no encontrado.' });
    }

    // Verificar permisos (si quieres que solo el usuario dueño o admin puedan editar)
    // Ejemplo: if (testimonio.idUsuario !== req.usuario.idUsuario && req.usuario.idRol !== ADMIN_ROLE_ID) {...}

    // Actualizar campos
    if (nombre) testimonio.nombre = nombre;
    if (mensaje) testimonio.mensaje = mensaje;

    await testimonio.save();

    res.status(200).json({
      mensaje: 'Testimonio actualizado exitosamente.',
      testimonio,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar un testimonio
 */
export const eliminarTestimonio = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonio = await Testimonio.findByPk(id);

    if (!testimonio) {
      return res.status(404).json({ error: 'Testimonio no encontrado.' });
    }

    // Verificar permisos
    // Ejemplo: if (testimonio.idUsuario !== req.usuario.idUsuario && req.usuario.idRol !== ADMIN_ROLE_ID) {...}

    await testimonio.destroy();

    res.status(200).json({ mensaje: 'Testimonio eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const listarTestimoniosDeUsuario = async (req, res) => {
    try {
      const { idUsuario } = req.params;
  
      const testimonios = await Testimonio.findAll({
        where: { idUsuario },
        order: [['fecha', 'DESC']],
      });
  
      res.status(200).json(testimonios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  