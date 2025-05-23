// src/components/VerticalInfiniteSlider.js
import React from 'react';
import { motion } from 'framer-motion';
import ServicioCard from './ServicioCard.js';

const VerticalInfiniteSlider = ({ items, velocidad = 40 }) => {
  // Triplicar los items: en vez de [...items, ...items]
  const triplicatedItems = [...items, ...items, ...items];
  return (
    <div className="vertical-slider-container">
      <motion.div
        className="vertical-slider-track"
        animate={{ y: ['0%', '-33.33%'] }} // Ajusta el porcentaje si es necesario para un scroll suave
        transition={{ repeat: Infinity, duration: velocidad, ease: 'linear' }}
      >
        {triplicatedItems.map((item, idx) => (
          <ServicioCard key={idx} servicio={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalInfiniteSlider;
