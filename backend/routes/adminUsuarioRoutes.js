// routes/adminUsuarioRoutes.js
import { Router } from 'express';
import {
  listarUsuarios,
  verUsuarioAdmin,
  editarUsuarioAdmin,
  eliminarUsuarioAdmin,
  crearUsuarioAdmin,
} from '../controllers/adminUsuarioController.js';

import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();


/**
 * GET /api/admin/usuarios
 * - Lista todos los usuarios (paginados)
 */
router.get('/', verificarToken, verificarRolAdmin, listarUsuarios);

router.post('/', verificarToken, verificarRolAdmin, crearUsuarioAdmin);
/**
 * GET /api/admin/usuarios/:id
 * - Ver detalle de un usuario
 */
router.get('/:id', verificarToken, verificarRolAdmin, verUsuarioAdmin);

/**
 * PUT /api/admin/usuarios/:id
 * - Editar un usuario (nombre, apellido, rol, email, etc.)
 */
router.put('/:id', verificarToken, verificarRolAdmin, editarUsuarioAdmin);

/**
 * DELETE /api/admin/usuarios/:id
 * - Eliminar un usuario
 */
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarUsuarioAdmin);

export default router;
