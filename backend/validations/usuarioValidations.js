// src/validations/usuarioValidations.js
import { body, validationResult, check } from 'express-validator';
import Boom from '@hapi/boom';

// Middleware de validación para el registro de usuarios.
export const validateRegister = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email es inválido.')
    .normalizeEmail(),
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  // Middleware para comprobar si hay errores y devolverlos usando Boom.
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map(err => err.msg).join(', ');
      return next(Boom.badRequest(errorMsg));
    }
    next();
  }
];

// Validaciones para el login
export const validateLogin = [
    check('email')
        .isEmail().withMessage('Email inválido.')
        .normalizeEmail(),
    check('contraseña')
        .notEmpty().withMessage('La contraseña es requerida.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return next(Boom.badRequest(errors.array()[0].msg));
        }
        next();
    }
];
  
// Validaciones para la recuperación de contraseña
export const validateForgotPassword = [
    check('email')
        .isEmail().withMessage('Email inválido.')
        .normalizeEmail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return next(Boom.badRequest(errors.array()[0].msg));
        }
        next();
    }
];