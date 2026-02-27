import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import SliderInfinito from '../components/SliderInfinito.js';
import { listProjectsPublicos } from '../services/projectService.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Proyectos = () => {
  const { t } = useTranslation();
  const { navigationDirection } = useContext(NavigationContext);
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate();

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

  const slides = proyectos.map(p => ({
    id: p.idProyecto,
    titulo: p.titulo,
    imagen: p.imagenPastilla,
    descripcion: p.descripcion
  }));

  const handleSlideClick = (proyecto) => {
    navigate(`/proyectos/${proyecto.id}`);
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
      <h1 className="proyectos-title">{t('projects.title')}</h1>
      <p className="proyectos-description">
        {t('home.intro').includes('en') ? 'Here I present some examples of projects I have developed.' : t('home.intro').includes('pt') ? 'Aqui apresento alguns exemplos de projetos que desenvolvi.' : 'Aquí presento algunos ejemplos de proyectos que he desarrollado.'}
      </p>
      <SliderInfinito
        slides={slides}
        velocidad="50s"
        direccion="izq"
        onSlideClick={handleSlideClick}
      />
      <SliderInfinito
        slides={slides}
        velocidad="30s"
        direccion="der"
        onSlideClick={handleSlideClick}
      />
    </motion.div>
  );
};

export default Proyectos;
