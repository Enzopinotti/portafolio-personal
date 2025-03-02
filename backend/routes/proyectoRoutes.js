// routes/proyectoRoutes.js

import { Router } from 'express';
import {
  asignarSkillAProyecto,
  buscarProyectos,
  crearProyecto,
  editarProyecto,
  eliminarProyecto,
  listarProyectos,
  verProyecto,
} from '../controllers/proyectoController.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para crear un nuevo proyecto (requiere autenticación)
router.post('/crear', verificarToken, verificarRolAdmin, crearProyecto);

// Ruta para editar un proyecto existente (requiere autenticación)
router.put('/:id', verificarToken, verificarRolAdmin ,editarProyecto);

// Ruta para eliminar un proyecto (requiere autenticación)
router.delete('/:id', verificarToken, verificarRolAdmin ,eliminarProyecto);

// Ruta para listar todos los proyectos
router.get('/', listarProyectos);

// Ruta para ver detalles de un proyecto específico
router.get('/:id', verProyecto);

router.get('/buscar', buscarProyectos);

router.post('/:idProyecto/skills/:idSkill', verificarRolAdmin ,asignarSkillAProyecto);

export default router;
