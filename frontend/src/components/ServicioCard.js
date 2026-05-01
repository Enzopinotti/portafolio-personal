import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaBolt,
  FaChartLine,
  FaCubes,
  FaLayerGroup,
  FaMobileAlt,
  FaRobot,
} from 'react-icons/fa';

const iconMap = {
  bolt: FaBolt,
  chart: FaChartLine,
  cubes: FaCubes,
  layers: FaLayerGroup,
  mobile: FaMobileAlt,
  robot: FaRobot,
};

const ServicioCard = ({ servicio, isExpanded, onToggle }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const Icon = iconMap[servicio.icon] || FaBolt;

  const nameKey = servicio.nombre || servicio.titulo;
  const descKey = servicio.descripcion;
  const chips = Array.isArray(servicio.chips) ? servicio.chips : [];

  // Si el string contiene un ".", asumimos que es una clave de traducción
  const translatedName = nameKey?.includes('.') ? t(nameKey) : (nameKey || '');
  const translatedDesc = descKey?.includes('.') ? t(descKey) : (descKey || '');

  const handlePointerDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (e.target.closest('.card-contact-btn')) return;
    const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    if (dist < 10 && onToggle) {
      onToggle();
    }
  };

  const handleKeyDown = (e) => {
    if (e.target.closest('.card-contact-btn')) return;
    if ((e.key === 'Enter' || e.key === ' ') && onToggle) {
      e.preventDefault();
      onToggle();
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = "5492346304036";
    const message = encodeURIComponent(`${t('contacto.whatsapp_message_prefix') || 'Hola Enzo, me interesa el servicio de'} ${translatedName}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Variantes para la animación de entrada
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <motion.div
        className={`servicio-card ${isExpanded ? 'is-expanded' : ''}`}
        ref={cardRef}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, amount: 0.2 }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        layout
        transition={{
          layout: {
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 25
          },
          opacity: { duration: 0.4 }
        }}
        style={{ originY: 0 }} // Para que la expansión se sienta desde arriba hacia abajo
      >
        <div className="card-inner">
          <div
            className="card-front"
            style={{
              backgroundImage: servicio.imagen ? `url(${servicio.imagen})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="overlay front" />
            <div className="card-content">
              <div className="card-service-icon" aria-hidden="true">
                <Icon />
              </div>
              <motion.h3 layout>{translatedName}</motion.h3>
              {!isExpanded && chips.length > 0 && (
                <div className="compact-card-chips" aria-label={t('services.capabilitiesLabel')}>
                  {chips.slice(0, 3).map(chip => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="expanded-card-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="card-description">{translatedDesc}</p>
                    {chips.length > 0 && (
                      <div className="expanded-card-chips" aria-label={t('services.capabilitiesLabel')}>
                        {chips.map(chip => (
                          <span key={chip}>{chip}</span>
                        ))}
                      </div>
                    )}
                    <div className="card-cta">
                      {servicio.precio && <span className="card-price">${servicio.precio}</span>}
                      <button
                        className="card-contact-btn"
                        onClick={handleWhatsApp}
                      >
                        {t('services.ctaButton', t('contacto.sendMessage'))}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ServicioCard;
