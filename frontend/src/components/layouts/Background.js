// src/components/layouts/Background.js
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoBackgroundWrapper = ({ background }) => {
  const videoRef = useRef(null);
  // Póster predeterminado (posiblemente negro o fallido)
  const [poster, setPoster] = useState(background.url.replace('.mp4', '.webp'));

  useEffect(() => {
    // Intentamos extraer un frame REAL que no sea el segundo 0 (pantalla negra)
    const v = document.createElement('video');
    v.src = background.url;
    v.muted = true;
    v.crossOrigin = 'anonymous';

    v.addEventListener('loadedmetadata', () => {
      v.currentTime = 2; // Saltamos a los 2 segundos para buscar un frame colorido
    });

    v.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        if (canvas.width > 0 && canvas.height > 0) {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL('image/jpeg');
          // Validamos que el frame se haya pintado
          if (dataURL.length > 1000) {
            setPoster(dataURL);
          }
        }
      } catch (err) {
        console.warn('No se pudo generar el thumbnail automático:', err);
      }
    });

  }, [background.url]);

  useEffect(() => {
    // Forzar autoplay a prueba de fallos de forma compatible con React
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(e => console.warn('Navegador previno el autoplay:', e));
      }
    }
  }, [background.url]);

  return (
    <motion.video
      key={background.key}
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="background"
      style={{ objectFit: 'cover', width: '100%', height: '100%', backgroundColor: '#000', position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <source src={background.url} type="video/mp4" />
      Tu navegador no soporta videos.
    </motion.video>
  );
};

const Background = ({ background }) => {
  const isVideo = background.url.toLowerCase().endsWith('.mp4');

  return (
    <AnimatePresence>
      {isVideo ? (
        <VideoBackgroundWrapper background={background} />
      ) : (
        <motion.div
          key={background.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
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

