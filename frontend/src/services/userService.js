// src/services/userService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Listar usuarios (para admin) con paginación
export const listAdminUsers = async (queryParams = {}, accessToken) => {
  const params = new URLSearchParams(queryParams).toString();
  const response = await fetch(`${API_URL}/admin/usuarios?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Ver detalles de un usuario (para admin)
export const viewAdminUser = async (userId) => {
  const response = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Crear un nuevo usuario (para admin)
export const createAdminUser = async (userData, accessToken) => {
    const response = await fetch(`${API_URL}/admin/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw await response.json();
    }
    return response.json();
};

// Actualizar un usuario (para admin)
export const updateAdminUser = async (userId, userData, accessToken) => {
  const response = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Eliminar un usuario (para admin)
export const deleteAdminUser = async (userId, accessToken) => {
  const response = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Buscar usuarios mediante query parameters (opcional)
export const searchAdminUsers = async (queryParams = {}) => {
  const params = new URLSearchParams(queryParams).toString();
  const response = await fetch(`${API_URL}/admin/usuarios/buscar?${params}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};
