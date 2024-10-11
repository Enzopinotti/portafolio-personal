// routes/skillRoutes.js

import { Router } from 'express';
import {
  crearSkill,
  editarSkill,
  eliminarSkill,
  listarSkills,
  verSkill,
} from '../controllers/skillController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para crear una nueva skill (requiere autenticación)
router.post('/crear', verificarToken, crearSkill);

// Ruta para editar una skill existente (requiere autenticación)
router.put('/:id', verificarToken, editarSkill);

// Ruta para eliminar una skill (requiere autenticación)
router.delete('/:id', verificarToken, eliminarSkill);

// Ruta para listar todas las skills
router.get('/', listarSkills);

// Ruta para ver detalles de una skill específica
router.get('/:id', verSkill);

export default router;
