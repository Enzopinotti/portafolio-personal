import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'user_id'
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'action'
  },
  target: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'target'
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'details'
  },
  ipAddress: {
    type: DataTypes.STRING(45), // IPv4/IPv6
    allowNull: true,
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'user_agent'
  },
}, {
  tableName: 'audit_logs',
  timestamps: true, // agrega createdAt, updatedAt
});

export default AuditLog;
