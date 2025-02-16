// src/components/ForgotPasswordModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

// Función similar para definir variantes según la dirección
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

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onForgotPasswordSubmit,
  onSwitchToLogin = () => {},
  direction = 'forward'
}) => {
  const { t } = useTranslation();
  const variants = getModalVariants(direction);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
            <button className="close-icon" onClick={onClose}>
              <FaTimes />
            </button>
            <h2>{t('forgotModal.title')}</h2>
            <p className="welcome-text">{t('forgotModal.welcome')}</p>
            <form onSubmit={onForgotPasswordSubmit} className="forgot-form">
              <input type="email" placeholder={t('forgotModal.email')} required />
              <button type="submit" className="submit-button">
                {t('forgotModal.submit')}
              </button>
            </form>
            <div className="links-container">
              <button type="button" className="text-button" onClick={onSwitchToLogin}>
                {t('forgotModal.switchToLogin')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
