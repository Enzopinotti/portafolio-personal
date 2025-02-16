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
  onForgotPassword
}) => {
  // Mantenemos la dirección de la transición para animaciones inversas
  const [direction, setDirection] = useState('forward');

  const handleSwitch = (newType) => {
    // Si cambiamos a "login", la transición es inversa; de lo contrario, normal.
    setDirection(newType === 'login' ? 'backward' : 'forward');
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
          onForgotPassword={onForgotPassword}
        />
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
