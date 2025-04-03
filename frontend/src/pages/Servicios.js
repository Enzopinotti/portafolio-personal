import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listServicios } from '../services/servicioService.js';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    listServicios()
      .then(data => {
        const mapped = data.servicios.map(servicio => ({
          id: servicio.idServicio,
          titulo: servicio.nombre,
          descripcion: servicio.descripcion,
          // Si en el futuro deseas usar la imagen, por ejemplo:
          imagen: servicio.Imagen ? servicio.Imagen.ruta : null,
        }));
        setServicios(mapped);
      })
      .catch(err => console.error('Error al cargar servicios:', err));
  }, []);

  return (
    <motion.div
      className="page servicios-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="servicios-container">
        <div className="servicios-left">
          <h2 className="titulo-servicios">Mis Servicios</h2>
          {/* Aquí puedes agregar otros elementos de info si lo deseas */}
        </div>
        <div className="servicios-right">
          <VerticalInfiniteSlider items={servicios} />
        </div>
      </div>
    </motion.div>
  );
};

export default Servicios;