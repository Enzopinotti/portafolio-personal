// src/components/ImagenCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ImagenCard = ({ imagen }) => {
  return (
    <motion.div
      className="imagen-card"
      whileHover={{
        rotateY: 5,
        scale: 1.1,
        y: -5,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      <img src={imagen.ruta} alt={imagen.descripcion || 'Imagen Card'} />
    </motion.div>
  );
};

export default ImagenCard;
