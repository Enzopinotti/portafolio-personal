import React, { useState } from 'react';
import { registerUser } from '../services/authService.js';
import { useTranslation } from 'react-i18next';

const RegisterForm = ({ onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contraseña !== confirmPassword) {
      setErrorMsg(t('registerModal.passwordMismatch') || 'Las contraseñas no coinciden.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await registerUser({ nombre, email, contraseña });
      onRegisterSuccess(data);
    } catch (err) {
      setErrorMsg(err.error || t('error.internal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        type="text"
        placeholder={t('registerModal.name') || 'Nombre'}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder={t('registerModal.email') || 'Correo electrónico'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t('registerModal.password') || 'Contraseña'}
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t('registerModal.confirmPassword') || 'Confirmar contraseña'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {errorMsg && <p className="error">{errorMsg}</p>}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? t('registerModal.loading') || 'Registrando...' : t('registerModal.submit') || 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
