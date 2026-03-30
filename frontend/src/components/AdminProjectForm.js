import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteImage, deletePortadaProyecto } from '../services/projectService.js';
import { FaFileUpload } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Configuración de módulos para Quill
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link'
];

const AdminProjectForm = ({
  newProject,
  setNewProject,
  handleCreate,
  availableSkills,
  skillPage,
  skillPages,
  setSkillPage,
  availableServices,
  servicePage,
  servicePages,
  setServicePage,
  isEditing = false,
  accessToken,
}) => {
  const { t } = useTranslation();

  // State local para la portada NUEVA (solo si usuario escoge un archivo).
  // Estructura: { file: File, localUrl: string } o null si no hay portada nueva.
  const [pendingPastilla, setPendingPastilla] = useState(null);

  // State local para imágenes extras nuevas (array de { file, localUrl }).
  const [pendingImages, setPendingImages] = useState([]);

  // Al montar o al abrir en modo edición/creación, reiniciamos vistas previas:
  useEffect(() => {
    setPendingPastilla(null);
    setPendingImages([]);
  }, []);

  /**
   * El usuario selecciona un nuevo archivo en "Imagen Pastilla".
   */
  const handlePastillaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tamaño (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('La portada no puede superar los 50MB.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPendingPastilla({ file, localUrl });
    setNewProject({ ...newProject, imagenPastilla: file });
  };

  /**
   * El usuario descarta la portada NUEVA (no la antigua).
   */
  const handleRemovePendingPastilla = () => {
    if (pendingPastilla) {
      URL.revokeObjectURL(pendingPastilla.localUrl);
    }
    setPendingPastilla(null);

    // Restaurar la portada antigua si era un string:
    if (typeof newProject.imagenPastilla === 'string') {
      // Dejar la portada antigua (string) intacta en newProject
      setNewProject({
        ...newProject,
        imagenPastilla: newProject.imagenPastilla,
      });
    } else {
      // O no había portada anterior
      setNewProject({
        ...newProject,
        imagenPastilla: null,
      });
    }
  };

  /**
   * El usuario elimina la portada actual de BD
   * (solo válido si isEditing y hay una portada string).
   */
  const handleDeletePortadaBD = async () => {
    try {
      if (!newProject.idProyecto) {
        toast.error('No hay un idProyecto para eliminar la portada.');
        return;
      }
      // Llamamos endpoint DELETE /:idProyecto/pastilla
      await deletePortadaProyecto(newProject.idProyecto, accessToken);

      // Borramos la portada en el estado
      setNewProject({
        ...newProject,
        imagenPastilla: null,
      });
      toast.success('Portada eliminada en BD con éxito');
    } catch (err) {
      console.error('Error al eliminar portada en BD:', err);
      toast.error('Error al eliminar la portada.');
    }
  };

  /**
   * Manejo de selección de imágenes extras
   */
  const handleExtrasChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files || []);
    if (!nuevosArchivos.length) return;

    const totalActualBD = newProject.imagenesActuales?.length || 0;
    const totalLocal = pendingImages.length;
    const totalSuma = totalActualBD + totalLocal + nuevosArchivos.length;
    if (totalSuma > 10) {
      toast.error(`Máx 10 archivos multimedia. Ya tienes ${totalActualBD + totalLocal}.`);
      return;
    }

    // Validación de tamaño (50MB)
    const filesTooLarge = nuevosArchivos.filter(f => f.size > 50 * 1024 * 1024);
    if (filesTooLarge.length > 0) {
      toast.error('Algunos archivos superan los 50MB y no fueron añadidos.');
    }
    const filteredFiles = nuevosArchivos.filter(f => f.size <= 50 * 1024 * 1024);
    if (!filteredFiles.length) return;

    // Creamos previews locales
    const newPreviews = nuevosArchivos.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    const merged = [...pendingImages, ...newPreviews];
    setPendingImages(merged);

    // Actualizamos newProject.imagenesExtras con la lista de Files
    const mergedFiles = merged.map((obj) => obj.file);
    setNewProject({
      ...newProject,
      imagenesExtras: mergedFiles,
    });
  };

  /**
   * El usuario descarta una de las imágenes NUEVAS (pendingImages)
   */
  const handleRemovePendingImage = (index) => {
    const updated = [...pendingImages];
    const [removed] = updated.splice(index, 1);
    URL.revokeObjectURL(removed.localUrl);

    setPendingImages(updated);

    // Actualizamos newProject.imagenesExtras con la lista resultante.
    const mergedFiles = updated.map((obj) => obj.file);
    setNewProject({
      ...newProject,
      imagenesExtras: mergedFiles,
    });
  };

  /**
   * El usuario elimina una imagen extra de la BD (si isEditing)
   */
  const handleDeleteExtraBD = async (img) => {
    try {
      if (!accessToken) {
        toast.error('No tienes token para eliminar la imagen en BD.');
        return;
      }
      await deleteImage(img.idImagen, accessToken);
      setNewProject({
        ...newProject,
        imagenesActuales: newProject.imagenesActuales.filter(
          (i) => i.idImagen !== img.idImagen
        ),
      });
      toast.success('Imagen extra (BD) eliminada con éxito');
    } catch (err) {
      console.error('Error al eliminar imagen BD:', err);
      toast.error('Error al eliminar imagen de BD.');
    }
  };

  // Skills (checkbox)
  const handleSkillCheckbox = (skill) => {
    const id = skill.idSkill;
    const current = newProject.skills || [];
    const isSelected = current.some(s => (typeof s === 'object' ? s.idSkill === id : s === id));

    if (!isSelected) {
      setNewProject({ ...newProject, skills: [...current, { idSkill: id, nivel: skill.nivel || 80 }] });
    } else {
      setNewProject({ ...newProject, skills: current.filter(s => (typeof s === 'object' ? s.idSkill !== id : s !== id)) });
    }
  };

  const handleSkillNivelChange = (id, newNivel) => {
    const current = newProject.skills || [];
    setNewProject({
      ...newProject,
      skills: current.map(s => {
        const sId = typeof s === 'object' ? s.idSkill : s;
        if (sId === id) return { idSkill: id, nivel: parseInt(newNivel, 10) };
        return s;
      })
    });
  };

  // Servicios (checkbox)
  const handleServiceCheckbox = (e) => {
    const val = parseInt(e.target.value, 10);
    const current = newProject.servicios || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, servicios: [...current, val] });
    } else {
      setNewProject({ ...newProject, servicios: current.filter((id) => id !== val) });
    }
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminProjectForm.formTitle')}</h3>

      {/* Título */}
      <label htmlFor="titulo">{t('adminProjectForm.titleLabel')}</label>
      <input
        id="titulo"
        type="text"
        placeholder={t('adminProjectForm.titlePlaceholder')}
        value={newProject.titulo || ''}
        onChange={(e) =>
          setNewProject({ ...newProject, titulo: e.target.value })
        }
      />

      {/* Fecha Inicio */}
      <label htmlFor="fechaInicio">{t('adminProjectForm.startDateLabel')}</label>
      <input
        id="fechaInicio"
        type="date"
        value={newProject.fechaInicio?.slice(0, 10) || ''}
        onChange={(e) =>
          setNewProject({ ...newProject, fechaInicio: e.target.value })
        }
      />

      {/* Descripción con Rich Text */}
      <label>{t('adminProjectForm.descriptionLabel')}</label>
      <div className="quill-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={newProject.descripcion || ''}
          onChange={(content) =>
            setNewProject({ ...newProject, descripcion: content })
          }
          modules={quillModules}
          formats={quillFormats}
          placeholder={t('adminProjectForm.descriptionPlaceholder')}
        />
      </div>

      {/* Enlace de despliegue */}
      <label htmlFor="enlace">URL Despliegue</label>
      <input
        id="enlace"
        type="text"
        placeholder="https://miaplicacion.com"
        value={newProject.enlace || ''}
        onChange={(e) => setNewProject({ ...newProject, enlace: e.target.value })}
      />

      {/* Enlace GitHub */}
      <label htmlFor="enlaceGithub">URL Repositorio (GitHub)</label>
      <input
        id="enlaceGithub"
        type="text"
        placeholder="https://github.com/tuusuario/tu-repo"
        value={newProject.enlaceGithub || ''}
        onChange={(e) =>
          setNewProject({ ...newProject, enlaceGithub: e.target.value })
        }
      />

      {/* ========== Portada ========== */}
      <label htmlFor="imagenPastilla">{t('adminProjectForm.coverImage')}</label>
      <div className="file-upload-wrapper">
        <FaFileUpload className="upload-icon" />
        <div className="upload-text">
          {pendingPastilla ? pendingPastilla.file.name : (
            <><span>{t('adminProjectForm.uploadClick', 'Haz click')}</span> {t('adminProjectForm.uploadOrSelection', 'para seleccionar la portada (foto o video)')}</>
          )}
        </div>
        <input
          id="imagenPastilla"
          type="file"
          accept="image/*,video/*"
          onChange={handlePastillaChange}
        />
      </div>

      {/* (A) Vista previa local de la NUEVA portada */}
      {pendingPastilla && (
        <div className="preview-pastilla">
          {pendingPastilla.file.type.startsWith('video/') ? (
            <video src={pendingPastilla.localUrl} className="preview-img" muted />
          ) : (
            <img
              src={pendingPastilla.localUrl}
              alt={t('adminProjectForm.newCover')}
              className="preview-img"
            />
          )}
          <button
            type="button"
            className="close-button"
            onClick={handleRemovePendingPastilla}
          >
            ✕
          </button>
        </div>
      )}

      {/* (B) Si no hay new file => Muestra la portada "vieja" si isEditing y es string */}
      {isEditing &&
        !pendingPastilla &&
        typeof newProject.imagenPastilla === 'string' &&
        newProject.imagenPastilla && (
          <div className="preview-pastilla">
            {newProject.imagenPastilla?.toLowerCase().match(/\.(mp4|webm|mov|ogg|quicktime)$/) || newProject.imagenPastilla?.includes('/video/upload/') ? (
              <video src={newProject.imagenPastilla} className="preview-img" muted />
            ) : (
              <img
                src={newProject.imagenPastilla}
                alt={t('adminProjectForm.currentCover')}
                className="preview-img"
              />
            )}
            <button
              type="button"
              className="close-button"
              onClick={handleDeletePortadaBD}
            >
              ✕
            </button>
          </div>
        )}

      {/* ========== Imágenes extras ========== */}
      <label htmlFor="imagenesExtras">{t('adminProjectForm.extraImages')}</label>
      <div className="file-upload-wrapper">
        <FaFileUpload className="upload-icon" />
        <div className="upload-text">
          {pendingImages.length > 0
            ? `${pendingImages.length} ${t('adminProjectForm.itemsSelected', 'archivos seleccionados')}`
            : (
              <><span>{t('adminProjectForm.uploadClick', 'Haz click')}</span> {t('adminProjectForm.uploadOrSelectionExtra', 'para añadir archivos multimedia extra (máx 10)')}</>
            )
          }
        </div>
        <input
          id="imagenesExtras"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleExtrasChange}
        />
      </div>

      {/* (1) Imágenes extras en BD */}
      {isEditing && newProject.imagenesActuales?.length > 0 && (
        <div className="preview-imagenes-extras">
          {newProject.imagenesActuales.map((img) => (
            <div key={img.idImagen} className="preview-item">
              {img.ruta?.toLowerCase().match(/\.(mp4|webm|mov|ogg|quicktime)$/) || img.ruta?.includes('/video/upload/') ? (
                <video src={img.ruta} className="preview-img" muted />
              ) : (
                <img
                  src={img.ruta}
                  alt={t('adminProjectForm.dbImage')}
                  className="preview-img"
                />
              )}
              <button
                type="button"
                className="close-button"
                onClick={() => handleDeleteExtraBD(img)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* (2) Imágenes nuevas (pendingImages) */}
      {pendingImages.length > 0 && (
        <div className="preview-imagenes-nuevas">
          {pendingImages.map((p, idx) => (
            <div key={idx} className="preview-item">
              {p.file.type.startsWith('video/') ? (
                <video src={p.localUrl} className="preview-img" muted />
              ) : (
                <img
                  src={p.localUrl}
                  alt={`Nueva Imagen ${idx}`}
                  className="preview-img"
                />
              )}
              <button
                type="button"
                className="close-button"
                onClick={() => handleRemovePendingImage(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <label>{t('adminProjectForm.linkSkills')}</label>
      <div className="skills-checkboxes">
        {availableSkills.map((skill) => {
          const selectedItem = newProject.skills?.find(s => (typeof s === 'object' ? s.idSkill === skill.idSkill : s === skill.idSkill));
          const isChecked = !!selectedItem;

          return (
            <div key={skill.idSkill} className="skill-option">
              <label className={isChecked ? 'selected' : ''}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSkillCheckbox(skill)}
                />
                <span>{skill.nombre?.includes('.') ? t(skill.nombre) : skill.nombre}</span>
              </label>
              {isChecked && (
                <div className="nivel-input">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={typeof selectedItem === 'object' ? selectedItem.nivel : 80}
                    onChange={(e) => handleSkillNivelChange(skill.idSkill, e.target.value)}
                  />
                  <span>%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginación Skills */}
      <div className="pagination-controls">
        <button
          type="button"
          disabled={skillPage <= 1}
          onClick={() => setSkillPage(skillPage - 1)}
        >
          {t('adminProjectForm.prevPage')}
        </button>
        <span>
          {t('adminProjectForm.page')} {skillPage} / {skillPages}
        </span>
        <button
          type="button"
          disabled={skillPage >= skillPages}
          onClick={() => setSkillPage(skillPage + 1)}
        >
          {t('adminProjectForm.nextPage')}
        </button>
      </div>

      {/* Servicios */}
      <label>{t('adminProjectForm.linkServices')}</label>
      <div className="services-checkboxes">
        {availableServices.map((serv) => {
          const isSelected = newProject.servicios?.includes(serv.idServicio) || false;
          return (
            <label key={serv.idServicio} className={isSelected ? 'selected' : ''}>
              <input
                type="checkbox"
                value={serv.idServicio}
                checked={isSelected}
                onChange={handleServiceCheckbox}
              />
              <span>{serv.nombre?.includes('.') ? t(serv.nombre) : serv.nombre}</span>
            </label>
          );
        })}
      </div>

      {/* Paginación Servicios */}
      <div className="pagination-controls">
        <button
          type="button"
          disabled={servicePage <= 1}
          onClick={() => setServicePage(servicePage - 1)}
        >
          {t('adminProjectForm.prevPage')}
        </button>
        <span>
          {t('adminProjectForm.page')} {servicePage} / {servicePages}
        </span>
        <button
          type="button"
          disabled={servicePage >= servicePages}
          onClick={() => setServicePage(servicePage + 1)}
        >
          {t('adminProjectForm.nextPage')}
        </button>
      </div>

      {/* Botón final de submit */}
      <button type="submit" className="submit-btn btn-standard">
        {t(isEditing ? 'adminProjectForm.editButton' : 'adminProjectForm.submitButton')}
      </button>
    </form>
  );
};

export default AdminProjectForm;