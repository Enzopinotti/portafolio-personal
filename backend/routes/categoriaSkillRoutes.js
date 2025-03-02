// routes/categoriaSkillRoutes.js
import { Router } from 'express';
import {
  listarCategoriaSkills,
  verCategoriaSkill,
  crearCategoriaSkill,
  editarCategoriaSkill,
  eliminarCategoriaSkill,
} from '../controllers/categoriaSkillController.js';

// Si tienes middlewares de autenticación/rol:
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

/**
 * GET /api/categorias-skills?page=1&limit=10
 * - Lista categorías de skills con paginación
 */
router.get('/', listarCategoriaSkills);

/**
 * GET /api/categorias-skills/:id
 * - Ver detalle de 1 categoría skill
 */
router.get('/:id', verCategoriaSkill);

/**
 * POST /api/categorias-skills
 * - Solo admin puede crear
 */
router.post('/', verificarToken, verificarRolAdmin, crearCategoriaSkill);

/**
 * PUT /api/categorias-skills/:id
 * - Solo admin puede editar
 */
router.put('/:id', verificarToken, verificarRolAdmin, editarCategoriaSkill);

/**
 * DELETE /api/categorias-skills/:id
 * - Solo admin puede eliminar
 */
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarCategoriaSkill);

export default router;
