// backend/controllers/noticiaController.js
const { Noticia } = require('../models');

// Obtener las últimas noticias
const getLatestNoticias = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    const noticias = await Noticia.findAll({
      order: [['fecha', 'DESC']],
      limit: limit,
      attributes: ['idNoticia', 'titulo', 'enlace', 'imagen', 'fecha', 'fuente']
    });
    
    res.json({
      success: true,
      data: noticias
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error del servidor al obtener las noticias' });
  }
};

module.exports = {
  getLatestNoticias
};
