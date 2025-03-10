// src/components/AdminProjectForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminProjectForm = ({ newProject, setNewProject, handleCreate, availableSkills, availableServices }) => {
  const { t } = useTranslation();

  // Manejar cambios en los checkboxes para skills
  const handleSkillCheckboxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const currentSkills = newProject.skills || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, skills: [...currentSkills, value] });
    } else {
      setNewProject({ ...newProject, skills: currentSkills.filter(id => id !== value) });
    }
  };

  // Manejar cambios en los checkboxes para servicios
  const handleServiceCheckboxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const currentServices = newProject.servicios || [];
    if (e.target.checked) {
      setNewProject({ ...newProject, servicios: [...currentServices, value] });
    } else {
      setNewProject({ ...newProject, servicios: currentServices.filter(id => id !== value) });
    }
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminProjectForm.formTitle')}</h3>
      
      <label htmlFor="titulo">{t('adminProjectForm.titleLabel')}</label>
      <input
        id="titulo"
        type="text"
        placeholder={t('adminProjectForm.titlePlaceholder')}
        value={newProject.titulo || ''}
        onChange={(e) => setNewProject({ ...newProject, titulo: e.target.value })}
      />
      
      <label htmlFor="fechaInicio">{t('adminProjectForm.startDateLabel')}</label>
      <input
        id="fechaInicio"
        type="date"
        value={newProject.fechaInicio || ''}
        onChange={(e) => setNewProject({ ...newProject, fechaInicio: e.target.value })}
      />
      
      <label htmlFor="descripcion">{t('adminProjectForm.descriptionLabel')}</label>
      <textarea
        id="descripcion"
        placeholder={t('adminProjectForm.descriptionPlaceholder')}
        value={newProject.descripcion || ''}
        onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
      />

      {availableSkills && availableSkills.length > 0 && (
        <>
          <label>{t('adminProjectForm.linkSkills')}</label>
          <div className="skills-checkboxes">
            {availableSkills.map((skill) => (
              <label key={skill.idSkill} className="skill-checkbox-label">
                <input
                  type="checkbox"
                  value={skill.idSkill}
                  checked={newProject.skills && newProject.skills.includes(skill.idSkill)}
                  onChange={handleSkillCheckboxChange}
                />
                <span>{skill.nombre} ({skill.nivel}%)</span>
              </label>
            ))}
          </div>
        </>
      )}

      {availableServices && availableServices.length > 0 && (
        <>
          <label>{t('adminProjectForm.linkServices')}</label>
          <div className="services-checkboxes">
            {availableServices.map((servicio) => (
              <label key={servicio.idServicio} className="service-checkbox-label">
                <input
                  type="checkbox"
                  value={servicio.idServicio}
                  checked={newProject.servicios && newProject.servicios.includes(servicio.idServicio)}
                  onChange={handleServiceCheckboxChange}
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
