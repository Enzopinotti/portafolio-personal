// src/components/SliderInfinito.jsx
import React from 'react';

/**
 * Props:
 * - slides: array de objetos (ejemplo: { id, titulo, desc }).
 * - velocidad: duración de la animación (ej. '10s').
 * - direccion: 'izq' para mover de izquierda a derecha o 'der' para mover de derecha a izquierda.
 * - onSlideClick: función que se ejecuta al hacer clic en un slide.
 *
 * NOTA: El número de slides visibles se controla vía CSS (media queries).
 */
const SliderInfinito = ({
  slides,
  velocidad = '10s',
  direccion = 'izq',
  onSlideClick,
}) => {
  // Duplicamos la lista de slides para lograr el efecto infinito (2 copias)
  const slidesDuplicados = [...slides, ...slides];

  // La clase 'sliderB' se aplicará si la dirección es "der" para invertir la animación.
  const claseDireccion = direccion === 'der' ? 'sliderB' : 'sliderA';

  return (
    <div
      className={`slider-container ${claseDireccion}`}
      // Calculamos --scroll-distance usando la cantidad de slides originales
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
            <div className="proyecto-pill">
              <h3>{item.titulo}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderInfinito;
