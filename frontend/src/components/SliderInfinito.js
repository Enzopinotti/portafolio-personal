// src/components/SliderInfinito.js
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

const SliderInfinito = ({
  slides,
  velocidad = '40s',
  direccion = 'izq',
  onSlideClick,
}) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Triplicamos slides para que nunca se vean los extremos
  const slidesDuplicados = [...slides, ...slides, ...slides];

  // Pixels por segundo: tomamos la velocidad como string "40s" → 40s para recorrer 1/3 del track
  // Se ajusta dinamicamente según el scrollWidth real
  const durSec = parseFloat(velocidad) || 40;

  // Auto-scroll frame-a-frame: mismo motionValue => compatible con drag
  useAnimationFrame((_, delta) => {
    if (isDraggingRef.current || !trackRef.current) return;

    const trackWidth = trackRef.current.scrollWidth;
    const oneThird = trackWidth / 3;
    if (oneThird === 0) return;

    // Velocidad: recorre 1/3 del track en `durSec` segundos
    const pxPerMs = oneThird / (durSec * 1000);
    const step = pxPerMs * delta * (direccion === 'izq' ? -1 : 1);

    let newX = x.get() + step;

    // Normalización del loop infinito
    if (newX <= -oneThird * 2) newX += oneThird;
    if (newX >= 0) newX -= oneThird;

    x.set(newX);
  });

  // Constraints del drag: hard stops en los extremos. 
  // right=-1 evita que el primer slide quede parcialmente fuera sin texto
  const getDragConstraints = () => {
    if (!trackRef.current) return { left: -9999, right: -1 };
    const oneThird = trackRef.current.scrollWidth / 3;
    return {
      left: -(oneThird * 2) + 1, // No sobrepasar el inicio del tercer set
      right: -1,                  // No permite ver el comienzo vacío
    };
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handlePointerDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleSlidePointerUp = (e, item) => {
    const dist = Math.hypot(
      e.clientX - dragStartPos.current.x,
      e.clientY - dragStartPos.current.y
    );
    if (dist < 8 && onSlideClick) {
      onSlideClick(item);
    }
  };

  return (
    <div
      className={`slider-container ${direccion === 'der' ? 'sliderB' : 'sliderA'}`}
      ref={containerRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        className="slider-track"
        ref={trackRef}
        style={{ x }}
        drag="x"
        dragConstraints={getDragConstraints()}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        whileTap={{ cursor: 'grabbing' }}
      >
        {slidesDuplicados.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="slide"
            onPointerUp={(e) => handleSlidePointerUp(e, item)}
          >
            <div className="proyecto-pill">
              {item.imagen?.toLowerCase().match(/\.(mp4|webm|mov|ogg|quicktime)$/) || item.imagen?.includes('/video/upload/') ? (
                <video
                  src={item.imagen}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="pill-video"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0
                  }}
                />
              ) : (
                <div
                  className="pill-bg"
                  style={{
                    backgroundImage: `url(${item.imagen})`,
                    backgroundSize: '110%',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0
                  }}
                />
              )}
              <div className="rayo" style={{ zIndex: 1 }} />
              <div className="pill-overlay" style={{ zIndex: 2 }}>
                <h3>{item.titulo}</h3>
                <div 
                  className="pill-desc" 
                  dangerouslySetInnerHTML={{ 
                    __html: item.descripcion?.length > 110 
                      ? item.descripcion.substring(0, 110) + '...' 
                      : item.descripcion 
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SliderInfinito;
