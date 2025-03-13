// src/components/AdminProyectosModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaPlus } from 'react-icons/fa';
import AdminProjectForm from './AdminProjectForm.js';
import { 
  listProjects,
  createProject,        // <-- Importamos la nueva función
  uploadPastilla,       // <-- Para subir la imagenPastilla
  uploadProjectImages,  // <-- Para subir las imágenes extras
  deleteProject,
  assignSkillsToProject,
  assignServicesToProject,
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

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Almacena los campos del nuevo proyecto
  const [newProject, setNewProject] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    enlace: '',
    skills: [],
    servicios: [],
    imagenPastilla: null,
    imagenesExtras: null,
  });

  // Cargar datos en la apertura del modal
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
      .catch(console.error);

    listServicios()
      .then((data) => {
        setAvailableServices(data.servicios || data);
      })
      .catch(console.error);
  }, [isOpen, t]);

  // Listado global de Skills y Servicios
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Confirmación de eliminación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Modales para asignar skills/servicios
  const [assignSkillModalOpen, setAssignSkillModalOpen] = useState(false);
  const [projectToAssignSkills, setProjectToAssignSkills] = useState(null);
  const [assignServiceModalOpen, setAssignServiceModalOpen] = useState(false);
  const [projectToAssignServices, setProjectToAssignServices] = useState(null);

  // Responsive para la imagen de fondo
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Filtro de proyectos
  const filteredProjects = projects.filter(project =>
    project.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eliminar proyecto
  const confirmDelete = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete, accessToken)
      .then(() => {
        setProjects(projects.filter(pro => pro.idProyecto !== projectToDelete));
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

  // **Nuevo**: handleCreate en 2 (o 3) pasos
  // src/components/AdminProyectosModal.jsx (extracto)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.titulo.trim() || !newProject.fechaInicio.trim()) {
      toast.error(t('adminProjectsModal.toast.createMissingFields'));
      return;
    }

    try {
      // 1) Crear proyecto con datos JSON
      const projectData = {
        titulo: newProject.titulo,
        descripcion: newProject.descripcion || '',
        fechaInicio: newProject.fechaInicio,
        fechaFin: newProject.fechaFin || '',
        enlace: newProject.enlace || '',
        enlaceGithub: newProject.enlaceGithub || '',  // <-- Repositorio
        skills: newProject.skills,
        servicios: newProject.servicios,
      };
      const response = await createProject(projectData, accessToken);
      const createdProject = response.proyecto; // { idProyecto, ... }

      // 2) Subir imagenPastilla si existe
      if (newProject.imagenPastilla) {
        const respPastilla = await uploadPastilla(
          createdProject.idProyecto,
          newProject.imagenPastilla,
          accessToken
        );
        Object.assign(createdProject, respPastilla.proyecto);
      }

      // 3) Subir imágenes extras si existen
      if (newProject.imagenesExtras && newProject.imagenesExtras.length > 0) {
        const respImages = await uploadProjectImages(
          createdProject.idProyecto,
          newProject.imagenesExtras,
          accessToken
        );
        // Manejo de `respImages.imagenes` si lo deseas
      }

      // Actualiza lista local
      setProjects([...projects, createdProject]);

      // Limpia form
      setNewProject({
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        enlace: '',
        enlaceGithub: '',
        skills: [],
        servicios: [],
        imagenPastilla: null,
        imagenesExtras: null,
      });

      toast.success(t('adminProjectsModal.toast.createSuccess'));
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      toast.error(t('adminProjectsModal.toast.createError'));
    }
  };


  // Asignar Skills
  const handleAssignSkills = (project) => {
    setProjectToAssignSkills(project);
    setAssignSkillModalOpen(true);
  };
  const handleSaveSkillAssignment = (selectedSkillIds) => {
    assignSkillsToProject(projectToAssignSkills.idProyecto, selectedSkillIds, accessToken)
      .then((res) => {
        // Actualiza el project con las nuevas skills
        setProjects(projects.map(pro =>
          pro.idProyecto === projectToAssignSkills.idProyecto ? res.proyecto : pro
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

  // Asignar Services
  const handleAssignServicios = (project) => {
    setProjectToAssignServices(project);
    setAssignServiceModalOpen(true);
  };
  const handleSaveServiceAssignment = (selectedServiceIds) => {
    assignServicesToProject(projectToAssignServices.idProyecto, selectedServiceIds, accessToken)
      .then((res) => {
        // Actualiza el project con los nuevos servicios
        setProjects(projects.map(pro =>
          pro.idProyecto === projectToAssignServices.idProyecto ? res.proyecto : pro
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

  // Cerrar modal con click en overlay (sin seleccionar texto)
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
              className="modal-content admin-submodal proyectos"
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
              <div className="admin-modal-body proyectos">
                <div className="leftModal proyectos">
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

                  {/* Listado de proyectos ya creados */}
                  <div className="projects-list">
                    {filteredProjects.map((project) => (
                      <div key={project.idProyecto} className="project-item">
                        <div className="project-info">
                          <h3>{project.titulo}</h3>
                          <p>{project.descripcion}</p>
                          <p>
                            {t('adminProjectsModal.actions.skills')}:{" "}
                            {project.Skills?.length
                              ? project.Skills.map(sk => sk.nombre).join(', ')
                              : t('adminProjectsModal.noSkills')}
                          </p>
                          <p>
                            {t('adminProjectsModal.actions.services')}:{" "}
                            {project.Servicios?.length
                              ? project.Servicios.map(sv => sv.nombre).join(', ')
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

                  {/* Form para crear nuevo proyecto */}
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

      {/* Modals confirm y asignación */}
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
