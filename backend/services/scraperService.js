// backend/services/scraperService.js
const axios = require('axios');
const cheerio = require('cheerio');
const { Noticia } = require('../models');

/**
 * Función para scrapear artículos de dev.to
 * Extrae título, enlace, imagen y autor/fuente
 */
const scrapeTechNews = async () => {
  try {
    console.log('[Scraper] Iniciando scraping de noticias en dev.to...');
    
    // Obtenemos el HTML de la página principal de dev.to
    const { data } = await axios.get('https://dev.to/t/javascript');
    const $ = cheerio.load(data);
    
    // Buscamos los contenedores de los artículos
    const articles = [];
    $('.crayons-story').each((i, el) => {
      if (typeof i === 'number' && i >= 10) return false; // Solo tomar los primeros 10 artículos
      
      const titleElement = $(el).find('.crayons-story__title a');
      const titulo = titleElement.text().trim();
      const enlacePath = titleElement.attr('href');
      const enlace = enlacePath ? `https://dev.to${enlacePath}` : null;
      
      // Buscar imagen, en dev.to a veces está en un div de cover o en un tag img
      let imagen = $(el).find('.crayons-story__cover img').attr('src');
      if (!imagen) {
          // Fallback a imagen de autor si no hay cover
          imagen = $(el).find('.crayons-avatar img').attr('src');
      }

      // Fuente y fecha
      const fuenteRaw = $(el).find('.crayons-story__secondary').text().trim();
      const fuente = fuenteRaw ? `dev.to (${fuenteRaw})` : 'dev.to';

      const fechaRaw = $(el).find('time').attr('datetime');
      const fecha = fechaRaw ? new Date(fechaRaw) : new Date();

      if (titulo && enlace) {
        articles.push({
          titulo,
          enlace,
          imagen,
          fecha,
          fuente
        });
      }
    });

    console.log(`[Scraper] Se encontraron ${articles.length} artículos. Guardando en BD...`);

    let noticiasGuardadas = 0;
    // Guardar en la base de datos (evitando duplicados)
    for (const article of articles) {
      // Usar findOrCreate basado en el enlace para evitar duplicados exactos
      const [noticiaRow, created] = await Noticia.findOrCreate({
        where: { enlace: article.enlace },
        defaults: article
      });
      if (created) noticiasGuardadas++;
    }

    console.log(`[Scraper] Scraping finalizado. ${noticiasGuardadas} nuevas noticias guardadas.`);
  } catch (error) {
    console.error('[Scraper] Error durante el scraping:', error.message);
  }
};

module.exports = {
  scrapeTechNews
};
