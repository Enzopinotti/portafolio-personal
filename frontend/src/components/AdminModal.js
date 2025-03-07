// src/components/AdminModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaProjectDiagram, 
  FaUsers, 
  FaCog, 
  FaWrench, 
  FaTags,
  FaConciergeBell  // ícono para servicios
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import AdminProyectosModal from './AdminProyectosModal.js';
import AdminSkillsModal from './AdminSkillsModal.js';
import AdminCategoriasModal from './AdminCategoriasModal.js';
import AdminServiciosModal from './AdminServiciosModal.js'; 
import AdminUsersModal from './AdminUsersModal.js';
import AdminSettingsModal from './AdminSettingsModal.js';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, y: '-100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '100vh' }
      }
    : {
        hidden: { opacity: 0, y: '100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '-100vh' }
      };
};

const AdminModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [subModal, setSubModal] = useState(null); // "proyectos", "usuarios", "config", "skills", "categorias" o "servicios"
  const [direction, setDirection] = useState('forward');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seleccionar imagen según el ancho
  const imageSrc = windowWidth < 768 ? '/images/PatronDos.png' : '/images/patronUno.png';

  const handleSwitch = (modalName) => {
    setDirection('forward');
    setSubModal(modalName);
  };

  const handleBack = () => {
    setSubModal(null);
  };

  const variants = getModalVariants(direction);

  return (
    <AnimatePresence mode="wait">
      {/* Modal principal de Admin */}
      {isOpen && !subModal && (
        <motion.div
          className="modal-overlay admin-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content admin-modal"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-icon" onClick={onClose}>
              <FaTimes />
            </button>
            <div className="admin-modal-body">
              <div className="leftModal">
                <img src={imageSrc} alt={t('adminModal.altImage', 'Admin Pattern')} />
              </div>
              <div className="rightModal">
                <h2>{t('adminModal.title')}</h2>
                <div className="admin-buttons">
                  <button onClick={() => handleSwitch('proyectos')}>
                    <FaProjectDiagram size={48} />
                    <span>{t('adminModal.buttons.projects')}</span>
                  </button>
                  <button onClick={() => handleSwitch('usuarios')}>
                    <FaUsers size={48} />
                    <span>{t('adminModal.buttons.users')}</span>
                  </button>
                  <button onClick={() => handleSwitch('skills')}>
                    <FaWrench size={48} />
                    <span>{t('adminModal.buttons.skills')}</span>
                  </button>
                  <button onClick={() => handleSwitch('categorias')}>
                    <FaTags size={48} />
                    <span>{t('adminModal.buttons.categories')}</span>
                  </button>
                  <button onClick={() => handleSwitch('servicios')}>
                    <FaConciergeBell size={48} />
                    <span>{t('adminModal.buttons.services')}</span>
                  </button>
                  <button onClick={() => handleSwitch('config')}>
                    <FaCog size={48} />
                    <span>{t('adminModal.buttons.settings')}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sub-modal: Gestión de Proyectos */}
      {isOpen && subModal === 'proyectos' && (
        <AdminProyectosModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}

      {/* Sub-modal: Gestión de Skills */}
      {isOpen && subModal === 'skills' && (
        <AdminSkillsModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}

      {/* Sub-modal: Gestión de Categorías */}
      {isOpen && subModal === 'categorias' && (
        <AdminCategoriasModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}

      {/* Sub-modal: Gestión de Servicios */}
      {isOpen && subModal === 'servicios' && (
        <AdminServiciosModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}
      {/* Sub-modal: Gestión de Usuarios */}
      {isOpen && subModal === 'usuarios' && (
        <AdminUsersModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}
      {/* Sub-modal: Configuración */}
      {isOpen && subModal === 'config' && (
        <AdminSettingsModal
          isOpen={isOpen}
          onClose={handleBack}
          direction={direction}
        />
      )}
    </AnimatePresence>
  );
};

export default AdminModal;
