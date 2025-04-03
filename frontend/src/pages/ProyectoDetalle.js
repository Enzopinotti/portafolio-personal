// src/pages/DetalleProyecto.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { getProjectById } from '../services/projectService.js';
import { getImagenesByProyecto } from '../services/imageService.js';

// Tu carrusel actual
import GaleriaProyecto from '../components/GaleriaProyecto.js';
// El nuevo slider vertical infinito
import VerticalInfiniteSliderImages from '../components/VerticalInfiniteSliderImages.js';

// Opcional: si usas Recharts para Skills
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const variantsContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const DetalleProyecto = () => {
  const { idProyecto } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);

  // Escuchamos cambios de tamaño para definir si es desktop o no
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1080);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar datos del proyecto e imágenes
  useEffect(() => {
    getProjectById(idProyecto)
      .then(data => setProyecto(data))
      .catch(err => console.error('Error cargando proyecto:', err));

    getImagenesByProyecto(idProyecto)
      .then(res => setImagenes(res.imagenes || []))
      .catch(err => console.error('Error cargando imágenes:', err));
  }, [idProyecto]);

  if (!proyecto) return <div className="loading">Cargando...</div>;

  // Por si usas Recharts en skills
  const skillData = proyecto.Skills?.map(skill => ({
    skill: skill.nombre,
    nivel: skill.nivel || 80,
  })) || [];

  return (
    <motion.div
      className="page detalle-proyecto-page"
      initial="hidden"
      animate="visible"
      variants={variantsContainer}
    >
      <div className="detalle-proyecto-container">
        
        {/* Sección de imágenes */}
        {imagenes.length > 0 && (
          isDesktop ? (
            // Desktop → slider vertical infinito
            <VerticalInfiniteSliderImages 
              imagenes={imagenes}
              velocidad={40}
            />
          ) : (
            // Mobile → carrusel horizontal
            <GaleriaProyecto imagenes={imagenes} />
          )
        )}

        {/* Resto del contenido */}
        <div className="detalle-proyecto-contenido">
          <h1>{proyecto.titulo}</h1>
          <p>{proyecto.descripcion}</p>

          {proyecto.enlace && (
            <a 
              href={proyecto.enlace} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver Proyecto
            </a>
          )}
          {proyecto.enlaceGithub && (
            <a 
              href={proyecto.enlaceGithub} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver Código en GitHub
            </a>
          )}

          {/* Skills section con RadarChart (opcional) */}
          <motion.div className="skills-section">
            <h3>Skills utilizadas</h3>
            {skillData.length > 0 ? (
              <RadarChart outerRadius={90} width={400} height={300} data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Nivel de Skill"
                  dataKey="nivel"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.7}
                />
                <Legend />
              </RadarChart>
            ) : (
              <p>No se especificaron skills para este proyecto.</p>
            )}
          </motion.div>

          {/* Servicios, etc. */}
          <motion.div className="servicios-section">
            <h3>Servicios ofrecidos</h3>
            {proyecto.Servicios?.length ? (
              <ul>
                {proyecto.Servicios.map(servicio => (
                  <li key={servicio.idServicio}>{servicio.nombre}</li>
                ))}
              </ul>
            ) : (
              <p>No se especificaron servicios para este proyecto.</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetalleProyecto;
