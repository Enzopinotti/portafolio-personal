// src/components/layouts/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from './Nav.js';
import LanguageSwitcher from '../LanguageSwitcher.js';
import AuthModal from '../AuthModal.js';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [modalType, setModalType] = useState('login'); // "login", "register", o "forgot"

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
  // Abre el modal de autenticación y define el tipo (login, register, etc.)
  const openAuthModal = (type = 'login') => {
    setIsMenuOpen(false);
    setModalType(type);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => setIsAuthOpen(false);

  // Estos callbacks reciben los datos del backend, NO el evento.
  const handleLoginSuccess = (data) => {
    // Aquí manejas el login (por ejemplo, guardas el token en el estado global)
    // Además, muestra el toast y cierra el modal
    console.log('Login exitoso:', data);
    // Ejemplo: toast.success(t('loginModal.success'));
    closeAuthModal();
  };

  const handleRegisterSuccess = (data) => {
    // Muestra el toast de éxito y cambia el modal a login
    console.log('Registro exitoso:', data);
    // Ejemplo: toast.success(t('registerModal.success'));
    setModalType('login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link className="text_logo" to="/">Enzo Pinotti</Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <span className="menu-icon-line"></span>
        <span className="menu-icon-line"></span>
        <span className="menu-icon-line"></span>
      </div>
      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <Nav handleMenuToggle={toggleMenu} />
          <div className="menu-buttons">
            <button onClick={() => openAuthModal('login')}>
              {t('header.login')}
            </button>
            <a href="URL_DEL_CV" download="Mi_CV.pdf" className="download-button">
              {t('header.downloadCV')}
            </a>
          </div>
          <button className="close-menu" onClick={toggleMenu}>✕</button>
        </div>
      </nav>
      <div className="header-extras">
        <LanguageSwitcher />
      </div>
      <AuthModal
        modalType={modalType}
        isOpen={isAuthOpen}
        onClose={closeAuthModal}
        onSwitchType={(type) => setModalType(type)}
        onLogin={handleLoginSuccess}
        onRegister={handleRegisterSuccess}
        onForgotPassword={() => setModalType('forgot')}
        onGoogleLogin={() => {
          // Lógica para login con Google
          window.location.href = `${process.env.REACT_APP_API_URL}/usuarios/auth/google`;
        }}
      />
    </header>
  );
};

export default Header;
