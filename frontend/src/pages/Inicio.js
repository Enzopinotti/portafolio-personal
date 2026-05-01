import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NavigationContext } from '../context/NavigationContext.js';
import TypewriterWithThinking from '../components/TypewriterWithThinking.js';

const Inicio = () => {
  const { navigationDirection, setNavigationDirection } = useContext(NavigationContext);
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { y: navigationDirection === 'forward' ? '100vh' : '-100vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : { y: navigationDirection === 'forward' ? '-100vh' : '100vh', opacity: 0 },
  };

  const heroVariants = {
    initial: {},
    animate: {
      transition: shouldReduceMotion ? {} : { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' },
  };

  const translatedWords = t('home.typewriterWords', { returnObjects: true });
  const words = Array.isArray(translatedWords) && translatedWords.length > 0
    ? translatedWords
    : ['Sistemas de gestión'];

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
      <div className="home-video-overlay" aria-hidden="true" />

      <motion.section className="home-hero" variants={heroVariants}>
        <motion.span className="home-hero__badge" variants={itemVariants}>
          {t('home.badge')}
        </motion.span>

        <motion.h1 variants={itemVariants}>{t('home.title')}</motion.h1>

        <motion.p className="home-hero__lead" variants={itemVariants}>
          {t('home.lead')}
        </motion.p>

        <motion.p className="home-hero__typewriter" variants={itemVariants}>
          <span>{t('home.typewriterIntro')}</span>
          <TypewriterWithThinking words={words} config={typewriterConfig} />
        </motion.p>


        <motion.div className="home-hero__actions" variants={itemVariants}>
          <Link
            className="home-cta home-cta--primary"
            to="/servicios"
            onClick={() => setNavigationDirection('forward')}
          >
            {t('home.ctaSolutions')}
          </Link>
          <Link
            className="home-cta home-cta--secondary"
            to="/proyectos"
            onClick={() => setNavigationDirection('forward')}
          >
            {t('home.ctaProjects')}
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Inicio;
