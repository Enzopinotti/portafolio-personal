// src/components/layouts/Background.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ background }) => {


  const isVideo = background.url.toLowerCase().endsWith('.mp4') || background.url.toLowerCase().endsWith('.webm');

  return (
    <AnimatePresence>
      {isVideo ? (
        <motion.video
          key={background.key}
          autoPlay
          loop
          muted
          playsInline
          poster={background.url.replace(/\.(mp4|webm)$/, '.webp')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="background"
          style={{
            position: 'absolute', // Importante para que NO empujen contenido al estar ambos presentes
            inset: 0,
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            backgroundColor: '#000'
          }}
        >
          <source src={background.url} type="video/webm" />
          Tu navegador no soporta videos.
        </motion.video>
      ) : (
        <motion.div
          key={background.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="background"
          style={{
            position: 'absolute',
            inset: 0,
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
