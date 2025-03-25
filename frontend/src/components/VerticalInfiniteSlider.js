// src/components/VerticalInfiniteSlider.js
import React from 'react';
import { motion } from 'framer-motion';
import ServicioCard from './ServicioCard.js';

const VerticalInfiniteSlider = ({ items, velocidad = 40 }) => {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="vertical-slider-container">
      <motion.div
        className="vertical-slider-track"
        animate={{ y: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: velocidad, ease: 'linear' }}
      >
        {duplicatedItems.map((item, idx) => (
          <ServicioCard key={idx} servicio={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalInfiniteSlider;
