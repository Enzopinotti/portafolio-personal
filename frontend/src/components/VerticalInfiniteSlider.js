import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import ServicioCard from './ServicioCard.js';

const VerticalInfiniteSlider = ({ items, velocidad = 30 }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Triplicamos los items para el efecto infinito
  const triplicatedItems = [...items, ...items, ...items];

  const startAnimation = useCallback(async () => {
    if (!trackRef.current) return;

    const trackHeight = trackRef.current.scrollHeight;
    const oneThirdHeight = trackHeight / 3;

    await controls.start({
      y: -oneThirdHeight,
      transition: {
        duration: velocidad,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    });
  }, [controls, velocidad]);

  useEffect(() => {
    // Si estamos arrastrando O si hay una tarjeta expandida, paramos.
    if (!isDragging && expandedId === null) {
      startAnimation();
    } else {
      controls.stop();
    }
  }, [isDragging, expandedId, startAnimation, controls]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Si el drag empieza fuera de una tarjeta expandida, cerramos cualquier expansión.
    // Esto permite que el usuario pueda arrastrar el fondo para cerrar.
    if (!e.target.closest('.servicio-card.is-expanded')) {
      setExpandedId(null);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const [constraints, setConstraints] = useState({ top: 0, bottom: 0 });

  const updateConstraints = () => {
    if (trackRef.current) {
      const h = trackRef.current.scrollHeight;
      setConstraints({
        top: -(h * (2 / 3)),
        bottom: h / 3
      });
    }
  };

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [items]);

  return (
    <div className="vertical-slider-container" ref={containerRef} style={{ overflow: 'hidden' }}>
      <motion.div
        className="vertical-slider-track"
        drag="y"
        dragConstraints={constraints}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y, cursor: isDragging ? 'grabbing' : 'grab' }}
        whileTap={{ cursor: 'grabbing' }}
        ref={trackRef}
      >
        {triplicatedItems.map((item, idx) => (
          <ServicioCard
            key={idx}
            servicio={item}
            isExpanded={expandedId === idx}
            onToggle={() => {
              setExpandedId(expandedId === idx ? null : idx);
              updateConstraints();
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalInfiniteSlider;
