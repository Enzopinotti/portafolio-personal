// src/components/ForgotPasswordModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import ForgotPasswordForm from './ForgotPasswordForm.js';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, y: '-100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '100vh' },
      }
    : {
        hidden: { opacity: 0, y: '100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '-100vh' },
      };
};

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onForgotPasswordSubmit, // callback opcional para enviar formulario
  onSwitchToLogin = () => {},
  onForgotSuccess = () => {},
  direction = 'forward',
}) => {
  const { t } = useTranslation();
  const variants = getModalVariants(direction);

  // Hook para detectar el ancho de la ventana
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Seleccionar imagen según el ancho
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Evita cerrar el modal si se está interactuando con inputs o si hay texto seleccionado
  const handleOverlayClick = (e) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea') return;
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="modal-content"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="leftModal">
              <img src={imageSrc} alt="Forgot Password" />
            </div>
            <div className="rightModal">
              <button className="close-icon" onClick={onClose}>
                <FaTimes />
              </button>
              <h2>{t('forgotModal.title')}</h2>
              <p className="welcome-text">{t('forgotModal.welcome')}</p>
              <ForgotPasswordForm onForgotSuccess={onForgotSuccess} />
              <div className="links-container">
                <button type="button" className="text-button" onClick={onSwitchToLogin}>
                  {t('forgotModal.switchToLogin')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
