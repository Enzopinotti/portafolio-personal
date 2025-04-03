// ServicioCard.jsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

const ServicioCard = ({ servicio }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const backRef = useRef(null);

  const [cardHeight, setCardHeight] = useState(150);

  useLayoutEffect(() => {
    if (isFlipped && backRef.current) {
      const backHeight = backRef.current.scrollHeight;
      if (backHeight && cardRef.current) {
        setCardHeight(backHeight + 100); // margen
      }
    } else {
      setCardHeight(150); // altura por defecto al frente
    }
  }, [isFlipped, servicio.descripcion]);

  const flipCard = () => setIsFlipped(prev => !prev);

  return (
    <motion.div
      className={`servicio-card ${isFlipped ? 'flipped' : ''}`}
      ref={cardRef}
      animate={{ height: cardHeight }}
      transition={{ duration: 0.4 }}
      style={{ height: cardHeight }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={flipCard}
    >
      <div className="card-inner">
        {/* FRONT */}
        <div
          className="card-front"
          style={{
            backgroundImage: servicio.imagen ? `url(${servicio.imagen})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="overlay front" />
          <h3>{servicio.titulo}</h3>
        </div>

        {/* BACK */}
        <div
          className="card-back"
          ref={backRef}
          style={{
            backgroundImage: servicio.imagen ? `url(${servicio.imagen})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="overlay back" />
          <p>{servicio.descripcion}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicioCard;
