// src/pages/DetalleProyecto.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getProjectById } from '../services/projectService.js';

// La nueva galería unificada
import ProyectoGallery from '../components/ProyectoGallery.js';
import DualSkillBar from '../components/DualSkillBar.js';

// Gráfico Radar tipo Stats para Skills
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const variantsContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const DetalleProyecto = () => {
  const { t } = useTranslation();
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

  // Cargar datos del proyecto - las imágenes ya vienen incluidas en la respuesta
  useEffect(() => {
    getProjectById(idProyecto)
      .then(data => {
        setProyecto(data);
        // Usar las imágenes embebidas en la respuesta del proyecto
        setImagenes(data.Imagenes || data.Imagens || []);
      })
      .catch(err => console.error('Error cargando proyecto:', err));
  }, [idProyecto]);

  if (!proyecto) return <div className="loading">{t('proyectoDetalle.loading')}</div>;

  // Por si usas Recharts en skills
  const skillData = proyecto.Skills?.map(skill => ({
    // Si el nombre contiene un punto (ej: skills.react), lo traducimos
    skill: skill.nombre?.includes('.') ? t(skill.nombre) : skill.nombre,
    nivel: skill.ProyectoSkill?.nivel || skill.nivel || 80,
  })) || [];

  return (
    <motion.div
      className="page detalle-proyecto-page"
      initial="hidden"
      animate="visible"
      variants={variantsContainer}
    >
      <div className="detalle-proyecto-container">

        {/* Sección de galería unificada */}
        <ProyectoGallery items={imagenes} />

        {/* Resto del contenido */}
        <div className={`detalle-proyecto-contenido ${imagenes.length === 0 ? 'centrado' : ''}`}>
          <h1>{proyecto.titulo}</h1>
          <div 
            className="proyecto-descripcion-html"
            dangerouslySetInnerHTML={{ __html: proyecto.descripcion }} 
          />

          <div className="project-links">
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
          </div>

          {/* Skills section con gráficos radiales tipo Stats (Radar) o Dual Bar */}
          <motion.div className="skills-section">
            <h3>{t('proyectoDetalle.skillsUsed')}</h3>
            {skillData.length >= 3 ? (
              <div className="radar-chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="60%" 
                    data={skillData}
                    margin={{ top: 10, right: 60, bottom: 10, left: 60 }}
                  >
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="nivel"
                      stroke="#3344DC" // $color-primary
                      strokeWidth={3}
                      fill="#3344DC"
                      fillOpacity={0.5}
                      style={{ filter: 'drop-shadow(0px 0px 8px rgba(51, 68, 220, 0.8))' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : skillData.length === 2 ? (
              <DualSkillBar skills={skillData} />
            ) : skillData.length === 1 ? (
              <div className="single-skill-fallback">
                <span className="skill-badge">{skillData[0].skill}</span>
              </div>
            ) : (
              <p>{t('proyectoDetalle.noSkills')}</p>
            )}
          </motion.div>

          {/* Servicios, etc. */}
          <motion.div className="servicios-section">
            <h3>{t('proyectoDetalle.servicesOffered')}</h3>
            {proyecto.Servicios?.length ? (
              <ul>
                {proyecto.Servicios.map(servicio => (
                  <li key={servicio.idServicio}>
                    <Link to={`/servicios?id=${servicio.idServicio}`}>
                      {servicio.nombre?.includes('.') ? t(servicio.nombre) : servicio.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('proyectoDetalle.noServices')}</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetalleProyecto;
