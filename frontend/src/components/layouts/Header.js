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
  const openAuthModal = (type = 'login') => {
    setIsMenuOpen(false);
    setModalType(type);
    setIsAuthOpen(true);
  };
  const closeAuthModal = () => setIsAuthOpen(false);

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
        onLogin={(e) => { e.preventDefault(); /* Lógica de login con Axios */ }}
        onRegister={(e) => { e.preventDefault(); /* Lógica de registro con Axios */ }}
        onForgotPassword={() => { setModalType('forgot'); }}
        onGoogleLogin={() => { /* Lógica para login con Google */ }}
      />
    </header>
  );
};

export default Header;
