// src/components/ProfileForm.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {
  editarPerfil,
  getProfile,
  actualizarAvatar,
  eliminarAvatar,
} from '../services/authService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';

const ProfileForm = ({ user }) => {
  const { t } = useTranslation();
  const { accessToken, setUser } = useContext(AuthContext);

  // Campos de texto
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
  });
  const [editable, setEditable] = useState({
    nombre: false,
    apellido: false,
    email: false,
    contraseña: false,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        contraseña: '',
      });
      setEditable({
        nombre: false,
        apellido: false,
        email: false,
        contraseña: false,
      });
      // Si user.avatar existe, usarlo; si no, placeholder
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
    }
  }, [user]);

  // Manejar clic en el avatar para subir nueva foto
  const handleAvatarClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  // Previsualizar la imagen localmente
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Guardar la nueva imagen en Cloudinary
  const handleAvatarSave = async () => {
    if (!avatarFile) return;
    try {
      setAvatarLoading(true);
      await actualizarAvatar(avatarFile, accessToken);
      const updatedUser = await getProfile(accessToken);
      setUser(updatedUser);

      toast.success(t('profile.avatarUpdated') || 'Avatar actualizado correctamente');
      setAvatarFile(null);
      setAvatarLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.error || 'Error al actualizar avatar');
      setAvatarLoading(false);
    }
  };

  // Eliminar el avatar actual (volver a placeholder)
  const handleDeleteAvatar = async () => {
    try {
      if (!user.avatar) return; // si no hay avatar, no hay nada que eliminar
      // Llamar al backend para eliminar la imagen
      await eliminarAvatar(accessToken);
      const updatedUser = await getProfile(accessToken);
      setUser(updatedUser);
      toast.success(t('profile.avatarDeleted') || 'Se eliminó la foto de perfil');
    } catch (error) {
      console.error(error);
      toast.error(error.error || 'Error al eliminar avatar');
    }
  };

  // Alternar edición en campos de texto
  const toggleEditable = (field) => {
    if (editable[field]) {
      setFormData((prev) => ({
        ...prev,
        [field]: user[field] ?? '',
      }));
    }
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar cambios (nombre, apellido, email, contraseña)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
      };
      if (formData.contraseña.trim() !== '') {
        payload.contraseña = formData.contraseña;
      }
      await editarPerfil(payload, accessToken);

      const updatedUser = await getProfile(accessToken);
      setUser(updatedUser);

      toast.success(t('profile.updated') || 'Perfil actualizado correctamente');
      setEditable({
        nombre: false,
        apellido: false,
        email: false,
        contraseña: false,
      });
    } catch (err) {
      setErrorMsg(err.error || err.message || t('error.internal'));
    } finally {
      setLoading(false);
    }
  };

  const anyEditable = Object.values(editable).some((v) => v);

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="avatar-container">
        <img
          className="avatar-image"
          src={
            avatarPreview
              ? avatarPreview
              : '/icons/user-placeholder.png'
          }
          alt="Avatar"
        />
        <div className="avatar-edit-overlay" onClick={handleAvatarClick}>
          <FaPencilAlt />
          <span>{t('profile.editAvatar') || 'Editar'}</span>
        </div>
      </div>
      {/* Input hidden para seleccionar archivo */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        onChange={handleFileChange}
      />

      {/* Botón de guardar avatar aparece si se seleccionó un archivo */}
      {avatarFile && (
        <button
          type="button"
          className="submit-button avatar-save-button"
          onClick={handleAvatarSave}
          disabled={avatarLoading}
        >
          {avatarLoading
            ? t('profile.loading') || 'Subiendo...'
            : t('profile.saveAvatar') || 'Guardar Avatar'}
        </button>
      )}

      {/* Botón para eliminar la foto actual (solo si user.avatar no es null y no hay nueva imagen local) */}
      {user.avatar && !avatarFile && (
        <button
          type="button"
          className="submit-button avatar-delete-button"
          onClick={handleDeleteAvatar}
        >
          {t('profile.deleteAvatar') || 'Eliminar foto'}
        </button>
      )}

      {/* ---------- Campos de texto ---------- */}
      <div className="form-group">
        <label>
          {t('profile.name')}
          {editable.nombre ? (
            <span className="edit-icon cancel-icon" onClick={() => toggleEditable('nombre')}>
              <FaTimes />
            </span>
          ) : (
            <span className="edit-icon" onClick={() => toggleEditable('nombre')}>
              <FaPencilAlt />
            </span>
          )}
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={!editable.nombre}
          required
        />
      </div>

      <div className="form-group">
        <label>
          {t('profile.lastName')}
          {editable.apellido ? (
            <span className="edit-icon cancel-icon" onClick={() => toggleEditable('apellido')}>
              <FaTimes />
            </span>
          ) : (
            <span className="edit-icon" onClick={() => toggleEditable('apellido')}>
              <FaPencilAlt />
            </span>
          )}
        </label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          disabled={!editable.apellido}
          required
        />
      </div>

      <div className="form-group">
        <label>
          {t('profile.email')}
          {editable.email ? (
            <span className="edit-icon cancel-icon" onClick={() => toggleEditable('email')}>
              <FaTimes />
            </span>
          ) : (
            <span className="edit-icon" onClick={() => toggleEditable('email')}>
              <FaPencilAlt />
            </span>
          )}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editable.email}
          required
        />
      </div>

      <div className="form-group">
        <label>
          {t('profile.password')}
          {editable.contraseña ? (
            <span className="edit-icon cancel-icon" onClick={() => toggleEditable('contraseña')}>
              <FaTimes />
            </span>
          ) : (
            <span className="edit-icon" onClick={() => toggleEditable('contraseña')}>
              <FaPencilAlt />
            </span>
          )}
        </label>
        <input
          type="password"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          disabled={!editable.contraseña}
        />
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      {/* Botón para guardar campos de texto si se está editando alguno */}
      {anyEditable && (
        <button type="submit" className="submit-button" disabled={loading}>
          {loading
            ? t('profile.loading') || 'Guardando...'
            : t('profile.save') || 'Guardar cambios'}
        </button>
      )}
    </form>
  );
};

export default ProfileForm;
