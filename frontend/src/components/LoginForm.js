import React, { useState } from 'react';
import { loginUser } from '../services/authService.js';
import { useTranslation } from 'react-i18next';

const LoginForm = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
        console.log('entre')
      // Se envía el campo "contraseña" para que coincida con la estrategia
      const data = await loginUser({ email, contraseña: password });
      console.log(data)
      onLoginSuccess(data);
    } catch (err) {
      setErrorMsg(err.error || t('error.internal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder={t('loginModal.email') || 'Correo electrónico'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t('loginModal.password') || 'Contraseña'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMsg && <p className="error">{errorMsg}</p>}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? t('loginModal.loading') || 'Cargando...' : t('loginModal.submit') || 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
