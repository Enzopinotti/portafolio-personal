// src/components/AdminProyectosModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaPlus } from 'react-icons/fa';
import AdminProjectForm from './AdminProjectForm.js';
import { 
  listProjects, 
  createProject, 
  deleteProject, 
  assignSkillsToProject, 
  assignServicesToProject 
} from '../services/projectService.js';
import { listSkills } from '../services/skillService.js';
import { listServicios } from '../services/servicioService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal.js';
import AssignSkillModal from './AssignSkillModal.js';
import AssignServiceModal from './AssignServiceModal.js';
import { useTranslation } from 'react-i18next';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? { hidden: { opacity: 0, x: '100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '-100vw' } }
    : { hidden: { opacity: 0, x: '-100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '100vw' } };
};

const AdminProyectosModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const variants = getModalVariants(direction);

  // Estados principales
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({ titulo: '', descripcion: '', fechaInicio: '', skills: [], servicios: [] });

  // Estados para datos disponibles
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Estado para confirmación de eliminación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Estados para modales de asignación
  const [assignSkillModalOpen, setAssignSkillModalOpen] = useState(false);
  const [projectToAssignSkills, setProjectToAssignSkills] = useState(null);

  const [assignServiceModalOpen, setAssignServiceModalOpen] = useState(false);
  const [projectToAssignServices, setProjectToAssignServices] = useState(null);

  // Manejo del responsive para la imagen de fondo
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminProjectsModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      });

    listSkills()
      .then((data) => {
        setAvailableSkills(data.skills || data);
      })
      .catch((err) => {
        console.error('Error al cargar skills:', err);
      });

    listServicios()
      .then((data) => {
        setAvailableServices(data.servicios || data);
      })
      .catch((err) => {
        console.error('Error al cargar servicios:', err);
      });
  }, [isOpen, t]);

  const filteredProjects = projects.filter(project =>
    project.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para eliminar un proyecto
  const confirmDelete = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete, accessToken)
      .then(() => {
        setProjects(projects.filter(project => project.idProyecto !== projectToDelete));
        toast.success(t('adminProjectsModal.toast.deleteSuccess'));
      })
      .catch((err) => {
        console.error('Error al eliminar proyecto:', err);
        toast.error(t('adminProjectsModal.toast.deleteError'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setProjectToDelete(null);
      });
  };

  const handleDelete = (id) => {
    setProjectToDelete(id);
    setConfirmOpen(true);
  };

  // Función para crear un nuevo proyecto (incluye asignación de skills y servicios desde el formulario)
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProject.titulo.trim() || !newProject.fechaInicio.trim()) {
      toast.error(t('adminProjectsModal.toast.createMissingFields'));
      return;
    }
    createProject(newProject, accessToken)
      .then((response) => {
        setProjects([...projects, response.proyecto]);
        setNewProject({ titulo: '', descripcion: '', fechaInicio: '', skills: [], servicios: [] });
        toast.success(t('adminProjectsModal.toast.createSuccess'));
      })
      .catch((err) => {
        console.error('Error al crear proyecto:', err);
        toast.error(t('adminProjectsModal.toast.createError'));
      });
  };

  // Función para abrir el modal de asignación de skills a un proyecto
  const handleAssignSkills = (project) => {
    setProjectToAssignSkills(project);
    setAssignSkillModalOpen(true);
  };

  // Función para guardar la asignación de skills a un proyecto
  const handleSaveSkillAssignment = (selectedSkillIds) => {
    assignSkillsToProject(projectToAssignSkills.idProyecto, selectedSkillIds, accessToken)
      .then((response) => {
        setProjects(projects.map(project =>
          project.idProyecto === projectToAssignSkills.idProyecto ? response.proyecto : project
        ));
        toast.success(t('adminProjectsModal.toast.assignSkillsSuccess'));
      })
      .catch((err) => {
        console.error('Error al asignar skills:', err);
        toast.error(t('adminProjectsModal.toast.assignSkillsError'));
      })
      .finally(() => {
        setAssignSkillModalOpen(false);
        setProjectToAssignSkills(null);
      });
  };

  // Función para abrir el modal de asignación de servicios a un proyecto
  const handleAssignServicios = (project) => {
    setProjectToAssignServices(project);
    setAssignServiceModalOpen(true);
  };

  // Función para guardar la asignación de servicios a un proyecto
  const handleSaveServiceAssignment = (selectedServiceIds) => {
    assignServicesToProject(projectToAssignServices.idProyecto, selectedServiceIds, accessToken)
      .then((response) => {
        setProjects(projects.map(project =>
          project.idProyecto === projectToAssignServices.idProyecto ? response.proyecto : project
        ));
        toast.success(t('adminProjectsModal.toast.assignServicesSuccess'));
      })
      .catch((err) => {
        console.error('Error al asignar servicios:', err);
        toast.error(t('adminProjectsModal.toast.assignServicesError'));
      })
      .finally(() => {
        setAssignServiceModalOpen(false);
        setProjectToAssignServices(null);
      });
  };

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
              className="modal-content admin-submodal"
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
              <div className="admin-modal-body">
                <div className="leftModal">
                  <img src={imageSrc} alt={t('adminProjectsModal.altImage')} />
                </div>
                <div className="rightModal">
                  <h2>{t('adminProjectsModal.title')}</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder={t('adminProjectsModal.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {loading && <p>{t('adminProjectsModal.loading')}</p>}
                  {error && <p className="error">{error}</p>}
                  <div className="projects-list">
                    {filteredProjects.map((project) => (
                      <div key={project.idProyecto} className="project-item">
                        <div className="project-info">
                          <h3>{project.titulo}</h3>
                          <p>{project.descripcion}</p>
                          <p>
                            {t('adminProjectsModal.actions.skills') || 'Skills'}:{" "}
                            {project.Skills && project.Skills.length > 0
                              ? project.Skills.map(skill => skill.nombre).join(', ')
                              : t('adminProjectsModal.noSkills')}
                          </p>
                          <p>
                            {t('adminProjectsModal.actions.services') || 'Services'}:{" "}
                            {project.Servicios && project.Servicios.length > 0
                              ? project.Servicios.map(servicio => servicio.nombre).join(', ')
                              : t('adminProjectsModal.noServices')}
                          </p>
                        </div>
                        <div className="project-actions">
                          <button
                            className="assign-skill-button"
                            onClick={() => handleAssignSkills(project)}
                            title={t('adminProjectsModal.actions.assignSkills')}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="assign-service-button"
                            onClick={() => handleAssignServicios(project)}
                            title={t('adminProjectsModal.actions.assignServices')}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(project.idProyecto)}
                            title={t('adminProjectsModal.actions.deleteProject')}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <AdminProjectForm
                    newProject={newProject}
                    setNewProject={setNewProject}
                    handleCreate={handleCreate}
                    availableSkills={availableSkills}
                    availableServices={availableServices}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminProjectsModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setProjectToDelete(null);
        }}
      />
      <AssignSkillModal
        isOpen={assignSkillModalOpen}
        availableSkills={availableSkills}
        onSave={handleSaveSkillAssignment}
        onCancel={() => {
          setAssignSkillModalOpen(false);
          setProjectToAssignSkills(null);
        }}
        currentSkills={projectToAssignSkills ? projectToAssignSkills.Skills || [] : []}
      />
      <AssignServiceModal
        isOpen={assignServiceModalOpen}
        availableServices={availableServices}
        onSave={handleSaveServiceAssignment}
        onCancel={() => {
          setAssignServiceModalOpen(false);
          setProjectToAssignServices(null);
        }}
        currentServices={projectToAssignServices ? projectToAssignServices.Servicios || [] : []}
      />
    </>
  );
};

export default AdminProyectosModal;
