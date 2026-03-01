// src/components/layouts/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import Telefono from './Telefono.js';
import Main from './Main.js';
import Background from './Background.js';

const Layout = () => {
  const location = useLocation();
  const background = getBackground(location.pathname);

  return (
    <div className="layout">
      <Background background={background} />
      <Header />
      <Main />
      <Footer />
      <Telefono />
    </div>
  );
};

export default Layout;
function getBackground(pathname) {
  if (pathname.startsWith('/proyectos/') && pathname.split('/')[2]) {
    return { url: '/videos/FondoProyectos.webm', key: 'detalleProyecto' };
  }
  switch (pathname) {
    case '/':
      return { url: '/videos/videoInicio.webm', key: 'inicio' };
    case '/servicios':
      return { url: '/videos/fondoServicios.webm', key: 'servicios' };
    case '/proyectos':
      return { url: '/videos/FondoProyectos.webm', key: 'proyectos' };
    case '/blog':
      return { url: '/images/fondoBlog.webp', key: 'blog' };
    case '/contacto':
      return { url: '/videos/fondoContacto.webm', key: 'contacto' };
    default:
      return { url: '/images/background-default.jpg', key: 'default' };
  }
}