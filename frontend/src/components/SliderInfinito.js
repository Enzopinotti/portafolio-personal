// src/components/SliderInfinito.jsx
import React from 'react';

const SliderInfinito = ({
  slides,
  velocidad = '10s',
  direccion = 'izq',
  onSlideClick,
}) => {
  const slidesDuplicados = [...slides, ...slides];
  const claseDireccion = direccion === 'der' ? 'sliderB' : 'sliderA';

  return (
    <div
      className={`slider-container ${claseDireccion}`}
      style={{
        '--scroll-distance': `calc(${slides.length * 100}% / var(--slides-por-pantalla))`,
      }}
    >
      <div className="slider-track" style={{ animationDuration: velocidad }}>
        {slidesDuplicados.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="slide"
            onClick={() => onSlideClick && onSlideClick(item)}
          >
            <div
              className="proyecto-pill"
              style={{
                backgroundImage: `url(${item.imagen})`,
                backgroundSize: '110%',
                backgroundPosition: 'center',
              }}
            >
              <div className="rayo" />
              <div className="pill-overlay">
                <h3>{item.titulo}</h3>
                <p className="pill-desc">{item.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderInfinito;
