// controllers/mensajeContactoController.js
import MensajeContacto from '../models/MensajeContacto.js';
import Usuario from '../models/Usuario.js';
import transporter from '../config/email.js';
import logger from '../config/logger.js';
import { registrarEvento } from '../utils/auditLogger.js';
import Boom from '@hapi/boom';

export const enviarMensaje = async (req, res, next) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;
    logger.info(`Enviar Mensaje: Recibido de ${nombre} (${email}) - Asunto: ${asunto}`);

    const nuevoMensaje = await MensajeContacto.create({
      nombre,
      email,
      asunto,
      mensaje,
      idUsuario: req.usuario ? req.usuario.idUsuario : null,
    });

    await registrarEvento({
      userId: req.usuario ? req.usuario.idUsuario : null,
      action: 'SEND_MENSAJE',
      target: 'mensaje_contacto',
      details: { asunto },
      req,
    });
    logger.info(`Enviar Mensaje: Mensaje guardado con ID ${nuevoMensaje.id_mensaje_contacto}.`);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto de ${nombre}: ${asunto}`,
      text: mensaje,
      html: `<p>${mensaje}</p>`,
    });
    logger.info('Enviar Mensaje: Correo de notificación enviado.');

    res.status(201).json({
      mensaje: 'Mensaje enviado exitosamente.',
      mensajeContacto: nuevoMensaje,
    });
  } catch (error) {
    logger.error(`Error en enviarMensaje: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const listarMensajes = async (req, res, next) => {
  try {
    logger.info('Listar Mensajes: Obteniendo todos los mensajes de contacto.');
    const mensajes = await MensajeContacto.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
        },
      ],
    });
    logger.info(`Listar Mensajes: Se obtuvieron ${mensajes.length} mensajes.`);
    res.status(200).json(mensajes);
  } catch (error) {
    logger.error(`Error en listarMensajes: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const verMensaje = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Ver Mensaje: Buscando mensaje con ID ${id}`);
    const mensaje = await MensajeContacto.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
        },
      ],
    });
    if (!mensaje) {
      logger.info(`Ver Mensaje: Mensaje con ID ${id} no encontrado.`);
      return next(Boom.notFound('Mensaje no encontrado.'));
    }
    logger.info(`Ver Mensaje: Mensaje con ID ${id} encontrado.`);
    res.status(200).json(mensaje);
  } catch (error) {
    logger.error(`Error en verMensaje: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const eliminarMensaje = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Eliminar Mensaje: Buscando mensaje con ID ${id}`);
    const mensaje = await MensajeContacto.findByPk(id);
    if (!mensaje) {
      logger.info(`Eliminar Mensaje: Mensaje con ID ${id} no encontrado.`);
      return next(Boom.notFound('Mensaje no encontrado.'));
    }
    await mensaje.destroy();
    logger.info(`Eliminar Mensaje: Mensaje con ID ${id} eliminado exitosamente.`);
    res.status(200).json({ mensaje: 'Mensaje eliminado exitosamente.' });
  } catch (error) {
    logger.error(`Error en eliminarMensaje: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};
