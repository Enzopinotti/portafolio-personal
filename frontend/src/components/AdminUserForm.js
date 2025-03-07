// src/components/AdminUserForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminUserForm = ({ newUser, setNewUser, handleCreate, roles }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminUserForm.formTitle')}</h3>
      
      <label htmlFor="nombre">{t('adminUserForm.nameLabel')}</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        placeholder={t('adminUserForm.namePlaceholder')}
        value={newUser.nombre || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="apellido">{t('adminUserForm.lastNameLabel')}</label>
      <input
        id="apellido"
        name="apellido"
        type="text"
        placeholder={t('adminUserForm.lastNamePlaceholder')}
        value={newUser.apellido || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="email">{t('adminUserForm.emailLabel')}</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder={t('adminUserForm.emailPlaceholder')}
        value={newUser.email || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="contraseña">{t('adminUserForm.passwordLabel')}</label>
      <div className="password-field">
        <input
          id="contraseña"
          name="contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('adminUserForm.passwordPlaceholder')}
          value={newUser.contraseña || ''}
          onChange={handleInputChange}
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <label htmlFor="idRol">{t('adminUserForm.roleLabel')}</label>
      <select
        id="idRol"
        name="idRol"
        value={newUser.idRol || ''}
        onChange={handleInputChange}
      >
        <option value="">{t('adminUserForm.rolePlaceholder')}</option>
        {roles && roles.map((rol) => (
          <option key={rol.idRol} value={rol.idRol}>
            {rol.nombre}
          </option>
        ))}
      </select>

      <div className="checkbox-group">
        <label htmlFor="sendEmail">{t('adminUserForm.sendEmailLabel')}</label>
        <input
          id="sendEmail"
          name="sendEmail"
          type="checkbox"
          checked={newUser.sendEmail || false}
          onChange={(e) =>
            setNewUser({ ...newUser, sendEmail: e.target.checked })
          }
        />
      </div>
      
      <button type="submit">{t('adminUserForm.submitButton')}</button>
    </form>
  );
};

export default AdminUserForm;
