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
  switch (pathname) {
    case '/':
      return { url: '/videos/videoInicio.mp4', key: 'inicio' };
    case '/servicios':
      return { url: '/images/background-servicios.jpg', key: 'servicios' };
    case '/proyectos':
      return { url: '/images/proyectos.jpg', key: 'proyectos' };
    case '/blog':
      return { url: '/images/background-blog.jpg', key: 'blog' };
    case '/contacto':
      return { url: '/images/contactoImagen.svg', key: 'contacto' };
    default:
      return { url: '/images/background-default.jpg', key: 'default' };
  }
}
