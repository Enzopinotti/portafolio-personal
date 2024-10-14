// src/pages/Contacto.js

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';

const Contacto = () => {
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
      className="page contacto-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1>Contacto</h1>
      <p>Ponte en contacto conmigo.</p>
    </motion.div>
  );
};

export default Contacto;
