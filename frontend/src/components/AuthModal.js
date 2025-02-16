// src/components/AuthModal.js
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal.js';
import RegisterModal from './RegisterModal.js';
import ForgotPasswordModal from './ForgotPasswordModal.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AuthModal = ({
  modalType,          // "login", "register" o "forgot"
  isOpen,
  onClose,
  onSwitchType,       // Función para cambiar el tipo de modal
  onLogin,
  onRegister,
  onGoogleLogin,
  onForgotPassword,
}) => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState('forward');

  const handleSwitch = (newType) => {
    setDirection(newType === 'login' ? 'backward' : 'forward');
    onSwitchType(newType);
  };

  // Callback para registro exitoso: se muestra el toast y se cambia al modal de login.
  const handleRegisterSuccess = (data) => {
    // Muestra el toast solo una vez.
    toast.success(t('registerModal.success') || 'Registro exitoso. Ahora inicia sesión.');
    // Ejecuta el callback del padre y cambia al modal de login.
    onRegister(data);
    handleSwitch('login');
  };

  // Callback para login exitoso: se muestra el toast y se cierra el modal.
  const handleLoginSuccess = (data) => {
    toast.success(t('loginModal.success') || 'Inicio de sesión exitoso.');
    onLogin(data);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && modalType === 'login' && (
        <LoginModal
          key="login"
          isOpen={isOpen}
          direction={direction}
          onClose={onClose}
          onLogin={handleLoginSuccess}
          onForgotPassword={() => handleSwitch('forgot')}
          onRegister={() => handleSwitch('register')}
          onGoogleLogin={onGoogleLogin}
        />
      )}
      {isOpen && modalType === 'register' && (
        <RegisterModal
          key="register"
          isOpen={isOpen}
          direction={direction}
          onClose={onClose}
          onRegister={handleRegisterSuccess}
          onSwitchToLogin={() => handleSwitch('login')}
        />
      )}
      {isOpen && modalType === 'forgot' && (
        <ForgotPasswordModal
          key="forgot"
          isOpen={isOpen}
          direction={direction}
          onClose={onClose}
          onSwitchToLogin={() => handleSwitch('login')}
          onForgotPassword={onForgotPassword}
        />
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
