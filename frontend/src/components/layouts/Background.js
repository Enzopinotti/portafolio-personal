// src/components/layouts/Background.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ background }) => {
  // Si es la página de contacto, renderizamos el fondo dividido
  if (background.key === 'contacto') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={background.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="background-split"
        >
          <div
            className="background-image"
            style={{ backgroundImage: `url(${background.url})` }}
          />
          <div className="background-solid" />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Si es un video
  const isVideo = background.url.toLowerCase().endsWith('.mp4');
  return (
    <AnimatePresence mode="wait">
      {isVideo ? (
        <motion.video
          key={background.key}
          autoPlay
          loop
          muted
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="background"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        >
          <source src={background.url} type="video/mp4" />
          Tu navegador no soporta videos.
        </motion.video>
      ) : (
        <motion.div
          key={background.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="background"
          style={{
            backgroundImage: `url(${background.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default Background;
