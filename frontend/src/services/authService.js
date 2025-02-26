// src/services/authService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Función para enviar una solicitud POST con fetch que incluya las credenciales.
 * Se configura para enviar cookies (con `credentials: 'include'`).
 */
const postData = async (endpoint, data) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Para enviar y recibir cookies
    body: JSON.stringify(data),
  });
  console.log('respuesta: ', response);
  if (!response.ok) {
    
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

export const loginUser = async (credentials) => {
  // Envía { email, contraseña } según espera la estrategia local
  return postData('/usuarios/login', credentials);
};

export const registerUser = async (userData) => {
  // Envía { nombre, email, contraseña } al endpoint de registro
  return postData('/usuarios/registrar', userData);
};

export const refreshToken = async () => {
  return postData('/usuarios/refresh', {});
};

export const logoutUser = async () => {
  return postData('/usuarios/logout', {});
};

export const confirmEmail = async (token) => {
  return postData('/usuarios/confirm-email', { token });
};

// Nueva función para reenviar confirmación
export const resendConfirmation = async (email, clientURI) => {
  return postData('/usuarios/resend-confirmation', { email, clientURI });
};

export const forgotPassword = async (userData) => {
  // Envía { email, clientURI } al endpoint de forgot password
  return postData('/usuarios/forgot', userData);
};

export const resetPassword = async (token, newPassword) => {
  return postData('/usuarios/reset-password', { token, newPassword });
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};