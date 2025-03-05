// src/components/AssignCategoryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const AssignCategoryModal = ({
  isOpen,
  availableCategories,
  onSave,
  onCancel,
  currentCategories = []
}) => {
  // Inicializamos el estado a partir de currentCategories (convertido a array de números)
  const [selectedCategories, setSelectedCategories] = useState(
    () => currentCategories.map(cat => cat.idCategoriaSkill)
  );

  // Usamos una ref para almacenar el valor previo y actualizar solo si es diferente
  const prevCategoriesRef = useRef(currentCategories);

  useEffect(() => {
    const newCats = currentCategories.map(cat => cat.idCategoriaSkill);
    // Si la lista cambió (comparando con la ref) actualizamos
    if (JSON.stringify(newCats) !== JSON.stringify(prevCategoriesRef.current.map(cat => cat.idCategoriaSkill))) {
      setSelectedCategories(newCats);
      prevCategoriesRef.current = currentCategories;
    }
  }, [currentCategories]);

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter((id) => id !== value));
    }
  };

  const handleSave = () => {
    onSave(selectedCategories);
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
          className="assign-category-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="assign-category-modal"
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
            <h3>Asignar Categorías</h3>
            <div className="category-list">
              {availableCategories.map((cat) => (
                <label key={cat.idCategoriaSkill} className="category-label">
                  <input
                    type="checkbox"
                    value={cat.idCategoriaSkill}
                    checked={selectedCategories.includes(cat.idCategoriaSkill)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{cat.nombre}</span>
                </label>
              ))}
            </div>
            <div className="assign-buttons">
              <button className="btn-save" onClick={handleSave}>
                Guardar
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignCategoryModal;
