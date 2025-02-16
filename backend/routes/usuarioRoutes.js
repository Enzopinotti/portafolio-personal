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
  loginGoogleController,
  forgotPassword,
  confirmEmail,
  resendConfirmationEmail,
  resetPassword
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { validateForgotPassword, validateLogin, validateRegister } from '../validations/usuarioValidations.js';

const router = Router();

/* ---------- Rutas locales ---------- */

// Ruta para registrar un nuevo usuario (local)
// Se aplica el middleware de validación y sanitización
router.post('/registrar', validateRegister, registrarVisitante);

// Login: se valida la data y luego se autentica con Passport y se llama al controlador
router.post(
  '/login',
  validateLogin,
  passport.authenticate('local', { session: false }),
  loginLocalController
);
// Forgot Password: valida el email y luego llama al controlador
router.post('/forgot', validateForgotPassword, forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-confirmation', resendConfirmationEmail);
router.post('/confirm-email', confirmEmail);
router.post('/logout', verificarToken, cerrarSesion);
router.get('/perfil', verificarToken, verPerfil);
router.put('/perfil', verificarToken, editarPerfil);
router.post('/avatar', verificarToken, upload.single('avatar'), actualizarAvatar);
router.put('/:id/cambiar-rol', verificarToken, cambiarRolUsuario);
router.post('/refresh', refrescarToken);

/* ---------- Rutas para Google OAuth ---------- */
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  loginGoogleController
);

export default router;
