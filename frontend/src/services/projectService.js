// src/services/projectService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Función auxiliar para solicitudes POST que envían JSON sin token
const postData = async (endpoint, data) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

// Crear un nuevo proyecto (requiere token)
export const createProject = async (projectData, accessToken) => {
  const response = await fetch(`${API_URL}/proyectos/crear`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}` 
    },
    credentials: 'include',
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Editar un proyecto (requiere token)
export const editProject = async (projectId, projectData, accessToken) => {
  const response = await fetch(`${API_URL}/proyectos/${projectId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}` 
    },
    credentials: 'include',
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Eliminar un proyecto (requiere token)
export const deleteProject = async (projectId, accessToken) => {
  const response = await fetch(`${API_URL}/proyectos/${projectId}`, {
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

// Listar todos los proyectos (no requiere token)
export const listProjects = async () => {
  const response = await fetch(`${API_URL}/proyectos/`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Ver detalles de un proyecto específico (no requiere token)
export const viewProject = async (projectId) => {
  const response = await fetch(`${API_URL}/proyectos/${projectId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Buscar proyectos mediante query parameters (no requiere token)
export const searchProjects = async (queryParams) => {
  const params = new URLSearchParams(queryParams).toString();
  const response = await fetch(`${API_URL}/proyectos/buscar?${params}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

// Asignar una skill a un proyecto (requiere token)
// Asignar skills a un proyecto (requiere token)
export const assignSkillsToProject = async (idProyecto, skills, accessToken) => {
    const response = await fetch(`${API_URL}/proyectos/${idProyecto}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      credentials: 'include',
      body: JSON.stringify({ skills }),
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  };

  export const assignServicesToProject = async (idProyecto, servicios, accessToken) => {
    const response = await fetch(`${API_URL}/proyectos/${idProyecto}/servicios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ servicios }),
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  };