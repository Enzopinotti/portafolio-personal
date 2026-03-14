import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { listServicios } from '../services/servicioService.js';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';
import ServicioCard from '../components/ServicioCard.js'; // Added as per instruction
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext.js';
import Loader from '../components/shared/Loader.js';

const Servicios = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialServiceId = queryParams.get('id');

  const { navigationDirection } = useContext(NavigationContext); // Added as per instruction
  const [servicios, setServicios] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1080);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    listServicios()
      .then(data => {
        // Fallback robusto para el mapeo de campos de imagen
        const mapped = data.servicios.map(servicio => {
          const imgPath = (servicio.Imagen && servicio.Imagen.ruta) || (servicio.imagen && servicio.imagen.ruta) || null;
          return {
            id: servicio.idServicio,
            titulo: servicio.nombre,
            descripcion: servicio.descripcion,
            imagen: imgPath,
          };
        });
        setServicios(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar servicios:', err);
        setLoading(false);
      });
  }, []);

  const renderDesktopTitles = () => {
    return [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].map((opacity, i) => (
      <h2
        key={i}
        className={`titulo-servicios op${opacity.toString().replace('.', '_')}`}
        style={{ zIndex: 10 - i }}
      >
        {t('services.title')}
      </h2>
    ));
  };

  const renderMobileTitles = () => {
    return [1, 0.7, 0.4, 0.1].map((opacity, i) => (
      <h2
        key={i}
        className={`titulo-servicios op${opacity.toString().replace('.', '_')}`}
        style={{ zIndex: 4 - i }}
      >
        {t('services.title')}
      </h2>
    ));
  };

  return (
    <motion.div
      className="page servicios-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} // Kept original exit prop, as instruction was malformed
      transition={{ duration: 0.5, ease: 'easeInOut' }} // Kept original ease, as instruction omitted it
    >
      <div className="servicios-container">
        <div className="servicios-left">
          {isDesktop ? renderDesktopTitles() : renderMobileTitles()}
        </div>
        <div className="servicios-right">
          <div className="servicios-slider-wrapper">
            {loading ? (
              <Loader variant="white" message={t('adminServiciosModal.loading', 'Cargando servicios...')} />
            ) : (
              <VerticalInfiniteSlider
                items={servicios}
                initialExpandedId={initialServiceId}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Servicios;
