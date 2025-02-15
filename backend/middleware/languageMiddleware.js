// middlewares/languageMiddleware.js
import i18n from '../config/i18n.js';

// Middleware que cambia el idioma de la petición basándose en el parámetro de consulta "lang".
// Si se recibe "?lang=en" y "en" es un idioma soportado, se establece ese idioma para la respuesta.
const languageMiddleware = (req, res, next) => {
  if (req.query.lang && i18n.getLocales().includes(req.query.lang)) {
    req.setLocale(req.query.lang);
  }
  next();
};

export default languageMiddleware;
