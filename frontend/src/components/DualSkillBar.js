import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const DualSkillBar = ({ skills }) => {
    if (!skills || skills.length !== 2) return null;

    const [topSkill, bottomSkill] = skills;

    // Variantes de animación para el llenado de las barras
    const barVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: (level) => ({
            height: `${level}%`,
            opacity: 1,
            transition: { duration: 1.5, ease: "easeOut", delay: 0.3 }
        })
    };

    const textVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.8 } }
    };

    const { t } = useTranslation();

    return (
        <div className="dual-skill-container">
            {/* Etiqueta Superior */}
            <motion.div
                className="skill-label top"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
            >
                <span className="skill-name">{topSkill.skill?.includes('.') ? t(topSkill.skill) : topSkill.skill}</span>
                {/* <span className="skill-level">{topSkill.nivel}%</span> */}
            </motion.div>

            {/* Barra Central Combinada */}
            <div className="bar-track">
                {/* Barra que crece hacia arriba (Top Skill) */}
                <motion.div
                    className="bar-fill fill-top"
                    custom={topSkill.nivel}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={barVariants}
                />

                {/* Separador sutil o centro de la barra */}
                <div className="bar-center-dot" />

                {/* Barra que crece hacia abajo (Bottom Skill) */}
                <motion.div
                    className="bar-fill fill-bottom"
                    custom={bottomSkill.nivel}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={barVariants}
                />
            </div>

            {/* Etiqueta Inferior */}
            <motion.div
                className="skill-label bottom"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
            >
                <span className="skill-name">{bottomSkill.skill?.includes('.') ? t(bottomSkill.skill) : bottomSkill.skill}</span>
                {/* <span className="skill-level">{bottomSkill.nivel}%</span> */}
            </motion.div>
        </div>
    );
};

export default DualSkillBar;
