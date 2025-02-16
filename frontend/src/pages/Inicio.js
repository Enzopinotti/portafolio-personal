// src/pages/Inicio.js
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import { useTranslation } from 'react-i18next';
import TypewriterWithThinking from '../components/TypewriterWithThinking.js';

const Inicio = () => {
  const { navigationDirection } = useContext(NavigationContext);
  const { t, i18n } = useTranslation();
  console.log('API URL:', process.env.REACT_APP_API_URL);
  const variants = {
    initial: { y: navigationDirection === 'forward' ? '100vh' : '-100vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: navigationDirection === 'forward' ? '-100vh' : '100vh', opacity: 0 },
  };

  let words = [];
  const language = i18n.language;
  if (language.startsWith('en')) {
    words = ["Industrial Engineer", "Fullstack Developer", "Systems Analyst", "UX/UI Designer"];
  } else if (language.startsWith('pt')) {
    words = ["Engenheiro Industrial", "Desenvolvedor Fullstack", "Analista de Sistemas", "Designer UX/UI"];
  } else {
    // Español
    words = ["Ingeniero industrial", "Desarrollador Fullstack", "Analista de Sistemas", "Diseñador UX/UI"];
  }

  // Configuración personalizada para el efecto
  const typewriterConfig = {
    thinkingDuration: 1900,
    typingSpeed: 150,
    erasingSpeed: 50,
    pauseDuration: 1500,
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