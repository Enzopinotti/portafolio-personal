// routes/imagenRoutes.js

import { Router } from 'express';
import { subirImagen } from '../controllers/imagenController.js';
import upload from '../config/multer.js';

const router = Router();

// Ruta para subir imagen
router.post('/subir', upload.single('imagen'), subirImagen);

export default router;
