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

    // Crear nuevo usuario con rol de Visitante
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      idRol: 1, // Asumiendo que el rol 'Visitante' tiene id 1
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar al usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos.' });
    }

    // Comparar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, idRol: usuario.idRol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cerrarSesion = (req, res) => {
  // En este caso, como estamos usando JWT sin almacenamiento en servidor,
  // simplemente indicamos al cliente que elimine el token.
  res.status(200).json({ mensaje: 'Cierre de sesión exitoso.' });
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
