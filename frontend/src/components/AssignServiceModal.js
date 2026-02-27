// src/components/AssignServiceModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

/**
 * Props:
 * - isOpen: boolean, indica si el modal está visible
 * - availableServices: array de servicios paginados (ej. [{idServicio, nombre}, ...])
 * - servicePage, servicePages, setServicePage: estados y funciones para manejar paginación
 * - onSave: función a la que se le pasa el array de IDs cuando se hace click en "Guardar"
 * - onCancel: función para cerrar el modal sin guardar
 * - currentServices: array de servicios que ya tiene el proyecto asignado (ej. [{idServicio, nombre}, ...])
 */
const AssignServiceModal = ({
  isOpen,
  availableServices = [],
  servicePage,
  servicePages,
  setServicePage,
  onSave,
  onCancel,
  currentServices = [],
}) => {
  const { t } = useTranslation();
  // Inicializamos selectedServices a partir de currentServices (usando idServicio)
  const [selectedServices, setSelectedServices] = useState(() =>
    currentServices.map(s => s.idServicio)
  );
  const prevRef = useRef(currentServices);

  // Cada vez que cambie currentServices, sincronizar selectedServices
  useEffect(() => {
    const newIds = currentServices.map(s => s.idServicio);
    const oldIds = prevRef.current.map(s => s.idServicio);
    if (JSON.stringify(newIds) !== JSON.stringify(oldIds)) {
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

  // Animations
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
            <h3>{t('assignServiceModal.title')}</h3>

            <div className="service-list">
              {availableServices.map((serv) => (
                <label key={serv.idServicio} className="service-label">
                  <input
                    type="checkbox"
                    value={serv.idServicio}
                    checked={selectedServices.includes(serv.idServicio)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{serv.nombre}</span>
                </label>
              ))}
            </div>

            {/* Controles de paginación abajo de la lista */}
            <div className="pagination-controls">
              <button
                type="button"
                disabled={servicePage <= 1}
                onClick={() => setServicePage(servicePage - 1)}
              >
                {t('adminProjectForm.prevPage')}
              </button>
              <span>{servicePage} / {servicePages}</span>
              <button
                type="button"
                disabled={servicePage >= servicePages}
                onClick={() => setServicePage(servicePage + 1)}
              >
                {t('adminProjectForm.nextPage')}
              </button>
            </div>

            <div className="assign-buttons">
              <button className="btn-save" onClick={handleSave}>
                {t('assignSkillModal.save')}
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                {t('assignSkillModal.cancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignServiceModal;
