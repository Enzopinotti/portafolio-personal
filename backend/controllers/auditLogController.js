import AuditLog from '../models/AuditLog.js';
import logger from '../config/logger.js';
import { Op } from 'sequelize';

/**
 * Listar los logs de auditoría, con opción de filtrar por userId.
 * Además se implementa paginación (page y limit) opcional.
 */
export const listarAuditLogs = async (req, res) => {
  try {
    // Parámetros opcionales: page, limit, userId
    const { page = 1, limit = 20, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }

    // Buscar logs con paginación
    const { rows, count } = await AuditLog.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    logger.info(`Listado de audit logs: ${rows.length} registros encontrados (total: ${count}).`);

    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      logs: rows
    });
  } catch (error) {
    logger.error(`Error al listar audit logs: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
