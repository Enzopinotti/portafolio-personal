// src/components/LoginModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import GoogleIcon from './GoogleIcon.js'; 

const modalVariants = {
  hidden: { opacity: 0, y: '-100vh' },
  visible: { opacity: 1, y: '0' },
  exit: { opacity: 0, y: '100vh' },
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
            variants={modalVariants}
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
            <button type="button" className="google-button" onClick={onGoogleLogin}>
              <GoogleIcon className="google-icon" />
              {t('loginModal.google')}
            </button>
            <form onSubmit={onLogin} className="login-form">
              <input type="email" placeholder={t('loginModal.email')} required />
              <input type="password" placeholder={t('loginModal.password')} required />
              <button type="submit" className="submit-button">
                {t('loginModal.submit')}
              </button>
            </form>
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
