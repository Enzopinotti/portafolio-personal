// src/pages/Proyectos.js
import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import SliderInfinito from '../components/SliderInfinito.js';
import { listProjectsPublicos } from '../services/projectService.js';

const Proyectos = () => {
  const { navigationDirection } = useContext(NavigationContext);
  const [proyectos, setProyectos] = useState([]);
  console.log('proyectos: ', proyectos);
  useEffect(() => {
    listProjectsPublicos()
      .then(data => setProyectos(data))
      .catch(err => console.error('Error al cargar proyectos:', err));
  }, []);

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

  // Construir slides para el carrusel: usaremos imagenPastilla y título
  const slides = proyectos.map(p => ({
    id: p.idProyecto,
    titulo: p.titulo,
    imagen: p.imagenPastilla,
    descripcion: p.descripcion
  }));

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
        Aquí presento algunos ejemplos de proyectos que he desarrollado.
      </p>
      <SliderInfinito
        slides={slides}
        velocidad="50s"
        direccion="izq"
        onSlideClick={handleSlideClick}
      />
    </motion.div>
  );
};

export default Proyectos;
