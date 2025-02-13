// controllers/usuarioController.js

import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registrarVisitante = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el email ya está registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario con rol Visitante (ejemplo: idRol=3)
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      idRol: 3, // Ajusta según tu seeder
    });

    // Generar Access y Refresh Token
    const accessToken = generarAccessToken({ idUsuario: nuevoUsuario.idUsuario, idRol: nuevoUsuario.idRol });
    const refreshToken = generarRefreshToken({ idUsuario: nuevoUsuario.idUsuario });

    // Guardar el refresh token en la BD
    nuevoUsuario.refreshToken = refreshToken;
    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const iniciarSesion = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos.' });
    }

    // Comparar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.password);
    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos.' });
    }

    // Generar Access y Refresh Token
    const accessToken = generarAccessToken({ idUsuario: usuario.idUsuario, idRol: usuario.idRol });
    const refreshToken = generarRefreshToken({ idUsuario: usuario.idUsuario });

    // Guardar el refresh token en la BD (rotación implícita al reloguear)
    usuario.refreshToken = refreshToken;
    await usuario.save();

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const cerrarSesion = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Borramos el refreshToken
    usuario.refreshToken = null;
    await usuario.save();

    res.status(200).json({ mensaje: 'Cierre de sesión exitoso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const refrescarToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'No se proporcionó el refresh token.' });
    }

    // Buscar usuario que tenga ese refreshToken en la BD
    const usuario = await Usuario.findOne({ where: { refreshToken } });
    if (!usuario) {
      return res.status(401).json({ error: 'Refresh token inválido (no coincide en la BD).' });
    }

    // Verificar con la clave de refresh
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token expirado o inválido.' });
      }

      // Rotamos el token => generamos uno nuevo
      const nuevoRefreshToken = generarRefreshToken({ idUsuario: usuario.idUsuario });
      usuario.refreshToken = nuevoRefreshToken;
      await usuario.save();

      // Generar nuevo access token
      const newAccessToken = generarAccessToken({ idUsuario: usuario.idUsuario, idRol: usuario.idRol });

      // Retornamos ambos tokens
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: nuevoRefreshToken,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const verPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario, {
      attributes: ['idUsuario', 'nombre', 'email'],
      include: [{ model: Rol, attributes: ['nombre'] }],
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarPerfil = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Actualizar los campos proporcionados
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      usuario.contraseña = hashedPassword;
    }

    await usuario.save();

    res.status(200).json({ mensaje: 'Perfil actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const actualizarAvatar = async (req, res) => {
  try {
    // Subir imagen a Cloudinary usando req.file
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
    });

    // Eliminar archivo local
    fs.unlinkSync(req.file.path);

    // Actualizar campo avatar en la BD
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.avatar = resultado.secure_url;
    await usuario.save();

    res.status(200).json({
      mensaje: 'Avatar actualizado exitosamente.',
      avatar: resultado.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const cambiarRolUsuario = async (req, res) => {
  try {
    // Solo un admin puede hacer esto
    if (req.usuario.idRol !== 1) { // Asumiendo rol admin = 1
      return res.status(403).json({ error: 'No autorizado.' });
    }

    const { id } = req.params;
    const { idRol } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.idRol = idRol;
    await usuario.save();

    res.status(200).json({
      mensaje: 'Rol del usuario actualizado exitosamente.',
      usuario,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

