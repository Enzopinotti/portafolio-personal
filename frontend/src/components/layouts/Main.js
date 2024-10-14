// src/components/layouts/Main.js

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Inicio from '../../pages/Inicio.js';
import Servicios from '../../pages/Servicios.js';
import Proyectos from '../../pages/Proyectos.js';
import Blog from '../../pages/Blog.js';
import Contacto from '../../pages/Contacto.js';

const Main = () => {
  const location = useLocation();

  return (
    <main>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </AnimatePresence>
    </main>
  );
};

export default Main;
