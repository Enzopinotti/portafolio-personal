// routes/imagenRoutes.js

import { Router } from 'express';
import { eliminarImagen, obtenerImagenesPorProyecto, subirImagen } from '../controllers/imagenController.js';
import upload from '../config/multer.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

// Ruta para subir imagen
router.post('/subir', upload.single('imagen'), subirImagen);
router.get('/proyecto/:idProyecto', obtenerImagenesPorProyecto);
router.delete('/:idImagen', verificarToken, verificarRolAdmin, eliminarImagen);

export default router;
