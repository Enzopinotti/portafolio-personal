// src/components/RegisterForm.js
import React, { useState } from 'react';
import { registerUser } from '../services/authService.js';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = ({ onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      const clientURI = process.env.REACT_APP_CLIENT_URI || 'http://localhost:3000';
      const data = await registerUser({ nombre, apellido ,email, contraseña, clientURI });
      onRegisterSuccess(data);
    } catch (err) {
      setErrorMsg(err.error || err.message || t('error.internal'));
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
        type='text'
        placeholder={t('registerModal.surname') || 'Apellido'}
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <input
        type="email"
        placeholder={t('registerModal.email') || 'Correo electrónico'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Campo "Contraseña" con toggle */}
      <div className="password-field">
        <input
          type={showPass ? 'text' : 'password'}
          placeholder={t('registerModal.password') || 'Contraseña'}
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <span className="toggle-password" onClick={() => setShowPass(!showPass)}>
          {showPass ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* Campo "Confirmar Contraseña" con toggle */}
      <div className="password-field">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder={t('registerModal.confirmPassword') || 'Confirmar contraseña'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <span className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? t('registerModal.loading') || 'Registrando...' : t('registerModal.submit') || 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
