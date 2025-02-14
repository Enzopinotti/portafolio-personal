// controllers/imagenController.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

export const subirImagen = async (req, res, next) => {
  try {
    logger.info('Subir Imagen: Iniciando carga de imagen.');
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'imagenes',
    });
    fs.unlinkSync(req.file.path);
    logger.info(`Subir Imagen: Imagen subida exitosamente. URL: ${resultado.secure_url}`);
    res.status(200).json({
      mensaje: 'Imagen subida exitosamente',
      url: resultado.secure_url,
    });
  } catch (error) {
    logger.error(`Error en subirImagen: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
