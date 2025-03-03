// routes/usuarioRoutes.js
import { Router } from 'express';
import passport from 'passport';
import Boom from '@hapi/boom';
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
  resetPassword,
  eliminarAvatar
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { validateForgotPassword, validateLogin, validateRegister } from '../validations/usuarioValidations.js';

const router = Router();

/* ---------- Rutas locales ---------- */

// Ruta para registrar un nuevo usuario (local)
// Se aplica el middleware de validación y sanitización
router.post('/registrar', validateRegister, registrarVisitante);

// * Login local con callback manual
router.post('/login', validateLogin, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      // Error interno (ej. DB) en la estrategia
      return next(Boom.internal(err.message || 'Error en la autenticación.'));
    }
    if (!user) {
      // Credenciales inválidas => 401
      // "info.message" viene de la estrategia local
      return next(Boom.unauthorized(info?.message || 'Email o contraseña incorrectos.'));
    }
    // Si hay usuario, lo guardamos en req.user y llamamos al controlador
    req.user = user;
    return loginLocalController(req, res, next);
  })(req, res, next);
});

// Forgot Password: valida el email y luego llama al controlador
router.post('/forgot', validateForgotPassword, forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-confirmation', resendConfirmationEmail);
router.post('/confirm-email', confirmEmail);
router.post('/logout', verificarToken, cerrarSesion);
router.get('/perfil', verificarToken, verPerfil);
router.put('/perfil', verificarToken, editarPerfil);
router.post('/avatar', verificarToken, upload.single('avatar'), actualizarAvatar);
router.delete('/avatar', verificarToken, eliminarAvatar);
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
