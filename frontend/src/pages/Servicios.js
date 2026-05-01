import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import VerticalInfiniteSlider from '../components/VerticalInfiniteSlider.js';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { listServicios } from '../services/servicioService.js';

const desktopOpacities = [1, 0.86, 0.72, 0.58, 0.44, 0.3, 0.18];
const mobileOpacities = [1, 0.58, 0.24];

const getArrayTranslation = (t, key) => {
  const value = t(key, { returnObjects: true, defaultValue: [] });
  return Array.isArray(value) ? value : [];
};

const Servicios = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const queryParams = new URLSearchParams(location.search);
  const initialServiceId = queryParams.get('id');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
  const [serviciosDB, setServiciosDB] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1080);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar servicios desde la API
  useEffect(() => {
    listServicios()
      .then((data) => {
        setServiciosDB(data.servicios || data || []);
      })
      .catch((err) => {
        console.error('Error cargando servicios:', err);
      });
  }, []);

  // Mapear servicios de la BD al formato que espera el slider/card
  const servicios = useMemo(() => {
    return serviciosDB.map((srv) => {
      // chips: si el nombre es una clave de traducción, intentamos obtener chips de i18n
      const nameKey = srv.nombre || '';
      const chips = nameKey.includes('.')
        ? getArrayTranslation(t, nameKey.replace('.name', '.chips'))
        : [];

      return {
        id: srv.idServicio,
        titulo: nameKey.includes('.') ? t(nameKey) : nameKey,
        descripcion: srv.descripcion?.includes('.')
          ? t(srv.descripcion)
          : (srv.descripcion || ''),
        chips,
        icon: srv.icono || 'bolt',
        precio: srv.precio,
        imagen: srv.Imagen?.ruta || null,
      };
    });
  }, [serviciosDB, t]);

  const renderTitles = () => {
    const opacities = isDesktop ? desktopOpacities : mobileOpacities;

    return opacities.map((opacity, index) => (
      <h2
        key={`${opacity}-${index}`}
        className="titulo-servicios"
        style={{
          '--title-opacity': opacity,
          zIndex: opacities.length - index,
        }}
      >
        {t('services.title')}
      </h2>
    ));
  };

  return (
    <motion.div
      className="page servicios-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeInOut' }}
    >
      <div className="servicios-container">
        <div className="servicios-left" aria-hidden="true">
          {renderTitles()}
        </div>

        <div className="servicios-right" aria-label={t('services.gridAriaLabel')}>
          <div className="servicios-slider-wrapper">
            <VerticalInfiniteSlider
              items={servicios}
              initialExpandedId={initialServiceId}
              velocidad={shouldReduceMotion ? 999999 : 42}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Servicios;
