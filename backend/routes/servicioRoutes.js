import { Router } from 'express';
import {
  crearServicio,
  listarServicios,
  verServicio,
  editarServicio,
  eliminarServicio,
  subirImagenServicio,
  eliminarPortadaServicio,
} from '../controllers/servicioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';
import upload from '../config/multer.js';

const router = Router();

// Listar y ver no requieren token, pero crear, editar y eliminar sí
router.get('/', listarServicios);
router.get('/:id', verServicio);

// Estas rutas requieren autenticación y rol admin (ajusta según tus necesidades)
router.post('/', verificarToken, verificarRolAdmin, crearServicio);
router.put('/:id', verificarToken, verificarRolAdmin, editarServicio);
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarServicio);
router.post(
  '/:id/portada',
  verificarToken,
  verificarRolAdmin,
  upload.single('portada'),
  subirImagenServicio
);
router.delete(
  '/:id/portada',
  verificarToken,
  verificarRolAdmin,
  eliminarPortadaServicio
);

export default router;
