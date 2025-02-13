import { Router } from 'express';
import {
  crearServicio,
  listarServicios,
  verServicio,
  editarServicio,
  eliminarServicio,
} from '../controllers/servicioController.js';
// import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/servicios
router.get('/', listarServicios);

// GET /api/servicios/:id
router.get('/:id', verServicio);

// POST /api/servicios
router.post('/', crearServicio);

// PUT /api/servicios/:id
router.put('/:id', editarServicio);

// DELETE /api/servicios/:id
router.delete('/:id', eliminarServicio);

export default router;
