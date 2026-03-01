// src/components/layouts/Background.js
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoBackground = ({ src, poster }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Forzar load() y play() cuando el video se monta o cambia de src
    if (videoRef.current) {
      videoRef.current.load(); // Crucial cuando se usa <source>
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Video autoplay prevented:", error);
        });
      }
    }
  }, [src]);

  return (
    <motion.video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="background"
      style={{
        position: 'absolute',
        inset: 0,
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        backgroundColor: '#000'
      }}
    />
  );
};

const Background = ({ background }) => {
  const isVideo = background.url.toLowerCase().endsWith('.mp4') || background.url.toLowerCase().endsWith('.webm');

  return (
    <AnimatePresence>
      {isVideo ? (
        <VideoBackground
          key={background.key}
          src={background.url}
          poster={background.url.replace(/\.(mp4|webm)$/, '.webp')}
        />
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
