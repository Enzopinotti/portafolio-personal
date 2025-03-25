// src/components/GaleriaProyecto.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const GaleriaProyecto = ({ imagenes }) => {
  return (
    <div className="galeria-proyecto">
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        effect={'coverflow'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        loop
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

        <div className="swiper-button-prev"><FaArrowLeft /></div>
        <div className="swiper-button-next"><FaArrowRight /></div>
      </Swiper>
    </div>
  );
};

export default GaleriaProyecto;
