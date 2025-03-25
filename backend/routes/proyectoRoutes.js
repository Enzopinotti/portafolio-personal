// routes/proyectoRoutes.js

import { Router } from 'express';
import {
  asignarServiciosAProyecto,
  asignarSkillsAProyecto,
  buscarProyectos,
  crearProyecto,
  editarProyecto,
  eliminarProyecto,
  listarProyectos,
  listarProyectosPublicos,
  subirImagenesProyecto,
  subirImagenPastilla,
  verProyecto,
} from '../controllers/proyectoController.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import uploadProjects from '../config/multerProyectos.js';

const router = Router();

// (1) Crear un nuevo proyecto (sin imágenes)
router.post(
  '/',
  verificarToken,
  verificarRolAdmin,
  crearProyecto
);

// (2.1) Subir la imagenPastilla a un proyecto existente
router.post(
  '/:idProyecto/pastilla',
  verificarToken,
  verificarRolAdmin,
  uploadProjects.single('pastilla'),
  subirImagenPastilla
);

// (2.2) Subir imágenes extras (hasta 5)
router.post(
  '/:idProyecto/imagenes',
  verificarToken,
  verificarRolAdmin,
  uploadProjects.array('imagenes', 5),
  subirImagenesProyecto
);

// Ruta para editar un proyecto existente (requiere autenticación)
router.put('/:id', verificarToken, verificarRolAdmin ,editarProyecto);

// Ruta para eliminar un proyecto (requiere autenticación)
router.delete('/:id', verificarToken, verificarRolAdmin ,eliminarProyecto);

// Ruta para listar todos los proyectos
router.get('/', listarProyectos);

router.get('/publicos', listarProyectosPublicos);

// Ruta para ver detalles de un proyecto específico
router.get('/:id', verProyecto);

router.get('/buscar', buscarProyectos);

router.post('/:idProyecto/skills', verificarToken, verificarRolAdmin, asignarSkillsAProyecto);

router.post('/:idProyecto/servicios', verificarToken, verificarRolAdmin, asignarServiciosAProyecto);



export default router;
