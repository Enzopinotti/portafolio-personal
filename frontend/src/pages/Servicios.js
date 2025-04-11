import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listServicios } from '../services/servicioService.js';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1080);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    listServicios()
      .then(data => {
        const mapped = data.servicios.map(servicio => ({
          id: servicio.idServicio,
          titulo: servicio.nombre,
          descripcion: servicio.descripcion,
          imagen: servicio.Imagen ? servicio.Imagen.ruta : null,
        }));
        setServicios(mapped);
      })
      .catch(err => console.error('Error al cargar servicios:', err));
  }, []);

  const renderDesktopTitles = () => {
    const titles = [];
    for (let i = 0; i < 10; i++) {
      const opacity = (1 - i * 0.1).toFixed(1);
      const className = `titulo-servicios op${opacity.replace('.', '_')}`;
      titles.push(
        <h2
          key={i}
          className={className}
          data-opacity={opacity} // Guardamos la opacidad base
        >
          Mis Servicios
        </h2>
      );
    }
    return titles;
  };

  const renderMobileTitles = () => (
    <>
      <h2 className="titulo-servicios mobile op1">Mis Servicios</h2>
      <h2 className="titulo-servicios mobile op0_8">Mis Servicios</h2>
      <h2 className="titulo-servicios mobile op0_4">Mis Servicios</h2>
      <h2 className="titulo-servicios mobile op0_2">Mis Servicios</h2>
    </>
  );

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
        {isDesktop ? renderDesktopTitles() : renderMobileTitles()}
        </div>
        <div className="servicios-right">
          <VerticalInfiniteSlider items={servicios} />
        </div>
      </div>
    </motion.div>
  );
};

export default Servicios;
