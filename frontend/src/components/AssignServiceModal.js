// src/components/AssignServiceModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const AssignServiceModal = ({
  isOpen,
  availableServices,
  onSave,
  onCancel,
  currentServices = []
}) => {
  // Inicializamos selectedServices a partir de currentServices (usando idServicio)
  const [selectedServices, setSelectedServices] = useState(() =>
    currentServices.map(s => s.idServicio)
  );
  const prevRef = useRef(currentServices);

  useEffect(() => {
    const newIds = currentServices.map(s => s.idServicio);
    if (JSON.stringify(newIds) !== JSON.stringify(prevRef.current.map(s => s.idServicio))) {
      setSelectedServices(newIds);
      prevRef.current = currentServices;
    }
  }, [currentServices]);

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedServices(prev => [...prev, value]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== value));
    }
  };

  const handleSave = () => {
    onSave(selectedServices);
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
          className="assign-service-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="assign-service-modal"
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
            <h3>Asignar Servicios</h3>
            <div className="service-list">
              {availableServices.map((s) => (
                <label key={s.idServicio} className="service-label">
                  <input
                    type="checkbox"
                    value={s.idServicio}
                    checked={selectedServices.includes(s.idServicio)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{s.nombre}</span>
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

export default AssignServiceModal;
