import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { listServicios } from '../services/servicioService.js';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';
import ServicioCard from '../components/ServicioCard.js'; // Added as per instruction
import { useTranslation } from 'react-i18next';
import { NavigationContext } from '../context/NavigationContext.js';

const Servicios = () => {
  const { t } = useTranslation();
  const { navigationDirection } = useContext(NavigationContext); // Added as per instruction
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

  // renderDesktopTitles and renderMobileTitles functions are removed as they are no longer used.

  return (
    <motion.div
      className="page servicios-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} // Kept original exit prop, as instruction was malformed
      transition={{ duration: 0.5, ease: 'easeInOut' }} // Kept original ease, as instruction omitted it
    >
      <h1 className="servicios-title">{t('services.title')}</h1>
      <p className="servicios-description">
        {t('home.intro').includes('en') ? 'Discover the different ways I can help you boost your business or digital project.' : t('home.intro').includes('pt') ? 'Descubra as diferentes maneiras de ajudá-lo a impulsionar o seu negócio ou projeto digital.' : 'Descubre las diferentes formas en las que puedo ayudarte a potenciar tu negocio o proyecto digital.'}
      </p>

      <div className="servicios-list-container">
        <VerticalInfiniteSlider items={servicios} />
      </div>
    </motion.div>
  );
};

export default Servicios;
