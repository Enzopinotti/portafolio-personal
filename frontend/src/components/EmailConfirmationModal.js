// src/components/EmailConfirmationModal.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { confirmEmail, resendConfirmation } from '../services/authService.js';
import { toast } from 'react-toastify';

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

const EmailConfirmationModal = ({
  isOpen,
  onClose,
  onGoToLogin,
  onGoToForgotPassword, // Callback para abrir el modal "Forgot Password" (opcional)
  direction = 'forward',
  token,      // Token recibido (por query string)
  userEmail   // Email del usuario, necesario para reenviar la confirmación
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'expired', 'error'
  const [loadingResend, setLoadingResend] = useState(false);
  const variants = getModalVariants(direction);

  // Hook para detectar el ancho de la ventana y seleccionar imagen
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  useEffect(() => {
    if (token) {
      confirmEmail(token)
        .then(() => setStatus('success'))
        .catch((error) => {
          console.log('Error en confirmación:', error);
          if (error.error === 'El token ha expirado.') {
            setStatus('expired');
          } else {
            setStatus('error');
          }
        });
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleResendConfirmation = async () => {
    setLoadingResend(true);
    try {
      await resendConfirmation(userEmail, process.env.REACT_APP_CLIENT_URI || 'http://localhost:3000');
      toast.success(t('emailConfirmation.resendSuccess'));
      if (onGoToForgotPassword) {
        onGoToForgotPassword(); // Abre el modal "Forgot Password" si se desea
      }
      onClose(); // Cierra el modal de confirmación
    } catch (err) {
      toast.error(t('emailConfirmation.resendError'));
    } finally {
      setLoadingResend(false);
    }
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
            {/* Sección izquierda con la imagen dinámica */}
            <div className="leftModal">
              <img src={imageSrc} alt={t('imgAlt.emailConfirmation')} />
            </div>
            <div className="rightModal">
              <button className="close-icon" onClick={onClose}>
                <FaTimes />
              </button>
              {status === 'loading' ? (
                <p>{t('emailConfirmation.loading')}</p>
              ) : status === 'success' ? (
                <>
                  <h2>{t('emailConfirmation.successTitle')}</h2>
                  <p>{t('emailConfirmation.successMessage')}</p>
                  <button className="submit-button" onClick={onGoToLogin}>
                    {t('emailConfirmation.goToHome')}
                  </button>
                </>
              ) : status === 'expired' ? (
                <>
                  <h2>{t('emailConfirmation.expiredTitle')}</h2>
                  <p>{t('emailConfirmation.expiredMessage')}</p>
                  <button
                    className="submit-button"
                    onClick={handleResendConfirmation}
                    disabled={loadingResend}
                  >
                    {loadingResend ? t('emailConfirmation.loading') : t('emailConfirmation.resend')}
                  </button>
                </>
              ) : (
                <>
                  <h2>{t('emailConfirmation.errorTitle')}</h2>
                  <p>{t('emailConfirmation.errorMessage')}</p>
                  <button className="submit-button" onClick={onGoToLogin}>
                    {t('emailConfirmation.goToHome')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailConfirmationModal;
