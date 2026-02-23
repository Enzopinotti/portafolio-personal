// src/components/layouts/Background.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ background }) => {


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
          poster={background.url.replace('.mp4', '.webp')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="background"
          style={{ objectFit: 'cover', width: '100%', height: '100%', backgroundColor: '#111' }}
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
