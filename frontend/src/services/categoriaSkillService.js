// src/services/categoriaSkillService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const listCategoriaSkills = async () => {
  const response = await fetch(`${API_URL}/categorias`, { method: 'GET' });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json(); // Se espera que devuelva un objeto o array de categorías
};

export const createCategoriaSkill = async (categoriaData, accessToken) => {
    const response = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      credentials: 'include',
      body: JSON.stringify(categoriaData),
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
};
  
  export const deleteCategoriaSkill = async (idCategoriaSkill, accessToken) => {
    const response = await fetch(`${API_URL}/categorias/${idCategoriaSkill}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
};