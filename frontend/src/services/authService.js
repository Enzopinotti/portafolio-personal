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
    credentials: 'include', 
    body: JSON.stringify(data),
  });
  console.log('respuesta: ', response);
  if (!response.ok) {
    
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${API_URL}/usuarios/refresh`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json(); // => { accessToken }
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

export const getProfile = async (accessToken) => {
  // Aquí usamos el access token en la cabecera Authorization
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: 'GET',
    credentials: 'include', // para enviar la cookie con refreshToken
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

export const editarPerfil = async (perfilData, accessToken) => {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,  // ¡Necesario!
    },
    credentials: 'include',
    body: JSON.stringify(perfilData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

export const actualizarAvatar = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_URL}/usuarios/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw errorData;
    } catch {
      throw { error: 'Error inesperado. El archivo puede ser demasiado grande.' };
    }
  }

  return response.json();
};

export const eliminarAvatar = async (accessToken) => {
  const response = await fetch(`${API_URL}/usuarios/avatar`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json(); // { mensaje: '...' }
};