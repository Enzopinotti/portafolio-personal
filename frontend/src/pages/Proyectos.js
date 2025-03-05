// src/pages/Proyectos.js
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import SliderInfinito from '../components/SliderInfinito.js';

const Proyectos = () => {
  const { navigationDirection } = useContext(NavigationContext);

  const variants = {
    initial: {
      y: navigationDirection === 'forward' ? '100vh' : '-100vh',
      opacity: 0,
    },
    animate: { y: 0, opacity: 1 },
    exit: {
      y: navigationDirection === 'forward' ? '-100vh' : '100vh',
      opacity: 0,
    },
  };

  const proyectosA = [
    { id: 1, titulo: 'Proyecto A1', desc: 'Aplicación web con React y Node.' },
    { id: 2, titulo: 'Proyecto A2', desc: 'Sistema e-commerce con MERN stack.' },
    { id: 3, titulo: 'Proyecto A3', desc: 'Juego con Phaser y Socket.io.' },
    { id: 4, titulo: 'Proyecto A4', desc: 'API REST con Express y Sequelize.' },
  ];

  const proyectosB = [
    { id: 1, titulo: 'Proyecto B1', desc: 'Proyecto invertido, sentido opuesto.' },
    { id: 2, titulo: 'Proyecto B2', desc: 'Otro ejemplo de proyecto.' },
    { id: 3, titulo: 'Proyecto B3', desc: 'Proyecto B3 descripción.' },
    { id: 4, titulo: 'Proyecto B4', desc: 'Proyecto B4 descripción.' },
  ];

  const handleSlideClick = (proyecto) => {
    const esMovil = window.matchMedia('(hover: none)').matches;
    if (esMovil) {
      window.location.href = `/proyecto/${proyecto.id}`;
    } else {
      console.log('Abrir modal para proyecto:', proyecto);
    }
  };

  return (
    <motion.div
      className="page proyectos-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1 className="proyectos-title">Mis Proyectos</h1>
      <p className="proyectos-description">
        Aquí presento algunos ejemplos de proyectos que he desarrollado, demostrando
        mis capacidades como desarrollador Fullstack.
      </p>

      {/* Slider A: se mueve de izquierda a derecha */}
      <SliderInfinito
        slides={proyectosA}
        velocidad="50s"
        direccion="izq"
        onSlideClick={handleSlideClick}
      />

      {/* Slider B: se mueve de derecha a izquierda */}
      <SliderInfinito
        slides={proyectosB}
        velocidad="60s"
        direccion="der"
        onSlideClick={handleSlideClick}
      />
    </motion.div>
  );
};

export default Proyectos;
