// src/components/layouts/Header.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from './Nav.js';
import LanguageSwitcher from '../LanguageSwitcher.js';
import AuthModal from '../AuthModal.js';
import ProfileModal from '../ProfileModal.js';
import { AuthContext } from '../../context/AuthContext.js';
import { FaUserCircle, FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const openAuthModal = (type = 'login') => {
    setIsMenuOpen(false);
    setModalType(type);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => setIsAuthOpen(false);
  const closeProfileModal = () => setIsProfileOpen(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link className="link_logo" to="/">
          <img className="logo" src="/images/logoEnzo.png" alt="Logo" />
        </Link>
      </div>

      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <Nav handleMenuToggle={toggleMenu} />
          <div className="menu-buttons">
            <a
              href="URL_DEL_CV"
              download="Mi_CV.pdf"
              className="download-button"
            >
              {t('header.downloadCV')}
            </a>
          </div>
          <LanguageSwitcher />
          <button className="close-menu" onClick={toggleMenu}>✕</button>
        </div>
      </nav>

      <div className="header-extras">
        {user ? (
          <div className="user-menu">
            <div
              className="user-info"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <FaUserCircle size={32} />
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    setIsProfileOpen(true);
                  }}
                >
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  {t('header.myProfile') || 'Mi Perfil'}
                </button>
                
                {user.idRol === 1 && (
                  <Link to="/admin" onClick={() => setShowDropdown(false)}>
                    {t('header.adminPanel') || 'Admin Panel'}
                  </Link>
                )}
                
                <button onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                  {t('header.logout') || 'Cerrar Sesión'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="login_button">
            <button onClick={() => openAuthModal('login')}>
              {t('header.login')}
            </button>
          </div>
        )}

        <div className="menu-icon" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
          <FaBars size={32} color="#fff" />
        </div>

        <LanguageSwitcher />
      </div>

      {/* Modal de autenticación */}
      {!user && (
        <AuthModal
          modalType={modalType}
          isOpen={isAuthOpen}
          onClose={closeAuthModal}
          onSwitchType={(type) => setModalType(type)}
          onLogin={(data) => {
            closeAuthModal();
          }}
          onRegister={(data) => {
            setModalType('login');
          }}
          onForgotPassword={() => setModalType('forgot')}
          onGoogleLogin={() => {
            window.location.href = `${process.env.REACT_APP_API_URL}/usuarios/auth/google`;
          }}
        />
      )}

      {/* Modal de perfil */}
      {user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={closeProfileModal}
          user={user}
        />
      )}
    </header>
  );
};

export default Header;
