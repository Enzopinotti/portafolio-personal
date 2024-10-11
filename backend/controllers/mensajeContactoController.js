// controllers/mensajeContactoController.js

import MensajeContacto from '../models/MensajeContacto.js';
import Usuario from '../models/Usuario.js';
import transporter from '../config/email.js';

export const enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    // Guardar el mensaje en la base de datos
    const nuevoMensaje = await MensajeContacto.create({
      nombre,
      email,
      asunto,
      mensaje,
      idUsuario: req.usuario ? req.usuario.idUsuario : null,
    });

    // Enviar correo de notificación al administrador
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Tu correo, donde recibirás los mensajes
      subject: `Nuevo mensaje de contacto de ${nombre}: ${asunto}`,
      text: mensaje,
      html: `<p>${mensaje}</p>`,
    });

    res.status(201).json({
      mensaje: 'Mensaje enviado exitosamente.',
      mensajeContacto: nuevoMensaje,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarMensajes = async (req, res) => {
  try {
    const mensajes = await MensajeContacto.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
        },
      ],
    });

    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verMensaje = async (req, res) => {
  try {
    const { id } = req.params;

    const mensaje = await MensajeContacto.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
        },
      ],
    });

    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    res.status(200).json(mensaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;

    const mensaje = await MensajeContacto.findByPk(id);

    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    await mensaje.destroy();

    res.status(200).json({ mensaje: 'Mensaje eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
