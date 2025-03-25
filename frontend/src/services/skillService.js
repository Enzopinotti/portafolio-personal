// src/services/skillService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear una nueva skill (requiere token)
export const createSkill = async (skillData, accessToken) => {
  const response = await fetch(`${API_URL}/skills/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify(skillData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Editar una skill (requiere token)
export const editSkill = async (skillId, skillData, accessToken) => {
  const response = await fetch(`${API_URL}/skills/${skillId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify(skillData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Eliminar una skill (requiere token)
export const deleteSkill = async (skillId, accessToken) => {
  const response = await fetch(`${API_URL}/skills/${skillId}`, {
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

// Listar todas las skills (no requiere token)
export const listSkills = async () => {
  const response = await fetch(`${API_URL}/skills/`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

export async function listSkillsPaginated(page = 1, limit = 12) {
  const response = await fetch(`${API_URL}/skills?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json(); // { skills, total, pages, currentPage, limit }
}

// Ver detalles de una skill (no requiere token)
export const viewSkill = async (skillId) => {
  const response = await fetch(`${API_URL}/skills/${skillId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Asignar una o varias categorías a una skill (requiere token)
// Se envía un objeto con la propiedad "categories": un array de IDs
export const assignCategoryToSkill = async (skillId, categories, accessToken) => {
  const response = await fetch(`${API_URL}/skills/${skillId}/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify({ categories }),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};
