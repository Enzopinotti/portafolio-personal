// routes/skillRoutes.js

import { Router } from 'express';
import {
  asignarCategoriaASkill,
  crearSkill,
  editarSkill,
  eliminarSkill,
  listarSkills,
  verSkill,
} from '../controllers/skillController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

// Ruta para crear una nueva skill (requiere autenticación)
router.post('/crear', verificarToken, verificarRolAdmin ,crearSkill);

// Ruta para editar una skill existente (requiere autenticación)
router.put('/:id', verificarToken, verificarRolAdmin ,editarSkill);

// Ruta para eliminar una skill (requiere autenticación)
router.delete('/:id', verificarToken, verificarRolAdmin ,eliminarSkill);

// Ruta para listar todas las skills
router.get('/', listarSkills);

// Ruta para ver detalles de una skill específica
router.get('/:id', verSkill);

// Nueva ruta para asignar categorías a una skill (requiere autenticación y rol admin)
router.post('/:idSkill/categorias', verificarToken, verificarRolAdmin, asignarCategoriaASkill);

export default router;
