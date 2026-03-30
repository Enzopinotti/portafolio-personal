// src/components/EditProjectModal.jsx
import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

// Importa tu formulario
import AdminProjectForm from './AdminProjectForm.js';

// Importa las funciones de tu servicio
import {
  editProject,
  uploadPastilla,
  uploadProjectImages,
  getProjectById,
} from '../services/projectService.js';

// Si necesitas AuthContext para el token
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';

// Ejemplo para cargar skills y servicios con paginación
import { listSkillsPaginated } from '../services/skillService.js';
import { listServiciosPaginated } from '../services/servicioService.js';
import { useTranslation } from 'react-i18next';

const EditProjectModal = ({ isOpen, project, onClose, onSave }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);

  // Estado interno de "editedProject"
  const [editedProject, setEditedProject] = useState({
    idProyecto: '',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    enlace: '',
    enlaceGithub: '',
    skills: [],
    servicios: [],
    imagenPastilla: null,
    imagenesActuales: [],
    imagenesExtras: null,
  });

  const [loadingProject, setLoadingProject] = useState(false);

  // Paginación
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillPage, setSkillPage] = useState(1);
  const [skillPages, setSkillPages] = useState(1);

  const [availableServices, setAvailableServices] = useState([]);
  const [servicePage, setServicePage] = useState(1);
  const [servicePages, setServicePages] = useState(1);

  // Cargar data fresca del proyecto por ID cuando se abre el modal
  useEffect(() => {
    if (isOpen && project?.idProyecto) {
      setLoadingProject(true);
      getProjectById(project.idProyecto)
        .then((data) => {
          console.log('Project fetched in EditProjectModal:', data);
          setEditedProject({
            idProyecto: data.idProyecto,
            titulo: data.titulo || '',
            descripcion: data.descripcion || '',
            fechaInicio: data.fechaInicio || '',
            fechaFin: data.fechaFin || '',
            enlace: data.enlace || '',
            enlaceGithub: data.enlaceGithub || '',
            skills: data.Skills?.map(sk => ({
              idSkill: sk.idSkill,
              nivel: sk.ProyectoSkill?.nivel || sk.nivel || 80
            })) || [],
            servicios: data.Servicios?.map(sv => sv.idServicio) || [],
            imagenPastilla: data.imagenPastilla || null,
            imagenesActuales: data.Imagenes || data.Imagens || [],
          });
        })
        .catch((err) => {
          console.error('Error fetching project:', err);
          toast.error('Error al cargar los datos del proyecto');
        })
        .finally(() => setLoadingProject(false));
    }
  }, [isOpen, project?.idProyecto]);

  // Cargar Skills (si usas paginación)
  useEffect(() => {
    if (isOpen) {
      listSkillsPaginated(skillPage, 12)
        .then(data => {
          setAvailableSkills(data.skills || []);
          setSkillPages(data.pages || 1);
        })
        .catch(console.error);
    }
  }, [isOpen, skillPage]);

  // Cargar Servicios (si usas paginación)
  useEffect(() => {
    if (isOpen) {
      listServiciosPaginated(servicePage, 12)
        .then(data => {
          setAvailableServices(data.servicios || []);
          setServicePages(data.pages || 1);
        })
        .catch(console.error);
    }
  }, [isOpen, servicePage]);

  // handleSave: Edita y sube imágenes
  const handleSave = async (e) => {
    e.preventDefault();
    console.log('Sending ID to editProject:', editedProject.idProyecto);
    try {
      // (1) Editar parte textual
      const res = await editProject(editedProject.idProyecto, {
        titulo: editedProject.titulo,
        descripcion: editedProject.descripcion,
        fechaInicio: editedProject.fechaInicio,
        fechaFin: editedProject.fechaFin,
        enlace: editedProject.enlace,
        enlaceGithub: editedProject.enlaceGithub,
        skills: editedProject.skills,
        servicios: editedProject.servicios,
      }, accessToken);

      let finalProject = res.proyecto;

      // (2) Subir portada si es un File
      if (
        editedProject.imagenPastilla &&
        typeof editedProject.imagenPastilla !== 'string'
      ) {
        const resPastilla = await uploadPastilla(
          editedProject.idProyecto,
          editedProject.imagenPastilla,
          accessToken
        );
        finalProject = resPastilla.proyecto;
      }

      // (3) Subir imágenes extras si hay un FileList
      if (
        editedProject.imagenesExtras &&
        editedProject.imagenesExtras.length > 0
      ) {
        await uploadProjectImages(
          editedProject.idProyecto,
          editedProject.imagenesExtras,
          accessToken
        );
      }

      // (4) Notificar al padre con el proyecto actualizado de la BD
      if (onSave) {
        onSave(finalProject || editedProject);
      }

      toast.success('Proyecto editado con éxito');
      onClose(); // cierra el modal
    } catch (err) {
      console.error(err);
      toast.error('Error al editar el proyecto');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay admin-overlay"
          style={{ zIndex: 2200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content admin-submodal proyectos"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <div className="admin-submodal-header">
              <button className="close-icon" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="rightModal" style={{ width: '100%', maxWidth: '100%' }}>
                <h2>{t('editProjectModal.title', 'Editar Proyecto')}</h2>

                {loadingProject ? (
                  <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos del proyecto...</p>
                ) : (
                  <AdminProjectForm
                    newProject={editedProject}
                    setNewProject={setEditedProject}
                    handleCreate={handleSave}
                    availableSkills={availableSkills}
                    skillPage={skillPage}
                    skillPages={skillPages}
                    setSkillPage={setSkillPage}
                    availableServices={availableServices}
                    servicePage={servicePage}
                    servicePages={servicePages}
                    setServicePage={setServicePage}
                    isEditing={true}
                    accessToken={accessToken}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProjectModal;