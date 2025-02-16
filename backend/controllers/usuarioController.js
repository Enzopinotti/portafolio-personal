// controllers/usuarioController.js
import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Boom from '@hapi/boom';
import { generarAccessToken, generarRefreshToken } from '../utils/tokenUtils.js';
import { registrarEvento } from '../utils/auditLogger.js';
import logger from '../config/logger.js';

dotenv.config();

export const registrarVisitante = async (req, res, next) => {
  try {
    const { nombre, email, contraseña } = req.body;
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      logger.info(`Registro fallido: email ${email} ya registrado.`);
      return next(Boom.badRequest('El email ya está registrado.'));
    }
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      idRol: 3,
    });
    const accessToken = generarAccessToken({ idUsuario: nuevoUsuario.idUsuario, idRol: nuevoUsuario.idRol });
    const refreshToken = generarRefreshToken({ idUsuario: nuevoUsuario.idUsuario });
    nuevoUsuario.refreshToken = refreshToken;
    await nuevoUsuario.save();
    await registrarEvento({
      userId: nuevoUsuario.idUsuario,
      action: 'REGISTER',
      target: 'usuario',
      details: { email, message: 'Registro de visitante exitoso' },
      req,
    });
    logger.info(`Usuario registrado exitosamente: ${email}`);
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`Error en registrarVisitante: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const loginLocalController = async (req, res, next) => {
  try {
    const usuario = req.user;
    if (!usuario) {
      return next(Boom.badRequest('Autenticación fallida.'));
    }
    const accessToken = generarAccessToken({ idUsuario: usuario.idUsuario, idRol: usuario.idRol });
    const refreshToken = generarRefreshToken({ idUsuario: usuario.idUsuario });
    usuario.refreshToken = refreshToken;
    await usuario.save();
    await registrarEvento({
      userId: usuario.idUsuario,
      action: 'LOGIN',
      target: 'usuario',
      details: { email: usuario.email, success: true },
      req,
    });
    logger.info(`Usuario ${usuario.email} inició sesión exitosamente.`);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      accessToken,
    });
  } catch (error) {
    logger.error(`Error en loginLocalController: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const loginGoogleController = async (req, res, next) => {
  try {
    const { usuario, accessJwt, refreshJwt } = req.user;
    if (!usuario) {
      return next(Boom.badRequest('Autenticación con Google fallida.'));
    }
    await registrarEvento({
      userId: usuario.idUsuario,
      action: 'LOGIN_GOOGLE',
      target: 'usuario',
      details: { email: usuario.email, success: true },
      req,
    });
    logger.info(`Usuario ${usuario.email} autenticado con Google exitosamente.`);
    
    // Establece la cookie con el refresh token
    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Redirige al usuario a la URL del frontend (home)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(frontendUrl);
    
    // Si quisieras enviar el access token en la URL (no recomendado por seguridad), podrías hacerlo en query params,
    // pero en general, al estar el refresh token en cookie, el frontend podrá hacer peticiones seguras al backend.
  } catch (error) {
    logger.error(`Error en loginGoogleController: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const cerrarSesion = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Cerrar sesión fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    await registrarEvento({
      userId: usuario.idUsuario,
      action: 'LOGOUT',
      target: 'usuario',
      details: { message: 'Cierre de sesión exitoso' },
      req,
    });
    logger.info(`Usuario ${usuario.email} cerró sesión exitosamente.`);
    usuario.refreshToken = null;
    await usuario.save();
    res.status(200).json({ mensaje: 'Cierre de sesión exitoso.' });
  } catch (error) {
    logger.error(`Error en cerrarSesion: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const refrescarToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      logger.info('Intento de refrescar token sin proporcionar refresh token.');
      return next(Boom.badRequest('No se proporcionó el refresh token.'));
    }
    const usuario = await Usuario.findOne({ where: { refreshToken } });
    if (!usuario) {
      logger.info('Refresh token inválido, no coincide en la BD.');
      return next(Boom.unauthorized('Refresh token inválido (no coincide en la BD).'));
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        logger.info('Refresh token expirado o inválido.');
        return next(Boom.forbidden('Refresh token expirado o inválido.'));
      }
      await registrarEvento({
        userId: usuario.idUsuario,
        action: 'REFRESH_TOKEN',
        target: 'usuario',
        details: { oldRefreshToken: refreshToken },
        req,
      });
      logger.info(`Usuario ${usuario.email} solicita refrescar token.`);
      const nuevoRefreshToken = generarRefreshToken({ idUsuario: usuario.idUsuario });
      usuario.refreshToken = nuevoRefreshToken;
      await usuario.save();
      await registrarEvento({
        userId: usuario.idUsuario,
        action: 'ROTATE_REFRESH_TOKEN',
        target: 'usuario',
        details: { newRefreshToken: nuevoRefreshToken },
        req,
      });
      logger.info(`Refresh token rotado para usuario ${usuario.email}.`);
      const newAccessToken = generarAccessToken({ idUsuario: usuario.idUsuario, idRol: usuario.idRol });
      res.cookie('refreshToken', nuevoRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    logger.error(`Error en refrescarToken: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario, {
      attributes: ['idUsuario', 'nombre', 'email'],
      include: [{ model: Rol, attributes: ['nombre'] }],
    });
    if (!usuario) {
      logger.info(`Ver perfil fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    res.status(200).json(usuario);
  } catch (error) {
    logger.error(`Error en verPerfil: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const editarPerfil = async (req, res, next) => {
  try {
    const { nombre, email, contraseña } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Editar perfil fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      usuario.contraseña = hashedPassword;
    }
    await usuario.save();
    logger.info(`Perfil actualizado exitosamente para usuario ${usuario.email}.`);
    res.status(200).json({ mensaje: 'Perfil actualizado exitosamente.' });
  } catch (error) {
    logger.error(`Error en editarPerfil: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const actualizarAvatar = async (req, res, next) => {
  try {
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
    });
    fs.unlinkSync(req.file.path);
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Actualizar avatar fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    usuario.avatar = resultado.secure_url;
    await usuario.save();
    await registrarEvento({
      userId: usuario.idUsuario,
      action: 'UPDATE_AVATAR',
      target: 'usuario',
      details: { avatarUrl: resultado.secure_url },
      req,
    });
    logger.info(`Avatar actualizado para usuario ${usuario.email}.`);
    res.status(200).json({
      mensaje: 'Avatar actualizado exitosamente.',
      avatar: resultado.secure_url,
    });
  } catch (error) {
    logger.error(`Error en actualizarAvatar: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const cambiarRolUsuario = async (req, res, next) => {
  try {
    if (req.usuario.idRol !== 1) {
      logger.info(`Cambio de rol fallido: Usuario ${req.usuario.idRol} no autorizado.`);
      return next(Boom.forbidden('No autorizado.'));
    }
    const { id } = req.params;
    const { idRol } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      logger.info(`Cambio de rol fallido: Usuario ${id} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    const rolAnterior = usuario.idRol;
    usuario.idRol = idRol;
    await usuario.save();
    await registrarEvento({
      userId: usuario.idUsuario,
      action: 'CHANGE_ROLE',
      target: 'usuario',
      details: { previousRole: rolAnterior, newRole: idRol },
      req,
    });
    logger.info(`Rol actualizado para usuario ${usuario.email} de ${rolAnterior} a ${idRol}.`);
    res.status(200).json({
      mensaje: 'Rol del usuario actualizado exitosamente.',
      usuario,
    });
  } catch (error) {
    logger.error(`Error en cambiarRolUsuario: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
