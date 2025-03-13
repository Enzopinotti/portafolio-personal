// src/components/AdminSkillsModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaPlus } from 'react-icons/fa';
import AdminSkillForm from './AdminSkillForm.js';
import { listSkills, createSkill, deleteSkill, assignCategoryToSkill } from '../services/skillService.js';
import { listCategoriaSkills } from '../services/categoriaSkillService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal.js';
import AssignCategoryModal from './AssignCategoryModal.js';
import { useTranslation } from 'react-i18next';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, x: '100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '-100vw' }
      }
    : {
        hidden: { opacity: 0, x: '-100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '100vw' }
      };
};

const AdminSkillsModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const variants = getModalVariants(direction);
  
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkill, setNewSkill] = useState({ nombre: '', nivel: '', idCategoriaSkill: '' });
  
  const [availableCategories, setAvailableCategories] = useState([]);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  // Estado para asignación de categorías
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [skillToAssign, setSkillToAssign] = useState(null);
  const [currentAssignedCategories, setCurrentAssignedCategories] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listSkills()
      .then((data) => {
        setSkills(data.skills || data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminSkillsModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      });
    // Cargar las categorías disponibles
    listCategoriaSkills()
      .then((data) => {
        setAvailableCategories(data.categorias || data);
      })
      .catch((err) => {
        console.error('Error al cargar categorías de skills:', err);
      });
  }, [isOpen, t]);
  
  const filteredSkills = skills.filter(skill =>
    skill.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const confirmDelete = () => {
    if (!skillToDelete) return;
    deleteSkill(skillToDelete, accessToken)
      .then(() => {
        setSkills(skills.filter(skill => skill.idSkill !== skillToDelete));
        toast.success(t('adminSkillsModal.toast.deleteSuccess'));
      })
      .catch((err) => {
        console.error('Error al eliminar skill:', err);
        toast.error(t('adminSkillsModal.toast.deleteError'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setSkillToDelete(null);
      });
  };
  
  const handleDelete = (id) => {
    setSkillToDelete(id);
    setConfirmOpen(true);
  };
  
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newSkill.nombre.trim() || !newSkill.idCategoriaSkill) {
      toast.error(t('adminSkillsModal.toast.createMissingFields'));
      return;
    }
    const nivel = parseInt(newSkill.nivel, 10);
    if (isNaN(nivel) || nivel < 0 || nivel > 100) {
      toast.error('El nivel debe estar entre 0 y 100.'); // Puedes traducir este mensaje si lo deseas.
      return;
    }
    createSkill({ ...newSkill, nivel }, accessToken)
      .then((response) => {
        setSkills([...skills, response.skill]);
        setNewSkill({ nombre: '', nivel: '', idCategoriaSkill: '' });
        toast.success(t('adminSkillsModal.toast.createSuccess'));
      })
      .catch((err) => {
        console.error('Error al crear skill:', err);
        toast.error(t('adminSkillsModal.toast.createError'));
      });
  };

  const handleAssignCategory = (skill) => {
    setSkillToAssign(skill);
    setCurrentAssignedCategories(skill.Categorias || []);
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = (selectedCategories) => {
    assignCategoryToSkill(skillToAssign.idSkill, selectedCategories, accessToken)
      .then((response) => {
        setSkills(skills.map(skill =>
          skill.idSkill === skillToAssign.idSkill ? response.skill : skill
        ));
        toast.success(t('adminSkillsModal.toast.assignCategorySuccess'));
      })
      .catch((err) => {
        console.error('Error al asignar categorías:', err);
        toast.error(t('adminSkillsModal.toast.assignCategoryError'));
      })
      .finally(() => {
        setAssignModalOpen(false);
        setSkillToAssign(null);
      });
  };
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  const handleOverlayClick = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="modal-overlay admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="modal-content admin-submodal skills"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-submodal-header">
                <button className="back-button" onClick={onClose}>
                  <FaArrowLeft />
                </button>
                <button className="close-icon" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>
              <div className="admin-modal-body skills">
                <div className="leftModal skills">
                  <img src={imageSrc} alt={t('adminSkillsModal.altImage')} />
                </div>
                <div className="rightModal skills">
                  <h2>{t('adminSkillsModal.title')}</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder={t('adminSkillsModal.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {loading && <p>{t('adminSkillsModal.loading')}</p>}
                  {error && <p className="error">{error}</p>}
                  <div className="projects-list">
                    {filteredSkills.map((skill) => (
                      <div key={skill.idSkill} className="project-item">
                        <div className="project-info">
                          <h3>{skill.nombre}</h3>
                          <p>{t('adminSkillsModal.actions.level')}: {skill.nivel}%</p>
                          <p className="categoria">
                          {t('adminSkillsModal.actions.categories')}: {skill.Categorias && skill.Categorias.length > 0
                              ? skill.Categorias.map((cat) => cat.nombre).join(', ')
                              : t('adminSkillsModal.noCategory')}
                          </p>
                        </div>
                        <div className="skill-actions">
                          <button
                            className="add-category-button"
                            onClick={() => handleAssignCategory(skill)}
                            title={t('adminSkillsModal.actions.addCategory')}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(skill.idSkill)}
                            title={t('adminSkillsModal.actions.deleteSkill')}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <AdminSkillForm
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    handleCreate={handleCreate}
                    availableCategories={availableCategories}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminSkillsModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSkillToDelete(null);
        }}
      />
      <AssignCategoryModal
        isOpen={assignModalOpen}
        availableCategories={availableCategories}
        onSave={handleSaveAssignment}
        onCancel={() => {
          setAssignModalOpen(false);
          setSkillToAssign(null);
        }}
        currentCategories={skillToAssign ? skillToAssign.Categorias || [] : []}
      />
    </>
  );
};

export default AdminSkillsModal;
