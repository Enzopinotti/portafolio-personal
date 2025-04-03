// controllers/imagenController.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';
import Imagen from '../models/Imagen.js';

export const subirImagen = async (req, res, next) => {
  try {
    logger.info('Subir Imagen: Iniciando carga de imagen.');

    // Subimos el archivo a Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'imagenes', // carpeta en tu cuenta Cloudinary
    });

    // Borramos archivo temporal
    fs.unlinkSync(req.file.path);

    // Creamos registro en BD
    const imagenCreada = await Imagen.create({
      ruta: resultado.secure_url,
      publicId: resultado.public_id,     // <<-- Guardamos el public_id
      idProyecto: req.body.idProyecto || null, // o req.query.idProyecto
    });

    logger.info(`Subir Imagen: Imagen subida con public_id "${resultado.public_id}".`);

    res.status(200).json({
      mensaje: 'Imagen subida exitosamente',
      imagen: imagenCreada,
    });
  } catch (error) {
    logger.error(`Error en subirImagen: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};


export const obtenerImagenesPorProyecto = async (req, res, next) => {
  try {
    const { idProyecto } = req.params;
    const imagenes = await Imagen.findAll({ where: { idProyecto } });
    res.json({ imagenes });
  } catch (error) {
    console.error(error);
    return next(Boom.internal('Error al obtener las imágenes del proyecto'));
  }
};

export const eliminarImagen = async (req, res, next) => {
  try {
    const { idImagen } = req.params;
    const imagen = await Imagen.findByPk(idImagen);
    if (!imagen) return next(Boom.notFound('Imagen no encontrada.'));

    // Borrar de Cloudinary
    if (imagen.publicId) {
      await cloudinary.uploader.destroy(imagen.publicId);
    }

    // Borrar registro de BD
    await imagen.destroy();

    res.json({ mensaje: 'Imagen eliminada con éxito.' });
  } catch (error) {
    logger.error(`Error al eliminar imagen: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};