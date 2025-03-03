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
import transporter from '../config/email.js';
import crypto from 'crypto';
import path from 'path';
import { __dirname } from '../utils/pathUtils.js';
import fs from 'fs';
import hbs from 'handlebars';
import cloudinary from '../config/cloudinary.js';

dotenv.config();

export const registrarVisitante = async (req, res, next) => {
  try {
    const { nombre, apellido ,email, contraseña, clientURI } = req.body;
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      logger.info(`Registro fallido: email ${email} ya registrado.`);
      return next(Boom.badRequest('El email ya está registrado.'));
    }

    // Generar token para confirmación y fecha de expiración (ej. 1 hora)
    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      idRol: 2,
      emailToken,
      emailTokenExpires,
      emailConfirmed: false,
    });

    const accessToken = generarAccessToken({ idUsuario: nuevoUsuario.idUsuario, idRol: nuevoUsuario.idRol });
    const refreshToken = generarRefreshToken({ idUsuario: nuevoUsuario.idUsuario });
    nuevoUsuario.refreshToken = refreshToken;
    await nuevoUsuario.save();

    await registrarEvento({
      userId: nuevoUsuario.idUsuario,
      action: 'REGISTER',
      target: 'usuario',
      details: { email, message: 'Registro exitoso' },
      req,
    });

    logger.info(`Usuario registrado exitosamente: ${email}`);

    // Preparar el template de correo
    const templatePath = path.join(__dirname, '../templates/confirmEmail.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateSource);

    // Construir el link de confirmación usando el clientURI enviado desde el front
    const confirmLink = `${clientURI}/confirm-email?token=${emailToken}&email=${email}`;


    const templateData = {
      nombre,
      confirmLink,
      colorPrimary: process.env.COLOR_PRIMARY || '#00bcd4',
      colorSecondary: process.env.COLOR_SECONDARY || '#ff4081',
      colorWhite: process.env.COLOR_WHITE || '#ffffff',
      colorTextDark: process.env.COLOR_TEXT_DARK || '#333333',
      spacingUnit: process.env.SPACING_UNIT || '8px'
    };

    const htmlToSend = template(templateData);

    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirma tu email',
      html: htmlToSend,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error al enviar correo de confirmación: ${err.message}`);
      } else {
        logger.info(`Correo de confirmación enviado: ${info.response}`);
      }
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente. Se ha enviado un correo para confirmar tu email.',
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

    logger.info(`Usuario ${usuario.email} autenticado con Google exitosamente.`);

    // Guarda el refresh token en cookie HTTP-only
    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirige con el access token en el query param
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}?accessToken=${accessJwt}`;

    return res.redirect(redirectUrl);
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email, clientURI } = req.body;
    if (!email || !clientURI) {
      return next(Boom.badRequest('Se requieren el email y el clientURI.'));
    }
    const usuario = await Usuario.findOne({ where: { email } });
    // Para seguridad, si no se encuentra usuario se responde igual
    if (!usuario) {
      return res.status(200).json({ mensaje: 'Se ha enviado un correo para restablecer tu contraseña.' });
    }

    // Generar token de restablecimiento y fecha de expiración (ej. 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    // Almacenar estos datos en el usuario (asegúrate de haber agregado estos campos en el modelo/migración)
    usuario.resetToken = resetToken;
    usuario.resetTokenExpires = resetTokenExpires;
    await usuario.save();

    // Preparar el template del correo de restablecimiento
    const templatePath = path.join(__dirname, '../templates/forgotPassword.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateSource);

    // Construir el link de restablecimiento usando el clientURI enviado desde el front
    const resetLink = `${clientURI}/reset-password?token=${resetToken}`;

    const templateData = {
      nombre: usuario.nombre,
      resetLink,
      colorPrimary: process.env.COLOR_PRIMARY || '#00bcd4',
      colorSecondary: process.env.COLOR_SECONDARY || '#ff4081',
      colorWhite: process.env.COLOR_WHITE || '#ffffff',
      colorTextDark: process.env.COLOR_TEXT_DARK || '#333333',
      spacingUnit: process.env.SPACING_UNIT || '8px'
    };

    const htmlToSend = template(templateData);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Restablece tu contraseña',
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error al enviar correo de restablecimiento: ${err.message}`);
      } else {
        logger.info(`Correo de restablecimiento enviado: ${info.response}`);
      }
    });

    res.status(200).json({ mensaje: 'Se ha enviado un correo para restablecer tu contraseña.' });
  } catch (error) {
    logger.error(`Error en forgotPassword: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    logger.info ('Intentando restablecer contraseña...');
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return next(Boom.badRequest('Se requieren el token y la nueva contraseña.'));
    }
    // Buscar el usuario por el token de reseteo
    const usuario = await Usuario.findOne({ where: { resetToken: token } });
    if (!usuario) {
      return next(Boom.notFound('Token inválido.'));
    }
    // Verificar si el token ha expirado
    if (usuario.resetTokenExpires < new Date()) {
      return next(Boom.badRequest('El token ha expirado.'));
    }
    // Hashear la nueva contraseña y actualizar
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword;
    usuario.resetToken = null;
    usuario.resetTokenExpires = null;
    await usuario.save();
    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    logger.error(`Error en resetPassword: ${error.message}`);
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
      attributes: ['idUsuario', 'nombre', 'apellido', 'email', 'avatar'], // <--- agregamos 'avatar'
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
    const { nombre, apellido ,email, contraseña } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Editar perfil fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
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
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Actualizar avatar fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    // 1) Si el usuario tiene un avatarPublicId previo, eliminar la imagen anterior de Cloudinary
    if (usuario.avatarPublicId) {
      await cloudinary.uploader.destroy(usuario.avatarPublicId);
    }

    // 2) Subir la nueva imagen
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
    });
    fs.unlinkSync(req.file.path); // elimina el archivo temporal

    // 3) Guardar la URL y el public_id
    usuario.avatar = resultado.secure_url;
    usuario.avatarPublicId = resultado.public_id; // <--- Nuevo

    await usuario.save();
    logger.info(`Avatar actualizado para usuario ${usuario.email}.`);

    return res.status(200).json({
      mensaje: 'Avatar actualizado exitosamente.',
      avatar: resultado.secure_url,
    });
  } catch (error) {
    logger.error(`Error en actualizarAvatar: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarAvatar = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      logger.info(`Eliminar avatar fallido: Usuario ${req.usuario.idUsuario} no encontrado.`);
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    // Si hay un public_id, se elimina
    if (usuario.avatarPublicId) {
      await cloudinary.uploader.destroy(usuario.avatarPublicId);
    }

    // Volver al placeholder
    usuario.avatar = null;
    usuario.avatarPublicId = null;
    await usuario.save();

    logger.info(`Avatar eliminado para usuario ${usuario.email}.`);
    return res.status(200).json({
      mensaje: 'Avatar eliminado. Ahora se usa el placeholder.',
    });
  } catch (error) {
    logger.error(`Error en eliminarAvatar: ${error.message}`);
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

export const confirmEmail = async (req, res, next) => {
  try {
    // Se espera el token en el body (ya que usamos POST)
    console.log('entre, token:', req.body.token);
    const { token } = req.body;
    if (!token) {
      return next(Boom.badRequest('Token es requerido.'));
    }

    // Buscar el usuario con ese token
    const usuario = await Usuario.findOne({ where: { emailToken: token } });
    if (!usuario) {
      return next(Boom.notFound('Token inválido.'));
    }

    // Verificar si el token ha expirado
    if (usuario.emailTokenExpires < new Date()) {
      return next(Boom.badRequest('El token ha expirado.'));
    }

    // Actualizar el usuario: confirmar el email y limpiar el token y su fecha
    usuario.emailConfirmed = true;
    usuario.emailToken = null;
    usuario.emailTokenExpires = null;
    await usuario.save();

    res.status(200).json({ mensaje: 'Email confirmado exitosamente.' });
  } catch (error) {
    logger.error(`Error en confirmEmail: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const resendConfirmationEmail = async (req, res, next) => {
  try {
    const { email, clientURI } = req.body;
    if (!email || !clientURI) {
      return next(Boom.badRequest('Se requieren el email y el clientURI.'));
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return next(Boom.notFound('Usuario no encontrado.'));
    }

    if (usuario.emailConfirmed) {
      return next(Boom.badRequest('El email ya está confirmado.'));
    }

    // Generar un nuevo token para confirmación y fecha de expiración (ej. 1 hora)
    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Actualizar el usuario con el nuevo token
    usuario.emailToken = emailToken;
    usuario.emailTokenExpires = emailTokenExpires;
    await usuario.save();

    // Preparar el template de correo (usando handlebars)
    const templatePath = path.join(__dirname, '../templates/confirmEmail.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateSource);

    // Construir el link de confirmación usando el clientURI enviado desde el front
    const confirmLink = `${clientURI}/confirm-email?token=${emailToken}`;

    const templateData = {
      nombre: usuario.nombre,
      confirmLink,
      colorPrimary: process.env.COLOR_PRIMARY || '#00bcd4',
      colorSecondary: process.env.COLOR_SECONDARY || '#ff4081',
      colorWhite: process.env.COLOR_WHITE || '#ffffff',
      colorTextDark: process.env.COLOR_TEXT_DARK || '#333333',
      spacingUnit: process.env.SPACING_UNIT || '8px'
    };

    const htmlToSend = template(templateData);

    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirma tu email',
      html: htmlToSend,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error al reenviar correo de confirmación: ${err.message}`);
      } else {
        logger.info(`Correo de confirmación reenviado: ${info.response}`);
      }
    });

    res.status(200).json({ mensaje: 'Correo de confirmación reenviado exitosamente.' });
  } catch (error) {
    logger.error(`Error en resendConfirmationEmail: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};