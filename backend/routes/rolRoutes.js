import { Router } from 'express';
import {
  crearRol,
  listarRoles,
  verRol,
  editarRol,
  eliminarRol,
} from '../controllers/rolController.js';

const router = Router();

// GET /api/roles
router.get('/', listarRoles);

// GET /api/roles/:id
router.get('/:id', verRol);

// POST /api/roles
router.post('/', crearRol);

// PUT /api/roles/:id
router.put('/:id', editarRol);

// DELETE /api/roles/:id
router.delete('/:id', eliminarRol);

export default router;
