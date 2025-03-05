import { Router } from 'express';
import {
  crearServicio,
  listarServicios,
  verServicio,
  editarServicio,
  eliminarServicio,
} from '../controllers/servicioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

// Listar y ver no requieren token, pero crear, editar y eliminar sí
router.get('/', listarServicios);
router.get('/:id', verServicio);

// Estas rutas requieren autenticación y rol admin (ajusta según tus necesidades)
router.post('/', verificarToken, verificarRolAdmin, crearServicio);
router.put('/:id', verificarToken, verificarRolAdmin, editarServicio);
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarServicio);

export default router;
