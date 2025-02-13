import { Router } from 'express';
import {
  crearArticulo,
  listarArticulos,
  verArticulo,
  editarArticulo,
  eliminarArticulo,
} from '../controllers/articuloController.js';
// import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/articulos/
router.get('/', listarArticulos);

// GET /api/articulos/:id
router.get('/:id', verArticulo);

// POST /api/articulos/
router.post('/', crearArticulo);

// PUT /api/articulos/:id
router.put('/:id', editarArticulo);

// DELETE /api/articulos/:id
router.delete('/:id', eliminarArticulo);

export default router;
