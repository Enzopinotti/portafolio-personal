// src/components/LoginModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import GoogleIcon from './GoogleIcon.js'; 
import LoginForm from './LoginForm.js';

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

const LoginModal = ({
  isOpen,
  onClose,
  onLogin,
  onForgotPassword = () => {},
  onRegister = () => {},
  onGoogleLogin = () => {},
  direction = 'forward'
}) => {
  const { t } = useTranslation();
  const variants = getModalVariants(direction);

  // Función para iniciar el flujo de Google
  const handleGoogleLogin = () => {
    // Redirige al usuario al endpoint de autenticación con Google del backend
    window.location.href = `${process.env.REACT_APP_API_URL}/usuarios/auth/google`;
  };
  return (
    <AnimatePresence mode="wait">
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
            <h2>{t('loginModal.title')}</h2>
            <p className="welcome-text">{t('loginModal.welcome')}</p>
            <button type="button" className="google-button" onClick={handleGoogleLogin}>
              <GoogleIcon className="google-icon" />
              {t('loginModal.google')}
            </button>
            <LoginForm onLoginSuccess={onLogin} />
            <div className="links-container">
              <button type="button" className="text-button" onClick={onForgotPassword}>
                {t('loginModal.forgotPassword')}
              </button>
              <button type="button" className="text-button" onClick={onRegister}>
                {t('loginModal.register')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
