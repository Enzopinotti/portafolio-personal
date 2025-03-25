// src/components/AdminProjectForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminProjectForm = ({
  newProject,
  setNewProject,
  handleCreate,
  // Lista y lógica de paginación para Skills
  availableSkills,
  skillPage,
  skillPages,
  setSkillPage,
  // Lista y lógica de paginación para Servicios
  availableServices,
  servicePage,
  servicePages,
  setServicePage
}) => {
  const { t } = useTranslation();
  // Manejo checks
  const handleSkillCheckbox = (e) => {
    const val = parseInt(e.target.value, 10);
    const current = newProject.skills || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, skills: [...current, val] });
    } else {
      setNewProject({ ...newProject, skills: current.filter(id => id !== val) });
    }
  };

  const handleServiceCheckbox = (e) => {
    const val = parseInt(e.target.value, 10);
    const current = newProject.servicios || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, servicios: [...current, val] });
    } else {
      setNewProject({ ...newProject, servicios: current.filter(id => id !== val) });
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
        value={newProject.titulo}
        onChange={e => setNewProject({ ...newProject, titulo: e.target.value })}
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
      <label>{t('adminProjectForm.linkSkills')}</label>
      <div className="skills-checkboxes">
        {availableSkills.map(skill => (
          <label key={skill.idSkill}>
            <input
              type="checkbox"
              value={skill.idSkill}
              checked={newProject.skills.includes(skill.idSkill)}
              onChange={handleSkillCheckbox}
            />
            <span>{skill.nombre} ({skill.nivel}%)</span>
          </label>
        ))}
      </div>
      {/* Paginación Skills (abajo de la lista) */}
      <div className="pagination-controls">
        <button
          type="button"
          disabled={skillPage <= 1}
          onClick={() => setSkillPage(skillPage - 1)}
        >
          {t('adminProjectForm.prevPage')}
        </button>
        <span>{t('adminProjectForm.page')} {skillPage} / {skillPages}</span>
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
        {availableServices.map(serv => (
          <label key={serv.idServicio}>
            <input
              type="checkbox"
              value={serv.idServicio}
              checked={newProject.servicios.includes(serv.idServicio)}
              onChange={handleServiceCheckbox}
            />
            <span>{serv.nombre}</span>
          </label>
        ))}
      </div>
      {/* Paginación Servicios (abajo de su lista) */}
      <div className="pagination-controls">
        <button
          type="button"
          disabled={servicePage <= 1}
          onClick={() => setServicePage(servicePage - 1)}
        >
          {t('adminProjectForm.prevPage')}
        </button>
        <span>{t('adminProjectForm.page')} {servicePage} / {servicePages}</span>
        <button
          type="button"
          disabled={servicePage >= servicePages}
          onClick={() => setServicePage(servicePage + 1)}
        >
          {t('adminProjectForm.nextPage')}
        </button>
      </div>

      <button type="submit">{t('adminProjectForm.submitButton')}</button>
    </form>
  );
};

export default AdminProjectForm;
