// config/i18n.js
import i18n from 'i18n';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

i18n.configure({
  // Idiomas soportados
  locales: ['es', 'en', 'pt'],
  // Idioma por defecto (en tu caso, español)
  defaultLocale: 'es',
  // Directorio donde se encuentran los archivos de traducción
  directory: path.join(process.cwd(), 'locales'),
  // Permite recargar automáticamente los archivos de traducción en desarrollo si quiero 
  autoReload: process.env.NODE_ENV === 'development',
  // No actualizar archivos automáticamente (útil en producción)
  updateFiles: false,
  // Usa notación de objetos para facilitar el anidamiento de claves
  objectNotation: true,
  // Configura cómo se determina el idioma; i18n utiliza la cabecera "Accept-Language" de forma predeterminada
  queryParameter: 'lang'
});

export default i18n;
