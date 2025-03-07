// controllers/adminSettingsController.js
import Settings from '../models/Settings.js';
import logger from '../config/logger.js';
import Boom from '@hapi/boom';

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
