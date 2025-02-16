// src/components/RegisterModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

// Función para obtener las variantes de animación según la dirección
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

const RegisterModal = ({
  isOpen,
  onClose,
  onRegister,
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
            <h2>{t('registerModal.title')}</h2>
            <p className="welcome-text">{t('registerModal.welcome')}</p>
            <form onSubmit={onRegister} className="register-form">
              <input type="text" placeholder={t('registerModal.name')} required />
              <input type="email" placeholder={t('registerModal.email')} required />
              <input type="password" placeholder={t('registerModal.password')} required />
              <input type="password" placeholder={t('registerModal.confirmPassword')} required />
              <button type="submit" className="submit-button">
                {t('registerModal.submit')}
              </button>
            </form>
            <div className="links-container">
              <button type="button" className="text-button" onClick={onSwitchToLogin}>
                {t('registerModal.alreadyHaveAccount')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
