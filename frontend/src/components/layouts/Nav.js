// src/components/layouts/Nav.js

import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationContext } from '../../context/NavigationContext.js';

const pagesOrder = ['/', '/servicios', '/proyectos', '/blog', '/contacto'];

const Nav = ({ handleMenuToggle }) => {
  const { setNavigationDirection } = useContext(NavigationContext);
  const location = useLocation();

  const handleNavClick = (path) => {
    const currentIndex = pagesOrder.indexOf(location.pathname);
    const targetIndex = pagesOrder.indexOf(path);

    if (targetIndex > currentIndex) {
      setNavigationDirection('forward');
    } else {
      setNavigationDirection('backward');
    }

    // Cerrar el menú después de hacer clic en un enlace
    if (handleMenuToggle) {
      handleMenuToggle();
    }
  };

  return (
    <ul className="nav-links">
      <li>
        <Link to="/" onClick={() => handleNavClick('/')}>Inicio</Link>
      </li>
      <li>
        <Link to="/servicios" onClick={() => handleNavClick('/servicios')}>Servicios</Link>
      </li>
      <li>
        <Link to="/proyectos" onClick={() => handleNavClick('/proyectos')}>Proyectos</Link>
      </li>
      <li>
        <Link to="/blog" onClick={() => handleNavClick('/blog')}>Blog</Link>
      </li>
      <li>
        <Link to="/contacto" onClick={() => handleNavClick('/contacto')}>Contacto</Link>
      </li>
    </ul>
  );
};

export default Nav;
