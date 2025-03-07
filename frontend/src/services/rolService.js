// src/services/rolService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const listRoles = async () => {
  const response = await fetch(`${API_URL}/roles`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};
