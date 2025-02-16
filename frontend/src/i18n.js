// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Si quisieras cargar archivos JSON desde el servidor, usarías i18next-http-backend
// import HttpBackend from 'i18next-http-backend';

// Si quisieras detectar automáticamente el idioma del navegador, usarías i18next-browser-languagedetector
// import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

i18n
  // .use(HttpBackend)        // Para cargar archivos JSON desde un servidor
  // .use(LanguageDetector)   // Para detectar idioma del navegador
  .use(initReactI18next)      // Para integrar con React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: 'es',                // Idioma por defecto
    fallbackLng: 'es',        // Si no se encuentra la clave, usar español
    interpolation: {
      escapeValue: false,     // React ya hace el escape
    },
  });

export default i18n;
