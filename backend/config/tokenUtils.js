// utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export function generarAccessToken(payload) {
  // Expira en 15 minutos o 1 hora, según gustes
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
}

export function generarRefreshToken(payload) {
  // Expira en 7 días o el tiempo que quieras
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
