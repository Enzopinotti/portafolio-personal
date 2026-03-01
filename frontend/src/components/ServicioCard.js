import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ServicioCard = ({ servicio, isExpanded, onToggle }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Mapeo simple de nombres de DB a claves de traducción
  const getTranslationKey = (name) => {
    if (!name) return null;
    if (name.includes('Análisis')) return 'bi';
    if (name.includes('Full-Stack')) return 'fullstack';
    if (name.includes('Liderazgo') || name.includes('Tech')) return 'techlead';
    if (name.includes('Automatización')) return 'automation';
    return null;
  };

  const key = getTranslationKey(servicio.nombre || servicio.titulo);
  const translatedName = key ? t(`services.items.${key}.name`) : (servicio.nombre || servicio.titulo || '');
  const translatedDesc = key ? t(`services.items.${key}.description`) : (servicio.descripcion || '');

  const handlePointerDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    if (dist < 10 && onToggle) {
      onToggle();
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = "5392346304036";
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
              <motion.h3 layout>{translatedName}</motion.h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="expanded-card-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="card-description">{translatedDesc}</p>
                    <div className="card-cta">
                      <span className="card-price">${servicio.precio}</span>
                      <button
                        className="card-contact-btn"
                        onClick={handleWhatsApp}
                      >
                        {t('contacto.sendMessage')}
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
