// routes/usuarioRoutes.js
import { Router } from 'express';
import passport from 'passport';
import {
  registrarVisitante,
  cerrarSesion,
  refrescarToken,
  verPerfil,
  editarPerfil,
  cambiarRolUsuario,
  actualizarAvatar,
  loginLocalController,
  loginGoogleController
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = Router();

/* ---------- Rutas locales ---------- */

// Ruta para registrar un nuevo usuario (local)
router.post('/registrar', registrarVisitante);

// Ruta para iniciar sesión local con Passport
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  loginLocalController
);

// Ruta para cerrar sesión (requiere autenticación)
router.post('/logout', verificarToken, cerrarSesion);

// Ruta para ver el perfil (requiere autenticación)
router.get('/perfil', verificarToken, verPerfil);

// Ruta para editar perfil (requiere autenticación)
router.put('/perfil', verificarToken, editarPerfil);

// Ruta para actualizar avatar (requiere autenticación)
router.post('/avatar', verificarToken, upload.single('avatar'), actualizarAvatar);

// Ruta para cambiar el rol (requiere autenticación, admin)
router.put('/:id/cambiar-rol', verificarToken, cambiarRolUsuario);

// Ruta para refrescar token (lee refresh token de cookie)
router.post('/refresh', refrescarToken);

/* ---------- Rutas para Google OAuth ---------- */

// Inicia el flujo de autenticación con Google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback de Google: utiliza Passport y luego pasa al controlador
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  loginGoogleController
);


export default router;
