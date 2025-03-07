// src/services/adminSettingsService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Obtener la configuración (suponemos un único registro)
export const getSettings = async () => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'GET'
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Actualizar la configuración
export const updateSettings = async (settings) => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};
