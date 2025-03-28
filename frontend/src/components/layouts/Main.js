// src/components/layouts/Main.js

import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Inicio from '../../pages/Inicio.js';
import Servicios from '../../pages/Servicios.js';
import Proyectos from '../../pages/Proyectos.js';
import Blog from '../../pages/Blog.js';
import Contacto from '../../pages/Contacto.js';
import DetalleProyecto from '../../pages/ProyectoDetalle.js';

const Main = () => {
  const location = useLocation();

  return (
    <main>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:idProyecto" element={<DetalleProyecto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirm-email" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </main>
  );
};

export default Main;
