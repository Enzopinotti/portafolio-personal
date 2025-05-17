// controllers/adminSettingsController.js
import Settings from '../models/Settings.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';
import { importarDesdeSheet } from '../utils/importarDesdeSheet.js';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwpf5VZzQGDV8QirJNxQ9EcHXLkXDqX9u4DG6E0j0sGfOwrT0IGL6R7b3NI3TX_qgxt/exec';

export const getSettingsController = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return next(Boom.notFound('Settings not found.'));
    }
    res.status(200).json(settings);
  } catch (error) {
    logger.error(`Error fetching settings: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const updateSettingsController = async (req, res, next) => {
  try {
    const newSettings = req.body;
    const settings = await Settings.findOne();
    if (!settings) {
      return next(Boom.notFound('Settings not found.'));
    }
    // Actualiza cada campo de forma segura
    await settings.update(newSettings);
    res.status(200).json(settings);
  } catch (error) {
    logger.error(`Error updating settings: ${error.message}`);
    return next(Boom.internal(error.message));
  }
};

export const importarFlexibleDesdeSheetController = async (req, res, next) => {
  try {
    const hojas = req.body.hojas;
    const log = await importarDesdeSheet(SHEET_URL, hojas);

    res.status(200).json({
      mensaje: hojas?.length
        ? `Importación parcial completada`
        : 'Importación completa realizada',
      detalle: log
    });
  } catch (error) {
    logger.error(`Error al importar hojas desde Sheet: ${error.message}`);
    return next(Boom.internal('Error al importar datos desde Google Sheet.'));
  }
};