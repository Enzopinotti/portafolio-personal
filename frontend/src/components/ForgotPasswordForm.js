// src/components/ForgotPasswordForm.js
import React, { useState } from 'react';
import { forgotPassword } from '../services/authService.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ForgotPasswordForm = ({ onForgotSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto
    setErrorMsg(null);
    setLoading(true);
    try {
      // Obtén el clientURI desde la variable de entorno
      const clientURI = process.env.REACT_APP_CLIENT_URI || 'http://localhost:3000';
      const data = await forgotPassword({ email, clientURI });
      toast.success(t('forgotModal.success'));
      onForgotSuccess(data); // Llama al callback para indicar éxito (y cerrar el modal)
    } catch (error) {
      setErrorMsg(error.error || error.message || t('error.internal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="forgot-form">
      <input
        type="email"
        placeholder={t('forgotModal.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {errorMsg && <p className="error">{errorMsg}</p>}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? t('forgotModal.loading') : t('forgotModal.submit')}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
