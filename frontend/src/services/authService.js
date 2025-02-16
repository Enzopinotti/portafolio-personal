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
