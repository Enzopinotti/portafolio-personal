// src/pages/Inicio.js

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';

const Inicio = () => {
  const { navigationDirection } = useContext(NavigationContext);

  const variants = {
    initial: {
      y: navigationDirection === 'forward' ? '100vh' : '-100vh',
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: navigationDirection === 'forward' ? '-100vh' : '100vh',
      opacity: 0,
    },
  };

  return (
    <motion.div
      className="page inicio-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1>Página de Inicio</h1>
      <p>Bienvenido a mi portafolio.</p>
    </motion.div>
  );
};

export default Inicio;
