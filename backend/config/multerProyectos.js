// config/multerProyectos.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de almacenamiento en disco local (temporal)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1) Extraer el id_proyecto (suponiendo que vienes de la ruta "/proyectos/:idProyecto/imagenes")
    const { idProyecto } = req.params; 
    // 2) Construir la carpeta dinámica
    const uploadPath = path.join('uploads', 'proyectos', idProyecto);

    // 3) Crear la carpeta si no existe
    fs.mkdirSync(uploadPath, { recursive: true });

    // 4) Asignar como destino final de guardado
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nombre único con timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro: solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen válida.'), false);
  }
};

const uploadProjects = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5MB por imagen
});

export default uploadProjects;
