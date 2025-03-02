// routes/testimonioRoutes.js
import { Router } from 'express';
import {
  crearTestimonio,
  listarTestimonios,
  verTestimonio,
  editarTestimonio,
  eliminarTestimonio,
  listarTestimoniosDeUsuario,
  publicarTestimonio, // si queremos un endpoint extra
} from '../controllers/testimonioController.js';

import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

/**
 * GET /api/testimonios
 * - Los anónimos y usuarios normales ven sólo testimonios publicados
 * - Los admins pueden ver todo (lo manejamos desde el controller con req.usuario si existe).
 */
router.get('/', listarTestimonios);

// GET testimonio por ID
router.get('/:id', verTestimonio);

// GET todos los testimonios de un usuario (requerir token si quieres la info de su "propio" user)
router.get('/usuario/:idUsuario', listarTestimoniosDeUsuario);

/**
 * POST /api/testimonios
 * - Solo usuarios autenticados pueden crear.
 */
router.post('/', verificarToken, crearTestimonio);

/**
 * PUT /api/testimonios/:id
 * - Si es admin, puede editar cualquier testimonio.
 * - Si no es admin, solo si es propietario.
 */
router.put('/:id', verificarToken, editarTestimonio);

/**
 * DELETE /api/testimonios/:id
 * - Si es admin, puede eliminarlo.
 * - Si no es admin, solo si es propietario.
 */
router.delete('/:id', verificarToken, eliminarTestimonio);

/**
 * PATCH /api/testimonios/:id/publicar
 * - Endpoint específico para que el admin marque como publicado
 */
router.patch('/:id/publicar', verificarToken, verificarRolAdmin, publicarTestimonio);

export default router;
