// src/services/servicioService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear un nuevo servicio (requiere token)
export const createServicio = async (servicioData, accessToken) => {
  const response = await fetch(`${API_URL}/servicios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(servicioData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Editar un servicio (requiere token)
export const editServicio = async (servicioId, servicioData, accessToken) => {
  const response = await fetch(`${API_URL}/servicios/${servicioId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(servicioData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Eliminar un servicio (requiere token)
export const deleteServicio = async (servicioId, accessToken) => {
  const response = await fetch(`${API_URL}/servicios/${servicioId}`, {
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

// Listar todos los servicios (no requiere token)
export const listServicios = async () => {
  const response = await fetch(`${API_URL}/servicios`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

export async function listServiciosPaginated(page = 1, limit = 12) {
  const response = await fetch(`${API_URL}/servicios?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json(); // { servicios, total, pages, currentPage, limit }
}

// Ver detalles de un servicio (no requiere token)
export const viewServicio = async (servicioId) => {
  const response = await fetch(`${API_URL}/servicios/${servicioId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

