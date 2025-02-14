// routes/index.js
import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import skillRoutes from './skillRoutes.js';
import proyectoRoutes from './proyectoRoutes.js';
import mensajeContactoRoutes from './mensajeContactoRoutes.js';
import testimonioRoutes from './testimonioRoutes.js';
import articuloRoutes from './articuloRoutes.js';
import servicioRoutes from './servicioRoutes.js';
import rolRoutes from './rolRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';

const router = Router();

// Agrupar rutas bajo el prefijo /api
router.use('/usuarios', usuarioRoutes);
router.use('/skills', skillRoutes);
router.use('/proyectos', proyectoRoutes);
router.use('/mensajes', mensajeContactoRoutes);
router.use('/testimonios', testimonioRoutes);
router.use('/articulos', articuloRoutes);
router.use('/servicios', servicioRoutes);
router.use('/roles', rolRoutes);
router.use('/auditLogs', auditLogRoutes);

export default router;
