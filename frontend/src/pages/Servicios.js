// src/pages/Servicios.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listServicios } from '../services/servicioService.js';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    listServicios()
      .then(data => setServicios(data.servicios || data))
      .catch(err => console.error('Error al cargar servicios:', err));
  }, []);

  const sliderItems = servicios.map(servicio => ({
    id: servicio.idServicio,
    titulo: servicio.nombre,
    descripcion: servicio.descripcion,
  }));

  return (
    <motion.div
      className="page servicios-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="servicios-container">
        <div className="servicios-right">
          <h2 className="titulo-servicios">Mis Servicios</h2>
          <VerticalInfiniteSlider items={sliderItems} />
        </div>
      </div>
    </motion.div>
  );
};

export default Servicios;
