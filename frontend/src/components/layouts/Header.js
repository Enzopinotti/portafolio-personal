// src/components/layouts/Header.js

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from './Nav.js';
import LanguageSwitcher from '../LanguageSwitcher.js';
import AuthModal from '../AuthModal.js';
import { AuthContext } from '../../context/AuthContext.js';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(user)
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const openAuthModal = (type = 'login') => {
    setIsMenuOpen(false);
    setModalType(type);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => setIsAuthOpen(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
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
            {user ? (
              <div className="user-menu">
                {/* Ícono + Nombre/Apellido */}
                <div 
                  className="user-info" 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <FaUserCircle size={32} />
                  {/* Muestra nombre y apellido si existen */}
                  <span style={{ marginLeft: '8px' }}>
                    {user?.nombre} {user?.apellido}
                  </span>
                </div>

                {showDropdown && (
                  <div className="dropdown">
                    {/* Botón "Mi Perfil" */}
                    <Link to="/perfil" onClick={() => setShowDropdown(false)}>
                      {t('header.myProfile') || 'Mi Perfil'}
                    </Link>

                    {/* Si es admin, muestra el botón/panel admin */}
                    {user.idRol === 1 && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)}>
                        {t('header.adminPanel') || 'Admin Panel'}
                      </Link>
                    )}

                    <button onClick={handleLogout}>
                      {t('header.logout') || 'Cerrar Sesión'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => openAuthModal('login')}>
                {t('header.login')}
              </button>
            )}

            <a
              href="URL_DEL_CV"
              download="Mi_CV.pdf"
              className="download-button"
            >
              {t('header.downloadCV')}
            </a>
          </div>

          <button className="close-menu" onClick={toggleMenu}>✕</button>
        </div>
      </nav>

      <div className="header-extras">
        <LanguageSwitcher />
      </div>

      {!user && (
        <AuthModal
          modalType={modalType}
          isOpen={isAuthOpen}
          onClose={closeAuthModal}
          onSwitchType={(type) => setModalType(type)}
          onLogin={(data) => {
            // al hacer login, cierra el modal
            closeAuthModal();
          }}
          onRegister={(data) => {
            // cambia el modal a login
            setModalType('login');
          }}
          onForgotPassword={() => setModalType('forgot')}
          onGoogleLogin={() => {
            // redirige a Google
            window.location.href = `${process.env.REACT_APP_API_URL}/usuarios/auth/google`;
          }}
        />
      )}
    </header>
  );
};

export default Header;
