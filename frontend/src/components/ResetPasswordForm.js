// src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { resetPassword } from '../services/authService.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordForm = ({ token, onResetSuccess }) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('resetPassword.passwordMismatch') || 'Las contraseñas no coinciden.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success(t('resetPassword.success') || 'Contraseña actualizada exitosamente.');
      onResetSuccess();
    } catch (error) {
      setErrorMsg(error.error || error.message || t('error.internal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      {/* Nueva contraseña */}
      <div className="password-field">
        <input
          type={showNewPass ? 'text' : 'password'}
          placeholder={t('resetPassword.newPassword') || 'Nueva contraseña'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <span className="toggle-password" onClick={() => setShowNewPass(!showNewPass)}>
          {showNewPass ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* Confirmar contraseña */}
      <div className="password-field">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder={t('resetPassword.confirmPassword') || 'Confirmar contraseña'}
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
        {loading ? t('resetPassword.loading') || 'Actualizando...' : t('resetPassword.submit') || 'Actualizar contraseña'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
