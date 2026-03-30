// src/components/layouts/Background.js
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoBackgroundWrapper = ({ background }) => {
  const videoRef = useRef(null);

  // Forzar play cada vez que cambia la URL (nueva ruta)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.load(); // Recarga el source cuando cambia
    const p = video.play();
    if (p !== undefined) {
      p.catch(e => console.warn('Autoplay bloqueado:', e));
    }
  }, [background.url]);

  return (
    <motion.video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={background.url.replace(/\.mp4$/i, '.webp')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="background"
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'absolute',
        inset: 0,
        zIndex: 0
      }}
    >
      <source src={background.url} type="video/mp4" />
      Tu navegador no soporta videos.
    </motion.video>
  );
};

const Background = ({ background }) => {
  const isVideo = background.url.toLowerCase().endsWith('.mp4');

  return (
    <AnimatePresence mode="wait">
      {isVideo ? (
        // key en el wrapper → AnimatePresence lo desmonta/remonta al cambiar de ruta
        <VideoBackgroundWrapper key={background.key} background={background} />
      ) : (
        <motion.div
          key={background.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="background"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${background.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            zIndex: 0
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default Background;
