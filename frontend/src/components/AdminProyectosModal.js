// src/components/AdminProyectosModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

import AdminProjectForm from './AdminProjectForm.js';
import ConfirmModal from './ConfirmModal.js';
import AssignSkillModal from './AssignSkillModal.js';
import AssignServiceModal from './AssignServiceModal.js';

import {
  listProjects,
  createProject,
  uploadPastilla,
  uploadProjectImages,
  deleteProject,
  assignSkillsToProject,
  assignServicesToProject,
  editProject
} from '../services/projectService.js';

import { listSkillsPaginated } from '../services/skillService.js';
import { listServiciosPaginated } from '../services/servicioService.js';

import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ProjectActionsDropdown from './ProjectActionsDropdown.js';
import EditProjectModal from './EditProjectModal.js';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? { hidden: { opacity: 0, x: '100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '-100vw' } }
    : { hidden: { opacity: 0, x: '-100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '100vw' } };
};

const AdminProyectosModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const modalVariants = getModalVariants(direction);

  const [projectToEdit, setProjectToEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // =========================
  // Estados principales
  // =========================
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Proyecto nuevo (para crear)
  const [newProject, setNewProject] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    enlace: '',
    enlaceGithub: '',
    skills: [],
    servicios: [],
    imagenPastilla: null,
    imagenesExtras: null
  });

  // Confirmación de eliminación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Modales Asignar skill/servicio
  const [assignSkillModalOpen, setAssignSkillModalOpen] = useState(false);
  const [projectToAssignSkills, setProjectToAssignSkills] = useState(null);
  const [assignServiceModalOpen, setAssignServiceModalOpen] = useState(false);
  const [projectToAssignServices, setProjectToAssignServices] = useState(null);

  // Imagen de fondo (responsive)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // =========================
  // Paginación Skills
  // =========================
  const [skillPage, setSkillPage] = useState(1);
  const [skillPages, setSkillPages] = useState(1);
  const [availableSkills, setAvailableSkills] = useState([]);

  // =========================
  // Paginación Servicios
  // =========================
  const [servicePage, setServicePage] = useState(1);
  const [servicePages, setServicePages] = useState(1);
  const [availableServices, setAvailableServices] = useState([]);

  // =========================
  // Efectos
  // =========================

  // Cargar proyectos cuando se abre el modal
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
  }, [isOpen, t]);

  // Cargar Skills paginadas
  useEffect(() => {
    if (!isOpen) return;
    listSkillsPaginated(skillPage, 12)
      .then(data => {
        setAvailableSkills(data.skills || []);
        setSkillPages(data.pages || 1);
      })
      .catch(err => console.error('Error paginando skills:', err));
  }, [isOpen, skillPage]);

  // Cargar Servicios paginados
  useEffect(() => {
    if (!isOpen) return;
    listServiciosPaginated(servicePage, 12)
      .then(data => {
        setAvailableServices(data.servicios || []);
        setServicePages(data.pages || 1);
      })
      .catch(err => console.error('Error paginando servicios:', err));
  }, [isOpen, servicePage]);

  // Filtro de proyectos
  const filteredProjects = projects.filter(project =>
    project.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =========================
  // Eliminar Proyecto
  // =========================
  const handleDelete = (id) => {
    setProjectToDelete(id);
    setConfirmOpen(true);
  };
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

  // =========================
  // Crear Proyecto
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();
  
    // Validar campos básicos
    if (!newProject.titulo.trim() || !newProject.fechaInicio.trim()) {
      toast.error(t('adminProjectsModal.toast.createMissingFields'));
      return;
    }
  
    try {
      // (1) Crear proyecto en BD (sin imágenes)
      const projectData = {
        titulo: newProject.titulo,
        descripcion: newProject.descripcion || '',
        fechaInicio: newProject.fechaInicio,
        fechaFin: newProject.fechaFin || '',
        enlace: newProject.enlace || '',
        enlaceGithub: newProject.enlaceGithub || '',
        skills: newProject.skills,
        servicios: newProject.servicios
      };
  
      const response = await createProject(projectData, accessToken);
      const createdProject = response.proyecto;
  
      // (2) Subir portada si es un File
      if (
        newProject.imagenPastilla && 
        typeof newProject.imagenPastilla !== 'string'
      ) {
        const respPastilla = await uploadPastilla(
          createdProject.idProyecto,
          newProject.imagenPastilla,
          accessToken
        );
        Object.assign(createdProject, respPastilla.proyecto);
      }
  
      // (3) Subir imágenes extras (si hay)
      if (newProject.imagenesExtras && newProject.imagenesExtras.length > 0) {
        await uploadProjectImages(
          createdProject.idProyecto,
          newProject.imagenesExtras,
          accessToken
        );
      }
  
      // (4) Refrescar la lista de proyectos
      listProjects()
        .then((data) => setProjects(data))
        .catch(console.error);
  
      // (5) Limpiar formulario
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
        imagenesExtras: null
      });
  
      toast.success(t('adminProjectsModal.toast.createSuccess'));
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      toast.error(t('adminProjectsModal.toast.createError'));
    }
  };

  // Editar Proyecto
  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setEditModalOpen(true);
  };

  // =========================
  // Asignar Skills
  // =========================
  const handleAssignSkills = (project) => {
    setProjectToAssignSkills(project);
    setAssignSkillModalOpen(true);
  };
  const handleSaveSkillAssignment = (selectedSkillIds) => {
    if (!projectToAssignSkills) return;
    assignSkillsToProject(projectToAssignSkills.idProyecto, selectedSkillIds, accessToken)
      .then(res => {
        // Actualiza la lista local
        setProjects(prev => prev.map(p => {
          if (p.idProyecto === projectToAssignSkills.idProyecto) {
            return { ...p, Skills: res.proyecto.Skills || [] };
          }
          return p;
        }));
        toast.success(t('adminProjectsModal.toast.assignSkillsSuccess'));
      })
      .catch(err => {
        console.error('Error al asignar skills:', err);
        toast.error(t('adminProjectsModal.toast.assignSkillsError'));
      })
      .finally(() => {
        setAssignSkillModalOpen(false);
        setProjectToAssignSkills(null);
      });
  };

  // =========================
  // Asignar Servicios
  // =========================
  const handleAssignServicios = (project) => {
    setProjectToAssignServices(project);
    setAssignServiceModalOpen(true);
  };
  const handleSaveServiceAssignment = (selectedServiceIds) => {
    if (!projectToAssignServices) return;
    assignServicesToProject(projectToAssignServices.idProyecto, selectedServiceIds, accessToken)
      .then(res => {
        setProjects(prev => prev.map(p => {
          if (p.idProyecto === projectToAssignServices.idProyecto) {
            return { ...p, Servicios: res.proyecto.Servicios || [] };
          }
          return p;
        }));
        toast.success(t('adminProjectsModal.toast.assignServicesSuccess'));
      })
      .catch(err => {
        console.error('Error al asignar servicios:', err);
        toast.error(t('adminProjectsModal.toast.assignServicesError'));
      })
      .finally(() => {
        setAssignServiceModalOpen(false);
        setProjectToAssignServices(null);
      });
  };

  // Cerrar modal si clickeas overlay
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
              variants={modalVariants}
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
                {/* Lado Izquierdo */}
                <div className="leftModal proyectos">
                  <img src={imageSrc} alt={t('adminProjectsModal.altImage')} />
                </div>

                {/* Lado Derecho */}
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

                  {/* Listado de proyectos */}
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
                              
                        <ProjectActionsDropdown
                          onAssignSkills={() => handleAssignSkills(project)}
                          onAssignServices={() => handleAssignServicios(project)}
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDelete(project.idProyecto)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Form para crear PROYECTO */}
                  <AdminProjectForm
                    newProject={newProject}
                    setNewProject={setNewProject}
                    handleCreate={handleCreate}
                    availableSkills={availableSkills}
                    skillPage={skillPage}
                    skillPages={skillPages}
                    setSkillPage={setSkillPage}

                    availableServices={availableServices}
                    servicePage={servicePage}
                    servicePages={servicePages}
                    setServicePage={setServicePage}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmar eliminación */}
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminProjectsModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setProjectToDelete(null);
        }}
      />

      {/* Modal Asignar Skills */}
      <AssignSkillModal
        isOpen={assignSkillModalOpen}
        availableSkills={availableSkills}
        skillPage={skillPage}
        skillPages={skillPages}
        setSkillPage={setSkillPage}
        onSave={handleSaveSkillAssignment}
        onCancel={() => {
          setAssignSkillModalOpen(false);
          setProjectToAssignSkills(null);
        }}
        currentSkills={projectToAssignSkills ? projectToAssignSkills.Skills || [] : []}
      />

      {/* Modal Editar */}
      <EditProjectModal
        isOpen={editModalOpen}
        project={projectToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={(updatedProject) => {
          editProject(updatedProject.idProyecto, updatedProject, accessToken)
            .then(() => {
              // Actualiza en la lista local
              setProjects(prev =>
                prev.map(p =>
                  p.idProyecto === updatedProject.idProyecto ? updatedProject : p
                )
              );
              toast.success('Proyecto editado con éxito');
            })
            .catch(err => {
              toast.error('Error al editar el proyecto');
              console.error(err);
            })
            .finally(() => {
              setEditModalOpen(false);
              setProjectToEdit(null);
            });
        }}
      />

      {/* Modal Asignar Servicios */}
      <AssignServiceModal
        isOpen={assignServiceModalOpen}
        availableServices={availableServices}
        servicePage={servicePage}
        servicePages={servicePages}
        setServicePage={setServicePage}
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