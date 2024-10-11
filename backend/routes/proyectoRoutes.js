// routes/proyectoRoutes.js

import { Router } from 'express';
import {
  crearProyecto,
  editarProyecto,
  eliminarProyecto,
  listarProyectos,
  verProyecto,
} from '../controllers/proyectoController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para crear un nuevo proyecto (requiere autenticación)
router.post('/crear', verificarToken, crearProyecto);

// Ruta para editar un proyecto existente (requiere autenticación)
router.put('/:id', verificarToken, editarProyecto);

// Ruta para eliminar un proyecto (requiere autenticación)
router.delete('/:id', verificarToken, eliminarProyecto);

// Ruta para listar todos los proyectos
router.get('/', listarProyectos);

// Ruta para ver detalles de un proyecto específico
router.get('/:id', verProyecto);

export default router;
