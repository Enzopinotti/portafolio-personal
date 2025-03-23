// controllers/mensajeContactoController.js
import MensajeContacto from '../models/MensajeContacto.js';
import Usuario from '../models/Usuario.js';
import transporter from '../config/email.js';
import logger from '../config/logger.js';
import { registrarEvento } from '../utils/auditLogger.js';
import Boom from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import hbs from 'handlebars';
import { __dirname } from '../utils/pathUtils.js';

export const enviarMensaje = async (req, res, next) => {
  try {
    const { nombreCompleto, email, servicioInteres, mensaje } = req.body;

    const nuevoMensaje = await MensajeContacto.create({
      nombreCompleto,
      email,
      servicioInteres,
      mensaje,
      idUsuario: req.usuario ? req.usuario.idUsuario : null,
    });

    await registrarEvento({
      userId: req.usuario ? req.usuario.idUsuario : null,
      action: 'SEND_MENSAJE',
      target: 'mensaje_contacto',
      details: { servicioInteres },
      req,
    });

    logger.info(`Mensaje de contacto registrado de: ${nombreCompleto} - ${email}`);

    // Template para el administrador
    const adminTemplatePath = path.join(__dirname, '../templates/contactoAdmin.hbs');
    const adminTemplateSource = fs.readFileSync(adminTemplatePath, 'utf8');
    const adminTemplate = hbs.compile(adminTemplateSource);

    const adminHtml = adminTemplate({
      nombreCompleto,
      email,
      servicioInteres,
      mensaje,
    });

    // Enviar correo al administrador
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'enzopinottii@gmail.com',
      subject: `Nuevo mensaje de contacto de ${nombreCompleto}`,
      html: adminHtml,
    });

    logger.info('Correo enviado al administrador.');

    // Template para el usuario
    const userTemplatePath = path.join(__dirname, '../templates/contactoUsuario.hbs');
    const userTemplateSource = fs.readFileSync(userTemplatePath, 'utf8');
    const userTemplate = hbs.compile(userTemplateSource);

    const userHtml = userTemplate({
      nombreCompleto,
      servicioInteres,
    });

    // Enviar correo de confirmación al usuario
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Hemos recibido tu mensaje',
      html: userHtml,
    });

    logger.info('Correo de confirmación enviado al usuario.');

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
    logger.info('Listar Mensajes: Obteniendo todos los mensajes de contacto (paginados).');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      paginate: limit,
      include: [
        {
          model: Usuario,
          attributes: ['idUsuario', 'nombre'],
        },
      ],
    };

    const { docs, pages, total } = await MensajeContacto.paginate(options);

    logger.info(
      `Listar Mensajes: Se obtuvieron ${docs.length} mensajes en la página ${page}. Total: ${total}.`
    );

    res.status(200).json({
      mensajes: docs,
      total,
      pages,
      currentPage: page,
      limit,
    });
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
