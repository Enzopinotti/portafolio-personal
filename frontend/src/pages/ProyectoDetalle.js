// src/pages/DetalleProyecto.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

import { getProjectById } from '../services/projectService.js';
import { getImagenesByProyecto } from '../services/imageService.js';

// La nueva galería unificada
import ProyectoGallery from '../components/ProyectoGallery.js';
import DualSkillBar from '../components/DualSkillBar.js';

// Gráfico Radar tipo Stats para Skills
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import Loader from '../components/shared/Loader.js';

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

  // Cargar datos del proyecto e imágenes
  useEffect(() => {
    getProjectById(idProyecto)
      .then(data => {
        console.log('Detalle Proyecto Data:', data);
        if (data.Servicios) {
          console.log('Servicios del Proyecto:', data.Servicios.length, data.Servicios);
        }
        setProyecto(data);
      })
      .catch(err => console.error('Error cargando proyecto:', err));

    getImagenesByProyecto(idProyecto)
      .then(res => setImagenes(res.imagenes || []))
      .catch(err => console.error('Error cargando imágenes:', err));
  }, [idProyecto]);

  if (!proyecto) return <Loader fullScreen={true} variant="white" message={t('proyectoDetalle.loading')} />;

  // Por si usas Recharts en skills
  const skillData = proyecto.Skills?.map(skill => ({
    skill: skill.nombre?.includes('.') ? t(skill.nombre) : (skill.nombre || ''),
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
          {/* Badge de Categoría */}
          {proyecto.Skills && proyecto.Skills.length > 0 && (
            <div className="proyecto-category-badge">
              {(() => {
                const counts = {};
                proyecto.Skills.forEach(sk => {
                  if (sk.Categorias && sk.Categorias.length > 0) {
                    const catName = sk.Categorias[0].nombre;
                    counts[catName] = (counts[catName] || 0) + 1;
                  }
                });
                const topCat = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                if (topCat) {
                  const catKey = topCat[0];
                  return catKey.includes('.') ? t(catKey) : catKey;
                }
                return null;
              })()}
            </div>
          )}
          <h1>{proyecto.titulo}</h1>
          <p>{proyecto.descripcion}</p>

          <div className="project-links">
            {proyecto.enlace && (
              <a
                href={proyecto.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn live-link"
              >
                <FaExternalLinkAlt /> {t('proyectoDetalle.viewProject', 'Ver Proyecto')}
              </a>
            )}
            {proyecto.enlaceGithub && (
              <a
                href={proyecto.enlaceGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn github-link"
              >
                <FaGithub /> {t('proyectoDetalle.viewCode', 'Ver Código')}
              </a>
            )}
          </div>

          {/* Skills section con gráficos radiales tipo Stats (Radar) o Dual Bar */}
          <motion.div className="skills-section">
            <h3>{t('proyectoDetalle.skillsUsed')}</h3>
            {skillData.length >= 3 ? (
              <div className="radar-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
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
              <div className="services-badges">
                {proyecto.Servicios.map(servicio => (
                  <Link
                    key={servicio.idServicio}
                    to={`/servicios?id=${servicio.idServicio}`}
                    className="service-badge"
                  >
                    {servicio.nombre?.includes('.') ? t(servicio.nombre) : (servicio.nombre || '')}
                  </Link>
                ))}
              </div>
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
