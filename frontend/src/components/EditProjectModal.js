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
  uploadProjectImages
} from '../services/projectService.js';

// Si necesitas AuthContext para el token
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';

// Ejemplo para cargar skills y servicios con paginación
import { listSkillsPaginated } from '../services/skillService.js';
import { listServiciosPaginated } from '../services/servicioService.js';

const EditProjectModal = ({ isOpen, project, onClose, onSave }) => {
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
    imagenPastilla: null,       // puede ser string (URL) o File
    imagenesActuales: [],       // array de imágenes en BD
    imagenesExtras: null,       // FileList con imágenes nuevas
  });

  // Paginación
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillPage, setSkillPage] = useState(1);
  const [skillPages, setSkillPages] = useState(1);

  const [availableServices, setAvailableServices] = useState([]);
  const [servicePage, setServicePage] = useState(1);
  const [servicePages, setServicePages] = useState(1);

  // Cargar data del "project" en "editedProject"
  useEffect(() => {
    if (project) {
      setEditedProject({
        idProyecto: project.idProyecto,
        titulo: project.titulo || '',
        descripcion: project.descripcion || '',
        fechaInicio: project.fechaInicio || '',
        fechaFin: project.fechaFin || '',
        enlace: project.enlace || '',
        enlaceGithub: project.enlaceGithub || '',
        skills: project.Skills?.map(sk => sk.idSkill) || [],
        servicios: project.Servicios?.map(sv => sv.idServicio) || [],
        // Asumimos "project.Imagens" o "project.Imagenes" para extras en BD
        imagenPastilla: project.imagenPastilla || null,
        imagenesActuales: project.Imagens || [],
        imagenesExtras: null,
      });
    }
  }, [project]);

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
    try {
      // (1) Editar parte textual
      await editProject(editedProject.idProyecto, {
        titulo: editedProject.titulo,
        descripcion: editedProject.descripcion,
        fechaInicio: editedProject.fechaInicio,
        fechaFin: editedProject.fechaFin,
        enlace: editedProject.enlace,
        enlaceGithub: editedProject.enlaceGithub,
        skills: editedProject.skills,
        servicios: editedProject.servicios,
      }, accessToken);

      // (2) Subir portada si es un File
      if (
        editedProject.imagenPastilla &&
        typeof editedProject.imagenPastilla !== 'string'
      ) {
        await uploadPastilla(
          editedProject.idProyecto,
          editedProject.imagenPastilla,
          accessToken
        );
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

      // (4) Notificar al padre
      if (onSave) {
        onSave(editedProject);
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
          className="edit-project-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="edit-project-modal"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
          >
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
            <h3>Editar Proyecto</h3>

            <AdminProjectForm
              newProject={editedProject}
              setNewProject={setEditedProject}
              handleCreate={handleSave}    // Se ejecuta al submit
              availableSkills={availableSkills}
              skillPage={skillPage}
              skillPages={skillPages}
              setSkillPage={setSkillPage}
              availableServices={availableServices}
              servicePage={servicePage}
              servicePages={servicePages}
              setServicePage={setServicePage}
              isEditing={true}
              accessToken={accessToken}    // Opcional, si quieres eliminar imágenes en DB
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProjectModal;