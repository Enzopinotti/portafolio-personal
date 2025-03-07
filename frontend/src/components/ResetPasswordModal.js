// src/components/ResetPasswordModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import ResetPasswordForm from './ResetPasswordForm.js';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, y: '-100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '100vh' }
      }
    : {
        hidden: { opacity: 0, y: '100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '-100vh' }
      };
};

const ResetPasswordModal = ({
  isOpen,
  onClose,
  token,
  onResetSuccess,
  direction = 'forward'
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
  // Si la pantalla es menor a 800px, usamos 'PatronDos.png'; en otro caso, 'patronUno.png'
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

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
              <img src={imageSrc} alt="Reset Password" />
            </div>
            <div className="rightModal">
              <button className="close-icon" onClick={onClose}>
                <FaTimes />
              </button>
              <h2>{t('resetPassword.title')}</h2>
              <p className="welcome-text">{t('resetPassword.welcome')}</p>
              <ResetPasswordForm token={token} onResetSuccess={onResetSuccess} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
