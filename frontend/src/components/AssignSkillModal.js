// src/components/AssignSkillModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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
  const [selectedSkills, setSelectedSkills] = useState(
    currentSkills.map(skill => skill.idSkill)
  );
  const prevRef = useRef(currentSkills);

  useEffect(() => {
    const newIds = currentSkills.map(skill => skill.idSkill);
    if (JSON.stringify(newIds) !== JSON.stringify(prevRef.current.map(s => s.idSkill))) {
      setSelectedSkills(newIds);
      prevRef.current = currentSkills;
    }
  }, [currentSkills]);

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedSkills(prev => [...prev, value]);
    } else {
      setSelectedSkills(prev => prev.filter(id => id !== value));
    }
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
            <h3>Asignar Skills</h3>

            <div className="skill-list">
              {availableSkills.map(skill => (
                <label key={skill.idSkill}>
                  <input
                    type="checkbox"
                    value={skill.idSkill}
                    checked={selectedSkills.includes(skill.idSkill)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{skill.nombre} ({skill.nivel}%)</span>
                </label>
              ))}
            </div>

            {/* Controles de paginación de SKILLS, 
                si quieres “abajo de la lista” */}
            <div className="pagination-controls">
              <button
                type="button"
                disabled={skillPage <= 1}
                onClick={() => setSkillPage(skillPage - 1)}
              >
                Prev
              </button>
              <span>{skillPage} / {skillPages}</span>
              <button
                type="button"
                disabled={skillPage >= skillPages}
                onClick={() => setSkillPage(skillPage + 1)}
              >
                Next
              </button>
            </div>

            <div className="assign-buttons">
              <button className="btn-save" onClick={handleSave}>Guardar</button>
              <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignSkillModal;