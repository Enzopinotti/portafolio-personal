// src/components/layouts/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav.js';
import FloatingButton from '../FloatingButton.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link className='text_logo' to="/">Enzo Pinotti</Link>
      </div>
      <div className="menu-icon" onClick={handleMenuToggle}>
        <span className="menu-icon-line"></span>
        <span className="menu-icon-line"></span>
        <span className="menu-icon-line"></span>
      </div>
      {/* El menú de navegación */}
      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <Nav handleMenuToggle={handleMenuToggle} />
          <div className="menu-buttons">
            <button>Iniciar Sesión</button>
            <a href="URL_DEL_CV" download="Mi_CV.pdf" className="download-button">
              Descargar CV
            </a>
          </div>
        </div>
      </nav>
      {/* Agregar el FloatingButton */}
      <FloatingButton />
    </header>
  );
};

export default Header;
