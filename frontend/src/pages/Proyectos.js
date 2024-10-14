// src/pages/Proyectos.js

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import SkillBubble from '../components/SkillBubble.js';

const Proyectos = () => {
  const { navigationDirection } = useContext(NavigationContext);

  const variants = {
    initial: {
      y: navigationDirection === 'forward' ? '100vh' : '-100vh',
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: navigationDirection === 'forward' ? '-100vh' : '100vh',
      opacity: 0,
    },
  };

  // Ejemplo de datos de skills
  const skills = [
    { id: 1, nombre: 'JavaScript', nivel: 80 },
    { id: 2, nombre: 'React', nivel: 70 },
    { id: 3, nombre: 'Node.js', nivel: 60 },
    // Agrega más skills según sea necesario
  ];

  return (
    <motion.div
      className="page proyectos-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1>Proyectos</h1>
      <div className="skills-container">
        {skills.map((skill) => (
          <SkillBubble key={skill.id} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
};

export default Proyectos;

