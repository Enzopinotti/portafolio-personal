// src/components/AuthModal.js
import React, { useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal.js';
import RegisterModal from './RegisterModal.js';
import ForgotPasswordModal from './ForgotPasswordModal.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext.js';

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
  const { login: authLogin } = useContext(AuthContext);

  const handleSwitch = (newType) => {
    setDirection(newType === 'login' ? 'backward' : 'forward');
    onSwitchType(newType);
  };

  // Callback para registro exitoso: se muestra el toast y se cambia al modal de login.
  const handleRegisterSuccess = (data) => {
    toast.success(t('registerModal.success') || 'Registro exitoso. Ahora inicia sesión.');
    onRegister(data);       // callback del padre (si lo usas para algo más)
    handleSwitch('login');  // cambia al modal de login
  };

  // Callback para login exitoso
  const handleLoginSuccess = (data) => {
    // data = { accessToken, ... } proveniente del backend
    toast.success(t('loginModal.success') || 'Inicio de sesión exitoso.');
    
    if (data?.accessToken) {
      // en lugar de setAccessToken(...), usamos la función "login(token)" del AuthContext
      authLogin(data.accessToken);
    }
    
    onLogin(data); // callback del padre (si lo necesitas)
    onClose();     // cierra el modal
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
