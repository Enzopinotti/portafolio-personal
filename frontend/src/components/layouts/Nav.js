// src/components/layouts/Nav.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationContext } from '../../context/NavigationContext.js';

const pagesOrder = ['/', '/servicios', '/proyectos', '/blog', '/contacto'];

const Nav = ({ handleMenuToggle }) => {
  const { t } = useTranslation();
  const { setNavigationDirection } = useContext(NavigationContext);
  const location = useLocation();

  const handleNavClick = (path) => {
    const currentIndex = pagesOrder.indexOf(location.pathname);
    const targetIndex = pagesOrder.indexOf(path);
    setNavigationDirection(targetIndex > currentIndex ? 'forward' : 'backward');
    if (handleMenuToggle) {
      handleMenuToggle();
    }
  };

  return (
    <ul className="nav-links">
      <li>
        <Link to="/" onClick={() => handleNavClick('/')}>
          {t('header.nav.home')}
        </Link>
      </li>
      <li>
        <Link to="/servicios" onClick={() => handleNavClick('/servicios')}>
          {t('header.nav.services')}
        </Link>
      </li>
      <li>
        <Link to="/proyectos" onClick={() => handleNavClick('/proyectos')}>
          {t('header.nav.projects')}
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={() => handleNavClick('/blog')}>
          {t('header.nav.blog')}
        </Link>
      </li>
      <li>
        <Link to="/contacto" onClick={() => handleNavClick('/contacto')}>
          {t('header.nav.contact')}
        </Link>
      </li>
    </ul>
  );
};

export default Nav;
