// routes/usuarioRoutes.js

import { Router } from 'express';
import {
  registrarVisitante,
  iniciarSesion,
  cerrarSesion,
  editarPerfil,
  verPerfil,
  cambiarRolUsuario,
  refrescarToken,
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { actualizarAvatar } from '../controllers/usuarioController.js';
import upload from '../config/multer.js';

const router = Router();

// Ruta para registrar un nuevo usuario (visitante)
router.post('/registrar', registrarVisitante);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

// Ruta para cerrar sesión (requiere autenticación)
router.post('/logout', verificarToken, cerrarSesion);

// Ruta para ver el perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, verPerfil);

router.post('/avatar', verificarToken, upload.single('avatar'), actualizarAvatar);

router.put('/:id/cambiar-rol', verificarToken, cambiarRolUsuario);

router.post('/refresh', refrescarToken);

export default router;
