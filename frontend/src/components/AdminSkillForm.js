// src/components/AdminSkillForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminSkillForm = ({ newSkill, setNewSkill, handleCreate, availableCategories }) => {
  const { t } = useTranslation();

  const handleCategoryChange = (e) => {
    setNewSkill({ ...newSkill, idCategoriaSkill: e.target.value });
  };

  const handleNivelChange = (e) => {
    setNewSkill({ ...newSkill, nivel: e.target.value });
  };

  return (
    <form className="new-skill-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminSkillForm.formTitle')}</h3>
      
      <label htmlFor="nombre">{t('adminSkillForm.nameLabel')}</label>
      <input
        id="nombre"
        type="text"
        placeholder={t('adminSkillForm.namePlaceholder')}
        value={newSkill.nombre || ''}
        onChange={(e) =>
          setNewSkill({ ...newSkill, nombre: e.target.value })
        }
      />
      
      <label htmlFor="nivel">
        {t('adminSkillForm.levelLabel', { level: newSkill.nivel ? newSkill.nivel : 0 })}
      </label>
      <input
        id="nivel"
        type="range"
        min="0"
        max="100"
        value={newSkill.nivel || 0}
        onChange={handleNivelChange}
      />
      
      <label htmlFor="categoria">{t('adminSkillForm.categoryLabel')}</label>
      <select
        id="categoria"
        value={newSkill.idCategoriaSkill || ''}
        onChange={handleCategoryChange}
      >
        <option value="">{t('adminSkillForm.categoryLabel')}</option>
        {availableCategories &&
          availableCategories.map((cat) => (
            <option key={cat.idCategoriaSkill} value={cat.idCategoriaSkill}>
              {cat.nombre}
            </option>
          ))}
      </select>
      
      <button type="submit">{t('adminSkillForm.submitButton')}</button>
    </form>
  );
};

export default AdminSkillForm;
