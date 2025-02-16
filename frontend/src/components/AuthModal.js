// src/components/AuthModal.js
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal.js';
import RegisterModal from './RegisterModal.js';
import ForgotPasswordModal from './ForgotPasswordModal.js';

const AuthModal = ({
  modalType,          // "login", "register" o "forgot"
  isOpen,
  onClose,
  onSwitchType,       // Función para cambiar el tipo de modal
  onLogin,
  onRegister,
  onGoogleLogin,
}) => {
  // Mantenemos la dirección de la transición
  const [direction, setDirection] = useState('forward');

  const handleSwitch = (newType) => {
    // Si cambiamos de "register" o "forgot" a "login", la transición es inversa.
    if (newType === 'login') {
      setDirection('backward');
    } else {
      setDirection('forward');
    }
    onSwitchType(newType);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && modalType === 'login' && (
        <LoginModal
          key="login"
          isOpen={isOpen}
          direction={direction}
          onClose={onClose}
          onLogin={onLogin}
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
          onRegister={onRegister}
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
        />
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
