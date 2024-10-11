// routes/usuarioRoutes.js

import { Router } from 'express';
import {
  registrarVisitante,
  iniciarSesion,
  cerrarSesion,
  editarPerfil,
  verPerfil,
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para registrar un nuevo usuario (visitante)
router.post('/registrar', registrarVisitante);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

// Ruta para cerrar sesión (requiere autenticación)
router.post('/logout', verificarToken, cerrarSesion);

// Ruta para ver el perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, verPerfil);

// Ruta para editar el perfil del usuario (requiere autenticación)
router.put('/perfil', verificarToken, editarPerfil);

export default router;
