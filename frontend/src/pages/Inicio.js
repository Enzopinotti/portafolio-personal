import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NavigationContext } from '../context/NavigationContext.js';
import { SettingsContext } from '../context/SettingsContext.js';
import TypewriterWithThinking from '../components/TypewriterWithThinking.js';

const Inicio = () => {
  const { navigationDirection } = useContext(NavigationContext);
  const { settings } = useContext(SettingsContext);
  const { t, i18n } = useTranslation();

  const variants = {
    initial: { y: navigationDirection === 'forward' ? '100vh' : '-100vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: navigationDirection === 'forward' ? '-100vh' : '100vh', opacity: 0 },
  };

  const currentLang = i18n.language.split('-')[0].toLowerCase();

  let words = [];
  if (settings) {
    const rawWords =
      currentLang === 'en' ? settings.typewriterWordsEN :
        currentLang === 'pt' ? settings.typewriterWordsPT :
          settings.typewriterWordsES;

    if (rawWords) {
      words = rawWords.split(',').map(w => w.trim());
    }
  }

  // Fallback if settings not loaded or empty
  if (words.length === 0) {
    if (currentLang === 'en') {
      words = ["Industrial Engineer", "Fullstack Developer", "Systems Analyst", "UX/UI Designer"];
    } else if (currentLang === 'pt') {
      words = ["Engenheiro Industrial", "Desenvolvedor Fullstack", "Analista de Sistemas", "Designer UX/UI"];
    } else {
      words = ["Ingeniero industrial", "Desarrollador Fullstack", "Analista de Sistemas", "Diseñador UX/UI"];
    }
  }

  // Configuración personalizada para el efecto
  const typewriterConfig = {
    thinkingDuration: 1900,
    typingSpeed: 100,
    erasingSpeed: 30,
    pauseDuration: 1000,
  };

  return (
    <motion.div
      className="home-container"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1>{t('home.welcome')}</h1>
      <p>
        {t('home.intro')}
        <TypewriterWithThinking words={words} config={typewriterConfig} />
      </p>
    </motion.div>
  );
};

export default Inicio;