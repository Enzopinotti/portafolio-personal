import { Router } from 'express';
import { listarAuditLogs } from '../controllers/auditLogController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para obtener los logs de auditoría, con filtrado opcional por userId
// Ejemplo: GET /api/audit-logs?userId=5&page=1&limit=20
router.get('/', verificarToken, listarAuditLogs);

export default router;
