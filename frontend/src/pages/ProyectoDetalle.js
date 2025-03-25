import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../services/projectService.js';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import GaleriaProyecto from '../components/GaleriaProyecto.js';

const variantsContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const DetalleProyecto = () => {
  const { idProyecto } = useParams();
  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {
    getProjectById(idProyecto)
      .then(data => setProyecto(data))
      .catch(err => console.error('Error:', err));
  }, [idProyecto]);

  if (!proyecto) return <div className="loading">Cargando...</div>;

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
        {proyecto.Imagens?.length > 0 && (
          <GaleriaProyecto imagenes={proyecto.Imagens} />
        )}

        <div className="detalle-proyecto-contenido">
          <h1>{proyecto.titulo}</h1>
          <p>{proyecto.descripcion}</p>

          {proyecto.enlace && (
            <a href={proyecto.enlace} target="_blank" rel="noopener noreferrer">
              Ver Proyecto
            </a>
          )}
          {proyecto.enlaceGithub && (
            <a href={proyecto.enlaceGithub} target="_blank" rel="noopener noreferrer">
              Ver Código en GitHub
            </a>
          )}

          <motion.div className="skills-section">
            <h3>Skills utilizadas</h3>
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
          </motion.div>

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
