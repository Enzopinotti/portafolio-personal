// src/components/AdminServicioForm.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminServicioForm = ({ newServicio, setNewServicio, handleCreate }) => {
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setNewServicio({
      ...newServicio,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminServicioForm.formTitle')}</h3>
      <label htmlFor="nombre">{t('adminServicioForm.nameLabel')}</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        placeholder={t('adminServicioForm.namePlaceholder')}
        value={newServicio.nombre || ''}
        onChange={handleInputChange}
      />
      <label htmlFor="descripcion">{t('adminServicioForm.descriptionLabel')}</label>
      <textarea
        id="descripcion"
        name="descripcion"
        placeholder={t('adminServicioForm.descriptionPlaceholder')}
        value={newServicio.descripcion || ''}
        onChange={handleInputChange}
      />
      <label htmlFor="precio">{t('adminServicioForm.priceLabel')}</label>
      <input
        id="precio"
        name="precio"
        type="number"
        step="0.01"
        placeholder={t('adminServicioForm.pricePlaceholder')}
        value={newServicio.precio || ''}
        onChange={handleInputChange}
      />
      <button type="submit">{t('adminServicioForm.submitButton')}</button>
    </form>
  );
};

export default AdminServicioForm;