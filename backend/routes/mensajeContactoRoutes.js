// routes/mensajeContactoRoutes.js

import { Router } from 'express';
import {
  enviarMensaje,
  listarMensajes,
  verMensaje,
  eliminarMensaje,
} from '../controllers/mensajeContactoController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para enviar un mensaje de contacto
router.post('/enviar', enviarMensaje);

// Ruta para listar todos los mensajes de contacto (requiere autenticación)
router.get('/', verificarToken, listarMensajes);

// Ruta para ver detalles de un mensaje específico (requiere autenticación)
router.get('/:id', verificarToken, verMensaje);

// Ruta para eliminar un mensaje de contacto (requiere autenticación)
router.delete('/:id', verificarToken, eliminarMensaje);

export default router;
