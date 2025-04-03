// src/components/GaleriaProyecto.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // sin EffectCoverflow
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GaleriaProyecto = ({ imagenes }) => {
  if (!imagenes || !imagenes.length) return null;

  return (
    <div className="galeria-proyecto">
      <Swiper
        modules={[Navigation, Pagination]}
        // Flechas next/prev nativas de Swiper
        navigation={true}
        // Muestra los “puntos” en la parte inferior
        pagination={{ clickable: true }}
        // Desactivar loop => flechas se deshabilitan al llegar a 1er o última
        loop={false}
        // Espacio entre slides
        spaceBetween={20}
        slidesPerView={1}
      >
        {imagenes.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img.ruta}
              alt={img.descripcion || `Imagen ${idx + 1}`}
              className="imagen-slide"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GaleriaProyecto;
