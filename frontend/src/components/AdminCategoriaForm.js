// src/components/AdminCategoriaForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminCategoriaForm = ({ newCategoria, setNewCategoria, handleCreate }) => {
  const { t } = useTranslation();

  return (
    <form className="new-categoria-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminCategoriaForm.formTitle')}</h3>
      <label htmlFor="nombre">{t('adminCategoriaForm.nameLabel')}</label>
      <input
        id="nombre"
        type="text"
        placeholder={t('adminCategoriaForm.namePlaceholder')}
        value={newCategoria.nombre || ''}
        onChange={(e) =>
          setNewCategoria({ ...newCategoria, nombre: e.target.value })
        }
      />
      <button type="submit">{t('adminCategoriaForm.submitButton')}</button>
    </form>
  );
};

export default AdminCategoriaForm;