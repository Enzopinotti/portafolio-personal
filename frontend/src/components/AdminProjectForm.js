// src/components/AdminProjectForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminProjectForm = ({ newProject, setNewProject, handleCreate, availableSkills, availableServices }) => {
  const { t } = useTranslation();

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
        onChange={(e) => setNewProject({ ...newProject, titulo: e.target.value })}
      />

      {/* Fecha de inicio */}
      <label htmlFor="fechaInicio">{t('adminProjectForm.startDateLabel')}</label>
      <input
        id="fechaInicio"
        type="date"
        value={newProject.fechaInicio || ''}
        onChange={(e) => setNewProject({ ...newProject, fechaInicio: e.target.value })}
      />

      {/* Descripción */}
      <label htmlFor="descripcion">{t('adminProjectForm.descriptionLabel')}</label>
      <textarea
        id="descripcion"
        placeholder={t('adminProjectForm.descriptionPlaceholder')}
        value={newProject.descripcion || ''}
        onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
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
        onChange={(e) => setNewProject({ ...newProject, enlaceGithub: e.target.value })}
      />

      {/* Imagen Pastilla */}
      <label htmlFor="imagenPastilla">Imagen Pastilla</label>
      <input
        id="imagenPastilla"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setNewProject({ ...newProject, imagenPastilla: e.target.files[0] })
        }
      />

      {/* Imágenes Extras */}
      <label htmlFor="imagenesExtras">Imágenes Extras (máx 5)</label>
      <input
        id="imagenesExtras"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) =>
          setNewProject({ ...newProject, imagenesExtras: e.target.files })
        }
      />

      {/* Skills */}
      {availableSkills && availableSkills.length > 0 && (
        <>
          <label>{t('adminProjectForm.linkSkills')}</label>
          <div className="skills-checkboxes">
            {availableSkills.map((skill) => (
              <label key={skill.idSkill} className="skill-checkbox-label">
                <input
                  type="checkbox"
                  value={skill.idSkill}
                  checked={newProject.skills?.includes(skill.idSkill)}
                  onChange={(ev) => {
                    const val = parseInt(ev.target.value, 10);
                    const current = newProject.skills || [];
                    if (ev.target.checked) {
                      setNewProject({ ...newProject, skills: [...current, val] });
                    } else {
                      setNewProject({ ...newProject, skills: current.filter(id => id !== val) });
                    }
                  }}
                />
                <span>{skill.nombre} ({skill.nivel}%)</span>
              </label>
            ))}
          </div>
        </>
      )}

      {/* Servicios */}
      {availableServices && availableServices.length > 0 && (
        <>
          <label>{t('adminProjectForm.linkServices')}</label>
          <div className="services-checkboxes">
            {availableServices.map((servicio) => (
              <label key={servicio.idServicio} className="service-checkbox-label">
                <input
                  type="checkbox"
                  value={servicio.idServicio}
                  checked={newProject.servicios?.includes(servicio.idServicio)}
                  onChange={(ev) => {
                    const val = parseInt(ev.target.value, 10);
                    const current = newProject.servicios || [];
                    if (ev.target.checked) {
                      setNewProject({ ...newProject, servicios: [...current, val] });
                    } else {
                      setNewProject({ ...newProject, servicios: current.filter(id => id !== val) });
                    }
                  }}
                />
                <span>{servicio.nombre}</span>
              </label>
            ))}
          </div>
        </>
      )}

      <button type="submit">{t('adminProjectForm.submitButton')}</button>
    </form>
  );
};

export default AdminProjectForm;
