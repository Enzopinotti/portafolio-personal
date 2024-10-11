import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};
