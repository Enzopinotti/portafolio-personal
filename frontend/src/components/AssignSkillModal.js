// src/components/AssignSkillModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AssignSkillModal = ({
  isOpen,
  availableSkills,   // <-- Paginado en padre
  skillPage,
  skillPages,
  setSkillPage,
  onSave,
  onCancel,
  currentSkills = []
}) => {
  const { t } = useTranslation();

  // Guardamos un array de objetos { idSkill, nivel }
  const [selectedSkills, setSelectedSkills] = useState(
    currentSkills.map(skill => ({
      idSkill: skill.idSkill,
      nivel: skill.ProyectoSkill?.nivel || skill.nivel || 80
    }))
  );
  const prevRef = useRef(currentSkills);

  useEffect(() => {
    const newSkills = currentSkills.map(skill => ({
      idSkill: skill.idSkill,
      nivel: skill.ProyectoSkill?.nivel || skill.nivel || 80
    }));
    // Comparación simple por IDs para evitar bucles si no hay cambios reales
    const currentIds = newSkills.map(s => s.idSkill).sort().join(',');
    const prevIds = selectedSkills.map(s => s.idSkill).sort().join(',');

    if (currentIds !== prevIds) {
      setSelectedSkills(newSkills);
    }
  }, [currentSkills]);

  const handleCheckboxChange = (skill) => {
    const id = skill.idSkill;
    const isSelected = selectedSkills.some(s => s.idSkill === id);

    if (!isSelected) {
      // Agregar con nivel por defecto
      setSelectedSkills(prev => [...prev, { idSkill: id, nivel: skill.nivel || 80 }]);
    } else {
      // Quitar
      setSelectedSkills(prev => prev.filter(s => s.idSkill !== id));
    }
  };

  const handleNivelChange = (id, newNivel) => {
    setSelectedSkills(prev => prev.map(s =>
      s.idSkill === id ? { ...s, nivel: parseInt(newNivel, 10) } : s
    ));
  };

  const handleSave = () => {
    onSave(selectedSkills);
  };

  const variants = {
    hidden: { opacity: 0, y: '-20px' },
    visible: { opacity: 1, y: '0' },
    exit: { opacity: 0, y: '20px' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="assign-skill-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="assign-skill-modal"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="assign-close" onClick={onCancel}>
              <FaTimes />
            </button>
            <h3>{t('assignSkillModal.title')}</h3>

            <div className="skill-list">
              {availableSkills.map(skill => {
                const selectedItem = selectedSkills.find(s => s.idSkill === skill.idSkill);
                const isChecked = !!selectedItem;

                return (
                  <div key={skill.idSkill} className="skill-option">
                    <label className={isChecked ? 'selected' : ''}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(skill)}
                      />
                      <span>{skill.nombre}</span>
                    </label>
                    {isChecked && (
                      <div className="nivel-input">
                        <span className="nivel-label">Nivel:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={selectedItem.nivel}
                          onChange={(e) => handleNivelChange(skill.idSkill, e.target.value)}
                        />
                        <span>%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controles de paginación de SKILLS, 
                si quieres “abajo de la lista” */}
            <div className="pagination-controls">
              <button
                type="button"
                disabled={skillPage <= 1}
                onClick={() => setSkillPage(skillPage - 1)}
              >
                {t('adminProjectForm.prevPage')}
              </button>
              <span>{skillPage} / {skillPages}</span>
              <button
                type="button"
                disabled={skillPage >= skillPages}
                onClick={() => setSkillPage(skillPage + 1)}
              >
                {t('adminProjectForm.nextPage')}
              </button>
            </div>

            <div className="assign-buttons">
              <button className="btn-save" onClick={handleSave}>{t('assignSkillModal.save')}</button>
              <button className="btn-cancel" onClick={onCancel}>{t('assignSkillModal.cancel')}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignSkillModal;