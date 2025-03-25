// src/components/ServicioCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ServicioCard = ({ servicio }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped(prev => !prev);

  return (
    <motion.div
      className={`servicio-card ${isFlipped ? 'flipped' : ''}`}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={flipCard}
    >
      <div className="card-inner">
        <div className="card-front">
          <h3>{servicio.titulo}</h3>
        </div>
        <div className="card-back">
          <p>{servicio.descripcion}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicioCard;
