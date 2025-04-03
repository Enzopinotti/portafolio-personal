import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteImage, deletePortadaProyecto } from '../services/projectService.js';

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

    const localUrl = URL.createObjectURL(file);
    setPendingPastilla({ file, localUrl });

    // Actualizamos newProject para que, al hacer submit,
    // se suba este File al backend.
    setNewProject({
      ...newProject,
      imagenPastilla: file,
    });
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
    if (totalSuma > 5) {
      toast.error(`Máx 5 imágenes extras. Ya tienes ${totalActualBD + totalLocal}.`);
      return;
    }

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
  const handleSkillCheckbox = (e) => {
    const val = parseInt(e.target.value, 10);
    const current = newProject.skills || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, skills: [...current, val] });
    } else {
      setNewProject({ ...newProject, skills: current.filter((id) => id !== val) });
    }
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

      {/* Descripción */}
      <label htmlFor="descripcion">{t('adminProjectForm.descriptionLabel')}</label>
      <textarea
        id="descripcion"
        placeholder={t('adminProjectForm.descriptionPlaceholder')}
        value={newProject.descripcion || ''}
        onChange={(e) =>
          setNewProject({ ...newProject, descripcion: e.target.value })
        }
      />

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
      <label htmlFor="imagenPastilla">Imagen Pastilla (portada)</label>
      <input
        id="imagenPastilla"
        type="file"
        accept="image/*"
        onChange={handlePastillaChange}
      />

      {/* (A) Vista previa local de la NUEVA portada */}
      {pendingPastilla && (
        <div className="preview-pastilla">
          <img
            src={pendingPastilla.localUrl}
            alt="Nueva Portada"
            className="preview-img"
          />
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
            <img
              src={newProject.imagenPastilla}
              alt="Portada Actual BD"
              className="preview-img"
            />
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
      <label htmlFor="imagenesExtras">Imágenes Extras (máx 5)</label>
      <input
        id="imagenesExtras"
        type="file"
        accept="image/*"
        multiple
        onChange={handleExtrasChange}
      />

      {/* (1) Imágenes extras en BD */}
      {isEditing && newProject.imagenesActuales?.length > 0 && (
        <div className="preview-imagenes-extras">
          {newProject.imagenesActuales.map((img) => (
            <div key={img.idImagen} className="preview-item">
              <img
                src={img.ruta}
                alt="Imagen BD"
                className="preview-img"
              />
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
              <img
                src={p.localUrl}
                alt={`Nueva Imagen ${idx}`}
                className="preview-img"
              />
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
        {availableSkills.map((skill) => (
          <label key={skill.idSkill}>
            <input
              type="checkbox"
              value={skill.idSkill}
              checked={newProject.skills?.includes(skill.idSkill) || false}
              onChange={handleSkillCheckbox}
            />
            <span>{skill.nombre}</span>
          </label>
        ))}
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
        {availableServices.map((serv) => (
          <label key={serv.idServicio}>
            <input
              type="checkbox"
              value={serv.idServicio}
              checked={newProject.servicios?.includes(serv.idServicio) || false}
              onChange={handleServiceCheckbox}
            />
            <span>{serv.nombre}</span>
          </label>
        ))}
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
      <button type="submit">
        {t(isEditing ? 'adminProjectForm.editButton' : 'adminProjectForm.submitButton')}
      </button>
    </form>
  );
};

export default AdminProjectForm;