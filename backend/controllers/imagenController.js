// controllers/imagenController.js

import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const subirImagen = async (req, res) => {
  try {
    // Suponiendo que usas Multer y el archivo está disponible en req.file
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'imagenes',
    });

    // Eliminar el archivo local después de subirlo
    fs.unlinkSync(req.file.path);

    // Guardar la información en la base de datos si es necesario
    // ...

    res.status(200).json({
      mensaje: 'Imagen subida exitosamente',
      url: resultado.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
