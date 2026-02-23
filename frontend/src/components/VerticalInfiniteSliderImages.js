import React from 'react';
import { motion } from 'framer-motion';

const VerticalInfiniteSliderImages = ({ imagenes = [], velocidad = 40 }) => {
  // Guardamos de undefined/null
  const safeImagenes = Array.isArray(imagenes) ? imagenes : [];
  // Duplicamos los elementos para lograr el efecto infinito
  const duplicatedItems = [...safeImagenes, ...safeImagenes];

  if (safeImagenes.length === 0) return null;

  return (
    <div className="vertical-slider-container">
      <motion.div
        className="vertical-slider-track"
        animate={{ y: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: velocidad, ease: 'linear' }}
      >
        {duplicatedItems.map((imagen, idx) => (
          <div key={idx} className="slider-image-item">
            <img
              src={imagen.url}
              alt={imagen.alt || `Imagen ${idx + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalInfiniteSliderImages;