// config/passport.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarAccessToken, generarRefreshToken } from '../utils/tokenUtils.js';
import logger from '../config/logger.js';

/* ----- Local Strategy ----- */
passport.use(new LocalStrategy({
  usernameField: 'email',           // usamos email como username
  passwordField: 'contraseña'         // o 'password' según lo que envíes
}, async (email, contraseña, done) => {
  try {
    logger.info(`LocalStrategy: Intento de autenticación para email: ${email}`);
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      logger.info(`LocalStrategy: No se encontró usuario para email: ${email}`);
      return done(null, false, { message: 'Email o contraseña incorrectos.' });
    }
    const validPassword = await bcrypt.compare(contraseña, usuario.password);
    if (!validPassword) {
      logger.info(`LocalStrategy: Contraseña incorrecta para email: ${email}`);
      return done(null, false, { message: 'Email o contraseña incorrectos.' });
    }
    logger.info(`LocalStrategy: Autenticación exitosa para email: ${email}`);
    return done(null, usuario);
  } catch (error) {
    logger.error(`LocalStrategy: Error en autenticación para email: ${email} - ${error.message}`);
    return done(error);
  }
}));

/* ----- Google Strategy sin sesiones ----- */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/usuarios/auth/google/callback',
  proxy: true, // Esto es clave para que reemplace HTTP por HTTPS en producción (detrás de nginx/docker)
  passReqToCallback: true, // para pasar req al callback y, opcionalmente, registrar eventos
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    logger.info(`GoogleStrategy: Inicio autenticación para usuario de Google: ${profile.displayName}`);
    const { displayName, emails } = profile;
    let usuario = await Usuario.findOne({ where: { email: emails[0].value } });
    if (!usuario) {
      logger.info(`GoogleStrategy: Usuario no encontrado para email ${emails[0].value}. Creando nuevo usuario.`);
      // Al crear el usuario, establecemos emailConfirmed a true
      usuario = await Usuario.create({
        nombre: displayName,
        email: emails[0].value,
        password: '', // No se utiliza para OAuth
        idRol: 2,     // Por ejemplo, rol de "usuario"
        emailConfirmed: true, // Marca el email como confirmado
      });
    }
    // Generar tokens sin usar sesiones.
    const accessJwt = generarAccessToken({ idUsuario: usuario.idUsuario, idRol: usuario.idRol });
    const refreshJwt = generarRefreshToken({ idUsuario: usuario.idUsuario });

    // Guarda el refresh token en la BD
    usuario.refreshToken = refreshJwt;
    await usuario.save();

    logger.info(`GoogleStrategy: Autenticación exitosa para email: ${emails[0].value}`);
    // Pasa al callback la información del usuario y los tokens generados
    return done(null, { usuario, accessJwt, refreshJwt });
  } catch (error) {
    logger.error(`GoogleStrategy: Error autenticando usuario ${profile.displayName} - ${error.message}`);
    return done(error, null);
  }
}));

export default passport;
