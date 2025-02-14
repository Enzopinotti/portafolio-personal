// utils/auditLogger.js
import AuditLog from '../models/AuditLog.js';

export async function registrarEvento({ userId, action, target, details, req }) {
  try {
    // Para obtener la IP:
    // Si el servidor está detrás de un proxy, puede que debas usar req.headers['x-forwarded-for']
    const ipAddress = req.headers['x-forwarded-for'] || req.ip || null;
    await AuditLog.create({
      user_id: userId || null,
      action,
      target,
      details,
      ip_address: ipAddress,
      user_agent: req.headers['user-agent'] || null
    });
  } catch (error) {
    console.error('Error registrando el evento de auditoría:', error);
  }
}
